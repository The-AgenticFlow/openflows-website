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
const isAppShell = document.body.hasAttribute('data-app-shell');

if (!prefersReducedMotion && !isAppShell) {
  window.lenis = new Lenis({
    autoRaf: true,
    anchors: { offset: -80 },
    lerp: 0.12,
  });
}

const progressBar = document.querySelector<HTMLElement>('[data-scroll-progress]');
const reveal = document.querySelector<HTMLElement>('[data-site-reveal]');
const revealInner = reveal?.firstElementChild as HTMLElement | null;
const sheet = document.querySelector<HTMLElement>('.site-sheet');
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

  if (!prefersReducedMotion && reveal && revealInner && sheet) {
    const uncovered = window.innerHeight - sheet.getBoundingClientRect().bottom;
    const amount = Math.min(1, Math.max(0, uncovered / reveal.offsetHeight));
    revealInner.style.setProperty('--reveal', amount.toFixed(3));
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

// Scroll reveal: content below the fold rises into view, with a short stagger inside a group.
const REVEAL_SELECTORS = [
  '.site-sheet main h2',
  '.site-sheet section h2',
  '.site-sheet article h2',
  '.site-sheet figure',
  '.content-row',
  '.recent-news-lead',
  '.recent-news-item',
  '.story-feature',
  '.story-strip-item',
  '.site-sheet [class*="_card_"]',
  '.site-sheet [class*="Card_"]',
  '.site-sheet [class*="Item_"]',
  '.site-sheet .docCard',
  '[data-reveal]',
].join(',');
const REVEAL_EXCLUDE = '.site-footer, [data-agent-flow], [data-intro], [data-no-reveal]';
const REVEAL_STAGGER_MS = 70;
const REVEAL_MAX_STEPS = 5;

if (!prefersReducedMotion && !isAppShell && 'IntersectionObserver' in window) {
  const foldLine = window.innerHeight * 0.92;
  const candidates = [...document.querySelectorAll<HTMLElement>(REVEAL_SELECTORS)].filter(
    (el) => !el.closest(REVEAL_EXCLUDE) && el.getBoundingClientRect().top > foldLine,
  );
  const candidateSet = new Set<Element>(candidates);
  const targets = candidates.filter((el) => {
    for (let parent = el.parentElement; parent; parent = parent.parentElement) {
      if (candidateSet.has(parent)) return false;
    }
    return true;
  });

  const finish = (el: HTMLElement) => {
    el.classList.remove('reveal-pending', 'is-revealed');
    el.style.removeProperty('--reveal-delay');
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        observer.unobserve(el);
        el.classList.add('is-revealed');
        el.addEventListener('transitionend', () => finish(el), { once: true });
        window.setTimeout(() => finish(el), 1600);
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
  );

  const groupIndex = new Map<Element, number>();
  targets.forEach((el) => {
    const parent = el.parentElement ?? document.body;
    const index = groupIndex.get(parent) ?? 0;
    groupIndex.set(parent, index + 1);
    el.style.setProperty('--reveal-delay', `${Math.min(index, REVEAL_MAX_STEPS) * REVEAL_STAGGER_MS}ms`);
    el.classList.add('reveal-pending');
    observer.observe(el);
  });
}
