/* Light / dark switch. Loaded in <head> so the saved choice applies before the page paints.
   Default: follow the device setting. A click saves an explicit choice for this browser. */
(function () {
  var KEY = "theme";
  var root = document.documentElement;
  var mq = window.matchMedia ? matchMedia("(prefers-color-scheme: dark)") : null;

  function saved() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function store(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function current() { return root.getAttribute("data-theme") || (mq && mq.matches ? "dark" : "light"); }

  var s = saved();
  if (s === "light" || s === "dark") root.setAttribute("data-theme", s);

  var css =
    ".theme-toggle{display:inline-grid;place-items:center;width:36px;height:36px;margin:-4px -6px -4px 0;padding:0;" +
    "border:0;border-radius:50%;background:transparent;color:var(--ink-soft);cursor:pointer;" +
    "transition:color .2s,background-color .2s}" +
    ".theme-toggle:hover{color:var(--ink);background:var(--line)}" +
    ".theme-toggle:focus-visible{outline:2px solid var(--pipe);outline-offset:2px}" +
    ".theme-toggle svg{width:18px;height:18px;transition:transform .5s cubic-bezier(.2,.7,.2,1)}" +
    ".theme-toggle .sun{display:none}" +
    "[data-mode=dark] .theme-toggle .sun{display:block}[data-mode=dark] .theme-toggle .moon{display:none}" +
    ".theme-toggle:active svg{transform:rotate(-30deg) scale(.9)}" +
    "@media (pointer:coarse){.theme-toggle{width:44px;height:44px;margin:-8px -10px -8px 0}}" +
    "@media (prefers-reduced-motion:reduce){.theme-toggle,.theme-toggle svg{transition:none}}";

  var icons =
    '<svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z"/></svg>' +
    '<svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">' +
    '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg>';

  function label(btn) {
    var dark = current() === "dark";
    root.setAttribute("data-mode", dark ? "dark" : "light");
    var next = dark ? "light" : "dark";
    btn.setAttribute("aria-label", "Switch to " + next + " mode");
    btn.title = "Switch to " + next + " mode";
  }

  function init() {
    var slot = document.querySelector("[data-theme-slot]");
    if (!slot) return;
    var st = document.createElement("style");
    st.textContent = css;
    document.head.appendChild(st);
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "theme-toggle";
    btn.innerHTML = icons;
    slot.appendChild(btn);
    label(btn);
    btn.addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      store(next);
      label(btn);
    });
    if (mq) {
      var onChange = function () { if (!saved()) label(btn); };
      if (mq.addEventListener) mq.addEventListener("change", onChange); else if (mq.addListener) mq.addListener(onChange);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
