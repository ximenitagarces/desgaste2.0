document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const paragraphs = document.querySelectorAll('.testimonio p');

  /* if (!paragraphs.length) {
    // No testimonial text in this page; only initialize Lenis if animation is desired.
    if (!prefersReducedMotion) {
      initLenis();
    }
    return;
  } */

  if (prefersReducedMotion) {
    paragraphs.forEach((paragraph) => {
      paragraph.style.color = '#111';
    });
    return;
  }

  // initLenis();
  gsap.registerPlugin(ScrollTrigger);

  paragraphs.forEach((paragraph) => {
    const split = new SplitType(paragraph, { types: 'words', tagName: 'span' });

    gsap.set(split.words, { color: 'black', opacity: 0.5 });

    gsap.to(split.words, {
      color: '#000',
      opacity: 1,
      ease: 'none',
      stagger: { each: 0.03, from: 'start' },
      scrollTrigger: {
        trigger: paragraph,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: true
      }
    });
  });
});

function initLenis() {
  
  const lenis = new Lenis({
    lerp: 0.08,
    smoothWheel: true,
    smoothTouch: false
  });

  function raf(time) {
    lenis.raf(time);
    ScrollTrigger?.update();
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

