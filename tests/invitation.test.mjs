import assert from "node:assert/strict";
import test from "node:test";
import { getCountdownParts } from "../invitation.mjs";

test("splits a remaining duration", () => {
  assert.deepEqual(getCountdownParts(90_061_000, 0), { days: 1, hours: 1, minutes: 1, seconds: 1, complete: false });
});

test("stops at zero after the wedding starts", () => {
  assert.deepEqual(getCountdownParts(1_000, 2_000), { days: 0, hours: 0, minutes: 0, seconds: 0, complete: true });
});
