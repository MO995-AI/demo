/* ==========================================================================
   work.js — 文档阅读页交互
   - 阅读进度条
   - 目录 scrollspy（当前章节高亮，仅展开当前章节的小节）
   - 移动端目录抽屉
   无依赖，file:// 直接可用。
   ========================================================================== */

(function () {
  "use strict";

  var doc = document.getElementById("docMain");
  var aside = document.getElementById("docAside");
  var toggle = document.getElementById("tocToggle");
  var closeBtn = document.getElementById("tocClose");
  var bar = document.querySelector("#progress span");
  if (!doc) return;

  /* ---------------------------------------------------------------- 进度条 */
  var ticking = false;

  function updateProgress() {
    ticking = false;
    if (!bar) return;
    var rect = doc.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var span = Math.max(1, rect.height - vh * 0.5);
    var read = (vh * 0.5 - rect.top) / span;
    bar.style.width = Math.max(0, Math.min(100, read * 100)) + "%";
  }

  /* ------------------------------------------------------------- Scrollspy */
  var headings = [].slice.call(doc.querySelectorAll("h2[id], h3[id]"));
  var links = {};
  headings.forEach(function (h) {
    var a = aside ? aside.querySelector('a[href="#' + h.id + '"]') : null;
    if (a) links[h.id] = a;
  });

  var current = "";

  function setActive(id) {
    if (id === current) return;
    current = id;

    [].forEach.call(aside.querySelectorAll(".toc__item.is-active, .toc__sub li.is-active"), function (el) {
      el.classList.remove("is-active");
    });

    var link = links[id];
    if (!link) return;

    var subItem = link.closest(".toc__sub li");
    if (subItem) {
      var parent = subItem.closest(".toc__item");
      if (parent) parent.classList.add("is-active");
      subItem.classList.add("is-active");
    } else {
      var item = link.closest(".toc__item");
      if (item) item.classList.add("is-active");
    }
  }

  var spyOffset = function () {
    var head = document.getElementById("siteHead");
    return (head ? head.offsetHeight : 64) + 32;
  };

  function updateSpy() {
    var y = window.scrollY + spyOffset();
    var found = headings.length ? headings[0].id : "";
    for (var i = 0; i < headings.length; i++) {
      var top = headings[i].getBoundingClientRect().top + window.scrollY;
      if (top <= y) found = headings[i].id;
      else break;
    }
    if (found) setActive(found);
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(function () {
        updateProgress();
        updateSpy();
      });
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  updateProgress();
  updateSpy();

  /* ------------------------------------------------------- 移动端目录抽屉 */
  var scrim = null;

  function isMobile() {
    return window.matchMedia("(max-width: 980px)").matches;
  }

  function ensureScrim() {
    if (scrim) return scrim;
    scrim = document.createElement("div");
    scrim.className = "toc-scrim";
    scrim.addEventListener("click", closeDrawer);
    document.body.appendChild(scrim);
    return scrim;
  }

  function openDrawer() {
    if (!aside) return;
    ensureScrim();
    document.body.classList.add("toc-open");
    aside.classList.add("is-open");
    if (toggle) toggle.setAttribute("aria-expanded", "true");
    var first = aside.querySelector("a, button");
    if (first) first.focus({ preventScroll: true });
  }

  function closeDrawer() {
    document.body.classList.remove("toc-open");
    if (aside) aside.classList.remove("is-open");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      if (isMobile()) toggle.focus({ preventScroll: true });
    }
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      if (aside && aside.classList.contains("is-open")) closeDrawer();
      else openDrawer();
    });
  }

  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);

  if (aside) {
    aside.addEventListener("click", function (e) {
      var a = e.target.closest("a[href^='#']");
      if (a && isMobile()) closeDrawer();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && document.body.classList.contains("toc-open")) closeDrawer();
  });

  var lastMobile = isMobile();
  window.addEventListener("resize", function () {
    var now = isMobile();
    if (now !== lastMobile) {
      lastMobile = now;
      if (!now) document.body.classList.remove("toc-open");
      if (aside) aside.classList.remove("is-open");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    }
  });

  /* ------------------------------------------------------------- 图片放大 */
  var box = null;

  function ensureBox() {
    if (box) return box;
    box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "图片放大预览");
    box.innerHTML =
      '<button class="lightbox__close" type="button">关闭 ✕</button>' +
      '<img class="lightbox__img" alt="" />' +
      '<p class="lightbox__cap"></p>';
    box.addEventListener("click", function (e) {
      if (e.target === box || e.target.classList.contains("lightbox__close")) closeBox();
    });
    document.body.appendChild(box);
    return box;
  }

  function openBox(link) {
    ensureBox();
    var img = link.querySelector("img");
    var fig = link.closest("figure");
    var cap = fig ? fig.querySelector("figcaption") : null;
    var big = box.querySelector(".lightbox__img");
    big.src = link.getAttribute("href");
    big.alt = img ? img.getAttribute("alt") || "" : "";
    box.querySelector(".lightbox__cap").textContent = cap ? cap.textContent.trim() : "";
    box.classList.add("is-open");
    document.body.classList.add("lightbox-open");
    box.querySelector(".lightbox__close").focus({ preventScroll: true });
  }

  function closeBox() {
    if (!box) return;
    box.classList.remove("is-open");
    document.body.classList.remove("lightbox-open");
    var img = box.querySelector(".lightbox__img");
    img.removeAttribute("src");
  }

  doc.addEventListener("click", function (e) {
    var link = e.target.closest("a.fig__open");
    if (!link) return;
    e.preventDefault();
    openBox(link);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && box && box.classList.contains("is-open")) closeBox();
  });
})();
