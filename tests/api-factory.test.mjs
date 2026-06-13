import test from "node:test";
import assert from "node:assert/strict";
import { register } from "node:module";

// Register a resolve hook so api.ts's bare `next/server` import resolves under
// Node's plain ESM loader, then import the real module being tested.
register(new URL("./helpers/next-server-resolve-hook.mjs", import.meta.url));
const { collection, readOnlyCollection, item } = await import("../src/lib/api.ts");

// A minimal in-memory repo implementing the list/get/create/update/remove
// interface that the route-handler factories depend on. No DB, no network.
function makeRepo(seed = []) {
  const rows = [...seed];
  let counter = rows.length;
  return {
    async list() {
      return rows;
    },
    async get(id) {
      return rows.find((r) => r.id === id) ?? null;
    },
    async create(input) {
      const created = { id: `ID-${++counter}`, ...input };
      rows.push(created);
      return created;
    },
    async update(id, input) {
      const row = rows.find((r) => r.id === id);
      if (!row) return null;
      Object.assign(row, input);
      return row;
    },
    async remove(id) {
      const idx = rows.findIndex((r) => r.id === id);
      if (idx === -1) return false;
      rows.splice(idx, 1);
      return true;
    },
    _rows: rows,
  };
}

// Helper builders for Request / route context.
function jsonRequest(body) {
  return new Request("http://test.local/api/x", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}
function rawRequest(rawBody) {
  return new Request("http://test.local/api/x", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: rawBody,
  });
}
function ctx(id) {
  return { params: Promise.resolve({ id }) };
}

test("collection.GET returns {data,total} with 200", async () => {
  const repo = makeRepo([{ id: "A" }, { id: "B" }]);
  const res = await collection(repo).GET();
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.total, 2);
  assert.deepEqual(body.data, [{ id: "A" }, { id: "B" }]);
});

test("collection.POST creates an entity and returns 201", async () => {
  const repo = makeRepo();
  const res = await collection(repo).POST(jsonRequest({ name: "Widget" }));
  assert.equal(res.status, 201);
  const body = await res.json();
  assert.equal(body.name, "Widget");
  assert.ok(body.id, "server-assigned id present");
  assert.equal(repo._rows.length, 1);
});

test("collection.POST returns 400 on unparseable body", async () => {
  const repo = makeRepo();
  const res = await collection(repo).POST(rawRequest("{not json"));
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.equal(body.error, "Invalid request body");
  assert.equal(repo._rows.length, 0, "nothing created");
});

test("readOnlyCollection.GET mirrors collection list shape", async () => {
  const repo = makeRepo([{ id: "X" }]);
  const res = await readOnlyCollection(repo).GET();
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.total, 1);
  assert.deepEqual(body.data, [{ id: "X" }]);
});

test("item.GET returns the entity (200) or 404 when missing", async () => {
  const repo = makeRepo([{ id: "A", name: "Alpha" }]);

  const ok = await item(repo).GET(new Request("http://test.local"), ctx("A"));
  assert.equal(ok.status, 200);
  assert.deepEqual(await ok.json(), { id: "A", name: "Alpha" });

  const missing = await item(repo).GET(new Request("http://test.local"), ctx("NOPE"));
  assert.equal(missing.status, 404);
  assert.equal((await missing.json()).error, "Not found");
});

test("item.PUT updates (200), 404 when missing, 400 on bad body", async () => {
  const repo = makeRepo([{ id: "A", name: "Alpha" }]);

  const ok = await item(repo).PUT(jsonRequest({ name: "Renamed" }), ctx("A"));
  assert.equal(ok.status, 200);
  assert.equal((await ok.json()).name, "Renamed");

  const missing = await item(repo).PUT(jsonRequest({ name: "Z" }), ctx("NOPE"));
  assert.equal(missing.status, 404);

  const bad = await item(repo).PUT(rawRequest("not json"), ctx("A"));
  assert.equal(bad.status, 400);
  assert.equal((await bad.json()).error, "Invalid request body");
});

test("item.PUT returns 405 when repo has no update()", async () => {
  const repo = makeRepo([{ id: "A" }]);
  delete repo.update;
  const res = await item(repo).PUT(jsonRequest({ x: 1 }), ctx("A"));
  assert.equal(res.status, 405);
  assert.equal((await res.json()).error, "Not supported");
});

test("item.DELETE removes (200 {ok:true}), 404 when missing, 405 unsupported", async () => {
  const repo = makeRepo([{ id: "A" }]);

  const ok = await item(repo).DELETE(new Request("http://test.local"), ctx("A"));
  assert.equal(ok.status, 200);
  assert.deepEqual(await ok.json(), { ok: true });
  assert.equal(repo._rows.length, 0);

  const missing = await item(repo).DELETE(new Request("http://test.local"), ctx("A"));
  assert.equal(missing.status, 404);

  const noRemove = makeRepo([{ id: "B" }]);
  delete noRemove.remove;
  const unsupported = await item(noRemove).DELETE(new Request("http://test.local"), ctx("B"));
  assert.equal(unsupported.status, 405);
  assert.equal((await unsupported.json()).error, "Not supported");
});
