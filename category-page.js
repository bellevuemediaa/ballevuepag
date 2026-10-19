import { caseStudies } from "./data/case-studies.js?v=fullride-20261015";
import { setupLanguage } from "./i18n.js?v=fullride-20261015";
import { playerMetrics, playerProfiles, playerServices, playerWorkLinks } from "./data/section-content.js?v=video-titles-20260928";

const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
root.classList.remove("motion-reduced");
root.classList.add("motion-full");

function setupCursorAura() {
  const aura = document.querySelector("[data-cursor-aura]");
  if (!aura || !window.matchMedia("(pointer: fine)").matches) return;

  document.addEventListener("pointermove", (event) => {
    aura.style.setProperty("--cursor-x", `${event.clientX}px`);
    aura.style.setProperty("--cursor-y", `${event.clientY}px`);
    aura.classList.add("is-active");
  }, { passive: true });

  document.addEventListener("mouseout", (event) => {
    if (!event.relatedTarget) aura.classList.remove("is-active");
  });
  window.addEventListener("blur", () => aura.classList.remove("is-active"));
}

function setupMenu() {
  const button = document.querySelector(".nav__menu");
  const menu = document.querySelector(".mobile-menu");
  const setOpen = (open) => {
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.setAttribute("aria-hidden", String(!open));
    menu.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
  };
  button.addEventListener("click", () => setOpen(button.getAttribute("aria-expanded") !== "true"));
  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setOpen(false)));
  window.addEventListener("keydown", (event) => { if (event.key === "Escape") setOpen(false); });
}

function setupNavScroll() {
  const nav = document.querySelector("[data-nav]");
  const update = () => nav.classList.toggle("is-scrolled", window.scrollY > 48);
  window.addEventListener("scroll", update, { passive: true });
  update();
}

function escape(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  }[character]));
}

