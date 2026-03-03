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

    // 5. BOOKING MODAL
    const modalMarkup = `
        <div class="modal-overlay" id="booking-modal">
            <div class="modal-content" style="max-width: 450px;">
                <span class="modal-close" onclick="document.getElementById('booking-modal').classList.remove('active'); document.body.style.overflow='auto';">&times;</span>
                <div id="step-1">
                    <h2>Complete Reservation</h2>
                    <p>Finalizing your <span id="pkg-name" style="font-weight:600"></span>.</p>
                    <div class="booking-form" style="display:flex; flex-direction:column; gap:1rem; margin-top:1rem;">
                        <input type="text" id="u-name" placeholder="FULL NAME" class="modal-input">
                        <input type="email" id="u-email" placeholder="EMAIL ADDRESS" class="modal-input">
                        <input type="date" id="b-date" min="${new Date().toISOString().split('T')[0]}" class="modal-input">
                        <button class="btn-premium" id="btn-conf" style="border-color:var(--color-forest); color:var(--color-forest); width:100%;">Confirm</button>
                    </div>
                </div>
                <div id="step-success" style="display:none; text-align:center;">
                    <div style="font-size:3rem;">🌿</div>
                    <h2>Confirmed</h2>
                    <p>Thanks, <span id="d-name" style="font-weight:600; color:var(--color-forest);"></span>. Booked successfully.</p>
                    <button class="btn-premium" onclick="document.getElementById('booking-modal').classList.remove('active'); document.body.style.overflow='auto';" style="border-color:var(--color-forest); color:var(--color-forest); width:100%; margin-top:1rem;">Close</button>
                </div>
            </div>
        </div>
        <style>.modal-input { padding: 1rem; border: 1px solid rgba(0,0,0,0.1); font-family: var(--font-body); font-size: 0.7rem; letter-spacing: 1px; outline: none; }</style>
    `;
    document.body.insertAdjacentHTML('beforeend', modalMarkup);

    const m = document.getElementById('booking-modal'), s1 = document.getElementById('step-1'), ss = document.getElementById('step-success');

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-premium');
        if (btn && btn.closest('.pricing-card')) {
            document.getElementById('pkg-name').innerText = btn.closest('.pricing-card').querySelector('h3').innerText;
            s1.style.display = 'block'; ss.style.display = 'none';
            m.classList.add('active'); document.body.style.overflow = 'hidden';
        } else if (e.target === m) {
            m.classList.remove('active'); document.body.style.overflow = 'auto';
        }
    });

    document.getElementById('btn-conf').onclick = () => {
        const n = document.getElementById('u-name').value, e = document.getElementById('u-email').value, d = document.getElementById('b-date').value;
        if (n && e && d) {
            document.getElementById('d-name').innerText = n;
            s1.style.display = 'none'; ss.style.display = 'block';
        } else alert('Please fill all details.');
    };
});
