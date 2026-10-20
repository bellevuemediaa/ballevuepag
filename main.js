import { renderContent } from "./components.js";
import { setupLanguage } from "./i18n.js";

renderContent();
setupLanguage();

const root = document.documentElement;
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
root.classList.remove("motion-reduced");
root.classList.add("motion-full");
const motionIsFull = () => true;

function setupIntro() {
  const intro = document.querySelector(".intro");
  if (!motionIsFull()) {
    intro.remove();
    return;
  }
  window.setTimeout(() => intro.classList.add("is-done"), 1650);
  window.setTimeout(() => intro.remove(), 2300);
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
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
}

function setupReveals() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".reveal, .manifesto__words span").forEach((element) => observer.observe(element));
}

function setupServices() {
  const backdrop = document.querySelector(".services__backdrop");
  const backdropImage = backdrop.querySelector("img");
  const card = document.querySelector("[data-service-card]");
  const cardNumber = document.querySelector("[data-service-card-number]");
  const cardTitle = document.querySelector("[data-service-card-title]");
  const cardDescription = document.querySelector("[data-service-card-description]");
  const cardTags = document.querySelector("[data-service-card-tags]");
  const cursorAura = document.querySelector("[data-cursor-aura]");
  const labels = ["Identity", "Strategy", "Athlete", "Markets"];
  const glows = ["78% 42%", "24% 60%", "60% 30%", "35% 70%"];
  const images = ["./assets/stadium-tunnel.jpg", "./assets/hero-tunnel.jpg", "./assets/player-rain.jpg", "./assets/stadium-tunnel.jpg"];
  [...new Set(images)].forEach((source) => { const image = new Image(); image.src = source; });

  const closeCard = () => {
    if (card.open) card.close();
    document.body.classList.remove("service-card-open");
  };
  const openCard = (service) => {
    cardNumber.textContent = String(Number(service.dataset.service) + 1).padStart(2, "0");
    cardTitle.replaceChildren(...(service.dataset.titleLines || service.dataset.title).split("|").map((line) => {
      const lineElement = document.createElement("span");
      lineElement.textContent = line;
      return lineElement;
    }));
    cardDescription.textContent = service.dataset.description;
    cardTags.textContent = (service.dataset.tags || "").split("|").filter(Boolean).join(" · ");
    cardTags.hidden = !cardTags.textContent;
    if (cursorAura) card.append(cursorAura);
    card.showModal();
    document.body.classList.add("service-card-open");
  };

  document.querySelectorAll("[data-service]").forEach((service) => {
    const activate = () => {
      const index = Number(service.dataset.service);
      backdrop.querySelector("span").textContent = labels[index];
      backdrop.style.background = `radial-gradient(circle at ${glows[index]}, rgba(252,198,48,.35), transparent 26%)`;
      backdropImage.src = images[index];
    };
    service.addEventListener("mouseenter", activate);
    service.addEventListener("focus", activate);
    service.addEventListener("click", () => openCard(service));
  });
  document.querySelector("[data-service-card-close]").addEventListener("click", closeCard);
  card.addEventListener("click", (event) => { if (event.target === card) closeCard(); });
  card.addEventListener("close", () => {
    document.body.classList.remove("service-card-open");
    if (cursorAura) document.body.append(cursorAura);
  });
}

function setupMagneticButton() {
  const button = document.querySelector(".magnetic");
  if (!button || !window.matchMedia("(pointer: fine)").matches || !motionIsFull()) return;
  button.addEventListener("pointermove", (event) => {
    const rect = button.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * 0.1;
    const y = (event.clientY - rect.top - rect.height / 2) * 0.16;
    button.style.transform = `translate(${x}px, ${y}px)`;
  });
  button.addEventListener("pointerleave", () => { button.style.transform = ""; });
}

function setupCursorAura() {
  const aura = document.querySelector("[data-cursor-aura]");
  if (!aura || !window.matchMedia("(pointer: fine)").matches || !motionIsFull()) return;

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

function setupContactForm() {
  const form = document.querySelector("[data-contact-form]");
  const status = document.querySelector("[data-contact-status]");
  if (!form) return;
  const submitButton = form.querySelector("[type='submit']");
  const handoff = form.querySelector("[data-contact-handoff]");
  const messageField = form.querySelector("[data-contact-message]");
  const copyButton = form.querySelector("[data-contact-copy]");
  const instagramUrl = "https://ig.me/m/bellevuemedia";
  const isSpanish = () => document.documentElement.lang === "es";
  submitButton.disabled = false;

  const copyMessage = async () => {
    if (!navigator.clipboard?.writeText) return false;
    try {
      await navigator.clipboard.writeText(messageField.value);
      return true;
    } catch {
      return false;
    }
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const fields = new FormData(form);
    const type = String(fields.get("contactType") || "").trim();
    const idea = String(fields.get("idea") || "").trim();
    const name = String(fields.get("fullName") || "").trim();
    const email = String(fields.get("email") || "").trim();
    const phone = String(fields.get("phone") || "").trim();
    const spanish = isSpanish();
    messageField.value = [
      spanish ? "Hola Bellevue, quiero hacer una consulta desde la web." : "Hi Bellevue, I'd like to get in touch through your website.",
      `${spanish ? "Me contacto como" : "I'm reaching out as"}: ${type}`,
      `${spanish ? "Nombre" : "Name"}: ${name}`,
      `${spanish ? "Correo" : "Email"}: ${email}`,
      ...(phone ? [`${spanish ? "Teléfono" : "Phone"}: ${phone}`] : []),
      ...(idea ? [`${spanish ? "Idea" : "Idea"}: ${idea}`] : []),
    ].join("\n");
    handoff.hidden = false;

    const copyPromise = copyMessage();
    window.open(instagramUrl, "_blank", "noopener,noreferrer");
    const copied = await copyPromise;
    status.textContent = copied
      ? (spanish ? "Mensaje copiado. Pegalo en el chat de Instagram y envialo." : "Message copied. Paste it into the Instagram chat and send it.")
      : (spanish ? "Copiá el mensaje de abajo, pegalo en el chat de Instagram y envialo." : "Copy the message below, paste it into the Instagram chat and send it.");
  });

  copyButton.addEventListener("click", async () => {
    const copied = await copyMessage();
    status.textContent = copied
      ? (isSpanish() ? "Mensaje copiado. Pegalo en el chat de Instagram y envialo." : "Message copied. Paste it into the Instagram chat and send it.")
      : (isSpanish() ? "Seleccioná el mensaje de abajo para copiarlo manualmente." : "Select the message below to copy it manually.");
    if (!copied) {
      messageField.focus();
      messageField.select();
    }
  });
}

