// Respect native keyboard behavior and keep questions easy to browse.
const questions = document.querySelectorAll('.faq-list details');
questions.forEach((question) => {
  question.addEventListener('toggle', () => {
    if (!question.open) return;
    questions.forEach((other) => { if (other !== question) other.open = false; });
  });
});
// Never leave a broken-image icon in place of supplied media.
// Show an honest, accessible source link if Imgur is unavailable.
document.querySelectorAll('img').forEach((img) => {
  img.addEventListener('error', () => {
    const link = document.createElement('a');
    link.className = 'image-unavailable';
    link.href = img.src;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'View the original collection image';
    link.setAttribute('aria-label', `View original image: ${img.alt}`);
    img.replaceWith(link);
  }, { once: true });
});

// Continuous galleries retain native touch scrolling and a visible pause control.
document.querySelectorAll('[data-gallery-controls]').forEach((controls) => {
  const gallery = document.getElementById(controls.dataset.galleryControls);
  if (!gallery) return;
  const slides = [...gallery.querySelectorAll('figure')];
  const previous = controls.querySelector('[data-direction="previous"]');
  const next = controls.querySelector('[data-direction="next"]');
  const toggle = controls.querySelector('.gallery-toggle');
  const counter = controls.querySelector('.gallery-count');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const copies = slides.map((slide) => {
    const copy = slide.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    copy.setAttribute('inert', '');
    copy.querySelectorAll('img').forEach((img) => { img.alt = ''; });
    gallery.append(copy);
    return copy;
  });
  let cycleWidth = 0;
  let offsets = [];
  let position = 0;
  let lastFrame = 0;
  let visible = false;
  let userPaused = reducedMotion.matches;
  let hovered = false;
  let touching = false;
  let resumeAt = 0;
  const shouldPlay = (now) => {
    const focused = gallery.matches(':focus-within') || (controls.matches(':focus-within') && document.activeElement !== toggle);
    return visible && !document.hidden && !userPaused && !hovered && !touching && !focused && now >= resumeAt && cycleWidth > 0;
  };
  const normalized = (value) => cycleWidth ? ((value % cycleWidth) + cycleWidth) % cycleWidth : 0;
  const activeIndex = () => offsets.reduce((nearest, offset, index) =>
    Math.abs(offset - normalized(gallery.scrollLeft)) < Math.abs(offsets[nearest] - normalized(gallery.scrollLeft)) ? index : nearest, 0);
  const updateCounter = () => {
    counter.textContent = `${activeIndex() + 1} / ${slides.length}`;
  };
  const updateToggle = () => {
    toggle.textContent = userPaused ? 'Play' : 'Pause';
    toggle.setAttribute('aria-pressed', String(userPaused));
    toggle.setAttribute('aria-label', `${userPaused ? 'Play' : 'Pause'} slideshow`);
  };
  const measure = () => {
    const progress = cycleWidth ? position / cycleWidth : 0;
    offsets = slides.map((slide) => slide.offsetLeft - slides[0].offsetLeft);
    cycleWidth = copies[0].offsetLeft - slides[0].offsetLeft;
    position = normalized(progress * cycleWidth);
    gallery.scrollLeft = position;
    updateCounter();
  };
  const move = (direction) => {
    resumeAt = performance.now() + 3500;
    const index = activeIndex();
    let target = index + direction;
    if (target < 0) {
      gallery.scrollLeft = normalized(gallery.scrollLeft) + cycleWidth;
      target = slides.length - 1;
    } else if (target >= slides.length) {
      gallery.scrollLeft = normalized(gallery.scrollLeft);
      target = slides.length;
    }
    gallery.scrollTo({left: target === slides.length ? cycleWidth : offsets[target], behavior: reducedMotion.matches ? 'instant' : 'smooth'});
  };
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  toggle.addEventListener('click', () => { userPaused = !userPaused; updateToggle(); });
  gallery.addEventListener('scroll', () => {
    if (!shouldPlay(performance.now())) position = gallery.scrollLeft;
    updateCounter();
  }, {passive:true});
  gallery.addEventListener('mouseenter', () => { hovered = true; });
  gallery.addEventListener('mouseleave', () => { hovered = false; });
  gallery.addEventListener('touchstart', () => { touching = true; }, {passive:true});
  const releaseTouch = () => { touching = false; resumeAt = performance.now() + 3500; };
  gallery.addEventListener('touchend', releaseTouch, {passive:true});
  gallery.addEventListener('touchcancel', releaseTouch, {passive:true});
  gallery.addEventListener('wheel', () => { resumeAt = performance.now() + 3500; }, {passive:true});
  gallery.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    move(event.key === 'ArrowRight' ? 1 : -1);
  });
  new ResizeObserver(measure).observe(gallery);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) gallery.querySelectorAll('img').forEach((img) => { img.loading = 'eager'; });
  }, {threshold:0.05}).observe(gallery);
  reducedMotion.addEventListener('change', () => { userPaused = reducedMotion.matches; updateToggle(); });
  const animate = (now) => {
    const elapsed = lastFrame ? Math.min(now - lastFrame, 50) : 0;
    lastFrame = now;
    if (shouldPlay(now)) {
      position = normalized(position + elapsed * 0.022);
      gallery.scrollLeft = position;
    }
    requestAnimationFrame(animate);
  };
  measure();
  updateToggle();
  requestAnimationFrame(animate);
});

