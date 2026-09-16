/**
 * Conversion tracking for missiontripplanning.com.
 *
 * MTP is a static site and does NOT load the platform's shared analytics.js, so
 * it gets none of that file's CTA or handoff tracking. This is the equivalent,
 * deliberately using the SAME event names and parameter names (cta_click,
 * app_handoff, cta_id, destination, page_path) so one report definition works
 * against both GA4 properties.
 *
 * Why this exists at all: MTP and GO are separate GA4 properties, so a person
 * crossing from one to the other is two unrelated users in two unrelated
 * reports. There is no native funnel across properties. This records the intent
 * on MTP's side; GO's property records the arrival via the utm_source on the
 * link. Read together they give a conversion rate.
 */
(function () {
  var GO_HOSTS = ['go.mkdscpls.com'];
  // Pages where someone is researching rather than shopping. Used to label the
  // handoff so "read a guide, then signed up" is separable from "landed on the
  // pricing page and signed up", which are very different intents.
  var RESEARCH_PAGES = [
    '/checklist', '/budget', '/how-to-plan-a-mission-trip',
    '/mission-trip-packing-list', '/mission-trip-fundraising-ideas',
    '/filling-your-team', '/church-mission-partners',
  ];

  document.addEventListener('click', function (e) {
    if (typeof window.gtag !== 'function') return;
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;

    var url;
    try {
      url = new URL(a.getAttribute('href'), window.location.origin);
    } catch (err) {
      return;
    }
    if (url.protocol.indexOf('http') !== 0) return;

    var page = window.location.pathname.replace(/\.html$/, '') || '/';
    var ctaId = a.getAttribute('data-utm-content') || '';
    // Fall back to the utm_content already on the link rather than the link
    // text, which is usually "Get Started" on every CTA and tells us nothing.
    if (!ctaId) ctaId = url.searchParams.get('utm_content') || '';
    var label = ctaId || (a.textContent || '').trim().slice(0, 50);

    if (GO_HOSTS.indexOf(url.hostname) !== -1) {
      gtag('event', 'app_handoff', {
        audience: RESEARCH_PAGES.indexOf(page) !== -1 ? 'researching' : 'evaluating',
        cta_id: label,
        destination: url.hostname + url.pathname,
        page_path: page,
      });
    } else if (ctaId) {
      gtag('event', 'cta_click', {
        cta_id: label,
        destination: url.hostname + url.pathname,
        page_path: page,
      });
    }
  });
})();
