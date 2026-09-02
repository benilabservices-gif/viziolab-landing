import { test, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { syncToSysteme, handler } from "../netlify/functions/subscribe.js";

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
    calls.push({ url, method: options?.method || "GET" });
    if (queue.length === 0) throw new Error(`Unexpected fetch call: ${url}`);
    return queue.shift();
  };
});

test("syncToSysteme creates a new contact and a new tag when neither exists", async () => {
  queue.push(mockResponse(200, { items: [] })); // GET contacts?email=
  queue.push(mockResponse(201, { id: 42 })); // POST contacts
  queue.push(mockResponse(200, { items: [] })); // GET tags?query=IDEE
  queue.push(mockResponse(201, { id: 7 })); // POST tags
  queue.push(mockResponse(201, {})); // POST contacts/42/tags

  const result = await syncToSysteme({
    prenom: "Awa",
    email: "awa@example.com",
    whatsapp: "+22900000000",
    situation: "IDEE",
    tags: ["IDEE"],
  });

  assert.equal(result.contactId, 42);
  assert.deepEqual(result.tags, ["IDEE"]);
  assert.equal(calls.length, 5);
  assert.match(calls[0].url, /\/contacts\?email=/);
  assert.equal(calls[1].method, "POST");
  assert.match(calls[1].url, /\/contacts$/);
  assert.match(calls[4].url, /\/contacts\/42\/tags$/);
});

test("syncToSysteme reuses an existing contact and an existing tag", async () => {
  queue.push(mockResponse(200, { items: [{ id: 99 }] })); // GET contacts?email= -> found
  queue.push(mockResponse(200, { items: [{ id: 5, name: "DEMARRAGE" }] })); // GET tags -> found
  queue.push(mockResponse(201, {})); // POST contacts/99/tags

  const result = await syncToSysteme({
    email: "deja@example.com",
    situation: "DEMARRAGE",
    tags: [],
  });

  assert.equal(result.contactId, 99);
  assert.equal(calls.length, 3);
  assert.equal(calls[0].method, "GET");
  assert.equal(calls[1].method, "GET");
  assert.equal(calls[2].method, "POST");
});

test("syncToSysteme deduplicates the situation tag against the tags array", async () => {
  queue.push(mockResponse(200, { items: [{ id: 1 }] })); // contact found
  queue.push(mockResponse(200, { items: [{ id: 10, name: "ACCOMPAGNEMENT" }] })); // tag found (situation === tags[0])
  queue.push(mockResponse(201, {})); // assign

  const result = await syncToSysteme({
    email: "x@example.com",
    situation: "ACCOMPAGNEMENT",
    tags: ["ACCOMPAGNEMENT"],
  });

  assert.deepEqual(result.tags, ["ACCOMPAGNEMENT"]);
  assert.equal(calls.length, 3); // one lookup + one create/lookup + one assign, not two of each
});

test("handler returns 400 when email or situation is missing", async () => {
  const res = await handler({ httpMethod: "POST", body: JSON.stringify({ email: "" }) });
  assert.equal(res.statusCode, 400);
});

test("handler returns 405 for non-POST requests", async () => {
  const res = await handler({ httpMethod: "GET" });
  assert.equal(res.statusCode, 405);
});

test("handler returns 200 and forwards the payload on success", async () => {
  queue.push(mockResponse(200, { items: [] }));
  queue.push(mockResponse(201, { id: 1 }));
  queue.push(mockResponse(200, { items: [] }));
  queue.push(mockResponse(201, { id: 2 }));
  queue.push(mockResponse(201, {}));

  const res = await handler({
    httpMethod: "POST",
    body: JSON.stringify({ email: "ok@example.com", situation: "EXPLORATION", tags: ["EXPLORATION"] }),
  });

  assert.equal(res.statusCode, 200);
  const body = JSON.parse(res.body);
  assert.equal(body.ok, true);
});
