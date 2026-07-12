
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const year = document.getElementById('year');
if (year) {
  year.textContent = new Date().getFullYear();
}


// Family Toolkit: local-only worksheet storage.
const FPD_STORAGE_PREFIX = 'familypd:';

function getSaveFields() {
  return [...document.querySelectorAll('[data-save]')];
}

function getStorageKey(fieldOrName) {
  const name = typeof fieldOrName === 'string'
    ? fieldOrName
    : fieldOrName.dataset.save;
  return `${FPD_STORAGE_PREFIX}${name}`;
}

function restoreSaveField(field) {
  const saved = localStorage.getItem(getStorageKey(field));
  if (saved === null) return;

  if (field.type === 'checkbox') {
    field.checked = saved === 'true';
  } else {
    field.value = saved;
  }
}

function saveField(field) {
  if (!field || !field.dataset || !field.dataset.save) return;
  const value = field.type === 'checkbox' ? String(field.checked) : field.value;
  localStorage.setItem(getStorageKey(field), value);
}

function restoreAllSaveFields(root = document) {
  root.querySelectorAll('[data-save]').forEach(restoreSaveField);
}

function updatePillarTotal() {
  const scoreFields = [...document.querySelectorAll('[data-pillar-score]')];
  const totalElement = document.getElementById('pillar-total');
  if (!totalElement || scoreFields.length === 0) return;

  const values = scoreFields
    .map(field => Number(field.value))
    .filter(value => Number.isFinite(value) && value > 0);

  totalElement.textContent = values.length === scoreFields.length
    ? String(values.reduce((sum, value) => sum + value, 0))
    : '—';
}

restoreAllSaveFields();
updatePillarTotal();

document.addEventListener('input', event => {
  const field = event.target.closest('[data-save]');
  if (field) saveField(field);
});

document.addEventListener('change', event => {
  const field = event.target.closest('[data-save]');
  if (field) {
    saveField(field);
    if (field.hasAttribute('data-pillar-score')) updatePillarTotal();
  }
});

document.querySelectorAll('[data-save-status]').forEach(button => {
  button.addEventListener('click', () => {
    getSaveFields().forEach(saveField);
    button.classList.add('save-confirmed');
    const originalText = button.textContent;
    button.textContent = 'Saved in this browser ✓';

    window.setTimeout(() => {
      button.classList.remove('save-confirmed');
      button.textContent = originalText;
    }, 1800);
  });
});

document.querySelectorAll('[data-print]').forEach(button => {
  button.addEventListener('click', () => window.print());
});

document.querySelectorAll('[data-reset-scope]').forEach(button => {
  button.addEventListener('click', () => {
    const scope = button.dataset.resetScope;
    const confirmed = window.confirm('Clear the saved entries for this tool?');
    if (!confirmed) return;

    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(`${FPD_STORAGE_PREFIX}${scope}`)) {
        localStorage.removeItem(key);
      }
    });

    getSaveFields().forEach(field => {
      if (!field.dataset.save.startsWith(scope)) return;
      if (field.type === 'checkbox') field.checked = false;
      else field.value = '';
    });

    if (scope === 'meeting') {
      localStorage.removeItem(`${FPD_STORAGE_PREFIX}meeting-custom-topics`);
      localStorage.removeItem(`${FPD_STORAGE_PREFIX}selected-news-story`);
      initializeMeetingPlanner();
    }

    updatePillarTotal();
  });
});

// ------------------------------------------------------------------
// Meeting planner
// ------------------------------------------------------------------
function readSavedValue(name) {
  return localStorage.getItem(getStorageKey(name)) || '';
}

function writeSavedValue(name, value) {
  localStorage.setItem(getStorageKey(name), value);
}

