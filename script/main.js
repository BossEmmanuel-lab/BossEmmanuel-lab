// ── AOS ─────────────────────────────────────────────────────────────
AOS.init({ duration: 650, easing: 'ease-out-quart', once: true, offset: 70 });

// ── Sliding Nav Indicator ────────────────────────────────────────────
const navInner  = document.querySelector('.nav-inner');
const indicator = document.querySelector('.nav-indicator');
const navLinks  = Array.from(document.querySelectorAll('.nav-link'));

function moveIndicator(link, animate) {
    const navRect  = navInner.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();

    if (!animate) {
        // Instant placement on first paint — no spring yet
        indicator.style.transition = 'none';
        indicator.style.width     = linkRect.width + 'px';
        indicator.style.transform = `translateX(${linkRect.left - navRect.left}px)`;
        // Enable spring from the very next frame
        requestAnimationFrame(() => requestAnimationFrame(() => {
            indicator.style.transition =
                'transform 0.44s cubic-bezier(0.34, 1.15, 0.64, 1), ' +
                'width 0.44s cubic-bezier(0.34, 1.15, 0.64, 1)';
        }));
    } else {
        indicator.style.width     = linkRect.width + 'px';
        indicator.style.transform = `translateX(${linkRect.left - navRect.left}px)`;
    }
}

function setActive(link, animate) {
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    moveIndicator(link, animate);
}

// Place indicator on the initial active link with no animation
setActive(document.querySelector('.nav-link.active') || navLinks[0], false);

// Slide on click
navLinks.forEach(link => link.addEventListener('click', () => setActive(link, true)));

// ── Sync indicator with scroll position ─────────────────────────────
const sections = Array.from(document.querySelectorAll('section[id]'));

const scrollIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (!e.isIntersecting) return;
        const link = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
        if (link) setActive(link, true);
    });
}, { rootMargin: '-45% 0px -50% 0px' });

sections.forEach(s => scrollIO.observe(s));

// ── Smooth scroll ────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
    });
});
