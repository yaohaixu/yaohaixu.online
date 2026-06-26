/**
 * Uncommon Windows — 姚海旭
 * Gallery script with lightbox
 */

(function () {
    'use strict';

    /* ── Image Data ── */
    const images = [
        { file: 'the-aurora-borealis-over-iceland-can-be-seen-outsi', title: 'Aurora Borealis', cnTitle: '北极光' },
        { file: 'a-volcano-can-be-seen-outside-the-window--erupting', title: 'Erupting Volcano', cnTitle: '火山喷发' },
        { file: 'outside-the-window-is-a-vast-ocean--with-a-volcano', title: 'Ocean with Volcano', cnTitle: '海中火山' },
        { file: 'outside-the-window-is-a-vast-ocean--with-a-small-i', title: 'Ocean with Small Island', cnTitle: '海中孤岛' },
        { file: 'outside-the-window-lies-a-vast-icelandic-tundra-', title: 'Icelandic Tundra', cnTitle: '冰岛苔原' },
        { file: 'looking-out-the-window--you-are-on-the-moon--with-', title: 'On the Moon', cnTitle: '月球之上' },
        { file: 'looking-out-the-window--there-is-a-vast-nebula-str', title: 'Vast Nebula', cnTitle: '浩瀚星云' },
        { file: 'looking-out-the-window--there-is-a-dark-cavern-wit', title: 'Dark Cavern', cnTitle: '黑暗洞穴' },
        { file: 'looking-out-the-window--there-is-an-ocean-expanse-', title: 'Ocean Expanse', cnTitle: '无垠海洋' },
        { file: 'looking-out-the-window--a-few-icebergs-drift-grace', title: 'Drifting Icebergs', cnTitle: '漂浮冰山' },
        { file: 'looking-out-the-window--there-is-a-breathtaking-vi', title: 'Breathtaking View', cnTitle: '壮丽景象' },
        { file: 'looking-out-the-window--there-is-a-magnificent-vie', title: 'Magnificent Vista', cnTitle: '壮美远景' },
        { file: 'looking-out-the-window--there-is-a-lush--verdant-g', title: 'Lush Verdant Grove', cnTitle: '葱郁丛林' },
        { file: 'looking-out-the-window--muddy-yellow-river-waters-', title: 'Yellow River Waters', cnTitle: '黄河之水' },
        { file: 'looking-out-the-window--the-yangtze-river-comes-in', title: 'Yangtze River', cnTitle: '长江奔涌' },
        { file: 'looking-out-the-window--there-is-a-swampy-wetland-', title: 'Swampy Wetland', cnTitle: '沼泽湿地' },
        { file: 'looking-out-the-window--there-is-a-swampy-wetland- (1)', title: 'Swampy Wetland II', cnTitle: '沼泽湿地 II' },
        { file: 'looking-out-the-window--there-is-a-vast-car-gravey', title: 'Car Graveyard', cnTitle: '汽车坟场' },
        { file: 'looking-out-the-window--there-is-a-cluster-of-aban', title: 'Abandoned Cluster', cnTitle: '废弃群落' },
    ];

    /* ── Device Detection ── */
    var isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

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
    var touchRevealed = {};  // track which items have overlay revealed on touch

    /* ── Build Gallery ── */
    function buildGallery() {
        images.forEach((img, i) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';

            const imgEl = document.createElement('img');
            imgEl.src = 'images/thumb/' + encodeURIComponent(img.file) + '.webp';
            imgEl.alt = img.title;
            imgEl.loading = 'lazy';

            const overlay = document.createElement('div');
            overlay.className = 'gallery-item-overlay';
            const cnSpan = document.createElement('span');
            cnSpan.className = 'gallery-item-cn';
            cnSpan.textContent = img.cnTitle;
            const titleSpan = document.createElement('span');
            titleSpan.className = 'gallery-item-title';
            titleSpan.textContent = img.title;
            overlay.appendChild(cnSpan);
            overlay.appendChild(titleSpan);

            item.appendChild(imgEl);
            item.appendChild(overlay);

            // Touch: first tap reveals overlay, second tap opens lightbox
            item.addEventListener('click', (function (index) {
                return function (e) {
                    if (!isTouchDevice) {
                        openLightbox(index);
                        return;
                    }
                    // Touch behavior
                    if (!touchRevealed[index]) {
                        // First tap: show overlay
                        e.preventDefault();
                        e.stopPropagation();
                        item.classList.add('overlay-visible');
                        touchRevealed[index] = true;
                        // Hide any other revealed overlays
                        hideAllOverlaysExcept(index);
                    } else {
                        // Second tap: open lightbox
                        openLightbox(index);
                    }
                };
            })(i));

            grid.appendChild(item);
        });
    }

    function hideAllOverlaysExcept(index) {
        var items = grid.querySelectorAll('.gallery-item');
        for (var j = 0; j < items.length; j++) {
            if (j !== index) {
                items[j].classList.remove('overlay-visible');
                touchRevealed[j] = false;
            }
        }
    }

    // Tap elsewhere to dismiss overlay
    document.addEventListener('click', function (e) {
        if (!isTouchDevice) return;
        if (!e.target.closest('.gallery-item')) {
            hideAllOverlaysExcept(-1);
        }
    });

    /* ── Lightbox ── */
    function openLightbox(index) {
        currentIndex = index;
        const img = images[index];
        lightboxImg.src = 'images/full/' + encodeURIComponent(img.file) + '.jpg';
        lightboxImg.alt = img.title;
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
        lightboxImg.src = 'images/full/' + encodeURIComponent(img.file) + '.jpg';
        lightboxImg.alt = img.title;
    }

    /* ── Lightbox Events ── */
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', prevImage);
    lightboxNext.addEventListener('click', nextImage);

    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
    });

    /* ── Scroll Animations ── */
    function handleScroll() {
        nav.classList.toggle('scrolled', window.scrollY > 80);

        var items = document.querySelectorAll('.gallery-item');
        for (var i = 0; i < items.length; i++) {
            var rect = items[i].getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                items[i].classList.add('visible');
            }
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    /* ── Init ── */
    buildGallery();
    requestAnimationFrame(handleScroll);


    /* ── Theme Toggle ── */
    var toggle = document.getElementById('themeToggle');
    var html = document.documentElement;

    // Load saved preference or follow system
    (function initTheme() {
        var saved = localStorage.getItem('theme');
        if (saved) {
            html.setAttribute('data-theme', saved);
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            html.setAttribute('data-theme', 'light');
        }
    })();

    toggle.addEventListener('click', function () {
        var current = html.getAttribute('data-theme');
        var next = current === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });


    /* ── WeChat Copy ── */
    var wechatEl = document.getElementById('wechatCopy');
    if (wechatEl) {
        wechatEl.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var text = wechatEl.textContent;
            // Try Clipboard API first
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(function () {
                    showWechatCopied();
                }).catch(function () {
                    fallbackCopy(text);
                });
            } else {
                fallbackCopy(text);
            }
        });
    }

    function fallbackCopy(text) {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        ta.style.top = '-9999px';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        try {
            document.execCommand('copy');
            showWechatCopied();
        } catch (e) {
            // silent fail
        }
        document.body.removeChild(ta);
    }

    function showWechatCopied() {
        wechatEl.classList.add('copied');
        var orig = wechatEl.textContent;
        wechatEl.textContent = '已复制 ✓';
        setTimeout(function () {
            wechatEl.classList.remove('copied');
            wechatEl.textContent = orig;
        }, 1800);
    }

})();