function safeId(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function getCustomTopics() {
  try {
    return JSON.parse(localStorage.getItem(getStorageKey('meeting-custom-topics')) || '[]');
  } catch {
    return [];
  }
}

function setCustomTopics(topics) {
  localStorage.setItem(getStorageKey('meeting-custom-topics'), JSON.stringify(topics));
}

function getSelectedNewsStory() {
  try {
    return JSON.parse(localStorage.getItem(getStorageKey('selected-news-story')) || 'null');
  } catch {
    return null;
  }
}

function getMeetingTopics() {
  const selected = [...document.querySelectorAll('[data-meeting-topic]:checked')].map(field => ({
    id: field.dataset.topicId,
    title: field.dataset.title,
    pillar: field.dataset.pillar,
    prompts: field.dataset.prompts,
    custom: false
  }));

  const custom = getCustomTopics().map(topic => ({ ...topic, custom: true }));
  const news = getSelectedNewsStory();

  if (news) {
    selected.push({
      id: `news-${news.id}`,
      title: news.title,
      pillar: news.pillar,
      prompts: news.prompts,
      source: news.source,
      published: news.published,
      url: news.url,
      custom: false,
      news: true
    });
  }

  return [...selected, ...custom];
}

function createTopicCard(topic) {
  const card = document.createElement('article');
  card.className = 'selected-topic-card';
  card.dataset.topicCard = topic.id;

  const promptKey = `meeting-discussion-${safeId(topic.id)}-prompt`;
  const notesKey = `meeting-discussion-${safeId(topic.id)}-notes`;
  const savedPrompt = readSavedValue(promptKey) || topic.prompts || '';
  const savedNotes = readSavedValue(notesKey);

  card.innerHTML = `
    <div class="selected-topic-header">
      <div>
        <span class="selected-topic-pillar">${topic.pillar}</span>
        <h3>${topic.title}</h3>
        ${topic.news ? `<a class="news-source-link" href="${topic.url}" target="_blank" rel="noopener noreferrer">View ${topic.source} article ↗</a>` : ''}
      </div>
      ${topic.custom ? `<button class="remove-custom-topic" type="button" data-remove-custom-topic="${topic.id}">Remove</button>` : ''}
    </div>
    <div class="topic-editor-grid">
      <label>
        Editable discussion prompts
        <textarea rows="5" data-save="${promptKey}">${savedPrompt}</textarea>
      </label>
      <label>
        Discussion notes, decisions, or concerns
        <textarea rows="5" data-save="${notesKey}" placeholder="Record the most important points…">${savedNotes}</textarea>
      </label>
    </div>
  `;

  return card;
}

function renderSelectedNewsSummary() {
  const container = document.getElementById('selected-news-summary');
  if (!container) return;

  const story = getSelectedNewsStory();
  if (!story) {
    container.innerHTML = `
      <p>No verified story selected yet.</p>
      <a class="inline-link" href="../news-discussion/">Choose a verified Family PD story</a>
    `;
    return;
  }

  container.innerHTML = `
    <div class="selected-news-story">
      <span>${story.pillar} · ${story.source} · ${formatDate(story.published)}</span>
      <strong>${story.title}</strong>
      <a class="inline-link" href="${story.url}" target="_blank" rel="noopener noreferrer">View original article ↗</a>
      <button class="text-button" type="button" id="remove-selected-news">Remove story</button>
    </div>
  `;

  const removeButton = document.getElementById('remove-selected-news');
  if (removeButton) {
    removeButton.addEventListener('click', () => {
      localStorage.removeItem(getStorageKey('selected-news-story'));
      renderMeetingTopics();
      renderSelectedNewsSummary();
    });
  }
}

function renderMeetingTopics() {
  const container = document.getElementById('meeting-selected-topics');
  if (!container) return;

  const topics = getMeetingTopics();
  container.innerHTML = '';

  if (!topics.length) {
    container.innerHTML = `
      <div class="empty-topic-state">
        <strong>No topics selected yet.</strong>
        <span>Check topics above to create editable discussion boxes.</span>
      </div>
    `;
    return;
  }

  topics.forEach(topic => {
    const card = createTopicCard(topic);
    container.appendChild(card);
    restoreAllSaveFields(card);
  });

  container.querySelectorAll('[data-remove-custom-topic]').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.dataset.removeCustomTopic;
      setCustomTopics(getCustomTopics().filter(topic => topic.id !== id));
      renderMeetingTopics();
    });
  });
}

