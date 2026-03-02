// ThermaStay - Interactive Premium Scripts

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');

    // Sticky Navbar Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            // Only remove if not explicitly set (some pages force scrolled state)
            if (!document.body.classList.contains('force-scrolled')) {
                // navbar.classList.remove('scrolled'); // Keeping for now, but simplified
            }
        }
    });

    // Advanced Filter Logic
    const tempFilter = document.getElementById('temp-filter');
    const accessFilters = document.querySelectorAll('.access-filter');
    const spaCards = document.querySelectorAll('.spa-card');
    const noResults = document.getElementById('no-results');

    if (tempFilter && spaCards.length > 0) {
        const applyFilters = () => {
            const selectedTemp = tempFilter.value;
            const selectedAccess = Array.from(accessFilters)
                .filter(cb => cb.checked)
                .map(cb => cb.value);

            let visibleCount = 0;

            spaCards.forEach(card => {
                const cardTemp = parseInt(card.getAttribute('data-temperature'));
                const cardAccess = card.getAttribute('data-accessibility').split(' ');

                let tempMatch = true;
                if (selectedTemp === '30-40') tempMatch = cardTemp >= 30 && cardTemp <= 40;
                else if (selectedTemp === '40-50') tempMatch = cardTemp > 40 && cardTemp <= 50;
                else if (selectedTemp === '50plus') tempMatch = cardTemp > 50;

                const accessMatch = selectedAccess.every(access => cardAccess.includes(access));

                if (tempMatch && accessMatch) {
                    card.classList.remove('spa-card-none');
                    setTimeout(() => {
                        card.classList.remove('spa-card-hidden');
                    }, 50);
                    visibleCount++;
                } else {
                    card.classList.add('spa-card-hidden');
                    setTimeout(() => {
                        card.classList.add('spa-card-none');
                    }, 500);
                }
            });

            // Handle "No Results" message
            if (noResults) {
                if (visibleCount === 0) {
                    noResults.style.display = 'block';
                    setTimeout(() => noResults.style.opacity = '1', 50);
                } else {
                    noResults.style.opacity = '0';
                    setTimeout(() => noResults.style.display = 'none', 500);
                }
            }
        };

        tempFilter.addEventListener('change', applyFilters);
        accessFilters.forEach(cb => cb.addEventListener('change', applyFilters));
    }

    // Scroll Reveal Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Prepare elements for reveal
    const revealElements = document.querySelectorAll('.spa-card, .amenity-item, .section-title');
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
        observer.observe(el);
    });

    // Observer class for easier CSS control
    const style = document.createElement('style');
    style.innerHTML = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
    // Page Transition Logic
    const overlay = document.createElement('div');
    overlay.id = 'page-transition-overlay';
    // Ensure it starts at the top (active state for initial load)
    overlay.classList.add('active');
    document.body.appendChild(overlay);

    // Initial Entrance: Move from 0 to 100% (Downwards)
    window.addEventListener('load', () => {
        setTimeout(() => {
            overlay.classList.add('exit');
        }, 100);
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 700);
    });

    // Intercept Clicks for Transition: Move from -100% to 0 (Downwards)
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.endsWith('.html') && !href.startsWith('#')) {
                e.preventDefault();
                overlay.style.display = 'block';
                overlay.classList.remove('exit', 'active'); // Reset to -100%
                setTimeout(() => overlay.classList.add('active'), 10);
                setTimeout(() => {
                    window.location.href = href;
                }, 600);
            }
        });
    });

    // Booking Modal Logic
    const modalMarkup = `
        <div class="modal-overlay" id="booking-modal">
            <div class="modal-content">
                <span class="modal-close" id="close-modal">&times;</span>
                <h2>Reserve Your Tub</h2>
                <p>Select your preferred date for a private thermal soak.</p>
                <div class="booking-form">
                    <input type="date" id="booking-date" min="${new Date().toISOString().split('T')[0]}">
                    <button class="btn-premium" id="confirm-booking" style="border-color: var(--color-forest); color: var(--color-forest); width: 100%;">Confirm Reservation</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalMarkup);

    const modal = document.getElementById('booking-modal');
    const closeModal = document.getElementById('close-modal');
    const confirmBtn = document.getElementById('confirm-booking');

    const openModal = () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const hideModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    // Attach to "Book Now" and "View Amenities" (repurposing some buttons for demo)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-premium') && e.target.innerText.includes('Book Now')) {
            e.preventDefault();
            openModal();
        }
    });

    closeModal.addEventListener('click', hideModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) hideModal();
    });

    confirmBtn.addEventListener('click', () => {
        const date = document.getElementById('booking-date').value;
        if (date) {
            alert(`Reservation confirmed for ${date}. We look forward to your visit.`);
            hideModal();
        } else {
            alert('Please select a date.');
        }
    });
});
