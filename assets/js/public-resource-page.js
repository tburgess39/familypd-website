'use strict';

const source = document.getElementById('resource-page-data');
const content = document.getElementById('resource-page-content');

if (source && content) {
  const data = JSON.parse(source.textContent);
  const buttons = [...document.querySelectorAll('[data-page-language]')];
  const labels = {
    en: ['Why it matters', 'Key points', 'Discussion questions', 'Action steps', 'Source', 'Privacy'],
    es: ['Por qué es importante', 'Puntos clave', 'Preguntas para conversar', 'Pasos a seguir', 'Fuente', 'Privacidad']
  };
  function render(language) {
    const [why, key, questions, actions, attribution, privacy] = labels[language];
    function append(parent, tag, wording) {
      const element = document.createElement(tag);
      element.textContent = wording;
      parent.append(element);
      return element;
    }
    function section(heading, value) {
      append(content, 'h2', heading);
      if (Array.isArray(value)) {
        const list = append(content, 'ul', '');
        for (const item of value) append(list, 'li', item[language]);
      } else {
        append(content, 'p', value[language]);
      }
    }
    content.replaceChildren();
    content.lang = language;
    append(content, 'h1', data.title[language]);
    append(content, 'p', data.summary[language]);
    section(why, data.why);
    section(key, data.keyPoints);
    section(questions, data.questions);
    section(actions, data.actions);
    section(attribution, data.source);
    section(privacy, data.privacy);
    for (const button of buttons) {
      button.setAttribute('aria-pressed', String(button.dataset.pageLanguage === language));
    }
  }
  for (const button of buttons) {
    button.addEventListener('click', () => render(button.dataset.pageLanguage));
  }
  render('en');
}