function initializeMeetingPlanner() {
  const container = document.getElementById('meeting-selected-topics');
  if (!container) return;

  document.querySelectorAll('[data-meeting-topic]').forEach(field => {
    restoreSaveField(field);
    field.addEventListener('change', renderMeetingTopics);
  });

  const addButton = document.getElementById('add-custom-topic');
  if (addButton && !addButton.dataset.initialized) {
    addButton.dataset.initialized = 'true';
    addButton.addEventListener('click', () => {
      const titleField = document.getElementById('custom-topic-title');
      const pillarField = document.getElementById('custom-topic-pillar');
      const promptField = document.getElementById('custom-topic-prompt');
      const title = titleField.value.trim();

      if (!title) {
        window.alert('Enter a custom topic first.');
        titleField.focus();
        return;
      }

      const topics = getCustomTopics();
      const topic = {
        id: `custom-${Date.now()}`,
        title,
        pillar: pillarField.value,
        prompts: promptField.value.trim()
      };
      topics.push(topic);
      setCustomTopics(topics);

      titleField.value = '';
      promptField.value = '';
      renderMeetingTopics();
    });
  }

  renderSelectedNewsSummary();
  renderMeetingTopics();
}

function textOrFallback(value, fallback = 'Not entered') {
  const cleaned = (value || '').trim();
  return cleaned || fallback;
}

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function buildMeetingPrintSheet() {
  const title = textOrFallback(readSavedValue('meeting-title'), 'Family Meeting Document');
  const purpose = textOrFallback(readSavedValue('meeting-purpose'), '');
  const date = readSavedValue('meeting-date');
  const time = readSavedValue('meeting-time');
  const facilitator = textOrFallback(readSavedValue('meeting-facilitator'));
  const participants = textOrFallback(readSavedValue('meeting-participants'));

  document.getElementById('print-meeting-title').textContent = title;
  document.getElementById('print-meeting-purpose').textContent = purpose;
  document.getElementById('print-meeting-opening').textContent =
    textOrFallback(readSavedValue('meeting-opening'));
  document.getElementById('print-meeting-decisions').textContent =
    textOrFallback(readSavedValue('meeting-decisions'));
  document.getElementById('print-meeting-closing').textContent =
    textOrFallback(readSavedValue('meeting-closing'));
  document.getElementById('print-meeting-next').textContent =
    readSavedValue('meeting-next-date')
      ? formatDate(readSavedValue('meeting-next-date'))
      : 'Not scheduled';

  document.getElementById('print-meeting-meta').innerHTML = `
    <div class="print-meta-item"><strong>Date</strong>${escapeHtml(date ? formatDate(date) : 'Not entered')}</div>
    <div class="print-meta-item"><strong>Time</strong>${escapeHtml(time || 'Not entered')}</div>
    <div class="print-meta-item"><strong>Facilitator</strong>${escapeHtml(facilitator)}</div>
    <div class="print-meta-item"><strong>Participants</strong>${escapeHtml(participants)}</div>
  `;

  const topicsContainer = document.getElementById('print-meeting-topics');
  topicsContainer.innerHTML = '';
  const topics = getMeetingTopics();

  if (!topics.length) {
    topicsContainer.innerHTML = '<p>No topics selected.</p>';
  } else {
    topics.forEach(topic => {
      const promptKey = `meeting-discussion-${safeId(topic.id)}-prompt`;
      const notesKey = `meeting-discussion-${safeId(topic.id)}-notes`;
      const prompt = textOrFallback(readSavedValue(promptKey) || topic.prompts);
      const notes = textOrFallback(readSavedValue(notesKey), 'No notes entered');

      const article = document.createElement('article');
      article.className = 'print-topic';
      article.innerHTML = `
        <h3>${escapeHtml(topic.title)} — ${escapeHtml(topic.pillar)}</h3>
        <p><span class="print-topic-label">Discussion prompts:</span> ${escapeHtml(prompt)}</p>
        <p><span class="print-topic-label">Notes / decisions:</span> ${escapeHtml(notes)}</p>
        ${topic.news ? `<p><span class="print-topic-label">Source:</span> ${escapeHtml(topic.source)} · ${escapeHtml(formatDate(topic.published))}</p>` : ''}
      `;
      topicsContainer.appendChild(article);
    });
  }

  const rows = [];
  for (let index = 1; index <= 4; index += 1) {
    const action = readSavedValue(`meeting-action-${index}`).trim();
    const owner = readSavedValue(`meeting-owner-${index}`).trim();
    const due = readSavedValue(`meeting-due-${index}`).trim();
    const support = readSavedValue(`meeting-support-${index}`).trim();
    if (action || owner || due || support) {
      rows.push({ action, owner, due, support });
    }
  }

  const actionsContainer = document.getElementById('print-meeting-actions');
  if (!rows.length) {
    actionsContainer.innerHTML = '<p>No action items entered.</p>';
  } else {
    actionsContainer.innerHTML = `
      <table class="print-action-table">
        <thead>
          <tr><th>Action item</th><th>Owner</th><th>Due date</th><th>Support needed</th></tr>
        </thead>
        <tbody>
          ${rows.map(row => `
            <tr>
              <td>${escapeHtml(row.action || '—')}</td>
              <td>${escapeHtml(row.owner || '—')}</td>
              <td>${escapeHtml(row.due ? formatDate(row.due) : '—')}</td>
              <td>${escapeHtml(row.support || '—')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }
}

const printMeetingButton = document.getElementById('print-meeting-document');
if (printMeetingButton) {
  printMeetingButton.addEventListener('click', () => {
    getSaveFields().forEach(saveField);
    buildMeetingPrintSheet();
    document.body.classList.add('printing-meeting');
    window.print();
  });

  window.addEventListener('afterprint', () => {
    document.body.classList.remove('printing-meeting');
  });
}

initializeMeetingPlanner();

// ------------------------------------------------------------------
// Verified family-news discussion page
// ------------------------------------------------------------------
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(`${dateString}T12:00:00`);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

function isWithinYears(dateString, years) {
  const published = new Date(`${dateString}T12:00:00`);
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - years);
  return published >= cutoff;
}

