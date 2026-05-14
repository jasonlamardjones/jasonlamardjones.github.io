document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  window.tlToggle = function(entry) {
    entry.classList.toggle('open');
  };

  const revealables = document.querySelectorAll('.reveal, .tl-entry');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealables.forEach(el => observer.observe(el));
  } else {
    revealables.forEach(el => el.classList.add('visible'));
  }

  const overlay = document.getElementById('siteImageLightbox');
  if (!overlay) return;

  const img = overlay.querySelector('img');
  const panel = overlay.querySelector('.site-lightbox-panel');

  overlay.setAttribute('hidden', '');
  overlay.setAttribute('aria-hidden', 'true');

  const openLightbox = (src, alt) => {
    if (!src || !img) return;
    img.src = src;
    img.alt = alt || 'Image preview';
    overlay.removeAttribute('hidden');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
  };

  const closeLightbox = () => {
    overlay.setAttribute('hidden', '');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    if (img) {
      img.removeAttribute('src');
      img.removeAttribute('alt');
    }
  };

  document.addEventListener('click', (event) => {
    const dataTrigger = event.target.closest('[data-lightbox]');
    const legacyTrigger = event.target.closest('a.lightbox-trigger');
    const trigger = dataTrigger || legacyTrigger;
    if (!trigger) return;

    const src = trigger.getAttribute('data-lightbox') || trigger.getAttribute('href');
    const alt = trigger.getAttribute('data-lightbox-alt') || trigger.querySelector('img')?.alt || 'Image preview';
    if (!src || src.startsWith('http')) return;

    event.preventDefault();
    event.stopPropagation();
    openLightbox(src, alt);
  });

  const closeTriggers = overlay.querySelectorAll('[data-lightbox-close]');
  closeTriggers.forEach(closeTrigger => {
    closeTrigger.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      closeLightbox();
    });
  });

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay || event.target.closest('[data-lightbox-close]')) {
      event.preventDefault();
      closeLightbox();
    }
  });

  if (panel) {
    panel.addEventListener('click', (event) => {
      if (!event.target.closest('[data-lightbox-close]')) {
        event.stopPropagation();
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !overlay.hasAttribute('hidden')) {
      closeLightbox();
    }
  });
});
