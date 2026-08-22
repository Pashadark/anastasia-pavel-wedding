export function getCountdownParts(targetMs, nowMs) {
  const left = Math.max(0, targetMs - nowMs);
  return { days: Math.floor(left / 86400000), hours: Math.floor((left % 86400000) / 3600000), minutes: Math.floor((left % 3600000) / 60000), seconds: Math.floor((left % 60000) / 1000), complete: left === 0 };
}

function boot() {
  const params = new URLSearchParams(window.location.search);
  const designClasses = { a: "design-a", b: "design-b", c: "design-c", d: "design-d" };
  const design = params.get("design");
  if (designClasses[design]) document.body.classList.add(designClasses[design]);
  if (params.get("preview") === "1") {
    document.querySelector("[data-welcome]")?.classList.add("hidden");
    document.body.classList.remove("locked");
    document.body.classList.add("is-preview");
  }
  const music = document.querySelector("[data-music]");
  const musicToggle = document.querySelector("[data-music-toggle]");
  document.querySelector("[data-open-invitation]")?.addEventListener("click", async () => {
    document.querySelector("[data-welcome]")?.classList.add("hidden");
    document.body.classList.remove("locked");
    try { await music?.play(); } catch { musicToggle?.classList.add("muted"); }
  });
  musicToggle?.addEventListener("click", async () => {
    if (!music) return;
    if (music.paused) { await music.play(); musicToggle.classList.remove("muted"); musicToggle.setAttribute("aria-label", "Выключить музыку"); }
    else { music.pause(); musicToggle.classList.add("muted"); musicToggle.setAttribute("aria-label", "Включить музыку"); }
  });
  document.querySelector("[data-add-calendar]")?.addEventListener("click", () => {
    const appleDevice = /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent);
    const googleCalendar = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=%D0%A1%D0%B2%D0%B0%D0%B4%D1%8C%D0%B1%D0%B0%20%D0%90%D0%BD%D0%B0%D1%81%D1%82%D0%B0%D1%81%D0%B8%D0%B8%20%D0%B8%20%D0%9F%D0%B0%D0%B2%D0%BB%D0%B0&dates=20260902T080000Z/20260902T180000Z&location=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0";
    window.location.href = appleDevice ? "./anastasia-pavel-wedding.ics" : googleCalendar;
  });

  const target = new Date("2026-09-02T11:00:00+03:00").getTime();
  const countdown = document.querySelector("[data-countdown]");
  const render = () => {
    const values = getCountdownParts(target, Date.now());
    for (const [key, value] of Object.entries(values)) {
      const element = countdown?.querySelector(`[data-${key}]`);
      if (element) element.textContent = String(value).padStart(2, "0");
    }
    return values.complete;
  };
  render();
  const timer = setInterval(() => { if (render()) clearInterval(timer); }, 1000);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const targets = document.querySelectorAll("[data-reveal], [data-timeline-item], [data-card-reveal]");
  if (reduced) targets.forEach((element) => element.classList.add("revealed"));
  else {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("revealed");
      observer.unobserve(entry.target);
    }), { threshold: 0.18, rootMargin: "0px 0px -8%" });
    document.querySelectorAll("[data-timeline-item]").forEach((element, index) => element.style.setProperty("--delay", `${index * 140}ms`));
    document.querySelectorAll("[data-card-reveal]").forEach((element, index) => element.style.setProperty("--delay", `${(index % 3) * 130}ms`));
    targets.forEach((element) => observer.observe(element));
  }
  document.querySelector("[data-decline]")?.addEventListener("click", () => {
    document.querySelector("[data-rsvp-choices]").hidden = true;
    const panel = document.querySelector("[data-decline-panel]");
    panel.hidden = false;
    panel.focus();
    if (music) music.pause();
    const declineVideo = panel.querySelector("[data-decline-video]");
    if (declineVideo) {
      declineVideo.muted = false;
      declineVideo.volume = 1;
      declineVideo.currentTime = 0;
      declineVideo.play().catch(() => declineVideo.setAttribute("controls", ""));
    }
  });
}

if (typeof document !== "undefined") boot();
