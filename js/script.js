(function () {
    'use strict';

    // ============================
    // LOADING SCREEN
    // ============================
    const loader = document.getElementById('loader');

    function hideLoader() {
        if (loader && !loader.classList.contains('hidden')) {
            loader.classList.add('hidden');
        }
    }

    window.addEventListener('load', function () {
        hideLoader();
        // Start observing sections after page load
        document.querySelectorAll('section:not(#hero)').forEach(function (el) {
            observer.observe(el);
        });
    });

    // Fallback: hide loader after 3s
    setTimeout(hideLoader, 3000);

    // ============================
    // CUSTOM CURSOR
    // ============================
    const cursorDot  = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    let cursorX = 0, cursorY = 0;
    let ringX   = 0, ringY   = 0;

    document.addEventListener('mousemove', function (e) {
        cursorX = e.clientX;
        cursorY = e.clientY;
        if (cursorDot) {
            cursorDot.style.left = cursorX + 'px';
            cursorDot.style.top  = cursorY + 'px';
        }
    });

    function animateCursor() {
        ringX += (cursorX - ringX) * 0.12;
        ringY += (cursorY - ringY) * 0.12;
        if (cursorRing) {
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top  = ringY + 'px';
        }
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effect on interactive elements
    document.querySelectorAll(
        'a, button, .project-card, .cert-card, .skill-card, .experience-card, .stat-card, .contact-item'
    ).forEach(function (el) {
        el.addEventListener('mouseenter', function () {
            if (cursorRing) cursorRing.classList.add('hover');
        });
        el.addEventListener('mouseleave', function () {
            if (cursorRing) cursorRing.classList.remove('hover');
        });
    });

    // ============================
    // MOUSE GLOW
    // ============================
    const mouseGlow = document.getElementById('mouseGlow');
    if (mouseGlow) {
        document.addEventListener('mousemove', function (e) {
            mouseGlow.style.left = e.clientX + 'px';
            mouseGlow.style.top  = e.clientY + 'px';
        });
    }

    // ============================
    // SCROLL PROGRESS
    // ============================
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        window.addEventListener('scroll', function () {
            const scrollTop  = window.scrollY;
            const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
            const progress   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            scrollProgress.style.width = progress + '%';
            scrollProgress.setAttribute('aria-valuenow', Math.round(progress));
        }, { passive: true });
    }

    // ============================
    // BACK TO TOP
    // ============================
    const backTop = document.getElementById('backTop');
    if (backTop) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 400) {
                backTop.classList.add('visible');
            } else {
                backTop.classList.remove('visible');
            }
        }, { passive: true });

        backTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ============================
    // NAVBAR — MOBILE MENU
    // ============================
    const navLinks = document.getElementById('navLinks');
    const menuBtn  = document.getElementById('menuBtn');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', function () {
            const isOpen = navLinks.classList.toggle('open');
            menuBtn.setAttribute('aria-expanded', isOpen);
            menuBtn.innerHTML = isOpen
                ? '<i class="fas fa-times" aria-hidden="true"></i>'
                : '<i class="fas fa-bars" aria-hidden="true"></i>';
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('open');
                menuBtn.setAttribute('aria-expanded', 'false');
                menuBtn.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
            });
        });

        // Close on Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
                menuBtn.setAttribute('aria-expanded', 'false');
                menuBtn.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
                menuBtn.focus();
            }
        });

        // Space / Enter on menu button
        menuBtn.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                menuBtn.click();
            }
        });
    }

    // ============================
    // NAVBAR — ACTIVE LINK ON SCROLL
    // ============================
    const navItems = navLinks ? navLinks.querySelectorAll('a') : [];
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', function () {
        let current = '';
        sections.forEach(function (section) {
            if (window.scrollY >= section.offsetTop - 120) {
                current = section.getAttribute('id');
            }
        });
        navItems.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }, { passive: true });

    // ============================
    // THEME TOGGLE
    // ============================
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon   = document.getElementById('themeIcon');
    let currentTheme  = 'dark';

    function setTheme(theme) {
        currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        if (themeIcon) {
            themeIcon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
        }
        try { localStorage.setItem('theme', theme); } catch (_) {}
    }

    // Restore saved theme
    try {
        const saved = localStorage.getItem('theme');
        if (saved) setTheme(saved);
    } catch (_) {}

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    }

    // ============================
    // TYPING ANIMATION
    // ============================
    const typedText = document.getElementById('typedText');
    if (typedText) {
        const phrases = [
            'Full Stack Web Developer',
            'BCA Graduate',
            'AI Enthusiast',
            'Python & FastAPI Developer',
            'Lifelong Learner'
        ];
        let phraseIndex  = 0;
        let charIndex    = 0;
        let isDeleting   = false;
        let typingSpeed  = 80;

        function typeLoop() {
            const currentPhrase = phrases[phraseIndex];
            if (isDeleting) {
                typedText.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 40;
            } else {
                typedText.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 80;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting  = true;
                typingSpeed = 2000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting  = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 400;
            }

            setTimeout(typeLoop, typingSpeed);
        }
        typeLoop();
    }

    // ============================
    // SCROLL REVEAL (Intersection Observer)
    // ============================
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Animate counters when about section appears
                if (entry.target.id === 'about') {
                    animateCounters();
                }
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    // Observe all sections except hero (already visible)
    document.querySelectorAll('section:not(#hero)').forEach(function (el) {
        observer.observe(el);
    });

    // ============================
    // ANIMATED COUNTERS (About stats)
    // ============================
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;
        countersAnimated = true;
        document.querySelectorAll('.stat-number[data-count]').forEach(function (counter) {
            const target    = parseInt(counter.getAttribute('data-count'), 10);
            if (isNaN(target)) return;
            let current     = 0;
            const increment = target / 40;
            const timer     = setInterval(function () {
                current += increment;
                if (current >= target) {
                    counter.textContent = target + '+';
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.round(current);
                }
            }, 30);
        });
    }

    // Trigger counters if about is already visible on load
    setTimeout(function () {
        const aboutSection = document.getElementById('about');
        if (aboutSection && aboutSection.classList.contains('visible')) {
            animateCounters();
        }
    }, 600);

    // ============================
    // COPY EMAIL
    // ============================
    const copyBtn    = document.getElementById('copyEmail');
    const emailValue = document.getElementById('emailValue');

    if (copyBtn && emailValue) {
        copyBtn.addEventListener('click', function () {
            const email = emailValue.textContent.trim();
            if (!email) return;

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(email).then(function () {
                    showToast('Email copied!');
                }).catch(function () {
                    fallbackCopy(emailValue);
                });
            } else {
                fallbackCopy(emailValue);
            }
        });
    }

    function fallbackCopy(node) {
        try {
            const range = document.createRange();
            range.selectNode(node);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            document.execCommand('copy');
            window.getSelection().removeAllRanges();
            showToast('Email copied!');
        } catch (_) {
            showToast('Could not copy — please copy manually');
        }
    }

    // ============================
    // TOAST NOTIFICATION
    // ============================
    const toast        = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    let toastTimeout;

    function showToast(msg) {
        if (!toast || !toastMessage) return;
        toastMessage.textContent = msg || 'Done!';
        toast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(function () {
            toast.classList.remove('show');
        }, 2500);
    }

    // ============================
    // REDUCED MOTION PREFERENCE
    // ============================
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('section').forEach(function (el) {
            el.classList.add('visible');
        });
        const cursorBlink = document.querySelector('.cursor-blink');
        if (cursorBlink) cursorBlink.style.animation = 'none';
    }

    // ============================
    // ENSURE HERO IS ALWAYS VISIBLE
    // ============================
    const hero = document.getElementById('hero');
    if (hero) hero.classList.add('visible');

    console.log('🚀 Manish Kevat Portfolio — Built with ❤️');

})();
