export function revealLocation(panel, button) {
  if (!panel || !button) return;
  panel.hidden = false;
  panel.classList.add('is-revealed');
  button.textContent = 'Место пока секретно';
  button.disabled = true;
}

export async function playFromIntro(audio) {
  if (!audio) return;
  if (!audio.currentTime || audio.currentTime < 27) audio.currentTime = 27;
  await audio.play();
}

if (typeof document !== 'undefined') {
  const panel = document.querySelector('[data-location-panel]');
  const trigger = document.querySelector('[data-location-trigger]');
  trigger?.addEventListener('click', () => revealLocation(panel, trigger));

  const music = document.querySelector('[data-party-music]');
  const musicButton = document.querySelector('[data-music-button]');
  let musicStarted = false;
  const updateMusicButton = () => {
    if (!musicButton || !music) return;
    musicButton.textContent = music.paused ? 'Музыка' : 'Пауза';
    musicButton.setAttribute('aria-label', music.paused ? 'Включить музыку' : 'Поставить музыку на паузу');
  };
  const startOnFirstTouch = async () => {
    if (musicStarted || !music) return;
    try { await playFromIntro(music); musicStarted = true; updateMusicButton(); } catch { updateMusicButton(); }
  };
  document.addEventListener('pointerdown', startOnFirstTouch, { once: true });
  musicButton?.addEventListener('click', async event => {
    event.stopPropagation();
    if (!music) return;
    if (music.paused) { try { await playFromIntro(music); musicStarted = true; } catch {} }
    else music.pause();
    updateMusicButton();
  });

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) reveals.forEach(el => el.classList.add('is-visible'));
  else {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: .14 });
    reveals.forEach(el => observer.observe(el));
  }

  const frames = [...document.querySelectorAll('.frame')];
  if (!reduced && frames.length) {
    let current = 0;
    setInterval(() => {
      frames[current].classList.remove('is-active');
      current = (current + 1) % frames.length;
      frames[current].classList.add('is-active');
    }, 1800);
  }
}
