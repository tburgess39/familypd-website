
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
const toolkitFields = document.querySelectorAll('[data-save]');

function storageKey(field) {
  return `familypd:${field.dataset.save}`;
}

function restoreToolkitFields() {
  toolkitFields.forEach(field => {
    const saved = localStorage.getItem(storageKey(field));
    if (saved === null) return;

    if (field.type === 'checkbox') {
      field.checked = saved === 'true';
    } else {
      field.value = saved;
    }
  });
}

function saveToolkitField(field) {
  const value = field.type === 'checkbox' ? String(field.checked) : field.value;
  localStorage.setItem(storageKey(field), value);
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

if (toolkitFields.length) {
  restoreToolkitFields();
  updatePillarTotal();

  toolkitFields.forEach(field => {
    const eventName = field.type === 'checkbox' || field.tagName === 'SELECT'
      ? 'change'
      : 'input';

    field.addEventListener(eventName, () => {
      saveToolkitField(field);
      if (field.hasAttribute('data-pillar-score')) updatePillarTotal();
    });
  });

  document.querySelectorAll('[data-save-status]').forEach(button => {
    button.addEventListener('click', () => {
      toolkitFields.forEach(saveToolkitField);
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

      toolkitFields.forEach(field => {
        if (!field.dataset.save.startsWith(scope)) return;

        localStorage.removeItem(storageKey(field));
        if (field.type === 'checkbox') {
          field.checked = false;
        } else {
          field.value = '';
        }
      });

      updatePillarTotal();
    });
  });
}