function renderCaseStudies() {
  const category = document.body.dataset.category;
  const target = document.querySelector("[data-case-studies]");
  const count = document.querySelector("[data-case-study-count]");
  const studies = caseStudies[category] || [];
  count.textContent = String(studies.length).padStart(2, "0");
  if (category === "clubs" && studies.length) {
    target.innerHTML = `
      <div class="club-features">
        ${studies.map((study, index) => `
          <section class="club-feature" id="${escape(study.id)}" aria-labelledby="${escape(study.id)}-title">
            <div class="club-feature__copy">
              <span class="eyebrow">${String(index + 1).padStart(2, "0")} / Club</span>
              <h2 id="${escape(study.id)}-title"><button class="club-feature__title-button" type="button" data-club-toggle="${index}" aria-controls="${escape(study.id)}-details" aria-expanded="false">${escape(study.title)} <span aria-hidden="true">↗</span></button></h2>
              ${study.context ? `<p>${escape(study.context)}</p>` : ""}
            </div>
            <button class="club-feature__image" type="button" data-club-toggle="${index}" aria-controls="${escape(study.id)}-details" aria-expanded="false" aria-label="Explore project: ${escape(study.title)}">
              <img src="${escape(study.image)}" alt="${escape(study.title)}" width="${study.width}" height="${study.height}" loading="lazy" decoding="async" />
              <span>Explore project ↗</span>
            </button>
            <div class="club-feature__details" id="${escape(study.id)}-details" hidden>
              <div class="club-feature__overview"><span class="eyebrow">Project overview</span><p>${escape(study.summary)}</p></div>
              <div class="club-feature__gallery" aria-label="Selected graphics">
                <div class="club-feature__gallery-head"><span class="eyebrow">Selected graphics</span><span>${study.galleryCount} <span>images</span></span></div>
                <div class="club-feature__gallery-grid" data-gallery-count="${study.galleryCount}">
                  ${Array.from({ length: study.galleryCount }, (_, imageIndex) => {
                    const number = String(imageIndex + 1).padStart(3, "0");
                    const label = study.galleryLabels[imageIndex];
                    const preserveArtwork = (study.id === "sao-joao-de-ver" && imageIndex >= 15)
                      || (study.id === "delta" && imageIndex >= 8);
                    const imageSrc = `${escape(study.galleryPrefix)}${number}${preserveArtwork ? "" : "-thumb"}.webp`;
                    return `<button class="club-feature__gallery-item${preserveArtwork ? " club-feature__gallery-item--uncropped" : ""}" type="button" data-club-gallery-index="${index}" data-club-photo-index="${imageIndex}">
                      ${preserveArtwork ? `<img class="club-feature__gallery-backdrop" src="${imageSrc}" alt="" loading="lazy" decoding="async" aria-hidden="true" />` : ""}
                      <img${preserveArtwork ? ' class="club-feature__gallery-artwork"' : ""} src="${imageSrc}" alt="" loading="lazy" decoding="async" />
                      <span class="club-feature__gallery-number">${String(imageIndex + 1).padStart(2, "0")}</span>
                      <span class="club-feature__gallery-caption">${escape(label)}</span>
                    </button>`;
                  }).join("")}
                </div>
              </div>
            </div>
          </section>`).join("")}
      </div>
      <dialog class="club-lightbox" aria-label="Club image">
        <button class="club-lightbox__close" type="button" aria-label="Close image">×</button>
        <img alt="" />
        <p><span data-club-lightbox-meta></span><small data-club-lightbox-label></small></p>
      </dialog>`;
    return;
  }
  if (category === "companies" && studies.length) {
    target.innerHTML = `
      <nav class="category-anchor-nav" aria-label="Company sections">
        ${studies.map((study, index) => `<a href="#${escape(study.id)}"><span>${String(index + 1).padStart(2, "0")}</span>${escape(study.title)} <i aria-hidden="true">↘</i></a>`).join("")}
      </nav>
      <div class="company-features">
        ${studies.map((study, index) => `
          <section class="company-feature${study.gallery ? " company-feature--featured" : ""}" id="${escape(study.id)}" data-company-index="${index}" aria-labelledby="${escape(study.id)}-title">
            <span class="eyebrow">${String(index + 1).padStart(2, "0")} / Company</span>
            <h2 id="${escape(study.id)}-title">${study.gallery ? `<button class="company-feature__title-button" type="button" data-company-toggle="${index}" aria-controls="${escape(study.id)}-details" aria-expanded="false">${escape(study.title)} <span aria-hidden="true">↗</span></button>` : escape(study.title)}</h2>
            ${study.gallery ? `
              <button class="company-feature__preview" type="button" data-company-toggle="${index}" aria-controls="${escape(study.id)}-details" aria-expanded="false">
                <img src="${escape(study.gallery[0].src)}" alt="${escape(study.title)} — ${escape(study.gallery[0].label)}" width="${study.gallery[0].width || 1080}" height="${study.gallery[0].height || 1350}" loading="lazy" decoding="async" />
                <span>Explore project ↗</span>
              </button>
              <div class="company-feature__details" id="${escape(study.id)}-details" hidden>
                <div class="company-feature__overview">
                  <div><span class="eyebrow">Project overview</span><p>${escape(study.summary)}</p></div>
                  <ul>${study.services.map((service) => `<li>${escape(service)}</li>`).join("")}</ul>
                </div>
                <div class="company-feature__gallery-head"><span class="eyebrow">Selected graphics</span><span>${study.gallery.length} <span>images</span></span></div>
                <div class="company-feature__gallery" aria-label="${escape(study.title)} selected graphics">
                  ${study.gallery.map((item, imageIndex) => `
                    <button class="company-feature__artwork" type="button" data-company-gallery-index="${index}" data-company-photo="${imageIndex}" aria-label="View image: ${escape(item.label)}">
                      <span class="company-feature__media">
                        ${item.height === 1920 ? `<img class="company-feature__media-backdrop" src="${escape(item.src)}" alt="" loading="lazy" decoding="async" aria-hidden="true" />` : ""}
                        <img class="company-feature__media-artwork" src="${escape(item.src)}" alt="${escape(study.title)} — ${escape(item.label)}" width="${item.width || 1080}" height="${item.height || 1350}" loading="lazy" decoding="async" />
                      </span>
                      <span class="company-feature__caption"><b>${String(imageIndex + 1).padStart(2, "0")}</b>${escape(item.label)} <i aria-hidden="true">↗</i></span>
                    </button>`).join("")}
                </div>
              </div>` : `<p>Project materials coming soon.</p>`}
          </section>`).join("")}
      </div>
      <dialog class="club-lightbox company-lightbox" aria-label="Company image">
        <button class="club-lightbox__close" type="button" aria-label="Close image">×</button>
        <img alt="" />
        <p><span data-company-lightbox-meta></span><small data-company-lightbox-label></small></p>
      </dialog>`;
    return;
  }
  target.innerHTML = studies.length
    ? studies.map((study, index) => study.type === "gallery" ? `
      <section class="case-study-gallery" id="matchday-gallery" aria-labelledby="pre-match-title">
        <div class="case-study-gallery__head">
          <span>${String(category === "footballers" ? playerProfiles.length + index + 1 : index + 1).padStart(2, "0")}</span>
          <h2 id="pre-match-title">${escape(study.title)}</h2>
        </div>
        <div class="photo-slider" data-photo-slider data-image-prefix="${escape(study.imagePrefix)}" data-image-count="${study.imageCount}" role="region" aria-label="Pre-match photos" aria-keyshortcuts="Space ArrowLeft ArrowRight" tabindex="0">
          <div class="photo-slider__frame" data-photo-frame>
            <div class="photo-slider__track" data-photo-track>
              ${[0, 1, 2, 3].map((offset) => `<img src="${escape(study.imagePrefix)}${String(offset + 1).padStart(3, "0")}.webp" alt="Pre-match photo ${offset + 1} of ${study.imageCount}" width="1000" height="1778" decoding="async" data-photo-image />`).join("")}
            </div>
          </div>
          <div class="photo-slider__controls">
            <span class="photo-slider__position" aria-live="off"><span data-photo-current>01</span> / ${String(study.imageCount).padStart(2, "0")}</span>
            <div class="photo-slider__actions">
              <button type="button" data-photo-prev aria-label="Previous photo">←</button>
              <label for="pre-match-photo-select" data-photo-select-label>Photo</label>
              <select id="pre-match-photo-select" data-photo-select aria-label="Choose a pre-match photo">
                ${Array.from({ length: study.imageCount }, (_, index) => `<option value="${index}">${String(index + 1).padStart(2, "0")}</option>`).join("")}
              </select>
              <button type="button" data-photo-next aria-label="Next photo">→</button>
              <button type="button" data-photo-toggle aria-label="Pause slideshow" aria-pressed="false">Pause</button>
            </div>
          </div>
        </div>
      </section>` : `
      <a class="case-study" href="${escape(study.href || "#")}">
        <img src="${escape(study.image)}" alt="${escape(study.alt || study.title)}" loading="lazy" />
        <div><span>${String(index + 1).padStart(2, "0")}</span><h3>${escape(study.title)}</h3><p>${escape(study.scope)}</p><b>${escape(study.year)}</b></div>
      </a>`).join("")
    : '<p class="case-studies__empty">Selected projects will be published here.</p>';
  if (category === "footballers") enhanceFootballers(target, count, studies.length);
}

