document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('header nav a, nav a').forEach(function (link) {
    var href = link.getAttribute('href') || '';
    var text = (link.textContent || '').trim().toLowerCase();
    if (href.indexOf('/app') >= 0 || href.indexOf('script.google.com') >= 0 || text === 'familypd os') {
      link.classList.add('family-pd-os-nav-button');
      if (!link.textContent.trim()) link.textContent = 'FamilyPD OS';
    }
  });
});
