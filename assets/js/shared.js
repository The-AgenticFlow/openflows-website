// ============================================================
// Shared JS — Openflows Website
// Extracted from index.html inline scripts
// ============================================================

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Nav background on scroll
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    const currentScroll = window.pageYOffset;
    if (currentScroll > 100) {
        nav.style.background = 'rgba(12, 11, 9, 0.92)';
        nav.style.borderBottomColor = 'var(--border-color)';
    } else {
        nav.style.background = 'rgba(12, 11, 9, 0.75)';
        nav.style.borderBottomColor = 'var(--border-dim)';
    }
});

// Intersection Observer for scroll-triggered animations
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);
document.querySelectorAll('.reveal').forEach(el => { observer.observe(el); });

// Stagger animations within containers
document.querySelectorAll('.agents-grid, .timeline, .pillars, .features-grid, .steps-grid').forEach(container => {
    container.querySelectorAll('.reveal').forEach((child, index) => {
        child.style.transitionDelay = `${index * 0.1}s`;
    });
});


// Mobile nav hamburger toggle
const navHamburger = document.querySelector('.nav-hamburger');
const navLinks = document.querySelector('.nav-links');
if (navHamburger && navLinks) {
    navHamburger.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        const isOpen = navLinks.classList.contains('open');
        navHamburger.setAttribute('aria-expanded', isOpen);
        navHamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });
}

// Mobile sidebar toggle
const sidebarToggle = document.querySelector('.docs-sidebar-toggle');
const docsSidebar = document.querySelector('.docs-sidebar');
if (sidebarToggle && docsSidebar) {
    sidebarToggle.addEventListener('click', () => {
        docsSidebar.classList.toggle('open');
        const isOpen = docsSidebar.classList.contains('open');
        sidebarToggle.setAttribute('aria-expanded', isOpen);
    });
}