function enhanceFootballers(target, count, galleryCount) {
  count.textContent = String(playerProfiles.length + galleryCount).padStart(2, "0");
  target.insertAdjacentHTML("afterbegin", `
    <section class="player-intro" aria-labelledby="player-intro-title">
      <p class="eyebrow">Here are some examples of what we do...</p>
      <h2 id="player-intro-title">This is what a season looks like when we're in it with someone.</h2>
      <nav class="category-anchor-nav" aria-label="Player sections">
        <a href="#player-stories"><span>01</span>Player stories <i aria-hidden="true">↘</i></a>
        <a href="#player-services"><span>02</span>Services <i aria-hidden="true">↘</i></a>
        <a href="#matchday-gallery"><span>03</span>Matchday <i aria-hidden="true">↘</i></a>
        <a href="#player-work"><span>04</span>More work <i aria-hidden="true">↘</i></a>
      </nav>
    </section>
    <section class="player-metrics" aria-label="Bellevue in numbers">
      <div class="player-metrics__grid">
        ${playerMetrics.map((metric) => `<div class="player-metric"><strong>${escape(metric.value)}</strong><span>${escape(metric.label)}</span></div>`).join("")}
      </div>
      <p>Present on every continent.</p>
    </section>
    <section class="player-stories" id="player-stories" aria-labelledby="player-stories-title">
      <div class="player-stories__opening">
        <div class="category-section-head"><p class="eyebrow">Players / 05</p><h2 id="player-stories-title">Player stories</h2></div>
        <div class="player-photo-grid" aria-label="Player stories">
          ${playerProfiles.map((profile, index) => `
            <button class="player-photo-grid__item" type="button" aria-controls="player-story-${index}" aria-expanded="false" data-player-index="${index}">
              ${profile.image ? `<img src="${escape(profile.image)}" alt="" loading="lazy" decoding="async" />` : `<span class="player-photo-grid__placeholder" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>`}
              <span class="player-photo-grid__caption">${escape(profile.name)}</span>
              <span class="player-photo-grid__arrow" aria-hidden="true">↗</span>
            </button>`).join("")}
        </div>
      </div>
      <div class="player-stories__grid" data-player-stories hidden>
        ${playerProfiles.map((profile, index) => `
          <article class="player-story" id="player-story-${index}" data-player-story hidden>
            <span>${String(index + 1).padStart(2, "0")}</span>
            <h3>${escape(profile.name)}</h3>
            <p>${escape(profile.description)}</p>
          </article>`).join("")}
      </div>
      <p class="player-stories__closing">Beyond the day-to-day, we back the player in whatever area they need, and we stay close as real support through their career. While they focus on what matters most, on the pitch, Bellevue puts a team behind them so their image and presence keep growing.</p>
    </section>
    <section class="player-services" id="player-services" aria-labelledby="player-services-title">
      <div class="category-section-head"><p class="eyebrow">What we build</p><h2 id="player-services-title">Services for players</h2></div>
      <div class="player-services__grid">
        ${playerServices.map((service, index) => `<div class="player-service"><span>${String(index + 1).padStart(2, "0")}</span><h3>${escape(service)}</h3></div>`).join("")}
      </div>
    </section>`);
  target.insertAdjacentHTML("beforeend", `
    <section class="player-work" id="player-work" aria-labelledby="player-work-title">
      <div class="category-section-head"><p class="eyebrow">Selected links</p><h2 id="player-work-title">More work we do with players...</h2></div>
      <div class="player-work__groups">
        ${playerWorkLinks.map((group) => `
          <div class="player-work__group player-work__group--previews">
            <h3>${escape(group.title)}</h3>
            <div class="player-video-grid">
              ${group.urls.map((url, index) => `<div class="player-video-card">
                <a class="player-video-card__preview${group.title !== "Video" ? " player-video-card__preview--image" : ""}" href="${escape(url)}" target="_blank" rel="noopener noreferrer" aria-label="View post ↗">${group.thumbnails?.[index] ? `<img src="${escape(group.thumbnails[index])}" alt="" loading="lazy" decoding="async" data-video-thumbnail />` : ""}${group.title === "Video" ? '<span class="player-video-card__play" aria-hidden="true">▶</span>' : ""}</a>
                <a href="${escape(url)}" target="_blank" rel="noopener noreferrer"><span>${escape(group.labels?.[index] || ((group.title === "Video" ? "Video " : "") + String(index + 1).padStart(2, "0")))}</span><span>View post ↗</span></a>
              </div>`).join("")}
            </div>
          </div>`).join("")}
      </div>
    </section>`);
}

