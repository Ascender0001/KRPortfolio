const navToggle = document.querySelector('.nav-toggle');
const navPanel = document.querySelector('.nav-panel');
const navLinks = document.querySelectorAll('.nav-panel a');
const revealElements = document.querySelectorAll('.reveal');

const setNavState = (isOpen) => {
  navPanel.classList.toggle('is-open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.querySelector('.sr-only').textContent = isOpen ? 'Menü bezárása' : 'Menü megnyitása';
};

navToggle.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  setNavState(!isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (navToggle.getAttribute('aria-expanded') === 'true') {
      setNavState(false);
    }
  });
});

document.addEventListener('click', (event) => {
  if (!navPanel.contains(event.target) && !navToggle.contains(event.target)) {
    setNavState(false);
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setNavState(false);
  }
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.18,
    rootMargin: '0px 0px -40px 0px',
  });

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

setNavState(false);