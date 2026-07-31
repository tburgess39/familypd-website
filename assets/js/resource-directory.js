(() => {
  "use strict";
  const grid = document.getElementById("resource-directory-grid");
  if (!grid) return;

  const search = document.getElementById("resource-directory-search");
  const category = document.getElementById("resource-directory-category");
  const clear = document.getElementById("resource-directory-clear");
  const status = document.getElementById("resource-directory-status");
  const empty = document.getElementById("resource-directory-empty");
  let items = [];

  const esc = (value) => String(value ?? "")
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;").replace(/'/g,"&#039;");

  function card(item) {
    const educator = item.category === "Educator Resources"
      ? '<span class="resource-scope resource-scope-educator">Specialized educator resource</span>'
      : `<span class="resource-scope">${esc(item.audience)}</span>`;
    return `<article class="resource-directory-card">
      <div class="resource-directory-card-top">
        <span class="tag">${esc(item.category)}</span>${educator}
      </div>
      <h3>${esc(item.title)}</h3>
      <p>${esc(item.description)}</p>
      <p class="resource-audience"><strong>For:</strong> ${esc(item.audience)}</p>
      <a class="button button-small" href="${esc(item.url)}">Open resource</a>
    </article>`;
  }

  function apply() {
    const q = search.value.trim().toLowerCase();
    const selected = category.value;
    const filtered = items.filter((item) => {
      const text = [item.title,item.description,item.category,item.audience,item.keywords].join(" ").toLowerCase();
      return (!q || text.includes(q)) && (selected === "All Resources" || item.category === selected);
    });
    grid.innerHTML = filtered.map(card).join("");
    empty.hidden = filtered.length !== 0;
    status.textContent = `Showing ${filtered.length} of ${items.length} resources.`;
  }

  fetch("/assets/data/resource-directory.json", {cache:"no-store"})
    .then((response) => {
      if (!response.ok) throw new Error("The resource directory could not be loaded.");
      return response.json();
    })
    .then((data) => {
      items = Array.isArray(data.items) ? data.items : [];
      category.innerHTML = (data.categories || ["All Resources"]).map((name) =>
        `<option value="${esc(name)}">${esc(name)}</option>`).join("");
      search.addEventListener("input", apply);
      category.addEventListener("change", apply);
      clear.addEventListener("click", () => {
        search.value = "";
        category.value = "All Resources";
        apply();
        search.focus();
      });
      apply();
    })
    .catch((error) => {
      grid.innerHTML = `<div class="notice-card"><strong>Directory unavailable.</strong><p>${esc(error.message)}</p></div>`;
      status.textContent = "Resource directory unavailable.";
    });
})();