function setupPlayerStories() {
  const cards = [...document.querySelectorAll("[data-player-index]")];
  const stories = [...document.querySelectorAll("[data-player-story]")];
  const panel = document.querySelector("[data-player-stories]");
  if (!panel || cards.length !== stories.length) return;

  cards.forEach((card, index) => card.addEventListener("click", () => {
    const shouldOpen = card.getAttribute("aria-expanded") !== "true";
    cards.forEach((item) => item.setAttribute("aria-expanded", "false"));
    stories.forEach((story) => { story.hidden = true; });
    panel.hidden = !shouldOpen;

    if (shouldOpen) {
      card.setAttribute("aria-expanded", "true");
      stories[index].hidden = false;
      requestAnimationFrame(() => panel.scrollIntoView({
        behavior: reduceMotion.matches ? "instant" : "smooth",
        block: "nearest",
      }));
    }
  }));
}

function setupClubProjects() {
  const features = [...document.querySelectorAll(".club-feature")];
  if (!features.length) return;

  const setOpen = (index, open) => {
    features.forEach((feature, featureIndex) => {
      const expanded = open && featureIndex === index;
      feature.querySelector(".club-feature__details").hidden = !expanded;
      feature.querySelectorAll("[data-club-toggle]").forEach((button) => button.setAttribute("aria-expanded", String(expanded)));
      feature.classList.toggle("is-open", expanded);
    });
    if (open) requestAnimationFrame(() => features[index].querySelector(".club-feature__details").scrollIntoView({
      behavior: reduceMotion.matches ? "instant" : "smooth", block: "nearest",
    }));
  };

  document.querySelectorAll("[data-club-toggle]").forEach((button) => button.addEventListener("click", () => {
    const index = Number(button.dataset.clubToggle);
    setOpen(index, button.getAttribute("aria-expanded") !== "true");
  }));
  document.querySelectorAll('.category-anchor-nav a[href^="#"]').forEach((link) => link.addEventListener("click", () => {
    const index = features.findIndex((feature) => `#${feature.id}` === link.getAttribute("href"));
    if (index >= 0) setOpen(index, true);
  }));
  const hashIndex = features.findIndex((feature) => `#${feature.id}` === window.location.hash);
  if (hashIndex >= 0) setOpen(hashIndex, true);
  window.addEventListener("hashchange", () => {
    const index = features.findIndex((feature) => `#${feature.id}` === window.location.hash);
    if (index >= 0) setOpen(index, true);
  });
}

