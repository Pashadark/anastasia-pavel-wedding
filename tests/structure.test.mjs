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
  assert.match(html, /assets\/nikakogo-prazdnika\.mp4/);
  assert.doesNotMatch(html, /data-decline-audio/);
  assert.match(html, /data-decline-video/);
  assert.match(html, /decline-video/);
  assert.doesNotMatch(html, /data-decline-video[^>]*\scontrols(?:\s|=|>)/);
  assert.match(script, /declineVideo\.muted = false/);
  assert.match(script, /declineVideo\.volume = 1/);
  assert.doesNotMatch(script, /declineAudio/);
  assert.match(html, /class="triple-stack"/);
  assert.equal((html.match(/triple-stack-card/g) ?? []).length, 3);
  assert.match(html, /class="memory-main" src="\.\/assets\/new-photo-01\.jpg"/);
  assert.match(html, /scroll-diamonds/);
  assert.doesNotMatch(html, /Открыть карту ↗/);
  assert.doesNotMatch(html, /Открыть видео отдельно ↗/);
});

test("uses irregular torn-paper section transitions and a brownie closing", async () => {
  const css = await readFile(new URL("../theme-a.css", import.meta.url), "utf8");
  assert.match(css, /paper-cut/);
  assert.match(css, /clip-path:polygon/);
  assert.doesNotMatch(css, /conic-gradient/);
  assert.match(css, /\.closing\{background:#4b3028/);
  assert.match(css, /\.memory-gallery\{[^}]*position:relative/);
  assert.match(css, /\.quote\{[^}]*Great Vibes/);
  assert.match(css, /\.quote\{[^}]*white-space:nowrap/);
});

test("decline video uses phone-compatible H.264 video and AAC audio", async () => {
  const video = await readFile(new URL("../assets/nikakogo-prazdnika.mp4", import.meta.url));
  assert.notEqual(video.indexOf(Buffer.from("avc1")), -1);
  assert.notEqual(video.indexOf(Buffer.from("mp4a")), -1);
  assert.equal(video.indexOf(Buffer.from("hev1")), -1);
});

test("decline video contains the full scene instead of the two-second excerpt", async () => {
  const video = await readFile(new URL("../assets/nikakogo-prazdnika.mp4", import.meta.url));
  assert.ok(video.length > 1_000_000, `expected full video, received ${video.length} bytes`);
});

test("offers four isolated mobile redesigns and the untouched original", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const script = await readFile(new URL("../invitation.mjs", import.meta.url), "utf8");
  const css = await readFile(new URL("../design-variants.css", import.meta.url), "utf8");
  assert.match(html, /design-variants\.css/);
  assert.match(script, /URLSearchParams/);
  assert.match(script, /design-(?:a|b|c|d)/);
  for (const theme of ["a", "b", "c", "d"]) {
    assert.match(css, new RegExp(`body\\.design-${theme}`));
  }
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /max-width:\s*430px/);
});

test("local preview links to original and all four redesigns", async () => {
  const html = await readFile(new URL("../preview.html", import.meta.url), "utf8");
  assert.match(html, /design=original/);
  for (const theme of ["a", "b", "c", "d"]) {
    assert.match(html, new RegExp(`design=${theme}`));
  }
  assert.equal((html.match(/class="phone"/g) ?? []).length, 4);
});

test("the chosen original direction has a dedicated mobile polish layer", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const script = await readFile(new URL("../invitation.mjs", import.meta.url), "utf8");
  const css = await readFile(new URL("../original-polish.css", import.meta.url), "utf8");
  assert.match(html, /original-polish\.css/);
  assert.match(script, /design-original/);
  assert.match(css, /body\.design-original/);
  assert.match(css, /max-width:\s*430px/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /timeline \[data-timeline-item\][^{]*\{[^}]*opacity:\s*1/);
});
