import { audiences, services, process, projects } from "./data/content.js";

const escape = (value) => String(value).replace(/[&<>'"]/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
}[character]));

export function renderAudience() {
  const target = document.querySelector("[data-audience-list]");
  target.innerHTML = audiences.map((item, index) => `
    <article class="audience__chapter${index === 0 ? " is-active" : ""}" data-audience="${index}">
      <span>${escape(item.number)}</span>
      <div><h3>${escape(item.title)}</h3><p>${escape(item.copy)}</p><a class="audience__cta" href="${escape(item.href)}">${escape(item.cta ?? `View ${item.title.toLowerCase()}`)}</a></div>
    </article>`).join("");
}

export function renderServices() {
  const target = document.querySelector("[data-services]");
  target.innerHTML = services.map((item, index) => `
    <button class="service" type="button" data-service="${index}" data-title="${escape(item.title)}" data-title-lines="${escape(item.cardTitle.join("|"))}" data-description="${escape(item.description)}" data-tags="${escape(item.tags.join("|"))}" aria-haspopup="dialog" aria-controls="service-card">
      <span>${escape(item.number)}</span><h3>${escape(item.title)}</h3><p>${escape(item.description)}</p>
    </button>`).join("");
}

export function renderProcess() {
  const target = document.querySelector("[data-process]");
  target.innerHTML = process.map((title, index) => `
    <li data-step="${index}"><span>0${index + 1}</span><strong>${escape(title)}</strong></li>`).join("");
}

export function renderWork() {
  const target = document.querySelector("[data-work]");
  target.innerHTML = projects.map((item, index) => `
    <a class="project project--${index + 1}" href="${escape(item.href)}" aria-label="Explore Bellevue work for ${escape(item.direction)}">
      <div class="project__visual"><div class="project__flare" aria-hidden="true"><em></em><em></em><em></em><em></em><em></em><em></em><em></em></div><span>${escape(item.index)}</span><b>${escape(item.direction)}</b></div>
      <div class="project__meta"><span>Client<br /><b>${escape(item.label)}</b></span></div>
    </a>`).join("");
}

export function renderContent() {
  renderAudience();
  renderServices();
  renderProcess();
  renderWork();
}
