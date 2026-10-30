// Reveal-on-scroll, nav mobile, tema (auto jam lokal + toggle), carousel. Tanpa dependensi.
(function () {
  var els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach(function (el) { el.classList.add("in"); });
  } else {
    // ponytail: threshold 0 — clip-path .reveal menahan intersectionRatio di 0 selagi
    // ter-clip, jadi threshold > 0 tak pernah terlampaui dan konten tak pernah muncul.
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0 });
    els.forEach(function (el) { io.observe(el); });
  }

  var burger = document.querySelector(".nav-burger");
  var links = document.querySelector(".nav-links");
  if (burger && links) {
    burger.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Tema: mode tersimpan (auto|light|dark); auto = gelap pukul 18.00-05.59 waktu perangkat.
  // ponytail: jam lokal pembaca, bukan zona waktu kantor; ganti ke API zona bila perlu.
  var MODES = ["auto", "light", "dark"];
  var root = document.documentElement;
  var mode = MODES.indexOf(localStorage.getItem("kn-theme")) > -1 ? localStorage.getItem("kn-theme") : "auto";
  function nightHour() { var h = new Date().getHours(); return h >= 18 || h < 6; }
  function applyTheme() {
    root.setAttribute("data-theme", mode === "auto" ? (nightHour() ? "dark" : "light") : mode);
    root.setAttribute("data-theme-mode", mode);
    var t = document.querySelector(".theme-toggle");
    if (t) t.setAttribute("aria-label", "Tema: " + mode + ". Klik untuk ganti.");
  }
  applyTheme();
  var toggle = document.querySelector(".theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      mode = MODES[(MODES.indexOf(mode) + 1) % MODES.length];
      localStorage.setItem("kn-theme", mode);
      applyTheme();
    });
  }

  // Carousel: scroll-snap native; tombol & dot hanya memanggil scrollTo.
  var track = document.querySelector(".car-track");
  if (track) {
    var slides = Array.prototype.slice.call(track.children);
    var dots = document.querySelector(".car-dots");
    slides.forEach(function (_, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Foto " + (i + 1));
      b.addEventListener("click", function () { go(i); });
      dots.appendChild(b);
    });
    function go(i) {
      var s = slides[Math.max(0, Math.min(slides.length - 1, i))];
      track.scrollTo({ left: s.offsetLeft - (track.clientWidth - s.clientWidth) / 2, behavior: "smooth" });
    }
    document.querySelectorAll(".car-btn").forEach(function (b) {
      b.addEventListener("click", function () { go(current() + Number(b.dataset.dir)); });
    });
    function current() {
      var mid = track.scrollLeft + track.clientWidth / 2, best = 0, dist = Infinity;
      slides.forEach(function (s, i) {
        var d = Math.abs(s.offsetLeft + s.clientWidth / 2 - mid);
        if (d < dist) { dist = d; best = i; }
      });
      return best;
    }
    var raf = 0;
    track.addEventListener("scroll", function () {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        var c = current();
        dots.children[c] && Array.prototype.forEach.call(dots.children, function (d, i) {
          d.setAttribute("aria-current", i === c ? "true" : "false");
        });
      });
    });
    dots.children[0] && dots.children[0].setAttribute("aria-current", "true");
  }
})();
