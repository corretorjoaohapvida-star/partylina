'use strict';

const variant = window.LINA_OFFER?.variant || 'b-2026-10';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

document.querySelectorAll('.faq-list details').forEach((question) => {
  question.addEventListener('toggle', () => {
    if (question.open) document.querySelectorAll('.faq-list details').forEach((other) => {
      if (other !== question) other.open = false;
    });
  });
});

// Pass existing campaign labels without changing either Hotmart offer ID.
const campaign = new URLSearchParams(window.location.search);
document.querySelectorAll('a.checkout').forEach((link) => {
  const checkout = new URL(link.href);
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'src', 'sck'].forEach((key) => {
    const value = campaign.get(key);
    if (value) checkout.searchParams.set(key, value);
  });
  if (!checkout.searchParams.has('src')) checkout.searchParams.set('src', 'lina-lp-b');
  link.href = checkout.href;
  link.addEventListener('click', () => {
    if (typeof window.fbq !== 'function') return;
    const complete = link.dataset.plan === 'complete';
    window.fbq('track', 'InitiateCheckout', {
      content_name: complete ? 'Lina Complete Party Library' : 'Lina Basic Collection',
      content_ids: [complete ? 'lina-party-complete' : 'lina-party-basic'],
      content_type: 'product',
      currency: 'USD',
      value: complete ? 14.90 : 7.90,
      num_items: 1,
      landing_page_variant: variant
    });
  });
});

// Offer visibility is a separate funnel event; an anchor click is not checkout.
const plans = document.getElementById('plans');
let plansTracked = false;
new IntersectionObserver(([entry], observer) => {
  if (!entry.isIntersecting || plansTracked) return;
  plansTracked = true;
  if (typeof window.fbq === 'function') window.fbq('track', 'ViewContent', {
    content_name: 'Lina Party Collection – Plans',
    content_ids: ['lina-party-complete', 'lina-party-basic'],
    content_type: 'product_group',
    landing_page_variant: variant
  });
  observer.disconnect();
}, {threshold:0.1}).observe(plans);

// The existing 24-hour display renews; it never closes or disables checkout.
const countdown = document.querySelector('[data-offer-countdown]');
const hours = Number(window.LINA_OFFER?.durationHours);
const duration = (Number.isFinite(hours) && hours > 0 ? hours : 24) * 3600000;
const storageKey = 'lina-offer-renewal-v1';
let refreshAt = 0;
try { refreshAt = Number(localStorage.getItem(storageKey)); } catch (_) {}
const renewCountdown = () => {
  refreshAt = Date.now() + duration;
  try { localStorage.setItem(storageKey, String(refreshAt)); } catch (_) {}
};
if (!Number.isFinite(refreshAt) || refreshAt <= Date.now() || refreshAt > Date.now() + duration) renewCountdown();
const updateCountdown = () => {
  if (refreshAt <= Date.now()) renewCountdown();
  const remaining = Math.ceil((refreshAt - Date.now()) / 1000);
  countdown.querySelector('[data-countdown-hours]').textContent = String(Math.floor(remaining / 3600)).padStart(2,'0');
  countdown.querySelector('[data-countdown-minutes]').textContent = String(Math.floor(remaining % 3600 / 60)).padStart(2,'0');
  countdown.querySelector('[data-countdown-seconds]').textContent = String(remaining % 60).padStart(2,'0');
};
updateCountdown();
setInterval(updateCountdown,1000);
new ResizeObserver(() => document.documentElement.style.setProperty('--promo-height', `${countdown.getBoundingClientRect().height}px`)).observe(countdown);

