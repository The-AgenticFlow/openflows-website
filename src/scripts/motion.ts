import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

declare global {
  interface Window {
    lenis?: Lenis;
  }
}

const NAV_HIDE_OFFSET = 160;
const NAV_SCROLL_THRESHOLD = 6;

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  window.lenis = new Lenis({
    autoRaf: true,
    anchors: { offset: -80 },
    lerp: 0.12,
  });
}

const progressBar = document.querySelector<HTMLElement>('[data-scroll-progress]');
const navbar = document.getElementById('navbar');
const mobileMenu = document.getElementById('mobileMenu');

let lastY = window.scrollY;
let frame = 0;

const isNavPinnedOpen = () =>
  Boolean(
    navbar?.matches(':focus-within') ||
      (navbar?.dataset.dropdownActiveClass && navbar.classList.contains(navbar.dataset.dropdownActiveClass)) ||
      (mobileMenu?.dataset.openClass && mobileMenu.classList.contains(mobileMenu.dataset.openClass)),
  );

const update = () => {
  frame = 0;
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;

  if (progressBar) {
    progressBar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
  }

  if (navbar) {
    const delta = y - lastY;
    if (y < NAV_HIDE_OFFSET || isNavPinnedOpen()) {
      navbar.classList.remove('nav-hidden');
    } else if (delta > NAV_SCROLL_THRESHOLD) {
      navbar.classList.add('nav-hidden');
    } else if (delta < -NAV_SCROLL_THRESHOLD) {
      navbar.classList.remove('nav-hidden');
    }
    if (Math.abs(delta) > NAV_SCROLL_THRESHOLD) lastY = y;
  }
};

const requestUpdate = () => {
  if (!frame) frame = requestAnimationFrame(update);
};

window.addEventListener('scroll', requestUpdate, { passive: true });
window.addEventListener('resize', requestUpdate, { passive: true });
navbar?.addEventListener('focusin', () => navbar.classList.remove('nav-hidden'));
update();
