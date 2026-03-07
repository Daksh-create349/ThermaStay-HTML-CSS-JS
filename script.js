// ThermaStay - Interactive Premium Scripts
document.addEventListener('DOMContentLoaded', () => {
    // 1. UTILITIES & NAVIGATION
    const scroll = (id) => {
        const target = document.querySelector(id);
        if (target) window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    };

    const nav = document.getElementById('navbar');
    window.onscroll = () => nav.classList.toggle('scrolled', window.scrollY > 50);

    if (window.location.hash === '#pricing') setTimeout(() => scroll('#pricing'), 800);

    // 2. PAGE TRANSITIONS & DELEGATION
    const overlay = document.createElement('div');
    overlay.id = 'page-transition-overlay';
    overlay.classList.add('active');
    document.body.appendChild(overlay);

    window.addEventListener('load', () => {
        setTimeout(() => overlay.classList.add('exit'), 100);
        setTimeout(() => overlay.style.display = 'none', 700);
    });

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href) return;

        // Smooth Scroll (Same page)
        if (href.startsWith('#')) {
            e.preventDefault();
            scroll(href);
        }
        // Cross-page Hash
        else if (href.includes('.html#')) {
            const [page, hash] = href.split('#');
            if (window.location.pathname.endsWith(page)) {
                e.preventDefault();
                scroll('#' + hash);
            }
        }
        // Transitions
        else if (href.endsWith('.html')) {
            e.preventDefault();
            overlay.style.display = 'block';
            overlay.classList.remove('exit', 'active');
            setTimeout(() => overlay.classList.add('active'), 10);
            setTimeout(() => window.location.href = href, 600);
        }
    });

    // 3. FILTER LOGIC
    const filters = { temp: document.getElementById('temp-filter'), access: document.querySelectorAll('.access-filter'), cards: document.querySelectorAll('.spa-card'), none: document.getElementById('no-results') };

    const applyFilters = () => {
        if (!filters.temp) return;
        const selectedTemp = filters.temp.value;
        const selectedAccess = [...filters.access].filter(cb => cb.checked).map(cb => cb.value);
        let visible = 0;

        filters.cards.forEach(card => {
            const t = parseInt(card.dataset.temperature);
            const a = card.dataset.accessibility.split(' ');
            const tMatch = selectedTemp === 'all' || (selectedTemp === '30-40' && t >= 30 && t <= 40) || (selectedTemp === '40-50' && t > 40 && t <= 50) || (selectedTemp === '50plus' && t > 50);
            const aMatch = selectedAccess.every(x => a.includes(x));

            card.classList.toggle('spa-card-none', !(tMatch && aMatch));
            card.classList.toggle('spa-card-hidden', !(tMatch && aMatch));
            if (tMatch && aMatch) visible++;
        });

        if (filters.none) {
            filters.none.style.display = visible ? 'none' : 'block';
            filters.none.style.opacity = visible ? '0' : '1';
        }
    };

    if (filters.temp) {
        filters.temp.onchange = applyFilters;
        filters.access.forEach(cb => cb.onchange = applyFilters);
    }

    // 4. ANIMATIONS (OBSERVER)
    const observer = new IntersectionObserver(entries => {
        entries.forEach(en => { if (en.isIntersecting) en.target.classList.add('visible'); });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.spa-card, .amenity-item, .section-title').forEach(el => {
        Object.assign(el.style, { opacity: '0', transform: 'translateY(40px)', transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)' });
        observer.observe(el);
    });

    document.head.insertAdjacentHTML('beforeend', `<style>.visible { opacity: 1 !important; transform: translateY(0) !important; }</style>`);

    // 5. AUTH & BOOKING SYSTEM (MINIMAL)
    const store = {
        get: (k) => JSON.parse(localStorage.getItem(k)),
        set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
        user: () => JSON.parse(localStorage.getItem('user'))
    };

    window.closeUI = () => { document.getElementById('overlay').style.display = 'none'; document.body.style.overflow = 'auto'; };

    window.toggleAuth = (m) => {
        document.getElementById('login-fields').style.display = m === 'login' ? 'block' : 'none';
        document.getElementById('signup-fields').style.display = m === 'signup' ? 'block' : 'none';
        document.querySelectorAll('.tabs button').forEach((b, i) => b.classList.toggle('active', (i === 0 && m === 'login') || (i === 1 && m === 'signup')));
    };

    const updateNav = () => {
        const u = store.user(), link = document.getElementById('auth-link');
        if (!link) return;
        link.innerHTML = u ? `<div class="user-badge" style="color:var(--color-clay)"><span class="user-initials">${u.name[0]}</span> Account</div>` : 'Sign In';
        link.onclick = (e) => { e.preventDefault(); u ? showProfile() : showAuth(); };
    };

    const showAuth = () => { document.getElementById('overlay').style.display = 'flex'; document.getElementById('auth-panel').style.display = 'block'; document.getElementById('profile-panel').style.display = 'none'; document.getElementById('book-panel').style.display = 'none'; };

    const showProfile = () => {
        const u = store.user();
        document.getElementById('p-name').innerText = u.name;
        document.getElementById('p-email').innerText = u.email;
        const list = document.getElementById('b-list'), bookings = store.get(`b_${u.email}`) || [];
        list.innerHTML = bookings.length ? bookings.map(b => `<div class="b-item"><div><p>${b.plan}</p><span style="font-size:0.6rem;opacity:0.6">${b.spa}</span></div><span>${b.date}</span></div>`).join('') : '<p>No bookings.</p>';
        document.getElementById('overlay').style.display = 'flex'; document.getElementById('profile-panel').style.display = 'block'; document.getElementById('auth-panel').style.display = 'none'; document.getElementById('book-panel').style.display = 'none';
    };

    window.auth = (m) => {
        const n = document.getElementById('s-name').value, e = document.getElementById(m === 'login' ? 'l-email' : 's-email').value;
        if (e && (m === 'login' || n)) {
            store.set('user', { name: n || e.split('@')[0], email: e });
            updateNav(); closeUI();
        } else alert('Fill all fields');
    };

    window.logout = () => { localStorage.removeItem('user'); updateNav(); closeUI(); };

    window.confirmBooking = () => {
        const d = document.getElementById('book-date').value, p = document.getElementById('target-plan').innerText, s = document.getElementById('target-spa').innerText, u = store.user();
        if (d && u) {
            const b = store.get(`b_${u.email}`) || [];
            b.push({ plan: p, spa: s, date: d });
            store.set(`b_${u.email}`, b);
            alert('Your reservation for ' + p + ' at ' + s + ' is confirmed!'); closeUI();
        } else alert('Select date');
    };

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-premium');
        if (btn && (btn.closest('.spa-card') || btn.closest('.pricing-card'))) {
            const u = store.user();
            if (!u) return showAuth();

            const card = btn.closest('.spa-card');
            const pricing = btn.closest('.pricing-card');

            const planName = pricing ? pricing.querySelector('h3').innerText : "Full Access Pass";
            const spaName = card ? card.querySelector('h3').innerText : (document.querySelector('h1')?.innerText.split(' Mineral')[0] || "ThermaStay Sanctuary");

            document.getElementById('target-plan').innerText = planName;
            document.getElementById('target-spa').innerText = spaName;

            document.getElementById('overlay').style.display = 'flex';
            document.getElementById('book-panel').style.display = 'block';
            document.getElementById('auth-panel').style.display = 'none';
            document.getElementById('profile-panel').style.display = 'none';
        }
    });

    updateNav();
});
