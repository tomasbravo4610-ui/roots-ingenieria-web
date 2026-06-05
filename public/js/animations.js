document.addEventListener("DOMContentLoaded", () => {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Solo anima la primera vez
      }
    });
  }, observerOptions);

  // Seleccionar elementos estáticos
  const elements = document.querySelectorAll('.fade-in-up');
  elements.forEach(el => observer.observe(el));

  // Observador para elementos dinámicos inyectados por Decap CMS
  const observerConfig = { childList: true, subtree: true };
  const bodyObserver = new MutationObserver(() => {
    const newElements = document.querySelectorAll('.fade-in-up:not(.is-visible)');
    newElements.forEach(el => observer.observe(el));
  });
  bodyObserver.observe(document.body, observerConfig);
});
