/**
 * Uncommon Windows — 姚海旭
 * Gallery script with lightbox
 */

(function () {
    'use strict';

    /* ── Image Data ── */
    const images = [
        { file: 'the-aurora-borealis-over-iceland-can-be-seen-outsi', title: 'Aurora Borealis' },
        { file: 'a-volcano-can-be-seen-outside-the-window--erupting', title: 'Erupting Volcano' },
        { file: 'outside-the-window-is-a-vast-ocean--with-a-volcano', title: 'Ocean with Volcano' },
        { file: 'outside-the-window-is-a-vast-ocean--with-a-small-i', title: 'Ocean with Small Island' },
        { file: 'outside-the-window-lies-a-vast-icelandic-tundra-', title: 'Icelandic Tundra' },
        { file: 'looking-out-the-window--you-are-on-the-moon--with-', title: 'On the Moon' },
        { file: 'looking-out-the-window--there-is-a-vast-nebula-str', title: 'Vast Nebula' },
        { file: 'looking-out-the-window--there-is-a-dark-cavern-wit', title: 'Dark Cavern' },
        { file: 'looking-out-the-window--there-is-an-ocean-expanse-', title: 'Ocean Expanse' },
        { file: 'looking-out-the-window--a-few-icebergs-drift-grace', title: 'Drifting Icebergs' },
        { file: 'looking-out-the-window--there-is-a-breathtaking-vi', title: 'Breathtaking View' },
        { file: 'looking-out-the-window--there-is-a-magnificent-vie', title: 'Magnificent Vista' },
        { file: 'looking-out-the-window--there-is-a-lush--verdant-g', title: 'Lush Verdant Grove' },
        { file: 'looking-out-the-window--muddy-yellow-river-waters-', title: 'Yellow River Waters' },
        { file: 'looking-out-the-window--the-yangtze-river-comes-in', title: 'Yangtze River' },
        { file: 'looking-out-the-window--there-is-a-swampy-wetland-', title: 'Swampy Wetland' },
        { file: 'looking-out-the-window--there-is-a-swampy-wetland- (1)', title: 'Swampy Wetland II' },
        { file: 'looking-out-the-window--there-is-a-vast-car-gravey', title: 'Car Graveyard' },
        { file: 'looking-out-the-window--there-is-a-cluster-of-aban', title: 'Abandoned Cluster' },
    ];

    /* ── DOM Refs ── */
    const grid = document.getElementById('galleryGrid');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const nav = document.querySelector('nav');

    let currentIndex = 0;

    /* ── Build Gallery ── */
    function buildGallery() {
        images.forEach((img, i) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';

            const imgEl = document.createElement('img');
            imgEl.src = `images/thumb/${encodeURIComponent(img.file)}.jpg`;
            imgEl.alt = img.title;
            imgEl.loading = 'lazy';

            const overlay = document.createElement('div');
            overlay.className = 'gallery-item-overlay';
            overlay.innerHTML = `<span class="gallery-item-title">${img.title}</span>`;

            item.appendChild(imgEl);
            item.appendChild(overlay);

            item.addEventListener('click', () => openLightbox(i));

            grid.appendChild(item);
        });
    }

    /* ── Lightbox ── */
    function openLightbox(index) {
        currentIndex = index;
        const img = images[index];
        lightboxImg.src = `images/full/${encodeURIComponent(img.file)}.jpg`;
        lightboxImg.alt = img.title;
        lightboxCaption.textContent = `${img.title}  —  ${index + 1} / ${images.length}`;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateLightbox();
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        updateLightbox();
    }

    function updateLightbox() {
        const img = images[currentIndex];
        lightboxImg.src = `images/full/${encodeURIComponent(img.file)}.jpg`;
        lightboxImg.alt = img.title;
        lightboxCaption.textContent = `${img.title}  —  ${currentIndex + 1} / ${images.length}`;
    }

    /* ── Lightbox Events ── */
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', prevImage);
    lightboxNext.addEventListener('click', nextImage);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
    });

    /* ── Scroll Animations ── */
    function handleScroll() {
        // Nav border
        nav.classList.toggle('scrolled', window.scrollY > 80);

        // Fade-in items
        const items = document.querySelectorAll('.gallery-item');
        items.forEach((item) => {
            const rect = item.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                item.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    /* ── Init ── */
    buildGallery();
    // Trigger once for items already in view
    requestAnimationFrame(handleScroll);

})();
