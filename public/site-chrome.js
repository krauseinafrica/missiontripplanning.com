/*
 * COPY. The canonical source is the platform repo at
 *   /var/www/discipleship-platform/public/js/site-chrome.js
 * missiontripplanning.com is a separate static site with its own nginx root,
 * so it cannot link the original. Re-copy both site-chrome files when the
 * shared chrome changes.
 */

/**
 * site-chrome.js — behaviour for the shared marketing header.
 *
 * The markup is written into each page rather than injected here, so crawlers
 * see the nav and the bar does not shift in after paint. This file only does
 * the three things markup cannot:
 *
 *   1. the mobile drawer (toggle, scrim, Escape, resize, outside click)
 *   2. the scroll shadow
 *   3. marking the current page, so one nav definition works on every page
 *
 * Pair it with site-chrome.css. Safe to include on a page with no header.
 */
(function () {
  'use strict';

  function markCurrent(header) {
    var here = window.location.pathname.replace(/\/+$/, '') || '/';
    var links = header.querySelectorAll('.sc-nav a[href^="/"]');
    var best = null;
    Array.prototype.forEach.call(links, function (a) {
      if (a.classList.contains('sc-cta')) return;
      var href = a.getAttribute('href').replace(/\/+$/, '') || '/';
      if (href === here) {
        best = a;
      } else if (href !== '/' && here.indexOf(href + '/') === 0 && (!best || href.length > best.getAttribute('href').length)) {
        // A sub-page marks its parent: /playbook/growth lights up Playbook.
        best = a;
      }
    });
    if (best) best.setAttribute('aria-current', 'page');
  }

  function wireDrawer(header) {
    var nav = header.querySelector('.sc-nav');
    var burger = header.querySelector('.sc-burger');
    if (!nav || !burger) return;

    var scrim = document.querySelector('.sc-scrim');
    if (!scrim) {
      scrim = document.createElement('div');
      scrim.className = 'sc-scrim';
      document.body.appendChild(scrim);
    }

    function setOpen(open) {
      nav.classList.toggle('is-open', open);
      scrim.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-controls', nav.id || 'scNav');
    if (!nav.id) nav.id = 'scNav';

    burger.addEventListener('click', function (e) {
      e.stopPropagation();
      setOpen(!nav.classList.contains('is-open'));
    });
    scrim.addEventListener('click', function () {
      setOpen(false);
    });
    nav.addEventListener('click', function (e) {
      // Let a real navigation close it; ignore clicks on the nav's own chrome.
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
    window.addEventListener('resize', function () {
      // Past the breakpoint the drawer styles no longer apply, so a stale
      // is-open would leave the scrim covering a desktop page.
      if (window.innerWidth > 900) setOpen(false);
    });
  }

  function wireShadow(header) {
    var ticking = false;
    function apply() {
      header.classList.toggle('is-scrolled', window.scrollY > 4);
      ticking = false;
    }
    window.addEventListener(
      'scroll',
      function () {
        if (ticking) return;
        ticking = true;
        (window.requestAnimationFrame || window.setTimeout)(apply);
      },
      { passive: true }
    );
    apply();
  }

  // The marketing pages drew their pictograms with emoji, so each one rendered
  // in whatever face the visitor's device shipped. Same outline style as the
  // app's icon set (Robert, 13 Sep). Referenced as
  // <svg class="sc-ico"><use href="#sc-name"></use></svg>.
  var SC_SPRITE =
      '<symbol id="sc-examine" viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="6.3"/><path d="M15.4 15.4 20 20"/><path d="M8.4 10.8h4.8"/></symbol>' +
      '<symbol id="sc-link" viewBox="0 0 24 24"><path d="M10.2 13.8a3.8 3.8 0 0 0 5.7.4l2.6-2.6a3.8 3.8 0 0 0-5.4-5.4l-1.5 1.5"/><path d="M13.8 10.2a3.8 3.8 0 0 0-5.7-.4l-2.6 2.6a3.8 3.8 0 0 0 5.4 5.4l1.5-1.5"/></symbol>' +
      '<symbol id="sc-book" viewBox="0 0 24 24"><path d="M12 6.6A3.4 3.4 0 0 0 8.6 3.2H4.8A1.3 1.3 0 0 0 3.5 4.5v11.3A1.3 1.3 0 0 0 4.8 17h4.1A3 3 0 0 1 12 20"/><path d="M12 6.6a3.4 3.4 0 0 1 3.4-3.4h3.8a1.3 1.3 0 0 1 1.3 1.3v11.3a1.3 1.3 0 0 1-1.3 1.2h-4.1A3 3 0 0 0 12 20"/><path d="M12 6.6V20"/></symbol>' +
      '<symbol id="sc-question" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.8"/><path d="M9.6 9.6a2.5 2.5 0 0 1 4.8.8c0 1.7-2.4 2-2.4 3.6"/><path d="M12 17.3h.01"/></symbol>' +
      '<symbol id="sc-research" viewBox="0 0 24 24"><path d="M9.5 3.2h5"/><path d="M10.6 3.2v5.4L5.9 17a2.1 2.1 0 0 0 1.8 3.2h8.6a2.1 2.1 0 0 0 1.8-3.2l-4.7-8.4V3.2"/><path d="M8.2 14.2h7.6"/></symbol>' +
      '<symbol id="sc-target" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.6"/><circle cx="12" cy="12" r="4.8"/><circle cx="12" cy="12" r="1.1"/></symbol>' +
      '<symbol id="sc-shield" viewBox="0 0 24 24"><path d="M12 3.1 5 6v5.4c0 4.3 2.9 8.2 7 9.5 4.1-1.3 7-5.2 7-9.5V6Z"/><path d="M9.2 12.1 11.3 14.2l3.9-4"/></symbol>' +
      '<symbol id="sc-compass" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.8"/><path d="m15.3 8.7-1.9 4.6-4.7 2 1.9-4.6Z"/></symbol>' +
      '<symbol id="sc-chat" viewBox="0 0 24 24"><path d="M20.4 13.6a3 3 0 0 1-3 3H9.1L4.6 20v-4.4H4.5a3 3 0 0 1-.9-2.1V6.9a3 3 0 0 1 3-3h10.8a3 3 0 0 1 3 3Z"/></symbol>' +
      '<symbol id="sc-books" viewBox="0 0 24 24"><path d="M4.4 4.6h3.3v14.8H4.4z"/><path d="M9.4 4.6h3.3v14.8H9.4z"/><path d="m14.6 5.6 3.2-.9 3.2 13.4-3.2.9z"/></symbol>' +
      '<symbol id="sc-mail" viewBox="0 0 24 24"><rect x="2.9" y="5" width="18.2" height="14" rx="2.2"/><path d="m3.6 6.6 7.2 5.6a2 2 0 0 0 2.4 0l7.2-5.6"/></symbol>' +
      '<symbol id="sc-bug" viewBox="0 0 24 24"><path d="M8.4 8.2a3.6 3.6 0 0 1 7.2 0v4.6a3.6 3.6 0 0 1-7.2 0Z"/><path d="M8.4 10.6H4.6M19.4 10.6h-3.8M8.4 14.4l-3.3 2.1M19 16.5l-3.4-2.1M8.4 6.8 6 4.9M18 4.9l-2.4 1.9M12 17.6v2.6"/></symbol>' +
      '<symbol id="sc-idea" viewBox="0 0 24 24"><path d="M9.4 17.4a6.2 6.2 0 1 1 5.2 0"/><path d="M9.6 17.4h4.8M10.3 20.4h3.4"/></symbol>' +
      '<symbol id="sc-note" viewBox="0 0 24 24"><path d="M6 3.4h8.2L19 8.2v12.4H6Z"/><path d="M14 3.4v5h5M8.8 12.4h6.4M8.8 15.8h4.4"/></symbol>' +
      '<symbol id="sc-thought" viewBox="0 0 24 24"><path d="M19.4 11.6a4.2 4.2 0 0 1-4.2 4.2H9.6L5.6 19v-3.4a4.2 4.2 0 0 1-1.4-3.1V9.8a4.2 4.2 0 0 1 4.2-4.2h7a4.2 4.2 0 0 1 4 4.2Z"/></symbol>' +
      '<symbol id="sc-check" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.8"/><path d="m8.3 12.3 2.6 2.6 4.8-5.2"/></symbol>' +
      '<symbol id="sc-hands" viewBox="0 0 24 24"><path d="M12 8.4 9.6 6.2a2.3 2.3 0 0 0-3.2 0L3.2 9.4a2 2 0 0 0 0 2.8l4.4 4.3a2 2 0 0 0 2.8 0"/><path d="M12 8.4l2.4-2.2a2.3 2.3 0 0 1 3.2 0l3.2 3.2a2 2 0 0 1 0 2.8l-4.4 4.3a2 2 0 0 1-2.8 0l-2-2"/></symbol>' +
      '<symbol id="sc-shepherd" viewBox="0 0 24 24"><path d="M7.2 12.4a3.3 3.3 0 1 1 1.6-6.2 3.4 3.4 0 0 1 6.4 0 3.3 3.3 0 1 1 1.6 6.2"/><path d="M7.6 12.4h8.8v3.3a3.3 3.3 0 0 1-3.3 3.3h-2.2a3.3 3.3 0 0 1-3.3-3.3Z"/><path d="M9.8 18.9v2M14.2 18.9v2"/></symbol>' +
      '<symbol id="sc-printer" viewBox="0 0 24 24"><path d="M6.6 8.6V3.6h10.8v5"/><rect x="3.4" y="8.6" width="17.2" height="7.4" rx="2"/><path d="M6.6 13.6h10.8v6.8H6.6Z"/></symbol>' +
      '<symbol id="sc-cross" viewBox="0 0 24 24"><path d="M12 3.2v17.6M7.4 8.4h9.2"/></symbol>' +
      '<symbol id="sc-pray" viewBox="0 0 24 24"><path d="M9.6 20.4V15a4.8 4.8 0 0 1 1.4-3.4l4.2-4.2a1.7 1.7 0 0 1 2.4 2.4l-2.8 2.8"/><path d="M14.4 20.4V15a4.8 4.8 0 0 0-1.4-3.4L8.8 7.4a1.7 1.7 0 0 0-2.4 2.4l2.8 2.8"/><path d="M7.4 20.4h9.2"/></symbol>' +
      '<symbol id="sc-globe" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.8"/><path d="M3.4 12h17.2"/><path d="M12 3.2a13.4 13.4 0 0 1 0 17.6 13.4 13.4 0 0 1 0-17.6Z"/></symbol>' +
      '<symbol id="sc-users" viewBox="0 0 24 24"><circle cx="9" cy="8.4" r="3.4"/><path d="M3.4 19.6a5.8 5.8 0 0 1 11.2 0"/><path d="M16.2 5.4a3.2 3.2 0 0 1 0 6"/><path d="M17.6 14.4a5.6 5.6 0 0 1 3 5.2"/></symbol>' +
      '<symbol id="sc-backpack" viewBox="0 0 24 24"><path d="M6.2 8.6a4.2 4.2 0 0 1 4.2-4.2h3.2a4.2 4.2 0 0 1 4.2 4.2v9.6a2.2 2.2 0 0 1-2.2 2.2H8.4a2.2 2.2 0 0 1-2.2-2.2Z"/><path d="M9.4 4.4V3.6a1.4 1.4 0 0 1 1.4-1.4h2.4a1.4 1.4 0 0 1 1.4 1.4v.8"/><path d="M9.4 11.6h5.2v3.8H9.4Z"/></symbol>' +
      '<symbol id="sc-gear" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.2 14.4a1.5 1.5 0 0 0 .3 1.7l.1.1a1.8 1.8 0 1 1-2.6 2.6l-.1-.1a1.5 1.5 0 0 0-2.5 1v.3a1.8 1.8 0 1 1-3.6 0v-.2a1.5 1.5 0 0 0-2.6-1l-.1.1a1.8 1.8 0 1 1-2.6-2.6l.1-.1a1.5 1.5 0 0 0-1-2.5h-.3a1.8 1.8 0 1 1 0-3.6h.2a1.5 1.5 0 0 0 1-2.6l-.1-.1a1.8 1.8 0 1 1 2.6-2.6l.1.1a1.5 1.5 0 0 0 1.7.3h.1a1.5 1.5 0 0 0 .9-1.4v-.3a1.8 1.8 0 1 1 3.6 0v.2a1.5 1.5 0 0 0 2.5 1l.1-.1a1.8 1.8 0 1 1 2.6 2.6l-.1.1a1.5 1.5 0 0 0 1 2.5h.3a1.8 1.8 0 1 1 0 3.6h-.2a1.5 1.5 0 0 0-1.4.9Z"/></symbol>' +
      '<symbol id="sc-heart" viewBox="0 0 24 24"><path d="M12 20.2 4.9 13.3a4.5 4.5 0 0 1 6.4-6.3l.7.7.7-.7a4.5 4.5 0 0 1 6.4 6.3Z"/></symbol>' +
      '<symbol id="sc-camera" viewBox="0 0 24 24"><path d="M3 9a2.3 2.3 0 0 1 2.3-2.3h1.9l1.2-2.05a1.4 1.4 0 0 1 1.2-.7h4.8a1.4 1.4 0 0 1 1.2.7l1.2 2.05h1.9A2.3 2.3 0 0 1 21 9v8.1a2.3 2.3 0 0 1-2.3 2.3H5.3A2.3 2.3 0 0 1 3 17.1Z"/><circle cx="12" cy="13" r="3.5"/></symbol>' +
      '<symbol id="sc-church" viewBox="0 0 24 24"><path d="M12 2.4v5.2M9.8 4.6h4.4"/><path d="M5 20.6V11l7-4 7 4v9.6"/><path d="M5 20.6h14"/><path d="M10.2 20.6v-4.2a1.8 1.8 0 0 1 3.6 0v4.2"/></symbol>' +
      '<symbol id="sc-family" viewBox="0 0 24 24"><circle cx="7.4" cy="6.6" r="2.6"/><circle cx="16.6" cy="6.6" r="2.6"/><path d="M3.2 20.4v-4a4.2 4.2 0 0 1 8.4 0v4"/><path d="M12.4 20.4v-4a4.2 4.2 0 0 1 8.4 0v4"/></symbol>' +
      '<symbol id="sc-inbox" viewBox="0 0 24 24"><path d="M3.4 13.4h4.2l1.4 2.4h6l1.4-2.4h4.2"/><path d="M4.9 5.2h14.2l1.5 8.2v4.2a2 2 0 0 1-2 2H5.4a2 2 0 0 1-2-2v-4.2Z"/></symbol>' +
      '<symbol id="sc-flask" viewBox="0 0 24 24"><path d="M9.5 3.2h5"/><path d="M10.6 3.2v5.4L5.9 17a2.1 2.1 0 0 0 1.8 3.2h8.6a2.1 2.1 0 0 0 1.8-3.2l-4.7-8.4V3.2"/><path d="M8.2 14.2h7.6"/></symbol>' +
      '<symbol id="sc-sparkle" viewBox="0 0 24 24"><path d="m12 3.4 2 5.3 5.3 2-5.3 2-2 5.3-2-5.3-5.3-2 5.3-2Z"/><path d="M18.4 16.4l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8Z"/></symbol>';

  function injectSprite() {
    if (document.getElementById('sc-icon-sprite')) return;
    var host = document.createElement('div');
    host.id = 'sc-icon-sprite';
    host.setAttribute('aria-hidden', 'true');
    host.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    host.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" ' +
      'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + SC_SPRITE + '</svg>';
    (document.body || document.documentElement).appendChild(host);
  }

  function boot() {
    injectSprite();
    var header = document.querySelector('.sc-header');
    if (!header) return;
    markCurrent(header);
    wireDrawer(header);
    wireShadow(header);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
