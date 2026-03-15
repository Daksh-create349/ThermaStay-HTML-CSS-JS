// ThermaStay - Premium Experience Engine
document.addEventListener('DOMContentLoaded', () => {
    // 1. STATE & UTILITIES
    const state = {
        isTransitioning: false,
        user: JSON.parse(localStorage.getItem('user'))
    };

    const $ = (s) => document.querySelector(s);
    const $$ = (s) => document.querySelectorAll(s);

    const smoothScroll = (id) => {
        const target = $(id);
        if (target) window.scrollTo({ top: target.offsetTop - 100, behavior: 'smooth' });
    };

    // Update Amenities Page Header
    const updateAmenitiesHeader = () => {
        const heroTitle = $('.hero h1');
        const savedSpa = localStorage.getItem('selectedSpa');
        // Only update if we're on the Amenities page (checking for specific secondary hero text or structure might be better, but assuming H1 is "Spa Mineral & Facility Details")
        if (heroTitle && heroTitle.innerText.includes('Spa Mineral & Facility Details') && savedSpa) {
            heroTitle.innerText = `${savedSpa} - Mineral & Facility Details`;
        }
    };
    updateAmenitiesHeader();

    // 2. PREMIUM NAVIGATION
    const nav = $('#navbar');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 80);
    }, { passive: true });

    // 3. ENHANCED PAGE TRANSITIONS
    const initTransitionOverlay = () => {
        const overlay = $('#page-transition-overlay');
        if (!overlay) return;
        
        // "Just at the beginning": Play animation only once per session
        if (sessionStorage.getItem('hasSeenEntry')) {
            overlay.style.display = 'none';
            overlay.classList.remove('active');
            return;
        }

        // Entrance animation (let the foggy reveal play, then wipe away)
        setTimeout(() => {
            overlay.classList.add('exit');
            setTimeout(() => {
                overlay.classList.remove('active');
                sessionStorage.setItem('hasSeenEntry', 'true');
            }, 2000); // Time for the final wipe-up transition
        }, 3000); // Display the foggy reveal for 3 seconds before exiting
    };

    initTransitionOverlay();

    const navigate = (href) => {
        // Instant navigation as per user preference ("Just in the beginning")
        window.location.href = href;
    };

    // Global Link Interceptor
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link || link.getAttribute('target') === '_blank') return;

        if (link.closest('.spa-card')) {
            const card = link.closest('.spa-card');
            const spaName = card.querySelector('h3').innerText;
            localStorage.setItem('selectedSpa', spaName);
        }

        const href = link.getAttribute('href');
        if (!href || href === '#') return;

        if (href.startsWith('#')) {
            e.preventDefault();
            smoothScroll(href);
        } else if (href.endsWith('.html') || href.includes('.html#')) {
            e.preventDefault();
            navigate(href);
        }
    });

    // 4. THEME & MOBILE MENU
    const setupThemeAndMobile = () => {
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = `
            <svg class="sun-icon" viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/></svg>
        `;
        
        const navLinks = $('.nav-links');
        // Theme toggle will be handled below to be always visible

        const updateToggleIcon = (theme) => {
            themeToggle.innerHTML = theme === 'light' ? 
                `<svg viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/></svg>` :
                `<svg viewBox="0 0 24 24"><path d="M12.1 2.9C6.8 2.9 2.5 7.1 2.5 12.4s4.3 9.5 9.6 9.5c4.1 0 7.6-2.5 9-6.2-.4.1-.8.2-1.3.2-4.5 0-8.1-3.6-8.1-8.1 0-1.9.7-3.6 1.8-5-.5-.1-1-.1-1.4-.1z"/></svg>`;
        };

        const currentTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        updateToggleIcon(currentTheme);

        themeToggle.addEventListener('click', () => {
            const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateToggleIcon(newTheme);
        });

        // Mobile Menu
        const mobileBtn = document.createElement('button');
        mobileBtn.className = 'mobile-menu-btn';
        mobileBtn.innerHTML = '<span></span><span></span><span></span>';
        
        const navbar = $('#navbar');
        if (navbar) {
            navbar.appendChild(themeToggle); // Keep theme toggle always visible
            navbar.insertBefore(mobileBtn, themeToggle);
        }

        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileBtn.classList.toggle('active');
        });

        // Close mobile menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileBtn.classList.remove('active');
            });
        });
    };

    setupThemeAndMobile();

    // 4. STAGGERED REVEAL SYSTEM
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    const setupReveals = () => {
        $$('.spa-card, .amenity-item, .section-title, .filter-panel').forEach((el, i) => {
            el.classList.add('reveal-item');
            el.style.transitionDelay = `${(i % 3) * 0.15}s`;
            revealObserver.observe(el);
        });
    };

    // Inject Reveal CSS
    const revealStyles = `
        .reveal-item { opacity: 0; transform: translateY(30px); transition: var(--transition-premium); }
        .reveal-item.revealed { opacity: 1; transform: translateY(0); }
        .spa-card-none { display: none !important; }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = revealStyles;
    document.head.appendChild(styleSheet);

    setupReveals();

    // 5. MAGNETIC INTERACTION (SUBTLE)
    const setupMagneticElements = () => {
        $$('.btn-premium, .logo, .theme-toggle').forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = `translate(0, 0)`;
            });
        });
    };
    setupMagneticElements();

    // 6. FILTERING ENGINE (SMOOTH)
    const filterState = {
        temp: $('#temp-filter'),
        access: $$('.access-filter'),
        cards: $$('.spa-card'),
        noResults: $('#no-results')
    };

    const applyFilters = () => {
        if (!filterState.temp) return;
        
        const selectedTemp = filterState.temp.value;
        const selectedAccess = [...filterState.access].filter(cb => cb.checked).map(cb => cb.value);
        let visibleCount = 0;

        filterState.cards.forEach(card => {
            const t = parseInt(card.dataset.temperature);
            const a = card.dataset.accessibility?.split(' ') || [];
            
            const tMatch = selectedTemp === 'all' || 
                          (selectedTemp === '30-40' && t >= 30 && t <= 40) || 
                          (selectedTemp === '40-50' && t > 40 && t <= 50) || 
                          (selectedTemp === '50plus' && t > 50);
            
            const aMatch = selectedAccess.every(x => a.includes(x));
            const shouldShow = tMatch && aMatch;

            if (shouldShow) {
                card.classList.remove('spa-card-none');
                setTimeout(() => card.style.opacity = '1', 10);
                visibleCount++;
            } else {
                card.style.opacity = '0';
                setTimeout(() => card.classList.add('spa-card-none'), 500);
            }
        });

        if (filterState.noResults) {
            filterState.noResults.style.display = visibleCount ? 'none' : 'block';
        }
    };

    if (filterState.temp) {
        filterState.temp.addEventListener('change', applyFilters);
        filterState.access.forEach(cb => cb.addEventListener('change', applyFilters));
    }

    // 7. AUTH & BOOKING SYSTEM
    const ui = {
        overlay: $('#overlay'),
        panels: {
            auth: $('#auth-panel'),
            profile: $('#profile-panel'),
            book: $('#book-panel')
        },
        updateNav: () => {
            const u = state.user;
            const link = $('#auth-link');
            if (!link) return;
            link.innerHTML = u ? `<span class="user-badge">${u.name[0]}</span>` : 'Sign In';
            link.onclick = (e) => { e.preventDefault(); u ? ui.showPanel('profile') : ui.showPanel('auth'); };
        },
        showPanel: (name) => {
            ui.overlay.style.display = 'flex';
            Object.keys(ui.panels).forEach(p => {
                if (ui.panels[p]) ui.panels[p].style.display = p === name ? 'block' : 'none';
            });
            if (name === 'pass') $('#pass-panel').style.display = 'block';
            else if ($('#pass-panel')) $('#pass-panel').style.display = 'none';
            document.body.style.overflow = 'hidden';
            
            if (name === 'profile' && state.user) {
                $('#p-name').innerText = state.user.name;
                $('#p-email').innerText = state.user.email;
                const list = $('#b-list');
                const bookings = JSON.parse(localStorage.getItem(`b_${state.user.email}`)) || [];
                list.innerHTML = bookings.length ? 
                    bookings.map((b, i) => `<div class="b-item" onclick="showPass(${i})"><div><p>${b.plan}</p><span>${b.spa}</span></div><span>${b.date}</span></div>`).join('') : 
                    '<p class="empty-msg">No active reservations.</p>';
            }
        },
        showPass: (index) => {
            const bookings = JSON.parse(localStorage.getItem(`b_${state.user.email}`)) || [];
            const b = bookings[index];
            if (!b) return;

            // Populate Pass Data
            $('#pass-guest').innerText = state.user.name;
            $('#pass-spa').innerText = b.spa;
            $('#pass-plan').innerText = b.plan;
            $('#pass-date').innerText = b.date;
            $('#pass-id-val').innerText = `TS-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

            // Generate QR Code (Placeholder using qrserver.com)
            const qrData = encodeURIComponent(`Booking:${b.spa}|User:${state.user.email}|Date:${b.date}`);
            $('#pass-qr').src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}&bgcolor=ffffff&color=000000&margin=10`;

            ui.showPanel('pass');
        },
        close: () => {
            ui.overlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };

    window.closeUI = ui.close;
    window.showPass = ui.showPass;
    window.toggleAuth = (m) => {
        $('#login-fields').style.display = m === 'login' ? 'block' : 'none';
        $('#signup-fields').style.display = m === 'signup' ? 'block' : 'none';
        $$('.tabs button').forEach((b, i) => b.classList.toggle('active', (i === 0 && m === 'login') || (i === 1 && m === 'signup')));
    };

    window.auth = (m) => {
        const n = $('#s-name')?.value, e = $(m === 'login' ? '#l-email' : '#s-email')?.value;
        if (e && (m === 'login' || n)) {
            state.user = { name: n || e.split('@')[0], email: e };
            localStorage.setItem('user', JSON.stringify(state.user));
            ui.updateNav(); ui.close();
        } else alert('Credentials required');
    };

    window.logout = () => { localStorage.removeItem('user'); state.user = null; ui.updateNav(); ui.close(); };

    window.confirmBooking = () => {
        const d = $('#book-date').value, p = $('#target-plan').innerText, s = $('#target-spa').innerText, u = state.user;
        if (d && u) {
            const b = JSON.parse(localStorage.getItem(`b_${u.email}`)) || [];
            b.push({ plan: p, spa: s, date: d });
            localStorage.setItem(`b_${u.email}`, JSON.stringify(b));
            ui.showPass(b.length - 1);
        } else alert('Please select a date');
    };

    // Booking Delegation
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-premium');
        if (btn && btn.closest('.pricing-card')) {
            e.preventDefault();
            if (!state.user) return ui.showPanel('auth');

            const pricing = btn.closest('.pricing-card');
            const savedSpa = localStorage.getItem('selectedSpa');
            
            $('#target-plan').innerText = pricing.querySelector('h3').innerText;
            $('#target-spa').innerText = savedSpa ? savedSpa : ($('h1')?.innerText.split(' Mineral')[0] || "ThermaStay Sanctuary");

            ui.showPanel('book');
        }
    });

    if ($('#book-date')) {
        $('#book-date').min = new Date().toISOString().split('T')[0];
    }

    ui.updateNav();
});
