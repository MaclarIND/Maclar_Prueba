/* MACLAR — interacciones del sitio */
(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Header / menú móvil ---------------- */
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
      const open = mobileNav.getAttribute("data-open") === "true";
      mobileNav.setAttribute("data-open", String(!open));
      menuToggle.setAttribute("aria-expanded", String(!open));
    });
    mobileNav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        mobileNav.setAttribute("data-open", "false");
        menuToggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* ---------------- Footer año ---------------- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------------- Reveal on scroll ---------------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length) {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.setAttribute("data-revealed", "true"));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.setAttribute("data-revealed", "true");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
      revealEls.forEach((el) => io.observe(el));
    }
  }

  /* ---------------- Hero interactivo ---------------- */
  const heroTone = {
    "tablero-electromecanico": { g1: "#22303e", g2: "#141d26", g3: "#0b0f14" },
    "tablero-electronico": { g1: "#3a2a1c", g2: "#1c1410", g3: "#0d0a08" },
    "botonera-ventana": { g1: "#262f36", g2: "#141a1f", g3: "#0b0e11" },
    "botonera-pulsador": { g1: "#332c24", g2: "#181410", g3: "#0c0a08" }
  };
  const heroOrder = [
    "tablero-electromecanico",
    "tablero-electronico",
    "botonera-ventana",
    "botonera-pulsador"
  ];

  function initHero() {
    const hero = document.querySelector("[data-hero]");
    if (!hero || typeof MACLAR_PRODUCTS === "undefined") return;

    const track = hero.querySelector("[data-hero-track]");
    const info = hero.querySelector("[data-hero-info]");
    const dotsWrap = hero.querySelector("[data-hero-dots]");
    const prevBtn = hero.querySelector("[data-hero-prev]");
    const nextBtn = hero.querySelector("[data-hero-next]");
    const progressWrap = hero.querySelector("[data-hero-progress]");

    const items = heroOrder
      .map((id) => MACLAR_PRODUCTS.find((p) => p.id === id))
      .filter(Boolean);
    if (!items.length) return;

    let active = 0;
    let autoplayTimer = null;
    const AUTOPLAY_MS = 5200;

    // Build DOM
    items.forEach((product, i) => {
      const btn = document.createElement("button");
      btn.className = "hero__item";
      btn.type = "button";
      btn.setAttribute("data-index", String(i));
      btn.setAttribute("aria-label", `Ver ${product.name}`);
      const img = document.createElement("img");
      img.src = maclarHeroImagePath(product);
      img.alt = "";
      img.loading = i === 0 ? "eager" : "lazy";
      img.decoding = "async";
      const label = document.createElement("span");
      label.className = "hero__item-label";
      label.textContent = product.shortName;
      btn.appendChild(img);
      btn.appendChild(label);
      btn.addEventListener("click", () => setActive(i, true));
      track.appendChild(btn);

      if (dotsWrap) {
        const dot = document.createElement("button");
        dot.className = "hero__dot";
        dot.type = "button";
        dot.setAttribute("aria-label", `Producto ${i + 1}: ${product.name}`);
        dot.textContent = String(i + 1).padStart(2, "0");
        dot.addEventListener("click", () => setActive(i, true));
        dotsWrap.appendChild(dot);
      }
      if (progressWrap) {
        const seg = document.createElement("span");
        seg.className = "hero__progress-seg";
        seg.innerHTML = "<span></span>";
        progressWrap.appendChild(seg);
      }
    });

    const itemEls = Array.from(track.querySelectorAll(".hero__item"));
    const dotEls = dotsWrap ? Array.from(dotsWrap.querySelectorAll(".hero__dot")) : [];
    const segEls = progressWrap ? Array.from(progressWrap.querySelectorAll(".hero__progress-seg")) : [];

    function layout() {
      const isMobile = window.innerWidth <= 760;
      itemEls.forEach((el, i) => {
        const diff = i - active;
        const abs = Math.abs(diff);
        const spacing = isMobile ? 30 : 21;
        const left = 50 + diff * spacing;
        const scale = i === active ? 1 : Math.max(0.52, 1 - abs * 0.22);
        const opacity = i === active ? 1 : abs <= 2 ? 0.5 : 0;
        const z = 10 - abs;
        el.style.left = left + "%";
        el.style.transform = `translate(-50%, 0) scale(${scale})`;
        el.style.opacity = String(opacity);
        el.style.zIndex = String(z);
        el.setAttribute("data-active", String(i === active));
        el.setAttribute("aria-current", i === active ? "true" : "false");
        el.tabIndex = abs <= 2 ? 0 : -1;
      });
    }

    function setActive(i, userInitiated) {
      active = (i + items.length) % items.length;
      const product = items[active];
      const tone = heroTone[product.id] || heroTone["tablero-electromecanico"];
      hero.style.setProperty("--hg-1", tone.g1);
      hero.style.setProperty("--hg-2", tone.g2);
      hero.style.setProperty("--hg-3", tone.g3);

      layout();

      if (info) {
        info.setAttribute("data-active", "false");
        window.setTimeout(() => {
          const cat = maclarGetCategory(product.category);
          info.innerHTML = `
            <div class="hero__info-bar"></div>
            <p class="hero__info-cat">${cat ? cat.name : ""}</p>
            <h2>${product.name}</h2>
            <p>${product.tagline}</p>
            <div class="hero__ctas">
              <a class="btn btn-primary btn-sm" href="${maclarProductUrl(product)}">Ver ficha</a>
              <a class="btn btn-light btn-sm" href="${maclarRoot()}index.html?producto=${product.slug}#contacto">Consultar</a>
            </div>`;
          info.setAttribute("data-active", "true");
        }, prefersReducedMotion ? 0 : 120);
      }

      dotEls.forEach((d, di) => d.setAttribute("data-active", String(di === active)));
      segEls.forEach((s, si) => {
        s.setAttribute("data-active", String(si === active));
        s.setAttribute("data-done", String(si < active));
      });

      if (userInitiated) restartAutoplay();
    }

    function next() { setActive(active + 1, true); }
    function prev() { setActive(active - 1, true); }

    if (nextBtn) nextBtn.addEventListener("click", next);
    if (prevBtn) prevBtn.addEventListener("click", prev);

    hero.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { next(); e.preventDefault(); }
      if (e.key === "ArrowLeft") { prev(); e.preventDefault(); }
    });

    // Touch swipe
    let touchStartX = null;
    const stage = hero.querySelector("[data-hero-stage]");
    if (stage) {
      stage.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
      stage.addEventListener("touchend", (e) => {
        if (touchStartX === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); }
        touchStartX = null;
      }, { passive: true });
    }

    function restartAutoplay() {
      if (prefersReducedMotion) return;
      if (autoplayTimer) window.clearInterval(autoplayTimer);
      autoplayTimer = window.setInterval(next, AUTOPLAY_MS);
    }
    function stopAutoplay() {
      if (autoplayTimer) window.clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
    hero.addEventListener("mouseenter", stopAutoplay);
    hero.addEventListener("mouseleave", restartAutoplay);
    hero.addEventListener("focusin", stopAutoplay);
    hero.addEventListener("focusout", restartAutoplay);
    document.addEventListener("visibilitychange", () => {
      document.hidden ? stopAutoplay() : restartAutoplay();
    });

    window.addEventListener("resize", layout);

    // Start on the product passed via ?producto= if present, else index 0
    const params = new URLSearchParams(window.location.search);
    const wanted = params.get("producto");
    const startIndex = wanted ? items.findIndex((p) => p.slug === wanted) : 0;
    setActive(startIndex >= 0 ? startIndex : 0, false);
    restartAutoplay();
  }

  /* ---------------- Catálogo con filtros ---------------- */
  function initCatalog() {
    const grid = document.querySelector("[data-catalog-grid]");
    const chips = document.querySelectorAll("[data-filter-chip]");
    if (!grid || typeof MACLAR_PRODUCTS === "undefined") return;

    function render(filter) {
      grid.innerHTML = "";
      MACLAR_CATEGORIES.forEach((cat) => {
        if (filter !== "todos" && filter !== cat.slug) return;
        const products = maclarProductsByCategory(cat.slug);
        if (products.length === 0) {
          const card = document.createElement("div");
          card.className = "cat-info-card";
          card.innerHTML = `
            <span class="product-category-tag">${cat.name}</span>
            <h3>${cat.name}</h3>
            <p>${cat.tagline} Sin fotografías verificadas propias por el momento: te compartimos la información documentada por el fabricante.</p>
            <a class="btn btn-ghost btn-sm" href="index.html?producto=&categoria=${cat.slug}#contacto">Consultar sobre esta línea</a>`;
          grid.appendChild(card);
          return;
        }
        products.forEach((product) => {
          const a = document.createElement("a");
          a.href = maclarProductUrl(product);
          a.className = "product-card";
          a.innerHTML = `
            <div class="product-card__media">
              <span class="product-card__cat">${cat.name}</span>
              <img src="${maclarCardImagePath(product)}" alt="${product.images[0].alt}" loading="lazy" decoding="async" width="640" height="900">
            </div>
            <div class="product-card__body">
              <h3>${product.name}</h3>
              <p>${product.tagline}</p>
              <span class="product-card__link">Ver ficha
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </span>
            </div>`;
          grid.appendChild(a);
        });
      });
    }

    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        chips.forEach((c) => c.setAttribute("aria-pressed", "false"));
        chip.setAttribute("aria-pressed", "true");
        render(chip.getAttribute("data-filter-chip"));
      });
    });

    render("todos");
  }

  /* ---------------- Formulario de contacto ---------------- */
  function initContactForm() {
    const form = document.querySelector("[data-contact-form]");
    if (!form) return;
    const select = form.querySelector("#producto-interes");
    const status = form.querySelector("[data-form-status]");
    const chip = document.querySelector("[data-contact-chip]");

    if (select && typeof MACLAR_PRODUCTS !== "undefined") {
      MACLAR_PRODUCTS.forEach((p) => {
        const opt = document.createElement("option");
        opt.value = p.slug;
        opt.textContent = p.name;
        select.appendChild(opt);
      });
      MACLAR_CATEGORIES.forEach((c) => {
        const opt = document.createElement("option");
        opt.value = "categoria:" + c.slug;
        opt.textContent = c.name + " (línea general)";
        select.appendChild(opt);
      });

      const params = new URLSearchParams(window.location.search);
      const wanted = params.get("producto");
      const wantedCat = params.get("categoria");
      if (wanted) {
        select.value = wanted;
        const product = maclarGetProduct(wanted);
        if (chip && product) {
          chip.hidden = false;
          chip.textContent = "Consultando por: " + product.name;
        }
      } else if (wantedCat) {
        select.value = "categoria:" + wantedCat;
      }
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const nombre = (data.get("nombre") || "").toString().trim();
      const correo = (data.get("correo") || "").toString().trim();
      const consulta = (data.get("consulta") || "").toString().trim();
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

      if (!nombre || !emailOk || !consulta) {
        status.className = "form-status form-status--err";
        status.setAttribute("data-show", "true");
        status.textContent = "Completá al menos nombre, un correo válido y tu consulta antes de continuar.";
        return;
      }

      const subject = encodeURIComponent("Consulta desde maclar.com.ar — " + nombre);
      const bodyLines = [
        `Nombre: ${nombre}`,
        `Empresa: ${data.get("empresa") || "-"}`,
        `Correo: ${correo}`,
        `Teléfono: ${data.get("telefono") || "-"}`,
        `Producto de interés: ${select ? select.options[select.selectedIndex].text : "-"}`,
        "",
        "Consulta:",
        consulta
      ];
      const body = encodeURIComponent(bodyLines.join("\n"));
      const mailto = `mailto:maclar@sion.com?subject=${subject}&body=${body}`;

      status.className = "form-status form-status--ok";
      status.setAttribute("data-show", "true");
      status.textContent =
        "Este formulario no envía la consulta automáticamente. Se abrirá tu cliente de correo con los datos completados para que la envíes vos mismo a MACLAR.";
      window.location.href = mailto;
    });
  }

  /* ---------------- Ficha de producto: galería + anatomía ---------------- */
  function initProductGallery() {
    const wrap = document.querySelector("[data-gallery]");
    if (!wrap) return;
    const mainImgs = Array.from(wrap.querySelectorAll("[data-gallery-main] img"));
    const caption = wrap.querySelector("[data-gallery-caption]");
    const thumbs = Array.from(wrap.querySelectorAll("[data-gallery-thumb]"));

    function show(i) {
      mainImgs.forEach((img, idx) => img.setAttribute("data-shown", String(idx === i)));
      thumbs.forEach((t, idx) => t.setAttribute("aria-current", String(idx === i)));
      if (caption && mainImgs[i]) caption.textContent = mainImgs[i].getAttribute("data-caption") || "";
    }
    thumbs.forEach((t, i) => t.addEventListener("click", () => show(i)));
    show(0);
  }

  function initAnatomyBlock(block) {
    const points = Array.from(block.querySelectorAll("[data-anatomy-point]"));
    const listItems = Array.from(block.querySelectorAll("[data-anatomy-item]"));
    function activate(i) {
      points.forEach((p) => p.setAttribute("data-active", String(Number(p.getAttribute("data-anatomy-point")) === i)));
      listItems.forEach((li) => li.setAttribute("data-active", String(Number(li.getAttribute("data-anatomy-item")) === i)));
    }
    points.forEach((p) => {
      const i = Number(p.getAttribute("data-anatomy-point"));
      p.addEventListener("click", () => activate(i));
      p.addEventListener("mouseenter", () => activate(i));
    });
    listItems.forEach((li) => {
      const i = Number(li.getAttribute("data-anatomy-item"));
      li.addEventListener("click", () => activate(i));
      li.addEventListener("mouseenter", () => activate(i));
    });
  }
  function initAnatomy() {
    document.querySelectorAll("[data-anatomy]").forEach(initAnatomyBlock);
  }

  /* ---------------- Anatomía homepage: selector de producto ---------------- */
  function initAnatomySwitcher() {
    const switcher = document.querySelector("[data-anatomy-switcher]");
    if (!switcher || typeof MACLAR_PRODUCTS === "undefined") return;
    const tabsWrap = switcher.querySelector("[data-anatomy-tabs]");
    const panelsWrap = switcher.querySelector("[data-anatomy-panels]");
    if (!tabsWrap || !panelsWrap) return;

    MACLAR_PRODUCTS.forEach((product, i) => {
      const tab = document.createElement("button");
      tab.className = "filter-chip";
      tab.type = "button";
      tab.setAttribute("aria-pressed", String(i === 0));
      tab.textContent = product.shortName;
      tab.addEventListener("click", () => {
        tabsWrap.querySelectorAll(".filter-chip").forEach((c) => c.setAttribute("aria-pressed", "false"));
        tab.setAttribute("aria-pressed", "true");
        panelsWrap.querySelectorAll("[data-anatomy]").forEach((p, pi) => (p.hidden = pi !== i));
      });
      tabsWrap.appendChild(tab);

      const panel = document.createElement("div");
      panel.setAttribute("data-anatomy", "");
      panel.hidden = i !== 0;
      const pointsHtml = product.anatomy
        .map(
          (pt, pi) => `<button type="button" class="anatomy-point" data-anatomy-point="${pi}" data-active="${pi === 0}" style="left:${pt.x}%; top:${pt.y}%;" aria-label="${pt.title}">${pi + 1}</button>`
        )
        .join("");
      const listHtml = product.anatomy
        .map(
          (pt, pi) => `<button type="button" class="anatomy-list-item" data-anatomy-item="${pi}" data-active="${pi === 0}">
              <span class="anatomy-list-item__num">${pi + 1}</span>
              <span><h4>${pt.title}</h4><p>${pt.text}</p></span>
            </button>`
        )
        .join("");
      panel.innerHTML = `
        <div class="anatomy-grid">
          <div class="anatomy-figure">
            <div class="anatomy-figure__frame">
              <img src="${maclarImagePath(product, "frontal.jpg")}" alt="${product.images[0].alt}" loading="${i === 0 ? "eager" : "lazy"}" decoding="async">
            </div>
            ${pointsHtml}
          </div>
          <div>
            <p class="hero__info-cat" style="color:rgba(255,255,255,.5)">${product.name}</p>
            <div class="anatomy-list">${listHtml}</div>
            <p class="anatomy-note">Componentes identificados sobre la fotografía real del producto. Ilustración explicativa, no un plano de fabricación.</p>
          </div>
        </div>`;
      panelsWrap.appendChild(panel);
      initAnatomyBlock(panel);
    });
  }

  /* ---------------- Página de producto individual ---------------- */
  function initProductPage() {
    const root = document.querySelector("[data-product-page]");
    if (!root || typeof MACLAR_PRODUCTS === "undefined") return;
    const slug = root.getAttribute("data-product-page");
    const product = maclarGetProduct(slug);
    if (!product) return;
    const category = maclarGetCategory(product.category);

    document.title = `${product.name} — MACLAR`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", product.tagline + " — " + product.description.slice(0, 120) + "…");

    root.querySelector("[data-p-breadcrumb]").innerHTML = `
      <a href="../index.html">Inicio</a><span aria-hidden="true">/</span>
      <a href="../index.html#catalogo">Productos</a><span aria-hidden="true">/</span>
      <span>${product.name}</span>`;

    root.querySelector("[data-p-category]").textContent = category ? category.name : "";
    root.querySelector("[data-p-title]").textContent = product.name;
    root.querySelector("[data-p-tagline]").textContent = product.tagline;
    root.querySelector("[data-p-description]").textContent = product.description;
    root.querySelector("[data-p-applications]").textContent = product.applications;

    const mainWrap = root.querySelector("[data-gallery-main]");
    const thumbWrap = root.querySelector("[data-gallery-thumbs]");
    product.images.forEach((img, i) => {
      const el = document.createElement("img");
      el.src = maclarImagePath(product, img.file);
      el.alt = img.alt;
      el.setAttribute("data-caption", img.caption);
      el.setAttribute("data-shown", String(i === 0));
      el.loading = i === 0 ? "eager" : "lazy";
      el.decoding = "async";
      mainWrap.appendChild(el);

      const thumbBtn = document.createElement("button");
      thumbBtn.className = "gallery__thumb";
      thumbBtn.type = "button";
      thumbBtn.setAttribute("data-gallery-thumb", "");
      thumbBtn.setAttribute("aria-current", String(i === 0));
      thumbBtn.setAttribute("aria-label", img.caption);
      const thumbImg = document.createElement("img");
      thumbImg.src = maclarImagePath(product, img.file);
      thumbImg.alt = "";
      thumbImg.loading = "lazy";
      thumbBtn.appendChild(thumbImg);
      thumbWrap.appendChild(thumbBtn);
    });

    const specsTable = root.querySelector("[data-p-specs]");
    product.specsVerified.forEach((s) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${s.label}</td><td>${s.value}</td>`;
      specsTable.appendChild(tr);
    });
    root.querySelector("[data-p-specs-note]").textContent = product.specsNote;

    const consultLinks = root.querySelectorAll("[data-p-consult]");
    consultLinks.forEach((a) => (a.href = `../index.html?producto=${product.slug}#contacto`));

    const anatomyPanel = root.querySelector("[data-anatomy]");
    if (anatomyPanel) {
      const pointsHtml = product.anatomy
        .map((pt, pi) => `<button type="button" class="anatomy-point" data-anatomy-point="${pi}" data-active="${pi === 0}" style="left:${pt.x}%; top:${pt.y}%;" aria-label="${pt.title}">${pi + 1}</button>`)
        .join("");
      const listHtml = product.anatomy
        .map(
          (pt, pi) => `<button type="button" class="anatomy-list-item" data-anatomy-item="${pi}" data-active="${pi === 0}">
            <span class="anatomy-list-item__num">${pi + 1}</span>
            <span><h4>${pt.title}</h4><p>${pt.text}</p></span>
          </button>`
        )
        .join("");
      anatomyPanel.querySelector("[data-anatomy-figure-img]").src = maclarImagePath(product, "frontal.jpg");
      anatomyPanel.querySelector("[data-anatomy-figure-img]").alt = product.images[0].alt;
      anatomyPanel.querySelector("[data-anatomy-points]").innerHTML = pointsHtml;
      anatomyPanel.querySelector("[data-anatomy-list]").innerHTML = listHtml;
      initAnatomyBlock(anatomyPanel);
    }

    const relatedWrap = root.querySelector("[data-p-related]");
    if (relatedWrap) {
      const related = MACLAR_PRODUCTS.filter((p) => p.category === product.category && p.slug !== product.slug);
      const pool = related.length ? related : MACLAR_PRODUCTS.filter((p) => p.slug !== product.slug);
      pool.slice(0, 3).forEach((p) => {
        const a = document.createElement("a");
        a.href = `${p.slug}.html`;
        a.className = "product-card";
        a.innerHTML = `
          <div class="product-card__media">
            <img src="${maclarCardImagePath(p)}" alt="${p.images[0].alt}" loading="lazy" decoding="async" width="640" height="900">
          </div>
          <div class="product-card__body">
            <h3>${p.name}</h3>
            <p>${p.tagline}</p>
          </div>`;
        relatedWrap.appendChild(a);
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    initHero();
    initCatalog();
    initContactForm();
    initProductGallery();
    initAnatomy();
    initAnatomySwitcher();
    initProductPage();
  });
})();
