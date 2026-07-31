(() => {
  "use strict";

  const DATA_URL = "/assets/data/media-bank.json";
  const PILLAR_ORDER = [
    "Health",
    "Relationships",
    "Education",
    "Finances",
    "Goals",
    "Community",
    "Policies",
    "Systems",
    "Self-awareness",
    "All Pillars"
  ];

  const elements = {
    grid: document.getElementById("media-bank-grid"),
    search: document.getElementById("media-search"),
    category: document.getElementById("media-category"),
    pillar: document.getElementById("media-pillar"),
    reset: document.getElementById("media-reset"),
    status: document.getElementById("media-status")
  };

  let mediaItems = [];

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function populateSelect(select, values, allLabel) {
    select.innerHTML = "";
    const all = document.createElement("option");
    all.value = "All";
    all.textContent = allLabel;
    select.appendChild(all);

    values.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  function buildCard(item) {
    const pageLink = item.page
      ? `<a class="button button-small" href="${escapeHtml(item.page)}"${/^https?:/i.test(item.page) ? ' target="_blank" rel="noopener noreferrer"' : ""}>Related page</a>`
      : "";

    return `
      <article class="media-card" data-category="${escapeHtml(item.category)}" data-pillar="${escapeHtml(item.pillar)}">
        <a class="media-card-image-link" href="${escapeHtml(item.image)}" target="_blank" rel="noopener noreferrer" aria-label="Open full-size ${escapeHtml(item.title)}">
          <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.alt)}" loading="lazy" decoding="async">
        </a>
        <div class="media-card-content">
          <div class="media-card-meta">
            <span>${escapeHtml(item.category)}</span>
            <span>${escapeHtml(item.pillar)}</span>
            <span>${escapeHtml(item.type)}</span>
          </div>
          <h2>${escapeHtml(item.title)}</h2>
          <p>${escapeHtml(item.description)}</p>
          <div class="media-card-actions">
            <a class="button button-small button-secondary" href="${escapeHtml(item.image)}" target="_blank" rel="noopener noreferrer">Open full-size visual</a>
            ${pageLink}
          </div>
        </div>
      </article>`;
  }

  function applyFilters() {
    const query = elements.search.value.trim().toLowerCase();
    const category = elements.category.value;
    const pillar = elements.pillar.value;

    const filtered = mediaItems.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;
      const matchesPillar = pillar === "All" || item.pillar === pillar;
      const haystack = [
        item.title,
        item.description,
        item.category,
        item.pillar,
        item.type,
        item.alt
      ].join(" ").toLowerCase();
      const matchesSearch = !query || haystack.includes(query);
      return matchesCategory && matchesPillar && matchesSearch;
    });

    elements.grid.innerHTML = filtered.length
      ? filtered.map(buildCard).join("")
      : `<div class="notice-card"><strong>No visuals matched.</strong><p>Try clearing a filter or searching with a broader word.</p></div>`;

    const label = filtered.length === 1 ? "visual" : "visuals";
    elements.status.textContent = `Showing ${filtered.length} of ${mediaItems.length} ${label}.`;
  }

  function bindControls() {
    elements.search.addEventListener("input", applyFilters);
    elements.category.addEventListener("change", applyFilters);
    elements.pillar.addEventListener("change", applyFilters);
    elements.reset.addEventListener("click", () => {
      elements.search.value = "";
      elements.category.value = "All";
      elements.pillar.value = "All";
      applyFilters();
      elements.search.focus();
    });
  }

  async function initialize() {
    try {
      const response = await fetch(DATA_URL, { cache: "no-store" });
      if (!response.ok) throw new Error(`Media data could not be loaded (${response.status}).`);
      const data = await response.json();
      mediaItems = Array.isArray(data.items) ? data.items : [];

      const categories = (data.categories || [])
        .filter((value) => value && value !== "All");
      populateSelect(elements.category, categories, "All categories");

      const availablePillars = [...new Set(mediaItems.map((item) => item.pillar).filter(Boolean))]
        .sort((a, b) => {
          const aIndex = PILLAR_ORDER.indexOf(a);
          const bIndex = PILLAR_ORDER.indexOf(b);
          return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex) || a.localeCompare(b);
        });
      populateSelect(elements.pillar, availablePillars, "All pillars and principles");

      bindControls();
      applyFilters();
    } catch (error) {
      elements.grid.innerHTML = `
        <div class="notice-card">
          <strong>The Media Bank could not load.</strong>
          <p>${escapeHtml(error.message)}</p>
        </div>`;
      elements.status.textContent = "Media unavailable.";
    }
  }

  initialize();
})();
