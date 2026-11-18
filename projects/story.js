// Shared story template behaviour: pinned figure swaps, swipe compare, reveal, zoom, progress bar.
(function () {
  // Sidecar: show the figure that matches the step in view
  document.querySelectorAll('.sidecar').forEach(function (sc) {
    var steps = sc.querySelectorAll('.step');
    var figs = sc.querySelectorAll('.stage figure');
    function show(id) {
      figs.forEach(function (f) { f.classList.toggle('active', f.dataset.id === id); });
      steps.forEach(function (s) { s.classList.toggle('active', s.dataset.fig === id); });
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) show(e.target.dataset.fig); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    steps.forEach(function (s) { io.observe(s); });
    if (steps[0]) show(steps[0].dataset.fig);
  });

  // Swipe compare
  document.querySelectorAll('.swipe').forEach(function (w) {
    var r = w.querySelector('input');
    function set() { w.style.setProperty('--pos', r.value + '%'); }
    r.addEventListener('input', set); set();
  });

  // Reveal on scroll
  var rv = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); rv.unobserve(e.target); } });
  }, { threshold: 0.2 });
  document.querySelectorAll('.reveal, .landuse').forEach(function (el) { rv.observe(el); });

  // Click to zoom
  var dlg = document.createElement('dialog');
  dlg.className = 'zoom';
  var big = document.createElement('img');
  dlg.appendChild(big);
  document.body.appendChild(dlg);
  dlg.addEventListener('click', function () { dlg.close(); });
  document.querySelectorAll('img[data-zoom]').forEach(function (img) {
    img.addEventListener('click', function () { big.src = img.src; big.alt = img.alt; dlg.showModal(); });
  });

  // Reading progress
  var bar = document.querySelector('.progress');
  if (bar) {
    window.addEventListener('scroll', function () {
      var h = document.documentElement;
      bar.style.width = (100 * h.scrollTop / (h.scrollHeight - h.clientHeight)) + '%';
    }, { passive: true });
  }
})();
