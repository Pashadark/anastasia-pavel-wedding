import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("contains the complete wedding invitation", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const script = await readFile(new URL("../invitation.mjs", import.meta.url), "utf8");
  for (const id of ["hero", "invitation", "schedule", "locations", "dress-code", "rsvp", "closing"]) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
  }
  assert.match(html, /Анастасия/);
  assert.match(html, /Павел/);
  assert.match(html, /02\.09\.2026/);
  assert.match(html, /https:\/\/t\.me\/\+ieyOMxZtKNQ3ZDNi/);
  assert.doesNotMatch(html, /После подтверждения вы сможете пройти опрос/);
  assert.match(html, /У близких душ единые поля/);
  assert.match(script, /anastasia-pavel-wedding\.ics/);
  assert.match(html, /https:\/\/yandex\.ru\/maps\/-\/CTsgBENo/);
  assert.match(html, /data-card-reveal/);
  assert.match(html, /Анастасия .*♥.* Павел/);
  assert.doesNotMatch(html, />с музыкой</);
  assert.doesNotMatch(html, /морепродукт/);
  assert.match(html, /yandex\.ru\/maps\/org\/dnevnik\/169389306628/);
  assert.match(html, /data-add-calendar/);
  assert.match(html, /timer-detail/);
  assert.match(html, /она бесценна/);
  assert.match(html, /Карандаш/);
  assert.match(html, /мальчика или девочку/);
  assert.match(html, /forbidden-colors/);
  assert.doesNotMatch(html, /Сиреневый|сиренев/iu);
  assert.match(html, /Не рекомендуемые цвета: белый и красный/);
  assert.match(html, /class="photo-stack"/);
  assert.match(html, /class="photo-stack-card photo-stack-large"/);
  assert.match(html, /class="photo-stack-card photo-stack-small"/);
  for (let photo = 1; photo <= 10; photo += 1) {
    const matches = html.match(new RegExp(`new-photo-${String(photo).padStart(2, "0")}\\.jpg`, "g")) ?? [];
    assert.equal(matches.length, 1, `new photo ${photo} must appear exactly once`);
  }
  assert.match(html, /assets\/decline-video\.mp4/);
  assert.match(html, /data-decline-video/);
  assert.match(html, /decline-video/);
  assert.match(html, /scroll-diamonds/);
  assert.doesNotMatch(html, /Открыть карту ↗/);
  assert.doesNotMatch(html, /Открыть видео отдельно ↗/);
});

test("uses paper-cut section transitions", async () => {
  const css = await readFile(new URL("../theme-a.css", import.meta.url), "utf8");
  assert.match(css, /paper-cut/);
  assert.match(css, /conic-gradient/);
});
