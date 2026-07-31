(() => {
  "use strict";
  const form = document.getElementById("site-search-form");
  if (!form) return;

  const input = document.getElementById("site-search-input");
  const category = document.getElementById("site-search-category");
  const clear = document.getElementById("site-search-clear");
  const status = document.getElementById("site-search-status");
  const results = document.getElementById("site-search-results");
  const empty = document.getElementById("site-search-empty");
  let items = [];

  const esc = (value) => String(value ?? "")
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;").replace(/'/g,"&#039;");

  function score(item, terms) {
    const title = item.title.toLowerCase();
    const categoryText = item.category.toLowerCase();
    const description = item.description.toLowerCase();
    const keywords = (item.keywords || "").toLowerCase();
    return terms.reduce((total, term) => {
      if (title.includes(term)) total += 8;
      if (keywords.includes(term)) total += 5;
      if (categoryText.includes(term)) total += 3;
      if (description.includes(term)) total += 2;
      return total;
    }, 0);
  }

  function render(runBySubmit = false) {
    const q = input.value.trim();
    const selected = category.value;
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);

    if (!terms.length && selected === "All") {
      results.innerHTML = "";
      empty.hidden = true;
      status.textContent = runBySubmit ? "Enter a word or phrase to search." : "Enter a word or phrase to begin.";
      return;
    }

    const found = items
      .map((item) => ({item, score: terms.length ? score(item, terms) : 1}))
      .filter(({item,score}) =>
        score > 0 && (selected === "All" || item.category === selected))
      .sort((a,b) => b.score - a.score || a.item.title.localeCompare(b.item.title));

    results.innerHTML = found.map(({item}) => `
      <article class="site-search-result">
        <div>
          <span class="tag">${esc(item.category)}</span>
          <h2><a href="${esc(item.url)}">${esc(item.title)}</a></h2>
          <p>${esc(item.description)}</p>
          <p class="resource-audience"><strong>For:</strong> ${esc(item.audience)}</p>
        </div>
        <a class="button button-small button-secondary" href="${esc(item.url)}">Open page</a>
      </article>`).join("");

    empty.hidden = found.length !== 0;
    status.textContent = `${found.length} result${found.length === 1 ? "" : "s"} found.`;
  }

  fetch("/assets/data/site-search.json", {cache:"no-store"})
    .then((response) => {
      if (!response.ok) throw new Error("The search index could not be loaded.");
      return response.json();
    })
    .then((data) => {
      items = Array.isArray(data.items) ? data.items : [];
      const categories = [...new Set(items.map((item) => item.category))].sort();
      category.innerHTML = '<option value="All">All page types</option>' +
        categories.map((name) => `<option value="${esc(name)}">${esc(name)}</option>`).join("");

      const params = new URLSearchParams(window.location.search);
      input.value = params.get("q") || "";
      if (input.value) render();

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const url = new URL(window.location.href);
        if (input.value.trim()) url.searchParams.set("q", input.value.trim());
        else url.searchParams.delete("q");
        history.replaceState(null, "", url);
        render(true);
      });
      input.addEventListener("input", () => {
        if (!input.value.trim()) render();
      });
      category.addEventListener("change", () => render());
      clear.addEventListener("click", () => {
        input.value = "";
        category.value = "All";
        history.replaceState(null, "", window.location.pathname);
        render();
        input.focus();
      });
    })
    .catch((error) => {
      results.innerHTML = `<div class="notice-card"><strong>Search unavailable.</strong><p>${esc(error.message)}</p></div>`;
      status.textContent = "Search unavailable.";
    });
})();
