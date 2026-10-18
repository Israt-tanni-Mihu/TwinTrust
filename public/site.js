(function () {
  'use strict';

  var LANG_KEY = 'tt_lang';
  var lang = 'bn';
  try { if (localStorage.getItem(LANG_KEY) === 'en') lang = 'en'; } catch (e) {}

  var roleNames = { USER: 'ইউজার', OFFICER: 'অফিসার', ADMIN: 'অ্যাডমিন' };

  var I18N = window.TT_I18N || { tr: function (s) { return s; } };
  var tr = I18N.tr;
  window.TT_LANG = function () { return lang; };
  window.TT_LOCALE = function () { return lang === 'en' ? 'en-US' : 'bn-BD'; };

  // translate confirm() dialogs too
  var nativeConfirm = window.confirm;
  window.confirm = function (msg) { return nativeConfirm.call(window, lang === 'en' ? tr(String(msg)) : msg); };

  var origText = new WeakMap();
  var origAttr = new WeakMap();
  var ATTRS = ['placeholder', 'title', 'aria-label', 'alt', 'label'];

  function translateText(node) {
    if (lang === 'en') {
      if (!origText.has(node)) origText.set(node, node.nodeValue);
      var t = tr(origText.get(node));
      if (t !== node.nodeValue) node.nodeValue = t;
    } else if (origText.has(node)) {
      var o = origText.get(node);
      if (node.nodeValue !== o) node.nodeValue = o;
    }
  }

  function translateAttrs(e) {
    ATTRS.forEach(function (name) {
      var cur = e.getAttribute(name);
      if (cur === null) return;
      var recs = origAttr.get(e) || {};
      var rec = recs[name];
      if (lang === 'en') {
        var base = (rec && cur === rec.shown) ? rec.orig : cur;
        var t = tr(base);
        if (t !== cur) e.setAttribute(name, t);
        recs[name] = { orig: base, shown: t };
        origAttr.set(e, recs);
      } else if (rec && cur === rec.shown) {
        e.setAttribute(name, rec.orig);
        delete recs[name];
      }
    });
  }

  function applyNode(root) {
    if (root.nodeType === 3) {
      var p = root.parentElement;
      if (p && !p.closest('[data-notr]')) translateText(root);
      return;
    }
    if (root.nodeType !== 1) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var pe = n.parentElement;
        if (!pe) return NodeFilter.FILTER_REJECT;
        var tag = pe.tagName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEXTAREA' || tag === 'NOSCRIPT') return NodeFilter.FILTER_REJECT;
        if (pe.closest('[data-notr]')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var n;
    while ((n = walker.nextNode())) translateText(n);
    translateAttrs(root);
    root.querySelectorAll('[placeholder],[title],[aria-label],[alt],[label]').forEach(translateAttrs);
  }

  var titleOrig = null;
  function applyTitle() {
    if (titleOrig === null) titleOrig = document.title;
    document.title = lang === 'en' ? tr(titleOrig) : titleOrig;
  }

  function el(tag, props, kids) {
    var e = document.createElement(tag);
    Object.keys(props || {}).forEach(function (k) {
      if (k === 'text') e.textContent = props[k];
      else e.setAttribute(k, props[k]);
    });
    (kids || []).forEach(function (c) { e.appendChild(c); });
    return e;
  }

  function getUser() {
    try { return JSON.parse(sessionStorage.getItem('user') || 'null'); } catch (e) { return null; }
  }

  function start() {
    var bar = el('header', { 'class': 'tt-bar' });
    var brand = el('a', { 'class': 'tt-brand', href: '/' }, [
      el('img', { src: '/logo.svg', alt: 'Twin Trust', width: '38', height: '38' }),
      el('span', { text: 'টুইন ট্রাস্ট ল্যান্ড ভেরিফাই' })
    ]);
    var langBtn = el('button', { type: 'button', 'class': 'tt-lang', 'data-notr': '1' });
    var burger = el('button', { type: 'button', 'class': 'tt-burger', 'aria-label': 'মেনু', text: '☰' });
    bar.appendChild(brand);
    bar.appendChild(el('div', { 'class': 'tt-right' }, [langBtn, burger]));

    var overlay = el('div', { 'class': 'tt-overlay' });
    var nav = el('nav', { 'class': 'tt-nav', 'aria-label': 'মেনু' });

    var foot = el('footer', { 'class': 'tt-footer' }, [
      el('div', { 'class': 'tt-foot-grid' }, [
        el('div', {}, [
          el('a', { 'class': 'tt-brand tt-foot-brand', href: '/' }, [
            el('img', { src: '/logo.svg', alt: 'Twin Trust', width: '34', height: '34' }),
            el('span', { text: 'টুইন ট্রাস্ট ল্যান্ড ভেরিফাই' })
          ]),
          el('p', { text: 'আপনার জমির তথ্য যাচাই করুন, ঝুঁকি জানুন, নিরাপদে সিদ্ধান্ত নিন।' })
        ]),
        el('div', {}, [
          el('h4', { text: 'দ্রুত লিংক' }),
          el('a', { href: '/', text: 'জমি খুঁজুন' }),
          el('a', { href: '/learn.html', text: 'আরো জানুন' })
        ]),
        el('div', {}, [
          el('h4', { text: 'গুরুত্বপূর্ণ নোট' }),
          el('p', { text: 'এই সাইটে শুধু অ্যাডমিনের যাচাই করা তথ্য দেখানো হয়। জমি কেনার আগে উপজেলা ভূমি অফিসে গিয়ে নিজে যাচাই করে নিন।' })
        ])
      ]),
      el('p', { 'class': 'tt-foot-note', text: 'এটা একটি পরীক্ষামূলক প্রজেক্ট, সরকারি রেকর্ড নয়।' }),
      el('p', { 'class': 'tt-foot-copy', text: '© ২০২৬ টুইন ট্রাস্ট ল্যান্ড ভেরিফাই। সর্বস্বত্ব সংরক্ষিত।' })
    ]);

    document.body.insertBefore(bar, document.body.firstChild);
    document.body.appendChild(foot);
    document.body.appendChild(overlay);
    document.body.appendChild(nav);
    document.body.classList.add('tt-bg');

    function closeNav() {
      nav.classList.remove('open');
      overlay.classList.remove('open');
    }

    function renderNav() {
      var user = getUser();
      nav.textContent = '';
      var close = el('button', { type: 'button', 'class': 'tt-close', 'aria-label': 'বন্ধ করুন', text: '✕' });
      close.addEventListener('click', closeNav);
      nav.appendChild(el('div', { 'class': 'tt-nav-head' }, [
        el('a', { 'class': 'tt-brand', href: '/' }, [
          el('img', { src: '/logo.svg', alt: 'Twin Trust', width: '34', height: '34' }),
          el('span', { text: 'টুইন ট্রাস্ট ল্যান্ড ভেরিফাই' })
        ]),
        close
      ]));
      if (user) {
        nav.appendChild(el('p', { 'class': 'tt-who', text: 'স্বাগতম, ' + user.name + ' (' + (roleNames[user.role] || user.role) + ')' }));
      }
      nav.appendChild(el('a', { href: '/', text: 'জমি খুঁজুন' }));
      if (user && user.role === 'USER') {
        nav.appendChild(el('a', { href: '/bayna.html', text: 'বায়না জমা দিন' }));
        nav.appendChild(el('a', { href: '/mortgage.html', text: 'বন্ধক জমা দিন' }));
      }
      if (user && user.role === 'OFFICER') nav.appendChild(el('a', { href: '/officer.html', text: 'মামলা জমা দিন' }));
      if (user && user.role === 'ADMIN') nav.appendChild(el('a', { href: '/admin.html', text: 'অ্যাডমিন পেজ' }));
      nav.appendChild(el('a', { href: '/learn.html', text: 'আরো জানুন' }));

      if (!user) {
        nav.appendChild(el('a', { href: '/login.html#register', text: 'নতুন অ্যাকাউন্ট' }));
        nav.appendChild(el('a', { href: '/login.html#officer', text: 'অফিসার আবেদন' }));
      } else {
        var out = el('button', { type: 'button', 'class': 'tt-logout', text: 'লগআউট' });
        out.addEventListener('click', function () {
          sessionStorage.clear();
          location.href = '/';
        });
        nav.appendChild(out);
      }
      applyNode(nav);
    }

    burger.addEventListener('click', function () {
      renderNav();
      nav.classList.add('open');
      overlay.classList.add('open');
    });
    overlay.addEventListener('click', closeNav);
    document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') closeNav(); });
    nav.addEventListener('click', function (ev) { if (ev.target.tagName === 'A') closeNav(); });

    function applyAll() {
      document.documentElement.lang = lang;
      langBtn.textContent = lang === 'bn' ? 'English' : 'বাংলা';
      applyTitle();
      applyNode(document.body);
    }
    langBtn.addEventListener('click', function () {
      lang = lang === 'bn' ? 'en' : 'bn';
      try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
      applyAll();
    });

    new MutationObserver(function (muts) {
      if (lang !== 'en') return;
      muts.forEach(function (m) {
        m.addedNodes.forEach(function (n) { applyNode(n); });
      });
    }).observe(document.body, { childList: true, subtree: true });

    applyAll();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();