function renderNewsCard(story) {
  const card = document.createElement('article');
  card.className = 'family-news-card';

  card.innerHTML = `
    <div class="news-card-meta">
      <span>${escapeHtml(story.pillar)}</span>
      ${story.secondary_pillar ? `<span>${escapeHtml(story.secondary_pillar)}</span>` : ''}
      <span>${escapeHtml(story.source)}</span>
      <span>${escapeHtml(formatDate(story.published))}</span>
    </div>
    <h3>${escapeHtml(story.title)}</h3>
    <p>${escapeHtml(story.summary)}</p>
    <div class="news-prevention-box">
      <h4>What families can do proactively</h4>
      <ul>${story.prevention.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
    </div>
    <div class="news-prompt-box">
      <strong>Family discussion prompts</strong>
      <p>${escapeHtml(story.prompts)}</p>
    </div>
    <div class="news-card-actions">
      <a class="button button-secondary" href="${story.url}" target="_blank" rel="noopener noreferrer">View Original Article ↗</a>
      <button class="button" type="button" data-use-news-story="${story.id}">Add to Meeting Planner</button>
    </div>
  `;

  return card;
}

async function initializeNewsPage() {
  const grid = document.getElementById('family-news-grid');
  if (!grid) return;

  try {
    const response = await fetch('../../assets/data/family-news.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Could not load story data.');
    const data = await response.json();

    const verifiedElement = document.getElementById('news-last-verified');
    if (verifiedElement) verifiedElement.textContent = formatDate(data.last_verified);

    const validStories = data.stories
      .filter(story => isWithinYears(story.published, data.policy.max_age_years))
      .sort((a, b) => b.published.localeCompare(a.published));

    grid.innerHTML = '';

    if (!validStories.length) {
      grid.innerHTML = '<div class="news-error">No stories currently meet the Family PD verification and age requirements.</div>';
      return;
    }

    validStories.forEach(story => grid.appendChild(renderNewsCard(story)));

    grid.querySelectorAll('[data-use-news-story]').forEach(button => {
      button.addEventListener('click', () => {
        const story = validStories.find(item => item.id === button.dataset.useNewsStory);
        if (!story) return;

        localStorage.setItem(getStorageKey('selected-news-story'), JSON.stringify(story));
        window.location.href = '../meeting-planner/';
      });
    });
  } catch (error) {
    grid.innerHTML = `
      <div class="news-error">
        The verified-story collection could not load. Please refresh the page or try again later.
      </div>
    `;
  }
}

initializeNewsPage();
