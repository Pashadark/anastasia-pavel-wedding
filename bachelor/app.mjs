export function revealLocation(panel, button) {
  if (!panel || !button) return;
  panel.hidden = false;
  panel.classList.add('is-revealed');
  button.textContent = 'Место пока секретно';
  button.disabled = true;
}

export async function revealLocationMedia(panel, video) {
  if (!panel) return;
  panel.hidden = false;
  panel.classList.add('is-revealed');
  try { await video?.play(); } catch {}
}

export async function playFromIntro(audio) {
  if (!audio) return;
  if (!audio.currentTime || audio.currentTime < 27) audio.currentTime = 27;
  await audio.play();
}

export async function openInvitation(gate, audio, finish = () => gate?.remove()) {
  await playFromIntro(audio);
  gate?.classList.add('is-opening');
  finish();
}

if (typeof document !== 'undefined') {
  const panel = document.querySelector('[data-location-panel]');
  const trigger = document.querySelector('[data-location-trigger]');
  const locationVideo = document.querySelector('[data-location-video]');
  const locationVideoPlayer = document.querySelector('[data-location-video-player]');
  trigger?.addEventListener('click', () => {
    revealLocation(panel, trigger);
    revealLocationMedia(locationVideo, locationVideoPlayer);
  });

  const music = document.querySelector('[data-party-music]');
  const musicButton = document.querySelector('[data-music-button]');
  const entryGate = document.querySelector('[data-entry-gate]');
  const entryButton = document.querySelector('[data-entry-button]');
  let musicStarted = false;
  const updateMusicButton = () => {
    if (!musicButton || !music) return;
    musicButton.textContent = music.paused ? 'Музыка' : 'Пауза';
    musicButton.setAttribute('aria-label', music.paused ? 'Включить музыку' : 'Поставить музыку на паузу');
  };
  entryButton?.addEventListener('click', async () => {
    if (!entryGate || !music) return;
    try {
      await openInvitation(entryGate, music, () => setTimeout(() => entryGate.remove(), 420));
      musicStarted = true;
    } catch {
      entryGate.remove();
    }
    updateMusicButton();
  });
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
  const filmstrip = document.querySelector('[data-filmstrip]');
  if (!reduced && frames.length) {
    let current = 0;
    setInterval(() => {
      frames[current].classList.remove('is-active');
      current = (current + 1) % frames.length;
      frames[current].classList.add('is-active');
      filmstrip?.classList.remove('is-switching');
      void filmstrip?.offsetWidth;
      filmstrip?.classList.add('is-switching');
    }, 1800);
  }

  const joinButton = document.querySelector('[data-join-pack]');
  const packScreen = document.querySelector('[data-pack-screen]');
  const packCount = document.querySelector('[data-pack-count]');
  const joined = localStorage.getItem('bachelor-pack-joined') === '1';
  if (joined && packCount) packCount.textContent = '8';
  joinButton?.addEventListener('click', event => {
    event.preventDefault();
    const href = joinButton.href;
    if (!localStorage.getItem('bachelor-pack-joined')) {
      localStorage.setItem('bachelor-pack-joined', '1');
      if (packCount) packCount.textContent = '8';
    }
    if (packScreen) {
      packScreen.hidden = false;
      packScreen.classList.add('is-visible');
    }
    setTimeout(() => { window.location.href = href; }, 1150);
  });
}
