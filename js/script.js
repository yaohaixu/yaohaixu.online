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
            imgEl.addEventListener('load', function () {
                this.classList.add('loaded');
            });

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

    /* ── Mouse Parallax (non-touch only) ── */
    var parallaxTicking = false;
    var parallaxMouseX = 0;
    var parallaxMouseY = 0;
    var parallaxViewW = window.innerWidth;
    var parallaxViewH = window.innerHeight;
    var parallaxImgs = [];  // filled after buildGallery

    function initMouseParallax() {
        if (isTouchDevice) return;
        var galleryGrid = document.getElementById('galleryGrid');
        if (!galleryGrid) return;
        parallaxImgs = galleryGrid.querySelectorAll('.gallery-item img');

        galleryGrid.addEventListener('mousemove', function (e) {
            parallaxMouseX = e.clientX;
            parallaxMouseY = e.clientY;
            parallaxViewW = window.innerWidth;
            parallaxViewH = window.innerHeight;
            if (!parallaxTicking) {
                parallaxTicking = true;
                requestAnimationFrame(applyParallax);
            }
        }, { passive: true });

        window.addEventListener('resize', function () {
            parallaxViewW = window.innerWidth;
            parallaxViewH = window.innerHeight;
        }, { passive: true });
    }

    function applyParallax() {
        parallaxTicking = false;
        var nx = (parallaxMouseX / parallaxViewW) * 2 - 1;  // -1..1
        var ny = (parallaxMouseY / parallaxViewH) * 2 - 1;
        for (var i = 0; i < parallaxImgs.length; i++) {
            var el = parallaxImgs[i];
            // Only apply if not being hovered (3D tilt handles hover)
            var item = el.closest('.gallery-item');
            if (item && item.matches(':hover')) continue;
            el.style.transform = 'translate(' + (nx * 8).toFixed(1) + 'px, ' + (ny * 8).toFixed(1) + 'px)';
        }
    }

    /* ── Gallery 3D Tilt (non-touch only) ── */
    function init3DTilt() {
        if (isTouchDevice) return;
        var grid = document.getElementById('galleryGrid');
        if (!grid) return;

        grid.addEventListener('mouseover', function (e) {
            var item = e.target.closest('.gallery-item');
            if (!item) return;
            updateTilt(item, e);
        });

        grid.addEventListener('mousemove', function (e) {
            var item = e.target.closest('.gallery-item');
            if (!item) return;
            updateTilt(item, e);
        }, { passive: true });

        grid.addEventListener('mouseout', function (e) {
            var item = e.target.closest('.gallery-item');
            if (!item) return;
            item.style.setProperty('--tilt-x', '0');
            item.style.setProperty('--tilt-y', '0');
        });
    }

    function updateTilt(item, e) {
        var rect = item.getBoundingClientRect();
        var tx = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5..0.5
        var ty = (e.clientY - rect.top) / rect.height - 0.5;
        item.style.setProperty('--tilt-x', tx.toFixed(3));
        item.style.setProperty('--tilt-y', ty.toFixed(3));
    }



    /* ── Lightbox ── */
    function openLightbox(index) {
        currentIndex = index;

        // Capture source thumbnail rect for zoom animation
        var items = grid.querySelectorAll('.gallery-item');
        var srcItem = items[index];
        var srcRect = srcItem ? srcItem.getBoundingClientRect() : null;

        var lc = document.querySelector('.lightbox-content');
        if (srcRect && lc) {
            // Compute scale from thumbnail to full size
            var lcRect = lc.getBoundingClientRect();
            var scaleX = srcRect.width / lcRect.width;
            var scaleY = srcRect.height / lcRect.height;
            var scale = Math.min(scaleX, scaleY);
            var tx = (srcRect.left + srcRect.width / 2) - (lcRect.left + lcRect.width / 2);
            var ty = (srcRect.top + srcRect.height / 2) - (lcRect.top + lcRect.height / 2);

            lc.style.transition = 'none';
            lc.style.transform = 'translate(' + tx.toFixed(0) + 'px, ' + ty.toFixed(0) + 'px) scale(' + scale.toFixed(3) + ')';
            // Force reflow
            lc.offsetHeight;
            lc.style.transition = 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            lc.style.transform = 'translate(0, 0) scale(1)';
        }

        const img = images[index];
        lightboxImg.src = 'images/full/' + encodeURIComponent(img.file) + '.jpg';
        lightboxImg.alt = img.title;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        var lc = document.querySelector('.lightbox-content');
        var items = grid.querySelectorAll('.gallery-item');
        var srcItem = items[currentIndex];
        if (lc && srcItem) {
            var srcRect = srcItem.getBoundingClientRect();
            var lcRect = lc.getBoundingClientRect();
            var scaleX = srcRect.width / lcRect.width;
            var scaleY = srcRect.height / lcRect.height;
            var scale = Math.min(scaleX, scaleY);
            var tx = (srcRect.left + srcRect.width / 2) - (lcRect.left + lcRect.width / 2);
            var ty = (srcRect.top + srcRect.height / 2) - (lcRect.top + lcRect.height / 2);

            lc.style.transition = 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            lc.style.transform = 'translate(' + tx.toFixed(0) + 'px, ' + ty.toFixed(0) + 'px) scale(' + scale.toFixed(3) + ')';

            setTimeout(function () {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
                if (lc) {
                    lc.style.transition = 'none';
                    lc.style.transform = '';
                }
            }, 400);
        } else {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
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
        var scrollY = window.scrollY;
        nav.classList.toggle('scrolled', scrollY > 80);
        // Hero background parallax
        var heroBg = document.querySelector('.hero-bg');
        if (heroBg) {
            heroBg.style.transform = 'translateY(' + (scrollY * 0.3).toFixed(1) + 'px)';
        }

        // Back-to-top visibility (lazy init)
        var bt = document.getElementById('backToTop');
        if (bt) {
            bt.classList.toggle('visible', scrollY > window.innerHeight);
        }

        // Gallery items visible reveal
        var items = document.querySelectorAll('.gallery-item');
        for (var i = 0; i < items.length; i++) {
            var rect = items[i].getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                items[i].classList.add('visible');
            }
        }
    }


    // Back-to-top click (lazy init)
    (function initBackToTop() {
        var btt = document.getElementById('backToTop');
        if (btt) {
            btt.addEventListener('click', function () {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    })();

    window.addEventListener('scroll', handleScroll, { passive: true });

    /* ── Init ── */
    buildGallery();
    requestAnimationFrame(handleScroll);
    initMouseParallax();
    init3DTilt();


    /* ── Theme Toggle (three-state: auto / dark / light) ── */
    var themeToggle = document.getElementById('themeToggle');
    var html = document.documentElement;
    var systemDarkQuery = window.matchMedia('(prefers-color-scheme: dark)');

    function getThemeMode() {
        return localStorage.getItem('theme') || 'auto';
    }

    function applyTheme(mode) {
        if (mode === 'auto') {
            html.setAttribute('data-theme', systemDarkQuery.matches ? 'dark' : 'light');
            html.setAttribute('data-theme-mode', 'auto');
        } else {
            html.setAttribute('data-theme', mode);
            html.removeAttribute('data-theme-mode');
        }
        localStorage.setItem('theme', mode);
    }

    // Init theme (default: auto)
    (function initTheme() {
        applyTheme(getThemeMode());
    })();

    // Listen for system theme changes when in auto mode
    systemDarkQuery.addEventListener('change', function () {
        if (getThemeMode() === 'auto') {
            applyTheme('auto');
        }
    });

    themeToggle.addEventListener('click', function () {
        var current = getThemeMode();
        var next;
        if (current === 'auto') {
            next = 'dark';
        } else if (current === 'dark') {
            next = 'light';
        } else {
            next = 'auto';
        }
        applyTheme(next);
    });

    /* ── Language Toggle ── */
    var translations = {
        'nav-works': { zh: '作品', en: 'Works' },
        'nav-about': { zh: '关于', en: 'About' },
        'nav-contact': { zh: '联系', en: 'Contact' },
        'hero-desc': { zh: '透过一扇扇不同寻常的窗户，看见超现实的远方', en: 'Through these uncommon windows, see the surreal beyond' },
        'hero-cta': { zh: '探索作品', en: 'Explore' },
        'section-works': { zh: '窗外', en: 'Beyond the Window' },
        'section-about': { zh: '关于', en: 'About' },
        'section-contact': { zh: '联系', en: 'Contact' },
        'about-p1': { zh: '《Uncommon Windows》系列作品使用 AI 生成技术创作。每一扇窗户都通向一个不可能的世界——窗外可以是极光下的冰岛苔原，可以是海中的火山喷发，也可以是一颗巨大的木星占满天空。', en: 'The "Uncommon Windows" series is created using AI generation technology. Each window opens onto an impossible world \u2014 beyond the frame, there may be the Icelandic tundra under the aurora, a volcano erupting at sea, or a giant Jupiter filling the sky.' },
        'about-p2': { zh: '这些图像探索了"窗口"作为媒介的双重性：它既是物理空间的边界，又是想象力的起点。通过将日常的窗景置换为超现实的景象，作品邀请观众重新审视熟悉与陌生、现实与虚构之间的界限。', en: 'These images explore the duality of the "window" as a medium: it is both a physical boundary and a departure point for imagination. By replacing everyday window views with surreal scenes, the work invites viewers to reconsider the boundary between the familiar and the strange, reality and fiction.' },
        'contact-phone': { zh: '电话', en: 'Phone' },
        'contact-wechat': { zh: '微信', en: 'WeChat' },
        'contact-email': { zh: '邮箱', en: 'Email' },
        'footer-copy': { zh: '\u00a9 2026 姚海旭 \u00b7 All Rights Reserved', en: '\u00a9 2026 Haixu Yao \u00b7 All Rights Reserved' }
    };

    var ariaTranslations = {
        'back-to-top': { zh: '回到顶部', en: 'Back to Top' }
    };

    var langToggle = document.getElementById('langToggle');

    function getLang() {
        return localStorage.getItem('lang') || 'zh';
    }

    function applyLanguage(lang) {
        html.setAttribute('data-lang', lang);
        localStorage.setItem('lang', lang);

        // Update text content
        var i18nEls = document.querySelectorAll('[data-i18n]');
        for (var i = 0; i < i18nEls.length; i++) {
            var el = i18nEls[i];
            var key = el.getAttribute('data-i18n');
            if (translations[key] && translations[key][lang]) {
                el.textContent = translations[key][lang];
            }
        }

        // Update aria-labels
        var ariaEls = document.querySelectorAll('[data-i18n-aria]');
        for (var j = 0; j < ariaEls.length; j++) {
            var aEl = ariaEls[j];
            var aKey = aEl.getAttribute('data-i18n-aria');
            if (ariaTranslations[aKey] && ariaTranslations[aKey][lang]) {
                aEl.setAttribute('aria-label', ariaTranslations[aKey][lang]);
                aEl.setAttribute('title', ariaTranslations[aKey][lang]);
            }
        }

        // Update langToggle aria-label and title
        langToggle.setAttribute('aria-label', lang === 'zh' ? 'Switch to English' : '切换到中文');
        langToggle.setAttribute('title', lang === 'zh' ? 'Switch to English' : '切换到中文');

        // Update themeToggle aria-label and title
        var themeTgl = document.getElementById('themeToggle');
        if (lang === 'en') {
            themeTgl.setAttribute('aria-label', 'Toggle Theme');
            themeTgl.setAttribute('title', 'Toggle Theme');
        } else {
            themeTgl.setAttribute('aria-label', '切换主题模式');
            themeTgl.setAttribute('title', '切换主题模式');
        }
    }

    langToggle.addEventListener('click', function () {
        var current = getLang();
        var next = current === 'zh' ? 'en' : 'zh';
        applyLanguage(next);
    });

    // Init language (default: zh)
    (function initLang() {
        applyLanguage(getLang());
    })();


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