// Keep campaign attribution when a visitor continues to the official checkout.
const campaignParams = new URLSearchParams(window.location.search);
document.querySelectorAll('a.checkout').forEach((link) => {
  const checkout = new URL(link.href);
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((key) => {
    const value = campaignParams.get(key);
    if (value) checkout.searchParams.set(key, value);
  });
  link.href = checkout.href;
  link.addEventListener('click', () => {
    if (link.getAttribute('aria-disabled') === 'true' || typeof window.fbq !== 'function') return;
    const complete = link.dataset.plan === 'complete';
    window.fbq('track', 'InitiateCheckout', {
      content_name: complete ? 'Lina Complete Party Library' : 'Lina Basic Collection',
      currency: 'USD',
      value: complete ? 14.90 : 7.90,
      num_items: 1
    });
  });
});

// Renew the display every 24 hours; checkout availability is independent of it.
const countdown = document.querySelector('[data-offer-countdown]');
if (countdown) {
  const configuredHours = Number(window.LINA_OFFER?.durationHours);
  const duration = (Number.isFinite(configuredHours) && configuredHours > 0 ? configuredHours : 24) * 3600000;
  const storageKey = 'lina-offer-renewal-v1';
  let refreshAt = 0;
  try { refreshAt = Number(window.localStorage.getItem(storageKey)); } catch (_) {}
  const renewCountdown = () => {
    refreshAt = Date.now() + duration;
    try { window.localStorage.setItem(storageKey, String(refreshAt)); } catch (_) {}
  };
  if (!Number.isFinite(refreshAt) || refreshAt <= Date.now() || refreshAt > Date.now() + duration) renewCountdown();
  countdown.hidden = false;
  const updateCountdown = () => {
    if (refreshAt <= Date.now()) renewCountdown();
    const remaining = Math.ceil((refreshAt - Date.now()) / 1000);
    countdown.querySelector('[data-countdown-hours]').textContent = String(Math.floor(remaining / 3600)).padStart(2, '0');
    countdown.querySelector('[data-countdown-minutes]').textContent = String(Math.floor(remaining % 3600 / 60)).padStart(2, '0');
    countdown.querySelector('[data-countdown-seconds]').textContent = String(remaining % 60).padStart(2, '0');
  };
  updateCountdown();
  setInterval(updateCountdown, 1000);
  new ResizeObserver(() => {
    document.documentElement.style.setProperty('--promo-height', `${countdown.getBoundingClientRect().height}px`);
  }).observe(countdown);
}
