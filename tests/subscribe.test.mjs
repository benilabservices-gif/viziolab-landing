import { test, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { syncToSysteme, handler } from "../netlify/functions/subscribe.js";

const CHALLENGE_TAG_ID = 2159157;

let calls;
let queue;
const realFetch = global.fetch;

function mockResponse(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => (body === undefined ? "" : JSON.stringify(body)),
  };
}

before(() => {
  process.env.SYSTEME_API_KEY = "test-key";
});

after(() => {
  global.fetch = realFetch;
});

beforeEach(() => {
  calls = [];
  queue = [];
  global.fetch = async (url, options) => {
    calls.push({ url, method: options?.method || "GET", body: options?.body });
    if (queue.length === 0) throw new Error(`Unexpected fetch call: ${url}`);
    return queue.shift();
  };
});

test("syncToSysteme creates a new contact and attaches the fixed challenge tag", async () => {
  queue.push(mockResponse(200, { items: [] })); // GET contacts?email=
  queue.push(mockResponse(201, { id: 42 })); // POST contacts
  queue.push(mockResponse(201, {})); // POST contacts/42/tags

  const result = await syncToSysteme({
    prenom: "Awa",
    email: "awa@example.com",
    whatsapp: "+22900000000",
    situation: "IDEE",
  });

  assert.equal(result.contactId, 42);
  assert.equal(result.tagId, CHALLENGE_TAG_ID);
  assert.equal(calls.length, 3);
  assert.match(calls[0].url, /\/contacts\?email=/);
  assert.equal(calls[1].method, "POST");
  assert.match(calls[1].url, /\/contacts$/);
  assert.match(calls[2].url, /\/contacts\/42\/tags$/);
  assert.deepEqual(JSON.parse(calls[2].body), { tagId: CHALLENGE_TAG_ID });
});

test("syncToSysteme reuses an existing contact and still attaches the fixed tag", async () => {
  queue.push(mockResponse(200, { items: [{ id: 99 }] })); // GET contacts?email= -> found
  queue.push(mockResponse(201, {})); // POST contacts/99/tags

  const result = await syncToSysteme({
    email: "deja@example.com",
    situation: "DEMARRAGE",
  });

  assert.equal(result.contactId, 99);
  assert.equal(calls.length, 2);
  assert.equal(calls[0].method, "GET");
  assert.equal(calls[1].method, "POST");
  assert.match(calls[1].url, /\/contacts\/99\/tags$/);
});

test("syncToSysteme attaches the same tag regardless of situation value", async () => {
  for (const situation of ["EXPLORATION", "IDEE", "DEMARRAGE", "CROISSANCE"]) {
    queue.push(mockResponse(200, { items: [{ id: 1 }] }));
    queue.push(mockResponse(201, {}));

    const result = await syncToSysteme({ email: "x@example.com", situation });

    assert.equal(result.tagId, CHALLENGE_TAG_ID, `situation ${situation} should still get the fixed tag`);
  }
});

test("handler returns 400 when email or situation is missing", async () => {
  const res = await handler({ httpMethod: "POST", body: JSON.stringify({ email: "" }) });
  assert.equal(res.statusCode, 400);
});

test("handler returns 405 for non-POST requests", async () => {
  const res = await handler({ httpMethod: "GET" });
  assert.equal(res.statusCode, 405);
});

test("handler returns 200 and forwards the fixed tag id on success", async () => {
  queue.push(mockResponse(200, { items: [] }));
  queue.push(mockResponse(201, { id: 1 }));
  queue.push(mockResponse(201, {}));

  const res = await handler({
    httpMethod: "POST",
    body: JSON.stringify({ email: "ok@example.com", situation: "EXPLORATION" }),
  });

  assert.equal(res.statusCode, 200);
  const body = JSON.parse(res.body);
  assert.equal(body.ok, true);
  assert.equal(body.tagId, CHALLENGE_TAG_ID);
});