function setupClubLightbox() {
  const dialog = document.querySelector(".club-lightbox");
  if (!dialog) return;
  const studies = caseStudies.clubs;
  const image = dialog.querySelector("img");
  const meta = dialog.querySelector("[data-club-lightbox-meta]");
  const label = dialog.querySelector("[data-club-lightbox-label]");
  let activeImage = 0;
  const clearImage = () => {
    image.hidden = true;
    image.removeAttribute("src");
    image.alt = "";
  };
  document.querySelectorAll("[data-club-gallery-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const study = studies[Number(button.dataset.clubGalleryIndex)];
      const position = Number(button.dataset.clubPhotoIndex) + 1;
      const fullSrc = `${study.galleryPrefix}${String(position).padStart(3, "0")}.webp`;
      const request = ++activeImage;
      clearImage();
      image.alt = `${study.title} — ${study.galleryLabels[position - 1]}`;
      meta.textContent = `${study.title} · ${String(position).padStart(2, "0")} / ${study.galleryCount}`;
      label.textContent = study.galleryLabels[position - 1];
      const thumbnail = button.querySelector(".club-feature__gallery-artwork, img");
      if (thumbnail?.complete && thumbnail.naturalWidth) {
        image.src = thumbnail.currentSrc;
        image.hidden = false;
      }
      dialog.showModal();
      const fullImage = new Image();
      fullImage.onload = () => {
        if (request !== activeImage || !dialog.open) return;
        image.src = fullSrc;
        image.hidden = false;
      };
      fullImage.src = fullSrc;
    });
  });
  dialog.querySelector(".club-lightbox__close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener("close", () => { activeImage += 1; clearImage(); });
}

