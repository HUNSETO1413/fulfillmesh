import test from "node:test";
import assert from "node:assert/strict";
import { hashPassword, verifyPassword } from "../src/lib/password.ts";
import { createSessionToken, verifySessionToken } from "../src/lib/session.ts";

test("hashPassword/verifyPassword round-trips", () => {
  const hash = hashPassword("demo1234");
  assert.match(hash, /^scrypt\$/);
  assert.equal(verifyPassword("demo1234", hash), true);
  assert.equal(verifyPassword("wrong-password", hash), false);
});

test("password hashes are salted (two hashes differ)", () => {
  assert.notEqual(hashPassword("same"), hashPassword("same"));
});

test("session token signs and verifies", async () => {
  const token = await createSessionToken({ uid: "USR-1", email: "a@b.com", role: "Admin" });
  const payload = await verifySessionToken(token);
  assert.ok(payload);
  assert.equal(payload.uid, "USR-1");
  assert.equal(payload.role, "Admin");
});

test("tampered session token is rejected", async () => {
  const token = await createSessionToken({ uid: "USR-1", email: "a@b.com", role: "Admin" });
  const tampered = token.slice(0, -2) + (token.endsWith("aa") ? "bb" : "aa");
  assert.equal(await verifySessionToken(tampered), null);
});

test("expired session token is rejected", async () => {
  const now = 1_000_000;
  const token = await createSessionToken({ uid: "USR-1", email: "a@b.com", role: "Admin" }, 100, now);
  assert.equal(await verifySessionToken(token, now + 200), null);
  assert.ok(await verifySessionToken(token, now + 50));
});