function setupProjectNavigation() {
  const wipe = document.querySelector(".page-wipe");
  let navigationTimer;
  document.querySelectorAll(".project[href], .audience__cta[href]").forEach((project) => {
    project.addEventListener("click", (event) => {
      if (!motionIsFull() || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      wipe.classList.add("is-covering");
      navigationTimer = window.setTimeout(() => window.location.assign(project.href), 280);
    });
  });
  window.addEventListener("pageshow", () => {
    window.clearTimeout(navigationTimer);
    wipe.classList.remove("is-covering");
  });
  window.addEventListener("pagehide", () => window.clearTimeout(navigationTimer));
}

function setupScrollStory() {
  const hero = document.querySelector(".hero");
  const audience = document.querySelector(".audience");
  const bridge = document.querySelector(".bridge");
  const team = document.querySelector(".team");
  const processSection = document.querySelector(".process");
  const work = document.querySelector(".work");
  const track = document.querySelector(".work__track");
  const projectCards = [...document.querySelectorAll(".project")];
  const audienceChapters = [...document.querySelectorAll("[data-audience]")];
  const audienceVisuals = [...document.querySelectorAll(".audience__visual")];
  const processSteps = [...document.querySelectorAll("[data-step]")];
  let ticking = false;

  const sectionProgress = (section) => {
    const rect = section.getBoundingClientRect();
    return clamp(-rect.top / Math.max(1, rect.height - window.innerHeight));
  };
  const timedProgress = (section, start, end) => clamp((sectionProgress(section) - start) / (end - start));
  const viewportProgress = (section) => {
    const rect = section.getBoundingClientRect();
    const start = window.innerHeight * 0.82;
    const travel = rect.height + window.innerHeight * 0.55;
    return clamp((start - rect.top) / Math.max(1, travel));
  };

  const update = () => {
    ticking = false;
    document.querySelector("[data-nav]").classList.toggle("is-scrolled", window.scrollY > 48);
    const pageRange = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    root.style.setProperty("--page-p", clamp(window.scrollY / pageRange).toFixed(4));
    if (!motionIsFull()) return;

    root.style.setProperty("--hero-p", timedProgress(hero, 0, 0.82).toFixed(4));
    root.style.setProperty("--audience-p", sectionProgress(audience).toFixed(4));
    root.style.setProperty("--bridge-p", timedProgress(bridge, 0.03, 0.76).toFixed(4));
    const teamProgress = timedProgress(team, 0.02, 0.78);
    root.style.setProperty("--team-fill", `${teamProgress * 100}%`);
    root.style.setProperty("--team-p", teamProgress.toFixed(4));

    const processProgress = window.innerWidth <= 560 ? viewportProgress(processSection) : timedProgress(processSection, 0, 0.84);
    root.style.setProperty("--process-p", `${processProgress * 100}%`);
    const processIndex = Math.min(processSteps.length - 1, Math.floor(processProgress * processSteps.length));
    processSteps.forEach((step, index) => step.classList.toggle("is-active", index <= processIndex));

    if (window.innerWidth > 900) {
      const trackPadding = parseFloat(getComputedStyle(track).paddingLeft) || 0;
      const maxTravel = Math.max(0, track.scrollWidth - window.innerWidth + trackPadding);
      root.style.setProperty("--work-x", `${timedProgress(work, 0.01, 0.92) * maxTravel}px`);
    }
    projectCards.forEach((project) => {
      const rect = project.getBoundingClientRect();
      const horizontal = window.innerWidth > 900;
      const viewport = horizontal ? window.innerWidth : window.innerHeight;
      const position = horizontal ? rect.left : rect.top;
      const size = horizontal ? rect.width : rect.height;
      project.style.setProperty("--project-p", clamp((viewport - position) / (viewport + size)).toFixed(4));
    });

    let activeAudience = 0;
    let closest = Infinity;
    audienceChapters.forEach((chapter, index) => {
      const rect = chapter.getBoundingClientRect();
      const distance = Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2);
      if (distance < closest) { closest = distance; activeAudience = index; }
    });
    audienceChapters.forEach((chapter, index) => chapter.classList.toggle("is-active", index === activeAudience));
    audienceVisuals.forEach((visual, index) => visual.classList.toggle("is-active", index === activeAudience));
  };

  const requestUpdate = () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  };
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  window.addEventListener("pageshow", requestUpdate);
  reduceMotion.addEventListener("change", requestUpdate);
  update();
  requestAnimationFrame(requestUpdate);
}

setupIntro();
setupMenu();
setupReveals();
setupServices();
setupMagneticButton();
setupCursorAura();
setupContactForm();
setupProjectNavigation();
setupScrollStory();
document.querySelector("[data-year]").textContent = new Date().getFullYear();