function setupCompanyProjects() {
  const features = [...document.querySelectorAll(".company-feature--featured")];
  if (!features.length) return;
  const setOpen = (index, open) => {
    features.forEach((feature) => {
      const expanded = open && Number(feature.dataset.companyIndex) === index;
      feature.querySelector(".company-feature__details").hidden = !expanded;
      feature.querySelectorAll("[data-company-toggle]").forEach((button) => button.setAttribute("aria-expanded", String(expanded)));
      feature.classList.toggle("is-open", expanded);
    });
    const active = features.find((feature) => Number(feature.dataset.companyIndex) === index);
    if (open && active) requestAnimationFrame(() => active.querySelector(".company-feature__details").scrollIntoView({
      behavior: reduceMotion.matches ? "instant" : "smooth", block: "nearest",
    }));
  };
  document.querySelectorAll("[data-company-toggle]").forEach((button) => button.addEventListener("click", () =>
    setOpen(Number(button.dataset.companyToggle), button.getAttribute("aria-expanded") !== "true")));
  document.querySelectorAll('.category-anchor-nav a[href^="#"]').forEach((link) => link.addEventListener("click", () => {
    const feature = features.find((item) => `#${item.id}` === link.getAttribute("href"));
    if (feature) setOpen(Number(feature.dataset.companyIndex), true);
  }));
  const openFromHash = () => {
    const feature = features.find((item) => `#${item.id}` === window.location.hash);
    if (feature) setOpen(Number(feature.dataset.companyIndex), true);
  };
  openFromHash();
  window.addEventListener("hashchange", openFromHash);
}

function setupCompanyLightbox() {
  const dialog = document.querySelector(".company-lightbox");
  if (!dialog) return;
  const image = dialog.querySelector("img");
  const meta = dialog.querySelector("[data-company-lightbox-meta]");
  const label = dialog.querySelector("[data-company-lightbox-label]");
  let activeImage = 0;
  const clearImage = () => {
    image.hidden = true;
    image.removeAttribute("src");
    image.alt = "";
  };
  document.querySelectorAll("[data-company-gallery-index]").forEach((button) => button.addEventListener("click", () => {
    const study = caseStudies.companies[Number(button.dataset.companyGalleryIndex)];
    const index = Number(button.dataset.companyPhoto);
    const item = study.gallery[index];
    const request = ++activeImage;
    clearImage();
    image.alt = `${study.title} — ${item.label}`;
    meta.textContent = `${study.title} · ${String(index + 1).padStart(2, "0")} / ${study.gallery.length}`;
    label.textContent = item.label;
    const thumbnail = button.querySelector(".company-feature__media-artwork");
    if (thumbnail?.complete && thumbnail.naturalWidth) {
      image.src = thumbnail.currentSrc;
      image.hidden = false;
    }
    dialog.showModal();
    const fullImage = new Image();
    fullImage.onload = () => {
      if (request !== activeImage || !dialog.open) return;
      image.src = item.src;
      image.hidden = false;
    };
    fullImage.src = item.src;
  }));
  dialog.querySelector(".club-lightbox__close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener("close", () => { activeImage += 1; clearImage(); });
}

function setupVideoPreviews() {
  document.querySelectorAll("[data-video-thumbnail]").forEach((image) => {
    image.addEventListener("error", () => { image.hidden = true; });
  });
}

function setupPlayerMetrics() {
  const cards = document.querySelectorAll(".player-metric");
  if (!cards.length || (reduceMotion.matches && !root.classList.contains("motion-full")) || !window.IntersectionObserver) return;

  const animateMetric = (card) => {
    const number = card.querySelector("strong");
    const finalValue = number.textContent.trim();
    const match = finalValue.match(/^(\+?)(\d+)(M?)$/);
    if (!match) return;

    const [, prefix, amount, suffix] = match;
    const target = Number(amount);
    const duration = 1400;
    let startTime;

    if (card.animate) {
      card.animate([
        { opacity: 0.45, transform: "translateY(18px)" },
        { opacity: 1, transform: "translateY(0)" },
      ], { duration: 700, easing: "cubic-bezier(.22, 1, .36, 1)" });
    }

    const tick = (time) => {
      if (startTime === undefined) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      const value = target * (1 - Math.pow(1 - progress, 3));
      const display = suffix ? Number(value.toFixed(1)) : Math.round(value);
      number.textContent = progress < 1 ? `${prefix}${display}${suffix}` : finalValue;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      animateMetric(entry.target);
    });
  }, { threshold: 0.35 });
  cards.forEach((card) => observer.observe(card));
}

