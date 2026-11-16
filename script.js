(() => {
  'use strict';
  const data = window.FOOT_DATA || {ballon: [], coupe: []};
  const $ = (id) => document.getElementById(id);
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const setStats = (id, items) => {
    const el = $(id); if (!el) return;
    el.innerHTML = items.map(([value,label]) => `<div class="stat-card"><strong>${esc(value)}</strong><span>${esc(label)}</span></div>`).join('');
  };
  const setupMenu = () => {
    const button = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.main-nav');
    if (button && nav) button.addEventListener('click', () => {
      const opened = nav.classList.toggle('open');
      button.setAttribute('aria-expanded', String(opened));
    });
  };
  const setupBallon = () => {
    const list = $('ballon-list'); if (!list) return;
    const search = $('search-ballon'), decade = $('decade-ballon'), sort = $('sort-ballon');
    setStats('stats-ballon', [[data.ballon.length,'éditions renseignées'],[new Set(data.ballon.map(x=>x.vainqueur.nom)).size,'vainqueurs différents'],['1980–2025','période couverte']]);
    const render = () => {
      const term = search.value.trim().toLocaleLowerCase('fr');
      const d = decade.value;
      const rows = [...data.ballon].filter(x => {
        const text = [x.annee,x.vainqueur.nom,x.vainqueur.club,x.vainqueur.pays,...x.second].join(' ').toLocaleLowerCase('fr');
        return (!term || text.includes(term)) && (d === 'all' || (Math.floor(x.annee/10)*10) === Number(d));
      }).sort((a,b) => sort.value === 'asc' ? a.annee-b.annee : b.annee-a.annee);
      list.innerHTML = rows.map(x => `<article class="award-card"><div class="card-top"><span class="year-badge">${x.annee}</span><span class="winner-label">Vainqueur</span></div><h3 class="winner-name">${esc(x.vainqueur.nom)}</h3><p class="winner-meta">${esc(x.vainqueur.club)} · ${esc(x.vainqueur.pays)}</p><div class="runner-line"><b>Deuxième :</b> ${esc(x.second.join(', ') || '—')}</div></article>`).join('');
      $('ballon-empty').hidden = rows.length !== 0;
    };
    [search,decade,sort].forEach(el => el.addEventListener('input',render));
    render();
  };
  const setupCoupe = () => {
    const list = $('coupe-list'); if (!list) return;
    const search = $('search-coupe'), country = $('country-coupe'), sort = $('sort-coupe');
    const champions = [...new Set(data.coupe.map(x=>x.vainqueur))].sort((a,b)=>a.localeCompare(b,'fr'));
    country.innerHTML += champions.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('');
    setStats('stats-coupe', [[data.coupe.length,'éditions renseignées'],[champions.length,'nations championnes'],['1930–2022','période couverte']]);
    const render = () => {
      const term = search.value.trim().toLocaleLowerCase('fr');
      const rows = [...data.coupe].filter(x => {
        const text = [x.annee,x.vainqueur,x.finaliste,x.ville,x.score].join(' ').toLocaleLowerCase('fr');
        return (!term || text.includes(term)) && (country.value === 'all' || x.vainqueur === country.value);
      }).sort((a,b)=>sort.value === 'asc' ? a.annee-b.annee : b.annee-a.annee);
      list.innerHTML = rows.map(x=>`<article class="world-card"><div class="card-top"><span class="year-badge">${x.annee}</span><span class="winner-label">Champion</span></div><h3>${esc(x.vainqueur)}</h3><p>Finaliste : ${esc(x.finaliste)}<br>Ville de la finale : ${esc(x.ville)}</p><div class="final-score">Score : ${esc(x.score)}</div></article>`).join('');
      $('coupe-empty').hidden = rows.length !== 0;
    };
    [search,country,sort].forEach(el=>el.addEventListener('input',render));
    render();
  };
  document.addEventListener('DOMContentLoaded', () => {
    setupMenu();
    document.querySelectorAll('.year-now').forEach(el=>el.textContent=new Date().getFullYear());
    if (document.body.dataset.page === 'ballon') setupBallon();
    if (document.body.dataset.page === 'coupe') setupCoupe();
  });
})();