/* DeloART — редизайн главной по ТЗ. Интерактив */

(function () {
    'use strict';

    /* ---------- Sticky-шапка: тень при скролле ---------- */
    var header = document.getElementById('siteHeader');
    function onScroll() {
        if (!header) return;
        header.classList.toggle('scrolled', window.pageYOffset > 8);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- Мобильное меню ---------- */
    var burger = document.querySelector('.burger');
    var nav = document.getElementById('nav');

    if (burger && nav) {
        burger.addEventListener('click', function () {
            var open = nav.classList.toggle('open');
            burger.classList.toggle('active', open);
            burger.setAttribute('aria-expanded', open ? 'true' : 'false');
            document.body.style.overflow = open ? 'hidden' : '';
        });

        nav.querySelectorAll('a, button').forEach(function (el) {
            el.addEventListener('click', function () {
                nav.classList.remove('open');
                burger.classList.remove('active');
                burger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        document.addEventListener('click', function (e) {
            if (window.innerWidth > 1200) return;
            if (!nav.classList.contains('open')) return;
            if (!nav.contains(e.target) && !burger.contains(e.target)) {
                nav.classList.remove('open');
                burger.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    /* ---------- Модалка ---------- */
    var modal = document.getElementById('modal');
    var modalTitle = document.getElementById('modalTitle');

    function openModal(title) {
        if (!modal) return;
        if (title && modalTitle) modalTitle.textContent = title;
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        var first = modal.querySelector('input');
        if (first) setTimeout(function () { first.focus(); }, 300);
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('[data-modal-open]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            openModal(btn.getAttribute('data-modal-open'));
        });
    });

    document.querySelectorAll('[data-modal-close]').forEach(function (el) {
        el.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeModal();
    });

    /* ---------- Фильтр кейсов ---------- */
    document.querySelectorAll('.cases-tabs').forEach(function (tabs) {
        var buttons = tabs.querySelectorAll('[data-case-filter]');
        var cards = document.querySelectorAll('.case-card');
        buttons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                buttons.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                var f = btn.getAttribute('data-case-filter');
                cards.forEach(function (card) {
                    var tags = (card.getAttribute('data-case-tags') || '').split(' ');
                    var show = f === 'all' || tags.indexOf(f) !== -1;
                    card.classList.toggle('hidden', !show);
                });
            });
        });
    });

    /* ---------- Табы отраслей ---------- */
    (function industryTabs() {
        var tabs = document.querySelectorAll('[data-industry]');
        var panels = document.querySelectorAll('[data-industry-panel]');
        if (!tabs.length || !panels.length) return;
        tabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                var key = tab.getAttribute('data-industry');
                tabs.forEach(function (t) { t.classList.remove('active'); });
                tab.classList.add('active');
                panels.forEach(function (p) {
                    p.classList.toggle('active', p.getAttribute('data-industry-panel') === key);
                });
            });
        });
    })();

    /* ---------- Слайдер отзывов ---------- */
    (function reviews() {
        var reviews = document.querySelectorAll('.reviews-track .review');
        var dotsBox = document.getElementById('reviewsDots');
        var prev = document.getElementById('reviewPrev');
        var next = document.getElementById('reviewNext');
        if (!reviews.length) return;
        var idx = 0;

        function render() {
            reviews.forEach(function (r, i) { r.classList.toggle('active', i === idx); });
            if (dotsBox) {
                var dots = dotsBox.querySelectorAll('i');
                dots.forEach(function (d, i) { d.classList.toggle('active', i === idx); });
            }
        }

        if (dotsBox) {
            reviews.forEach(function (_, i) {
                var d = document.createElement('i');
                if (i === 0) d.classList.add('active');
                d.addEventListener('click', function () { idx = i; render(); });
                dotsBox.appendChild(d);
            });
        }

        if (prev) prev.addEventListener('click', function () {
            idx = (idx - 1 + reviews.length) % reviews.length; render();
        });
        if (next) next.addEventListener('click', function () {
            idx = (idx + 1) % reviews.length; render();
        });
        render();
    })();

    /* ---------- Появление секций при скролле ---------- */
    (function reveal() {
        var targets = document.querySelectorAll(
            '.section-head, .solution-card, .case-card, .step-card, .industry-panel, .stack-card, .leader-card, .reviews-card, .process-cta, .audit-box, .hero-bento'
        );
        if (!targets.length) return;

        targets.forEach(function (el) { el.classList.add('reveal'); });

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('visible');
                io.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

        targets.forEach(function (el) { io.observe(el); });
    })();

    /* ---------- Формы: заглушка отправки ---------- */
    [document.getElementById('auditForm'), document.getElementById('modalForm')].forEach(function (form) {
        if (!form) return;
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var btn = form.querySelector('button[type="submit"]');
            if (!btn) return;
            var original = btn.textContent;
            btn.textContent = 'Отправлено';
            btn.disabled = true;
            setTimeout(function () {
                btn.textContent = original;
                btn.disabled = false;
                form.reset();
                if (form.id === 'modalForm') closeModal();
            }, 2200);
        });
    });

    /* ---------- Плавная прокрутка по якорям ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var id = link.getAttribute('href');
            if (id === '#' || id.length < 2) return;
            var target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            var top = target.getBoundingClientRect().top + window.pageYOffset - 84;
            window.scrollTo({ top: top, behavior: 'smooth' });
        });
    });
})();
