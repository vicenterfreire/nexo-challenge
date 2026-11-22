(() => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const categoryNames = { filosofia: 'Filosofia', sociologia: 'Sociologia', fisica: 'Física', psicologia: 'Psicologia', historia: 'História', tecnologia: 'Tecnologia' };
  const views = { explore: $('#home'), challenge: $('#challenge') };
  const navLinks = $$('.nav-link');
  const topicFields = { category: $('#topic-category'), type: $('#topic-type'), title: $('#topic-title'), description: $('#topic-description'), mission: $('#topic-mission') };
  const setup = $('#setup-panel'), session = $('#session-panel');
  let topics = [], activeTopic = null, phase = 'research', remaining = 0, interval = null, running = false, researchDuration = 600, presentationDuration = 300;
  const phaseDurations = { research: () => researchDuration, presentation: () => presentationDuration, discussion: () => 0 };
  const phaseMeta = {
    research: { label: 'PESQUISA', hint: 'Explore o tema. Siga sua curiosidade.', button: 'Iniciar pesquisa' },
    presentation: { label: 'APRESENTAÇÃO', hint: 'Explique o que descobriu com suas próprias palavras.', button: 'Iniciar apresentação' },
    discussion: { label: 'DISCUSSÃO', hint: 'Tempo livre para conversar, questionar e compartilhar ideias.', button: 'Iniciar conversa' }
  };
  function showView(name) {
    const viewName = name === 'about' ? 'explore' : name;
    Object.values(views).forEach(v => v.classList.remove('active-view'));
    views[viewName]?.classList.add('active-view');
    navLinks.forEach(link => link.classList.toggle('active', link.dataset.view === viewName));
    $('.main-nav').classList.remove('open');
    if (viewName === 'challenge') window.scrollTo({ top: 0, behavior: 'smooth' });
    else if (name === 'about') $('#about').scrollIntoView({ behavior: 'smooth' });
  }
  $$('[data-view]').forEach(el => el.addEventListener('click', () => showView(el.dataset.view)));
  $$('.area-card').forEach(card => card.addEventListener('click', () => { $('#category-select').value = card.dataset.category; showView('challenge'); }));
  $('.menu-toggle').addEventListener('click', () => $('.main-nav').classList.toggle('open'));
  $('#year').textContent = new Date().getFullYear();
  function toast(message) { const t = $('#toast'); t.textContent = message; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2300); }
  function stopTimer() { if (interval) clearInterval(interval); interval = null; running = false; }
  function formatTime(seconds) { const m = Math.floor(seconds / 60), s = seconds % 60; return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`; }
  function renderTimer() {
    $('#timer-display').textContent = phase === 'discussion' ? '∞' : formatTime(remaining);
    $('#phase-label').textContent = phaseMeta[phase].label;
    $('#timer-hint').textContent = phaseMeta[phase].hint;
    $('#timer-toggle').textContent = phase === 'discussion' ? (running ? '■ Pausar' : '▶ Iniciar conversa') : (running ? 'Ⅱ Pausar' : `▶ ${phaseMeta[phase].button}`);
    $('#phase-research').classList.toggle('active', phase === 'research');
    $('#phase-presentation').classList.toggle('active', phase === 'presentation');
    $('#phase-discussion').classList.toggle('active', phase === 'discussion');
  }
  function beginPhase(nextPhase, autoStart = false) {
    stopTimer(); phase = nextPhase; remaining = phaseDurations[phase](); renderTimer();
    if (nextPhase === 'discussion') { $('#session-footnote').textContent = 'A conversa é livre. Encerre quando quiser.'; }
    else { $('#session-footnote').textContent = 'Quando o tempo acabar, vocês avançam para a próxima etapa.'; }
    if (autoStart) startTimer();
  }
  function startTimer() {
    if (phase === 'discussion') { running = true; renderTimer(); return; }
    if (running) return;
    running = true; renderTimer();
    interval = setInterval(() => {
      remaining--;
      if (remaining <= 0) { remaining = 0; stopTimer(); renderTimer(); toast('Tempo encerrado!'); setTimeout(() => { if (phase === 'research') beginPhase('presentation', true); else if (phase === 'presentation') beginPhase('discussion', false); }, 700); }
      else renderTimer();
    }, 1000);
  }
  $('#timer-toggle').addEventListener('click', () => { if (phase === 'discussion') { running = !running; renderTimer(); } else if (running) { stopTimer(); renderTimer(); } else startTimer(); });
  $('#timer-reset').addEventListener('click', () => { beginPhase(phase, false); toast('Etapa reiniciada.'); });
  $('#timer-next').addEventListener('click', () => { if (phase === 'research') beginPhase('presentation', false); else if (phase === 'presentation') beginPhase('discussion', false); else toast('A discussão já está em andamento.'); });
  function readDurations() {
    const r = $('#research-select').value, p = $('#presentation-select').value;
    researchDuration = (r === 'custom' ? Number($('#research-custom').value) : Number(r)) * 60;
    presentationDuration = (p === 'custom' ? Number($('#presentation-custom').value) : Number(p)) * 60;
    if (!researchDuration || researchDuration < 60 || researchDuration > 10800 || !presentationDuration || presentationDuration < 60 || presentationDuration > 5400) { toast('Informe tempos válidos.'); return false; }
    return true;
  }
  function randomFrom(list) { return list[Math.floor(Math.random() * list.length)]; }
  function drawTopic() {
    if (!topics.length) { toast('Os temas ainda não carregaram.'); return; }
    if (!readDurations()) return;
    const selected = $('#category-select').value;
    const pool = selected === 'all' ? topics : topics.filter(t => t.category === selected);
    if (!pool.length) { toast('Não há temas cadastrados nesta área.'); return; }
    activeTopic = randomFrom(pool);
    topicFields.category.textContent = categoryNames[activeTopic.category] || activeTopic.category;
    topicFields.type.textContent = (activeTopic.type || 'Tema').toUpperCase();
    topicFields.title.textContent = activeTopic.title;
    topicFields.description.textContent = activeTopic.description;
    topicFields.mission.textContent = activeTopic.mission;
    setup.classList.add('hidden'); session.classList.remove('hidden');
    beginPhase('research', false);
    showView('challenge');
    session.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  $('#draw-button').addEventListener('click', drawTopic);
  $('#new-challenge').addEventListener('click', () => { stopTimer(); session.classList.add('hidden'); setup.classList.remove('hidden'); });
  $('#finish-session').addEventListener('click', () => { stopTimer(); session.classList.add('hidden'); setup.classList.remove('hidden'); showView('explore'); toast('Desafio concluído. Que ideia ficou com você?'); });
  $('#research-select').addEventListener('change', () => $('#custom-research').classList.toggle('hidden', $('#research-select').value !== 'custom'));
  $('#presentation-select').addEventListener('change', () => $('#custom-presentation').classList.toggle('hidden', $('#presentation-select').value !== 'custom'));
  fetch('topics.json').then(r => { if (!r.ok) throw new Error('Falha ao carregar topics.json'); return r.json(); }).then(data => { topics = data.topics || []; }).catch(err => { console.error(err); toast('Não foi possível carregar temas. Confira topics.json.'); });
})();
