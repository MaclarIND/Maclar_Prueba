/* MACLAR — interacciones del sitio */
(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Video cinematográfico ---------------- */
  const cinematicVideo = document.querySelector("[data-cinematic-video]");
  if (cinematicVideo) {
    if (prefersReducedMotion) {
      cinematicVideo.removeAttribute("autoplay");
      cinematicVideo.pause();
    }
    cinematicVideo.addEventListener("error", () => {
      cinematicVideo.closest(".cinematic")?.classList.add("cinematic--no-video");
    });
  }

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
  // Se llama al final de DOMContentLoaded (ver abajo), después de que todas
  // las grillas dinámicas (catálogo, repuestos, relacionados) ya tienen sus
  // tarjetas reales. Si se observa un contenedor todavía vacío, su altura es
  // 0 y el IntersectionObserver nunca lo marca como intersectando — quedaba
  // en opacity:0 para siempre hasta que algún mutation/reflow posterior
  // (por ej. tocar un filtro) forzaba un recálculo.
  function initReveal() {
    const revealEls = document.querySelectorAll("[data-reveal]");
    if (!revealEls.length) return;
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.setAttribute("data-revealed", "true"));
    } else {
      // threshold bajo (no 0.12 de área) a propósito: un contenedor muy alto
      // (p. ej. la grilla de 127 repuestos) casi nunca llega a cubrir el 12%
      // de SU PROPIA área total con el viewport, así que ese umbral no se
      // cumplía nunca en la carga inicial — recién disparaba cuando un
      // filtro reducía la cantidad de tarjetas y por lo tanto la altura.
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.setAttribute("data-revealed", "true");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0, rootMargin: "0px 0px -40px 0px" }
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
              <a class="btn btn-light btn-sm" href="${maclarRoot()}index.html?producto=${product.slug}#contacto">Cotizar</a>
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
            <a class="btn btn-ghost btn-sm" href="index.html?producto=&categoria=${cat.slug}#contacto">Solicitar cotización</a>`;
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

    // Envío automático por email: usa FormSubmit (https://formsubmit.co), un
    // servicio que reenvía por correo lo que se le postea por AJAX, sin
    // necesidad de backend propio. IMPORTANTE: la primera vez que llegue una
    // consulta, FormSubmit manda un correo de activación a la casilla de
    // destino pidiendo confirmar el buzón — hasta que no se confirme ese
    // enlace, los envíos no llegan.
    const FORMSUBMIT_ENDPOINT = "https://formsubmit.co/ajax/natywolf@mac.com";

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

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      status.className = "form-status";
      status.setAttribute("data-show", "true");
      status.textContent = "Enviando consulta…";

      const payload = {
        _subject: "Nueva consulta desde maclar.com.ar — " + nombre,
        _template: "table",
        _captcha: "false",
        Nombre: nombre,
        Empresa: (data.get("empresa") || "-").toString().trim() || "-",
        Correo: correo,
        "Teléfono": (data.get("telefono") || "-").toString().trim() || "-",
        "Producto de interés": select ? select.options[select.selectedIndex].text : "-",
        Consulta: consulta
      };

      const reqTimeout = new AbortController();
      const reqTimeoutId = setTimeout(() => reqTimeout.abort(), 10000);

      fetch(FORMSUBMIT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
        signal: reqTimeout.signal
      })
        .then((res) => (res.ok ? res.json() : Promise.reject(new Error("HTTP " + res.status))))
        .then(() => {
          status.className = "form-status form-status--ok";
          status.textContent = "¡Listo! Tu consulta fue enviada. Te vamos a contactar a la brevedad.";
          form.reset();
        })
        .catch(() => {
          status.className = "form-status form-status--err";
          status.textContent =
            "No pudimos enviar la consulta automáticamente. Escribinos directamente a Maclarsrl@gmail.com o volvé a intentarlo en unos minutos.";
        })
        .finally(() => {
          clearTimeout(reqTimeoutId);
          if (submitBtn) submitBtn.disabled = false;
        });
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
              <img src="${maclarImagePath(product, "frontal.png")}" alt="${product.images[0].alt}" loading="${i === 0 ? "eager" : "lazy"}" decoding="async">
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

  /* ---------------- Visor 3D del producto ---------------- */
  function initProduct3DViewer(root, product) {
    const photosTab = root.querySelector('[data-gallery-tab="photos"]');
    const threeDTab = root.querySelector("[data-3d-tab]");
    const photosView = root.querySelector('[data-gallery-view="photos"]');
    const threeDView = root.querySelector('[data-gallery-view="3d"]');
    const frame = root.querySelector("[data-3d-frame]");
    const viewer = root.querySelector("[data-model-viewer]");
    if (!photosTab || !threeDTab || !photosView || !threeDView || !frame || !viewer) return;
    if (typeof customElements === "undefined" || !customElements.get) return;

    function showView(name) {
      photosView.hidden = name !== "photos";
      threeDView.hidden = name !== "3d";
      photosTab.setAttribute("aria-pressed", String(name === "photos"));
      threeDTab.setAttribute("aria-pressed", String(name === "3d"));
    }
    photosTab.addEventListener("click", () => showView("photos"));

    const src = maclarModel3dPath(product);
    viewer.setAttribute("alt", `Vista 3D aproximada — ${product.name}`);

    // <model-viewer> no arranca a cargar el modelo mientras su contenedor
    // está oculto (display:none no le da layout), así que no podemos
    // esperar su propio evento "load" para decidir si mostrar la pestaña.
    // Primero confirmamos con un fetch liviano que el .glb existe; recién
    // ahí revelamos la pestaña, y el <model-viewer> recibe su src cuando
    // el usuario efectivamente la abre (momento en que ya es visible).
    let modelRequested = false;
    threeDTab.addEventListener("click", () => {
      showView("3d");
      if (!modelRequested) {
        modelRequested = true;
        viewer.setAttribute("src", src);
      }
    });
    viewer.addEventListener("load", () => {
      frame.setAttribute("data-loading", "false");
    });
    viewer.addEventListener("error", () => {
      threeDTab.hidden = true;
      if (threeDTab.getAttribute("aria-pressed") === "true") showView("photos");
    });

    fetch(src, { method: "HEAD" })
      .then((res) => {
        if (res.ok) threeDTab.hidden = false;
      })
      .catch(() => {});
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
    // Gallery DOM (images/thumbs) is built dynamically above, after
    // initProductGallery() already ran on page load — wire it up now
    // that the elements it needs actually exist.
    initProductGallery();
    initProduct3DViewer(root, product);

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
      anatomyPanel.querySelector("[data-anatomy-figure-img]").src = maclarImagePath(product, "frontal.png");
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

  /* ---------------- Repuestos ---------------- */
  const REPUESTO_ICON = `<svg class="repuesto-card__icon" width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M14.7 6.3a1 1 0 0 0-1.4 0l-1.3 1.3-1-1a3 3 0 0 0-4.2 0L4.6 8.8a3 3 0 0 0 0 4.2l1 1-1.3 1.3a1 1 0 1 0 1.4 1.4l1.3-1.3 1 1a3 3 0 0 0 4.2 0l2.2-2.2a3 3 0 0 0 0-4.2l-1-1 1.3-1.3a1 1 0 0 0 0-1.4Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
  </svg>`;

  function initRepuestos() {
    const grid = document.querySelector("[data-repuestos-grid]");
    if (!grid || typeof MACLAR_REPUESTOS === "undefined") return;

    const searchInput = document.querySelector("[data-repuestos-search]");
    const filtersWrap = document.querySelector("[data-repuestos-filters]");
    const countEl = document.querySelector("[data-repuestos-count]");
    const emptyEl = document.querySelector("[data-repuestos-empty]");
    const syncNote = document.querySelector("[data-repuestos-sync-note]");

    let items = MACLAR_REPUESTOS;
    let activeCat = "todos";
    let query = "";

    MACLAR_REPUESTOS_CATEGORIES.forEach((cat) => {
      const chip = document.createElement("button");
      chip.className = "filter-chip";
      chip.type = "button";
      chip.setAttribute("data-filter-chip", cat.slug);
      chip.setAttribute("aria-pressed", "false");
      chip.textContent = cat.name;
      filtersWrap.appendChild(chip);
    });

    function render() {
      const q = query.trim().toLowerCase();
      const filtered = items.filter((it) => {
        if (activeCat !== "todos" && it.cat !== activeCat) return false;
        if (q && !it.name.toLowerCase().includes(q)) return false;
        return true;
      });

      grid.innerHTML = "";
      filtered.forEach((it) => {
        const card = document.createElement("article");
        card.className = "repuesto-card";
        const imgPath = maclarRepuestoImagePath(it);
        card.innerHTML = `
          <div class="repuesto-card__media">${imgPath ? `<img src="${imgPath}" alt="${it.name}" loading="lazy" decoding="async">` : REPUESTO_ICON}</div>
          <span class="repuesto-card__cat">${it.catLabel}</span>
          <h3 class="repuesto-card__name">${it.name}</h3>
          <span class="repuesto-card__price">${maclarFormatUsd(it.price)}</span>`;
        grid.appendChild(card);
      });

      if (countEl) countEl.textContent = `${filtered.length} de ${items.length} repuestos`;
      if (emptyEl) emptyEl.hidden = filtered.length !== 0;
    }

    document.querySelectorAll("[data-repuestos-filters] [data-filter-chip]").forEach((chip) => {
      chip.addEventListener("click", () => {
        document.querySelectorAll("[data-repuestos-filters] [data-filter-chip]").forEach((c) => c.setAttribute("aria-pressed", "false"));
        chip.setAttribute("aria-pressed", "true");
        activeCat = chip.getAttribute("data-filter-chip");
        render();
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", () => {
        query = searchInput.value;
        render();
      });
    }

    render();

    // Sincronización de precios: si MACLAR_REPUESTOS_CSV_URL está configurada
    // (ver js/repuestos.js), se intenta traer precios actualizados desde una
    // planilla de Google Sheets publicada como CSV. Si falla por cualquier
    // motivo (sin conexión, link no configurado, CORS) se deja la planilla
    // importada como está, sin romper nada.
    if (typeof MACLAR_REPUESTOS_CSV_URL === "string" && MACLAR_REPUESTOS_CSV_URL.trim()) {
      const csvTimeout = new AbortController();
      const csvTimeoutId = setTimeout(() => csvTimeout.abort(), 6000);
      // Google cachea agresivamente el CSV publicado; se agrega un parámetro
      // único por carga y se pide al navegador no usar su propia caché, para
      // no mostrar precios viejos aunque la planilla ya se haya actualizado.
      const csvUrl = MACLAR_REPUESTOS_CSV_URL + (MACLAR_REPUESTOS_CSV_URL.includes("?") ? "&" : "?") + "_=" + Date.now();
      fetch(csvUrl, { signal: csvTimeout.signal, cache: "no-store" })
        .then((res) => (res.ok ? res.text() : Promise.reject(new Error("HTTP " + res.status))))
        .then((csvText) => {
          const rows = csvText.trim().split("\n").map((line) => line.split(",").map((c) => c.replace(/^"|"$/g, "").trim()));
          const headerRow = (rows[0] || []).map((h) => h.toLowerCase());
          let nameIdx = headerRow.findIndex((h) => h.includes("nombre") || h.includes("name"));
          let priceIdx = headerRow.findIndex((h) => h.includes("precio") || h.includes("price"));
          if (nameIdx !== -1 && priceIdx !== -1) {
            // encabezados reconocidos: se descarta esa fila, el resto son datos
            rows.shift();
          } else {
            // sin encabezados con esas palabras (p. ej. la planilla arranca
            // directo con datos, o la primera fila es un título de categoría):
            // se asume la columna A = nombre y la última columna = precio,
            // que es como está armada la planilla de repuestos.
            nameIdx = 0;
            priceIdx = (rows[0] || []).length - 1;
          }

          const byName = new Map(items.map((it) => [it.name.toLowerCase(), it]));
          let updated = 0;
          let matched = 0;
          rows.forEach((cols) => {
            const name = (cols[nameIdx] || "").toLowerCase();
            const price = parseFloat((cols[priceIdx] || "").replace(",", "."));
            const match = byName.get(name);
            if (match && !isNaN(price)) {
              matched++;
              if (match.price !== price) {
                match.price = price;
                updated++;
              }
            }
          });
          if (syncNote) {
            if (matched === 0) {
              syncNote.textContent = `Leí la planilla (${rows.length} filas) pero ningún nombre coincidió con el catálogo. Revisá que el nombre en la planilla sea igual al del sitio.`;
            } else {
              syncNote.textContent = `Planilla sincronizada: ${matched} repuestos encontrados, ${updated} con precio distinto al importado — ${new Date().toLocaleString("es-AR")}.`;
            }
          }
          render();
        })
        .catch((err) => {
          if (syncNote) {
            syncNote.textContent = err && err.name === "AbortError"
              ? "La planilla tardó demasiado en responder; se muestran los precios importados."
              : "No se pudo conectar con la planilla publicada; se muestran los precios importados.";
          }
        })
        .finally(() => clearTimeout(csvTimeoutId));
    }
  }

  /* ---------------- Productos extra (controles y accesorios) ---------------- */
  function initProductosExtra() {
    const grid = document.querySelector("[data-extra-grid]");
    if (!grid || typeof MACLAR_PRODUCTOS_EXTRA === "undefined") return;

    const searchInput = document.querySelector("[data-extra-search]");
    const filtersWrap = document.querySelector("[data-extra-filters]");
    const countEl = document.querySelector("[data-extra-count]");
    const emptyEl = document.querySelector("[data-extra-empty]");

    const items = MACLAR_PRODUCTOS_EXTRA;
    let activeCat = "todos";
    let query = "";

    MACLAR_EXTRA_CATEGORIES.forEach((cat) => {
      const chip = document.createElement("button");
      chip.className = "filter-chip";
      chip.type = "button";
      chip.setAttribute("data-filter-chip", cat.id);
      chip.setAttribute("aria-pressed", "false");
      chip.textContent = cat.label;
      filtersWrap.appendChild(chip);
    });

    function render() {
      const q = query.trim().toLowerCase();
      const filtered = items.filter((it) => {
        if (activeCat !== "todos" && it.cat !== activeCat) return false;
        if (q && !it.name.toLowerCase().includes(q)) return false;
        return true;
      });

      grid.innerHTML = "";
      filtered.forEach((it) => {
        const card = document.createElement("article");
        card.className = "repuesto-card";
        const imgPath = maclarExtraImagePath(it);
        const catText = it.group ? `${it.catLabel} · ${it.group}` : it.catLabel;
        card.innerHTML = `
          <div class="repuesto-card__media">${imgPath ? `<img src="${imgPath}" alt="${it.name}" loading="lazy" decoding="async">` : REPUESTO_ICON}</div>
          <span class="repuesto-card__cat">${catText}</span>
          <h3 class="repuesto-card__name">${it.name}</h3>`;
        grid.appendChild(card);
      });

      if (countEl) countEl.textContent = `${filtered.length} de ${items.length} productos`;
      if (emptyEl) emptyEl.hidden = filtered.length !== 0;
    }

    document.querySelectorAll("[data-extra-filters] [data-filter-chip]").forEach((chip) => {
      chip.addEventListener("click", () => {
        document.querySelectorAll("[data-extra-filters] [data-filter-chip]").forEach((c) => c.setAttribute("aria-pressed", "false"));
        chip.setAttribute("aria-pressed", "true");
        activeCat = chip.getAttribute("data-filter-chip");
        render();
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", () => {
        query = searchInput.value;
        render();
      });
    }

    render();
  }

  document.addEventListener("DOMContentLoaded", () => {
    initHero();
    initCatalog();
    initContactForm();
    initProductGallery();
    initAnatomy();
    initAnatomySwitcher();
    initProductPage();
    initRepuestos();
    initProductosExtra();
    initReveal();
  });
})();