function setupPhotoSlider() {
  const slider = document.querySelector("[data-photo-slider]");
  if (!slider) return;

  const frame = slider.querySelector("[data-photo-frame]");
  const track = slider.querySelector("[data-photo-track]");
  const count = Number(slider.dataset.imageCount);
  const prefix = slider.dataset.imagePrefix;
  const select = slider.querySelector("[data-photo-select]");
  const currentLabel = slider.querySelector("[data-photo-current]");
  const selectLabel = slider.querySelector("[data-photo-select-label]");
  const previousButton = slider.querySelector("[data-photo-prev]");
  const nextButton = slider.querySelector("[data-photo-next]");
  const toggleButton = slider.querySelector("[data-photo-toggle]");
  let current = 0;
  let offset = 0;
  let photoWidth = 0;
  let autoFrame = 0;
  let manualFrame = 0;
  let lastFrameTime = 0;
  let userPaused = false;
  let touchStartX = 0;
  let touchStartY = 0;

  const photoNumber = (index) => (index + count) % count + 1;
  const setPhoto = (image, index) => {
    const number = photoNumber(index);
    image.src = `${prefix}${String(number).padStart(3, "0")}.webp`;
    image.alt = document.documentElement.lang === "es"
      ? `Foto previa al partido ${number} de ${count}`
      : `Pre-match photo ${number} of ${count}`;
  };
  const updateAlt = () => {
    [...track.children].forEach((image, position) => {
      const number = photoNumber(current + position);
      image.alt = document.documentElement.lang === "es"
        ? `Foto previa al partido ${number} de ${count}`
        : `Pre-match photo ${number} of ${count}`;
    });
  };
  const updateSliderLabel = () => {
    const spanish = document.documentElement.lang === "es";
    slider.setAttribute("aria-label", spanish
      ? `Fotos pre partido. Presioná espacio para ${userPaused ? "reanudar" : "pausar"}.`
      : `Pre-match photos. Press Space to ${userPaused ? "resume" : "pause"}.`);
    currentLabel.textContent = String(photoNumber(current)).padStart(2, "0");
    select.value = String(current);
    selectLabel.textContent = spanish ? "Foto" : "Photo";
    select.setAttribute("aria-label", spanish ? "Elegir una foto pre partido" : "Choose a pre-match photo");
    previousButton.setAttribute("aria-label", spanish ? "Foto anterior" : "Previous photo");
    nextButton.setAttribute("aria-label", spanish ? "Foto siguiente" : "Next photo");
    toggleButton.textContent = userPaused ? (spanish ? "Reanudar" : "Resume") : (spanish ? "Pausar" : "Pause");
    toggleButton.setAttribute("aria-label", spanish
      ? `${userPaused ? "Reanudar" : "Pausar"} presentación de fotos`
      : `${userPaused ? "Resume" : "Pause"} slideshow`);
    toggleButton.setAttribute("aria-pressed", String(userPaused));
  };
  const renderPosition = () => { track.style.transform = `translate3d(${-offset}px, 0, 0)`; };
  const measure = () => {
    const oldWidth = photoWidth;
    photoWidth = frame.clientWidth / (window.matchMedia("(max-width: 700px)").matches ? 1 : 3);
    if (oldWidth) offset = offset / oldWidth * photoWidth;
    renderPosition();
  };
  const advance = () => {
    current = (current + 1) % count;
    offset -= photoWidth;
    const first = track.firstElementChild;
    track.append(first);
    setPhoto(first, current + 3);
    updateSliderLabel();
  };
  const stopAuto = () => {
    cancelAnimationFrame(autoFrame);
    autoFrame = 0;
    lastFrameTime = 0;
  };
  const tick = (time) => {
    if (lastFrameTime) offset += Math.min(time - lastFrameTime, 64) * photoWidth / 5500;
    lastFrameTime = time;
    while (offset >= photoWidth) advance();
    renderPosition();
    autoFrame = requestAnimationFrame(tick);
  };
  const startAuto = () => {
    if (!autoFrame && !manualFrame && !document.hidden && !userPaused) autoFrame = requestAnimationFrame(tick);
  };
  const animateTo = (target, done) => {
    const initial = offset;
    let started = 0;
    const step = (time) => {
      if (!started) started = time;
      const progress = Math.min((time - started) / 650, 1);
      offset = initial + (target - initial) * (1 - Math.pow(1 - progress, 3));
      renderPosition();
      if (progress < 1) manualFrame = requestAnimationFrame(step);
      else {
        manualFrame = 0;
        done();
        renderPosition();
        startAuto();
      }
    };
    manualFrame = requestAnimationFrame(step);
  };
  const move = (direction) => {
    if (!photoWidth || manualFrame) return;
    userPaused = true;
    stopAuto();
    updateSliderLabel();
    if (direction > 0) {
      animateTo(photoWidth, advance);
    } else {
      const previous = (current - 1 + count) % count;
      const last = track.lastElementChild;
      track.prepend(last);
      setPhoto(last, previous);
      current = previous;
      offset += photoWidth;
      renderPosition();
      updateSliderLabel();
      animateTo(0, () => { offset = 0; });
    }
  };

  select.addEventListener("focus", () => {
    userPaused = true;
    stopAuto();
    updateSliderLabel();
  });
  select.addEventListener("change", () => {
    stopAuto();
    cancelAnimationFrame(manualFrame);
    manualFrame = 0;
    userPaused = true;
    current = Number(select.value);
    offset = 0;
    [...track.children].forEach((image, position) => setPhoto(image, current + position));
    renderPosition();
    updateSliderLabel();
  });
  previousButton.addEventListener("click", () => move(-1));
  nextButton.addEventListener("click", () => move(1));
  toggleButton.addEventListener("click", () => {
    userPaused = !userPaused;
    updateSliderLabel();
    if (userPaused) stopAuto(); else startAuto();
  });

  slider.addEventListener("keydown", (event) => {
    if (event.target !== slider) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      move(event.key === "ArrowRight" ? 1 : -1);
    } else if (event.code === "Space") {
      event.preventDefault();
      userPaused = !userPaused;
      updateSliderLabel();
      if (userPaused) stopAuto(); else startAuto();
    }
  });
  slider.addEventListener("touchstart", (event) => {
    stopAuto();
    touchStartX = event.changedTouches[0].screenX;
    touchStartY = event.changedTouches[0].screenY;
  }, { passive: true });
  slider.addEventListener("touchend", (event) => {
    const deltaX = event.changedTouches[0].screenX - touchStartX;
    const deltaY = event.changedTouches[0].screenY - touchStartY;
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
      move(deltaX < 0 ? 1 : -1);
    } else startAuto();
  }, { passive: true });
  document.addEventListener("visibilitychange", () => document.hidden ? stopAuto() : startAuto());
  new MutationObserver(() => { updateAlt(); updateSliderLabel(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  new ResizeObserver(measure).observe(frame);
  measure();
  updateSliderLabel();
  startAuto();
}

setupCursorAura();
setupMenu();
setupNavScroll();
renderCaseStudies();
setupClubProjects();
setupCompanyProjects();
setupPlayerStories();
setupLanguage();
setupVideoPreviews();
setupPlayerMetrics();
setupPhotoSlider();
setupClubLightbox();
setupCompanyLightbox();
