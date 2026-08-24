export function revealLocation(panel, button) {
  if (!panel || !button) return;
  panel.hidden = false;
  panel.classList.add('is-revealed');
  button.textContent = 'Место пока секретно';
  button.disabled = true;
}

if (typeof document !== 'undefined') {
  const panel = document.querySelector('[data-location-panel]');
  const trigger = document.querySelector('[data-location-trigger]');
  trigger?.addEventListener('click', () => revealLocation(panel, trigger));

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