// Continuous galleries pause for interaction and reduced-motion preferences.
document.querySelectorAll('[data-gallery-controls]').forEach((controls) => {
  const gallery = document.getElementById(controls.dataset.galleryControls);
  const slides = [...gallery.querySelectorAll('figure')];
  const previous = controls.querySelector('[data-direction="previous"]');
  const next = controls.querySelector('[data-direction="next"]');
  const toggle = controls.querySelector('.gallery-toggle');
  const counter = controls.querySelector('.gallery-count');
  const copies = slides.map((slide) => {
    const copy = slide.cloneNode(true);
    copy.setAttribute('aria-hidden','true');
    copy.querySelectorAll('button').forEach((button) => button.tabIndex = -1);
    gallery.append(copy);
    return copy;
  });
  let cycleWidth = 0;
  let offsets = [];
  let position = 0;
  let lastFrame = 0;
  let frame = 0;
  let visible = false;
  let userPaused = reducedMotion.matches;
  let hovered = false;
  let touching = false;
  let resumeAt = 0;
  const normalized = (value) => cycleWidth ? ((value % cycleWidth) + cycleWidth) % cycleWidth : 0;
  const activeIndex = () => offsets.reduce((nearest, offset, index) =>
    Math.abs(offset - normalized(gallery.scrollLeft)) < Math.abs(offsets[nearest] - normalized(gallery.scrollLeft)) ? index : nearest, 0);
  const updateCounter = () => { counter.textContent = `${activeIndex() + 1} / ${slides.length}`; };
  const updateToggle = () => {
    toggle.textContent = userPaused ? 'Play' : 'Pause';
    toggle.setAttribute('aria-pressed',String(userPaused));
    toggle.setAttribute('aria-label',`${userPaused ? 'Play' : 'Pause'} automatic gallery`);
  };
  const measure = () => {
    const progress = cycleWidth ? position / cycleWidth : 0;
    offsets = slides.map((slide) => slide.offsetLeft - slides[0].offsetLeft);
    cycleWidth = copies[0].offsetLeft - slides[0].offsetLeft;
    position = normalized(progress * cycleWidth);
    gallery.scrollLeft = position;
    updateCounter();
  };
  const shouldPlay = (now) => visible && !document.hidden && !userPaused && !hovered && !touching &&
    !gallery.matches(':focus-within') && now >= resumeAt && cycleWidth > 0;
  const animate = (now) => {
    const elapsed = lastFrame ? Math.min(now - lastFrame,50) : 0;
    lastFrame = now;
    if (shouldPlay(now)) {
      position = normalized(position + elapsed * 0.028);
      gallery.scrollLeft = position;
    }
    frame = visible && !document.hidden ? requestAnimationFrame(animate) : 0;
  };
  const start = () => { if (!frame && visible && !document.hidden) { lastFrame = 0; frame = requestAnimationFrame(animate); } };
  const move = (direction) => {
    resumeAt = performance.now() + 5000;
    const index = activeIndex();
    let target = index + direction;
    if (target < 0) { gallery.scrollLeft = normalized(gallery.scrollLeft) + cycleWidth; target = slides.length - 1; }
    else if (target >= slides.length) { gallery.scrollLeft = normalized(gallery.scrollLeft); target = slides.length; }
    gallery.scrollTo({left:target === slides.length ? cycleWidth : offsets[target],behavior:reducedMotion.matches ? 'instant' : 'smooth'});
  };
  previous.addEventListener('click',() => move(-1));
  next.addEventListener('click',() => move(1));
  toggle.addEventListener('click',() => { userPaused = !userPaused; updateToggle(); start(); });
  gallery.addEventListener('scroll',() => {
    if (!shouldPlay(performance.now())) position = gallery.scrollLeft;
    updateCounter();
  },{passive:true});
  gallery.addEventListener('mouseenter',() => { hovered = true; });
  gallery.addEventListener('mouseleave',() => { hovered = false; });
  gallery.addEventListener('touchstart',() => { touching = true; },{passive:true});
  const releaseTouch = () => { touching = false; resumeAt = performance.now() + 5000; };
  gallery.addEventListener('touchend',releaseTouch,{passive:true});
  gallery.addEventListener('touchcancel',releaseTouch,{passive:true});
  gallery.addEventListener('wheel',() => { resumeAt = performance.now() + 5000; },{passive:true});
  gallery.addEventListener('keydown',(event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1); }
  });
  new ResizeObserver(measure).observe(gallery);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) start(); },{rootMargin:'100px',threshold:0}).observe(gallery);
  document.addEventListener('visibilitychange',start);
  reducedMotion.addEventListener('change',() => { userPaused = reducedMotion.matches; updateToggle(); });
  gallery.querySelectorAll('img').forEach((img) => img.addEventListener('load',measure,{once:true}));
  measure();
  updateToggle();
});

const viewer = document.getElementById('photo-viewer');
let returnFocus = null;
document.querySelectorAll('.gallery').forEach((gallery) => gallery.addEventListener('click',(event) => {
  const button = event.target.closest('.photo-open');
  if (!button) return;
  const img = button.querySelector('img');
  returnFocus = button;
  document.getElementById('viewer-image').src = img.src;
  document.getElementById('viewer-image').alt = img.alt;
  document.getElementById('photo-title').textContent = button.closest('figure').querySelector('figcaption').textContent;
  viewer.showModal();
}));
viewer.querySelector('.viewer-close').addEventListener('click',() => viewer.close());
viewer.addEventListener('click',(event) => { if (event.target === viewer) {
  const rect = viewer.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) viewer.close();
} });
viewer.addEventListener('close',() => returnFocus?.focus({preventScroll:true}));

