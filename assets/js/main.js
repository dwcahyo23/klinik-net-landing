// Reveal-on-scroll + nav mobile. ~20 baris, tanpa dependensi.
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
})();
