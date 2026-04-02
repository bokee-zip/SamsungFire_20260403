// Configuration
const observerOptions = {
    threshold: 0.5
};

function initPresentation() {
    const sections = document.querySelectorAll('section');
    const totalSlides = sections.length;
    
    let currentSlideIndex = 0;

    // Create Navigation Indicator (Dots) if they don't exist
    let slidesNav = document.querySelector('.slide-nav');
    if (!slidesNav) {
        slidesNav = document.createElement('div');
        slidesNav.className = 'slide-nav';
        document.body.appendChild(slidesNav);
    }
    slidesNav.innerHTML = ''; // Clear for re-init

    sections.forEach((section, index) => {
        // 1. Add Page Number if not already present
        if (!section.querySelector('.page-number')) {
            const pageNum = document.createElement('div');
            pageNum.className = 'page-number';
            pageNum.textContent = `${index + 1} / ${totalSlides}`;
            section.appendChild(pageNum);
        }

        // 2. Add Dot for Nav
        const dot = document.createElement('div');
        dot.className = 'slide-dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            section.scrollIntoView({ behavior: 'smooth' });
        });
        slidesNav.appendChild(dot);

        // 3. Animation Delay setup
        const animatables = section.querySelectorAll('.animate-in');
        animatables.forEach((el, i) => {
            el.style.transitionDelay = `${i * 0.15}s`;
        });
    });

    const dots = document.querySelectorAll('.slide-dot');

    // Intersection Observer for slide highlighting and animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = Array.from(sections).indexOf(entry.target);
                currentSlideIndex = index;
                
                // Update dots
                dots.forEach(d => d.classList.remove('active'));
                if (dots[index]) dots[index].classList.add('active');

                // Trigger animations
                const animatables = entry.target.querySelectorAll('.animate-in');
                animatables.forEach(el => el.classList.add('visible'));
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Keyboard Navigation
    const keyHandler = (e) => {
        if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(e.key)) {
            if (e.key === ' ' && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
            e.preventDefault();
            if (currentSlideIndex < totalSlides - 1) {
                sections[currentSlideIndex + 1].scrollIntoView({ behavior: 'smooth' });
            }
        } else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) {
            e.preventDefault();
            if (currentSlideIndex > 0) {
                sections[currentSlideIndex - 1].scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    window.removeEventListener('keydown', keyHandler);
    window.addEventListener('keydown', keyHandler);
}

// Global scope to run after loading sections
window.initPresentation = initPresentation;
initPresentation();
