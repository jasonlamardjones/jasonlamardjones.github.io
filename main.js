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
});


document.addEventListener('DOMContentLoaded', () => {
  const dialog = document.getElementById('imageLightbox');
  if (!dialog) return;

  const dialogImage = dialog.querySelector('img');
  const closeButton = dialog.querySelector('.lightbox-close');
  const buttons = document.querySelectorAll('[data-lightbox]');

  const closeDialog = () => {
    if (dialog.open) dialog.close();
    dialogImage.removeAttribute('src');
    dialogImage.removeAttribute('alt');
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const src = button.getAttribute('data-lightbox');
      const alt = button.getAttribute('data-lightbox-alt') || button.querySelector('img')?.alt || 'Image preview';
      if (!src || !dialogImage) return;
      dialogImage.src = src;
      dialogImage.alt = alt;
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        window.open(src, '_blank', 'noopener');
      }
    });
  });

  if (closeButton) closeButton.addEventListener('click', closeDialog);

  dialog.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    const inside = (
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom
    );
    if (!inside) closeDialog();
  });
});
