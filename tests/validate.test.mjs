import test from "node:test";
import assert from "node:assert/strict";
import {
  isEmail,
  isCardNumber,
  isExpiry,
  isCvc,
  isUrl,
  isDomain,
  passwordStrength,
} from "../src/lib/validate.ts";

test("isEmail accepts valid addresses and rejects malformed ones", () => {
  assert.equal(isEmail("user@example.com"), true);
  assert.equal(isEmail("  user@example.co.uk  "), true, "trims surrounding whitespace");
  assert.equal(isEmail("a.b+tag@sub.domain.io"), true);
  assert.equal(isEmail("no-at-sign.com"), false);
  assert.equal(isEmail("user@nodot"), false);
  assert.equal(isEmail("user@domain.x"), false, "TLD must be at least 2 chars");
  assert.equal(isEmail("two@@at.com"), false);
  assert.equal(isEmail("has space@x.com"), false);
});

test("isCardNumber validates length and Luhn checksum", () => {
  assert.equal(isCardNumber("4242424242424242"), true, "valid Visa test number");
  assert.equal(isCardNumber("4242 4242 4242 4242"), true, "spaces allowed");
  assert.equal(isCardNumber("4242-4242-4242-4242"), true, "dashes allowed");
  assert.equal(isCardNumber("4242424242424241"), false, "fails Luhn");
  assert.equal(isCardNumber("1234567890123"), false, "13 digits but bad checksum");
  assert.equal(isCardNumber("424242424242"), false, "12 digits too short");
  assert.equal(isCardNumber("42424242424242424242"), false, "20 digits too long");
  assert.equal(isCardNumber("4242abcd42424242"), false, "non-digits rejected");
});

test("isExpiry requires MM/YY and rejects past or invalid months", () => {
  assert.equal(isExpiry("13/30"), false, "month out of range");
  assert.equal(isExpiry("00/30"), false, "month zero");
  assert.equal(isExpiry("1/30"), false, "single-digit month not allowed");
  assert.equal(isExpiry("12-30"), false, "wrong separator");

  const now = new Date();
  const futureYY = String((now.getFullYear() + 2) % 100).padStart(2, "0");
  assert.equal(isExpiry(`12/${futureYY}`), true, "future year valid");

  const pastYY = String((now.getFullYear() - 1) % 100).padStart(2, "0");
  assert.equal(isExpiry(`12/${pastYY}`), false, "past year invalid");

  const thisYY = String(now.getFullYear() % 100).padStart(2, "0");
  const thisMM = String(now.getMonth() + 1).padStart(2, "0");
  assert.equal(isExpiry(`${thisMM}/${thisYY}`), true, "current month is still valid");
});

test("isCvc accepts 3-4 digit codes only", () => {
  assert.equal(isCvc("123"), true);
  assert.equal(isCvc("1234"), true);
  assert.equal(isCvc("12"), false);
  assert.equal(isCvc("12345"), false);
  assert.equal(isCvc("12a"), false);
});

test("isUrl accepts http/https URLs and rejects other schemes", () => {
  assert.equal(isUrl("https://fulfillmesh.com"), true);
  assert.equal(isUrl("http://localhost:3000/path?q=1"), true);
  assert.equal(isUrl("  https://trimmed.com  "), true);
  assert.equal(isUrl("ftp://files.example.com"), false, "non-http scheme rejected");
  assert.equal(isUrl("javascript:alert(1)"), false);
  assert.equal(isUrl("not a url"), false);
});

test("isDomain validates bare domain names", () => {
  assert.equal(isDomain("example.com"), true);
  assert.equal(isDomain("sub.example.co.uk"), true);
  assert.equal(isDomain("my-store.io"), true);
  assert.equal(isDomain("nodot"), false, "needs at least one dot");
  assert.equal(isDomain("-bad.com"), false, "label cannot start with hyphen");
  assert.equal(isDomain("bad-.com"), false, "label cannot end with hyphen");
  assert.equal(isDomain("https://example.com"), false, "scheme not allowed");
});

test("passwordStrength scores by length and character classes", () => {
  assert.equal(passwordStrength("abc"), "weak", "short, single class");
  assert.equal(passwordStrength("abcdefgh"), "weak", ">=8 chars alone is only 1 point");
  assert.equal(passwordStrength("aB1xyz"), "medium", "mixed case + digit = 2 points");
  assert.equal(passwordStrength("Abcdefgh1"), "medium", "len>=8 + mixed case + digit = 3 points");
  assert.equal(passwordStrength("Abcdefghijk1"), "strong", "len>=12 + mixed case + digit = 4 points");
  assert.equal(passwordStrength("Abcdefgh1234!"), "strong", "all five classes = 5 points");
});
