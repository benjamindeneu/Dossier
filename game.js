// ============================================================
// MR. WHITE — Game Logic (event-delegation version)
// ============================================================

// ----- STATE -----
const state = {
  language: 'en',
  playerCount: 5,
  undercoverCount: 1,
  hasGhost: true,
  players: [],            // [{ id, name, role, word, eliminated }]
  civilianWord: "",
  undercoverWord: "",
  revealIndex: 0,
  revealed: false,
  roundNumber: 1,
  speakerOrder: null,
  speakerOrderRound: null,
  timer: { running: false, secondsLeft: 120, intervalId: null },
};

const TRANSLATIONS = {
  en: {
    'home-pretitle': 'Case File · Volume I',
    'home-subtitle': '— a game of words & lies —',
    'briefing-label': 'Briefing',
    'briefing-title': 'Three Roles. One Truth.',
    'briefing-p1': '<strong>Civilians</strong> share a secret word. <strong>Undercovers</strong> hold a similar but different word. <strong>The Ghost</strong> knows nothing — and must bluff.',
    'briefing-p2': 'Each round, every player describes their word with a single hint. Then everyone votes to eliminate a suspect.',
    'btn-new-game': '▸ NEW GAME',
    'btn-rules': 'HOW TO PLAY',
    'footer-pass': 'PASS · THE · DEVICE',
    'rules-pretitle': 'Section II',
    'rules-title': 'The Rules',
    'rules-s1-title': '§ 1 · Setup',
    'rules-s1-items': ['Pick the number of players (3 or more).', 'Assign Undercovers and optionally The Ghost.', 'The device is passed around. Each player privately views their secret.'],
    'rules-s2-title': '§ 2 · Roles',
    'rules-s2-items': ['<strong>Civilians</strong> — receive the majority word. Goal: eliminate all impostors.', '<strong>Undercovers</strong> — receive a related but different word. Goal: survive.', '<strong>The Ghost</strong> — receives no word. Goal: survive long enough to guess the civilians\' word.'],
    'rules-s3-title': '§ 3 · A Round',
    'rules-s3-items': ['Starting with a randomly chosen player, each living player gives <em>one word</em> describing their secret word.', 'Hints must be subtle: too vague and you\'re suspicious, too obvious and you give it away.', 'You may not say the secret word itself, nor repeat a previous hint.', 'After everyone has spoken, players discuss and vote.'],
    'rules-s4-title': '§ 4 · Voting & Endgame',
    'rules-s4-items': ['The most-voted player is eliminated and their role revealed.', 'If The Ghost is eliminated, they get one chance to guess the civilians\' word — guess right and they steal the win.', 'Civilians win when all impostors are eliminated. Impostors win when they equal the civilians in number.'],
    'btn-back': '◂ BACK',
    'setup-pretitle': 'Operation Setup',
    'setup-title': 'Roster',
    'setup-count-label': 'Player Count',
    'setup-count-hint': '3 to 20 players · pass the device between rounds',
    'setup-names-label': 'Names (optional)',
    'setup-roles-label': 'Roles',
    'setup-undercover-label': 'Undercover Agents',
    'setup-ghost-toggle': 'Include The Ghost',
    'setup-composition-label': 'Composition',
    'btn-start': '▸ DEAL THE CARDS',
    'reveal-pass': 'PASS THE DEVICE',
    'reveal-subtext': 'Take it. Hide it from the others.',
    'reveal-tap': '▸ TAP TO REVEAL ◂',
    'reveal-next': '▸ NEXT PLAYER',
    'reveal-start': '▸ START THE GAME',
    'reveal-hide': '▸ NEXT PLAYER · TAP TO HIDE',
    'reveal-hidden': '▸ HIDDEN — PASS DEVICE',
    'reveal-pass-next': 'Hand the device to the next player.',
    'round-order': 'Speaking Order',
    'round-desc': 'Each player gives ONE word about their secret',
    'timer-optional': 'Discussion Timer (optional)',
    'timer-tap-start': 'tap below to start',
    'timer-btn-start': 'START 2:00 TIMER',
    'timer-label-discussion': 'discussion',
    'timer-label-up': 'time\'s up — vote',
    'btn-proceed-vote': '▸ PROCEED TO VOTE',
    'btn-more-disc': '◂ MORE DISCUSSION',
    'vote-pretitle': 'Round',
    'vote-title': 'The Vote',
    'vote-subtitle': '— who is hiding something? —',
    'vote-instruction': 'Tap the player to eliminate',
    'elim-title': '✦ ELIMINATED ✦',
    'elim-was': 'WAS REVEALED TO BE',
    'elim-btn-cont': '▸ CONTINUE',
    'ghost-last-chance': '✦ LAST CHANCE ✦',
    'ghost-gambit': 'The Ghost\'s Gambit',
    'ghost-caught-subtext': ', you\'ve been caught.<br/>Guess the civilians\' word to steal the win.',
    'ghost-placeholder': 'enter your guess...',
    'ghost-submit': '▸ SUBMIT GUESS',
    'end-title': '✦ END OF GAME ✦',
    'end-btn-again': '▸ PLAY AGAIN · SAME PLAYERS',
    'end-btn-new': '▸ NEW GAME',
    'role-civilian': 'CIVILIAN',
    'role-undercover': 'UNDERCOVER',
    'role-ghost': 'THE GHOST',
    'win-civilians': 'CIVILIANS WIN',
    'win-ghost': 'THE GHOST WINS',
    'win-impostors': 'IMPOSTORS WIN',
    'win-undercovers': 'UNDERCOVERS WIN',
    'status-eliminated': '(eliminated)',
    'end-cast-label': 'The Whole Cast'
  },
  fr: {
    'home-pretitle': 'Dossier · Volume I',
    'home-subtitle': '— un jeu de mots et de mensonges —',
    'briefing-label': 'Briefing',
    'briefing-title': 'Trois Rôles. Une Vérité.',
    'briefing-p1': 'Les <strong>Civils</strong> partagent un mot secret. Les <strong>Infiltrés</strong> ont un mot proche mais différent. <strong>Le Fantôme</strong> ne sait rien — et doit bluffer.',
    'briefing-p2': 'À chaque tour, chaque joueur décrit son mot avec un seul indice. Ensuite, tout le monde vote pour éliminer un suspect.',
    'btn-new-game': '▸ NOUVEAU JEU',
    'btn-rules': 'COMMENT JOUER',
    'footer-pass': 'PASSEZ · LE · TÉLÉPHONE',
    'rules-pretitle': 'Section II',
    'rules-title': 'Les Règles',
    'rules-s1-title': '§ 1 · Mise en place',
    'rules-s1-items': ['Choisissez le nombre de joueurs (3 ou plus).', 'Ajoutez des Infiltrés et éventuellement le Fantôme.', 'Le téléphone circule. Chaque joueur regarde son secret en privé.'],
    'rules-s2-title': '§ 2 · Les Rôles',
    'rules-s2-items': ['<strong>Civils</strong> — reçoivent le mot majoritaire. But : éliminer les imposteurs.', '<strong>Infiltrés</strong> — reçoivent un mot lié mais différent. But : survivre.', '<strong>Le Fantôme</strong> — ne reçoit aucun mot. But : survivre et deviner le mot des civils.'],
    'rules-s3-title': '§ 3 · Un Tour',
    'rules-s3-items': ['En commençant par un joueur aléatoire, chaque joueur vivant donne <em>un mot</em> décrivant son secret.', 'Les indices doivent être subtils : trop vagues et vous êtes suspect, trop évidents et vous trahissez le mot.', 'Interdiction de dire le mot secret ou de répéter un indice précédent.', 'Après que tout le monde a parlé, on discute et on vote.'],
    'rules-s4-title': '§ 4 · Vote et Fin de partie',
    'rules-s4-items': ['Le joueur le plus voté est éliminé et son rôle révélé.', 'Si le Fantôme est éliminé, il peut tenter de deviner le mot des civils pour voler la victoire.', 'Les civils gagnent quand tous les imposteurs sont éliminés. Les imposteurs gagnent s\'ils sont aussi nombreux que les civils.'],
    'btn-back': '◂ RETOUR',
    'setup-pretitle': 'Configuration',
    'setup-title': 'Effectif',
    'setup-count-label': 'Nombre de joueurs',
    'setup-count-hint': '3 à 20 joueurs · passez le téléphone entre les tours',
    'setup-names-label': 'Noms (optionnel)',
    'setup-roles-label': 'Rôles',
    'setup-undercover-label': 'Agents Infiltrés',
    'setup-ghost-toggle': 'Inclure le Fantôme',
    'setup-composition-label': 'Composition',
    'btn-start': '▸ DISTRIBUER LES CARTES',
    'reveal-pass': 'PASSEZ LE TÉLÉPHONE',
    'reveal-subtext': 'Prenez-le. Cachez-le aux autres.',
    'reveal-tap': '▸ APPUYER POUR RÉVÉLER ◂',
    'reveal-next': '▸ JOUEUR SUIVANT',
    'reveal-start': '▸ COMMENCER LE JEU',
    'reveal-hide': '▸ JOUEUR SUIVANT · CACHER',
    'reveal-hidden': '▸ CACHÉ — PASSEZ LE TÉLÉPHONE',
    'reveal-pass-next': 'Donnez l\'appareil au joueur suivant.',
    'round-order': 'Ordre de Parole',
    'round-desc': 'Chaque joueur donne UN mot sur son secret',
    'timer-optional': 'Chronomètre (optionnel)',
    'timer-tap-start': 'appuyez pour démarrer',
    'timer-btn-start': 'DÉMARRER 2:00',
    'timer-label-discussion': 'discussion',
    'timer-label-up': 'temps écoulé — votez',
    'btn-proceed-vote': '▸ PASSER AU VOTE',
    'btn-more-disc': '◂ CONTINUER À DISCUTER',
    'vote-pretitle': 'Tour',
    'vote-title': 'Le Vote',
    'vote-subtitle': '— qui cache quelque chose ? —',
    'vote-instruction': 'Appuyez sur le joueur à éliminer',
    'elim-title': '✦ ÉLIMINÉ ✦',
    'elim-was': 'A ÉTÉ RÉVÉLÉ COMME ÉTANT',
    'elim-btn-cont': '▸ CONTINUER',
    'ghost-last-chance': '✦ DERNIÈRE CHANCE ✦',
    'ghost-gambit': 'Le Gambit du Fantôme',
    'ghost-caught-subtext': ', vous avez été démasqué.<br/>Devinez le mot des civils pour voler la victoire.',
    'ghost-placeholder': 'votre réponse...',
    'ghost-submit': '▸ VALIDER',
    'end-title': '✦ FIN DE PARTIE ✦',
    'end-btn-again': '▸ REJOUER · MÊME ÉQUIPE',
    'end-btn-new': '▸ NOUVEAU JEU',
    'role-civilian': 'CIVIL',
    'role-undercover': 'INFILTRÉ',
    'role-ghost': 'LE FANTÔME',
    'win-civilians': 'VICTOIRE DES CIVILS',
    'win-ghost': 'VICTOIRE DU FANTÔME',
    'win-impostors': 'VICTOIRE DES IMPOSTEURS',
    'win-undercovers': 'VICTOIRE DES INFILTRÉS',
    'status-eliminated': '(éliminé)',
    'end-cast-label': 'Récapitulatif des rôles'
  }
};

function t(key) {
  return TRANSLATIONS[state.language][key] || key;
}

function updateStaticUI() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  // Complex bits
  const briefing = document.getElementById('briefing-content');
  if (briefing) briefing.innerHTML = `<p>${t('briefing-p1')}</p><p>${t('briefing-p2')}</p>`;
  
  const rulesContainer = document.getElementById('rules-container');
  if (rulesContainer) {
    rulesContainer.innerHTML = [1,2,3,4].map(num => `
      <div class="file">
        <div class="file-label">${t(`rules-s${num}-title`)}</div>
        <ul class="info-list">
          ${t(`rules-s${num}-items`).map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    `).join('');
  }
}

// ----- HELPERS -----
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function escapeHtml(s) {
  if (s == null) return '';
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);
}

// ----- NAVIGATION -----
function goto(sceneName) {
  document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));
  const target = document.getElementById('scene-' + sceneName);
  if (target) target.classList.add('active');
  window.scrollTo(0, 0);
  updateStaticUI();

  if (sceneName === 'setup') renderSetup();
  if (sceneName === 'reveal') renderReveal();
  if (sceneName === 'round') renderRound();
  if (sceneName === 'vote') renderVote();
  if (sceneName === 'end') renderEnd();
}

// ----- SETUP -----
function changePlayerCount(delta) {
  const next = Math.max(3, Math.min(20, state.playerCount + delta));
  state.playerCount = next;
  const maxImpostors = Math.max(1, state.playerCount - 2);
  const maxUndercover = state.hasGhost ? maxImpostors - 1 : maxImpostors;
  const minUndercover = state.hasGhost ? 0 : 1;
  state.undercoverCount = Math.max(minUndercover, Math.min(maxUndercover, state.undercoverCount));
  renderSetup();
}

function changeUndercover(delta) {
  const maxImpostors = Math.max(1, state.playerCount - 2);
  const maxUndercover = state.hasGhost ? maxImpostors - 1 : maxImpostors;
  const minUndercover = state.hasGhost ? 0 : 1;
  const next = Math.max(minUndercover, Math.min(maxUndercover, state.undercoverCount + delta));
  state.undercoverCount = next;
  renderSetup();
}

function toggleGhost() {
  state.hasGhost = !state.hasGhost;
  const maxImpostors = Math.max(1, state.playerCount - 2);
  const maxUndercover = state.hasGhost ? maxImpostors - 1 : maxImpostors;
  const minUndercover = state.hasGhost ? 0 : 1;
  state.undercoverCount = Math.max(minUndercover, Math.min(maxUndercover, state.undercoverCount));
  renderSetup();
}

function renderSetup() {
  document.getElementById('player-count-display').textContent = state.playerCount;
  document.getElementById('undercover-count').textContent = state.undercoverCount;
  document.getElementById('ghost-toggle').classList.toggle('on', state.hasGhost);

  // Sync players array with playerCount
  while (state.players.length < state.playerCount) {
    state.players.push({ id: state.players.length, name: '', role: null, word: null, eliminated: false });
  }
  if (state.players.length > state.playerCount) {
    state.players = state.players.slice(0, state.playerCount);
  }

  // Render player name list
  const list = document.getElementById('setup-player-list');
  list.innerHTML = '';
  state.players.forEach((p, i) => {
    const li = document.createElement('li');
    li.className = 'player-row';

    const numSpan = document.createElement('span');
    numSpan.className = 'num';
    numSpan.textContent = String(i + 1).padStart(2, '0');

    const input = document.createElement('input');
    input.type = 'text';
    input.maxLength = 20;
    input.placeholder = `Player ${i + 1}`;
    input.value = p.name;
    input.style.cssText = 'background:transparent; border:none; padding:0; font-size:18px; color:var(--paper); font-family:inherit; outline:none; width:100%;';
    input.addEventListener('input', e => {
      state.players[i].name = e.target.value;
    });

    li.appendChild(numSpan);
    li.appendChild(input);
    list.appendChild(li);
  });

  // Composition chips
  const civCount = state.playerCount - state.undercoverCount - (state.hasGhost ? 1 : 0);
  const comp = document.getElementById('composition-display');
  comp.innerHTML = '';
  const chips = [
    `${civCount} ${t('role-civilian')}${civCount !== 1 ? 'S' : ''}`,
    `${state.undercoverCount} ${t('role-undercover')}${state.undercoverCount !== 1 ? 'S' : ''}`,
  ];
  if (state.hasGhost) chips.push(`1 ${t('role-ghost')}`);
  chips.forEach(label => {
    const span = document.createElement('span');
    span.className = 'role-chip';
    span.textContent = label;
    comp.appendChild(span);
  });
}

// ----- START GAME (deal cards) -----
function startGame() {
  state.players.forEach((p, i) => {
    if (!p.name || !p.name.trim()) p.name = `Player ${i + 1}`;
    p.eliminated = false;
  });

  const { civilian, undercover } = pickWordPair(state.language);
  state.civilianWord = civilian;
  state.undercoverWord = undercover;

  const civCount = state.playerCount - state.undercoverCount - (state.hasGhost ? 1 : 0);
  const roles = [];
  for (let i = 0; i < civCount; i++) roles.push('civilian');
  for (let i = 0; i < state.undercoverCount; i++) roles.push('undercover');
  if (state.hasGhost) roles.push('ghost');

  shuffle(roles);

  state.players.forEach((p, i) => {
    p.role = roles[i];
    if (p.role === 'civilian') p.word = state.civilianWord;
    else if (p.role === 'undercover') p.word = state.undercoverWord;
    else p.word = null;
    p.eliminated = false;
  });

  state.revealOrder = state.players.map((_, i) => i);
  shuffle(state.revealOrder);

  state.revealIndex = 0;
  state.revealed = false;
  state.roundNumber = 1;
  state.speakerOrder = null;

  goto('reveal');
}

// ----- REVEAL PHASE -----
function renderReveal() {
  const playerIdx = state.revealOrder[state.revealIndex];
  const player = state.players[playerIdx];

  document.getElementById('reveal-name').textContent = player.name.toUpperCase();
  document.getElementById('reveal-instruction').textContent = `${t('reveal-pass')} (${state.revealIndex + 1}/${state.players.length})`;
  document.getElementById('reveal-subtext').textContent = t('reveal-subtext');

  const card = document.getElementById('secret-card');
  card.classList.add('locked');
  state.revealed = false;

  document.getElementById('reveal-next-btn').style.display = 'none';

  let roleLabel = '';
  let wordHTML = '';

  if (player.role === 'civilian') {
    roleLabel = t('role-civilian');
    wordHTML = `<div class="secret-word">${escapeHtml(player.word)}</div>`;
  } else if (player.role === 'undercover') {
    roleLabel = t('role-undercover');
    wordHTML = `<div class="secret-word">${escapeHtml(player.word)}</div>`;
  } else {
    roleLabel = t('role-ghost');
    wordHTML = `<div class="secret-word no-word">${state.language === 'fr' ? 'aucun mot' : 'no word'}</div>`;
  }

  card.innerHTML = `
    <div class="tap-hint">${t('reveal-tap')}</div>
    <div class="secret-content">
      <div class="secret-role">${roleLabel}</div>
      ${wordHTML}
    </div>
  `;
  // Re-add data-action since innerHTML cleared listeners but data attribute survives the parent
  card.setAttribute('data-action', 'reveal-secret');
}

function revealSecret() {
  const card = document.getElementById('secret-card');
  if (card.classList.contains('locked')) {
    card.classList.remove('locked');
    state.revealed = true;
    const nextBtn = document.getElementById('reveal-next-btn');
    nextBtn.style.display = 'block';
    const isLast = state.revealIndex >= state.revealOrder.length - 1;
    nextBtn.textContent = isLast ? t('reveal-start') : t('reveal-next');
  }
}

function nextReveal() {
  state.revealIndex++;
  if (state.revealIndex >= state.revealOrder.length) {
    goto('round');
  } else {
    renderReveal();
  }
}

// ----- ROUND PHASE -----
function renderRound() {
  document.getElementById('round-number').textContent = `${t('vote-pretitle').toUpperCase()} ${state.roundNumber}`;
  document.getElementById('vote-round-num').textContent = state.roundNumber;

  if (!state.speakerOrder || state.speakerOrderRound !== state.roundNumber) {
    const aliveIdx = [];
    state.players.forEach((p, i) => { if (!p.eliminated) aliveIdx.push(i); });
    shuffle(aliveIdx);
    state.speakerOrder = aliveIdx;
    state.speakerOrderRound = state.roundNumber;
  }

  const list = document.getElementById('speaker-list');
  list.innerHTML = '';
  state.speakerOrder.forEach((idx, position) => {
    const p = state.players[idx];
    const li = document.createElement('li');
    li.className = 'speaker-row' + (p.eliminated ? ' eliminated' : '') + (position === 0 ? ' first-speaker' : '');

    const nameSpan = document.createElement('span');
    nameSpan.style.flex = '1';
    nameSpan.textContent = p.name;
    li.appendChild(nameSpan);

    if (position === 0) {
      const badge = document.createElement('span');
      badge.className = 'speaker-badge';
      badge.textContent = 'begins';
      li.appendChild(badge);
    }

    list.appendChild(li);
  });

  resetTimer();
}

// ----- TIMER -----
function toggleTimer() {
  if (state.timer.running) pauseTimer();
  else startTimer();
}

function startTimer() {
  if (state.timer.running) return;
  state.timer.running = true;
  document.getElementById('timer-btn').textContent = 'PAUSE';
  document.getElementById('timer-label').textContent = 'discussion';
  state.timer.intervalId = setInterval(() => {
    state.timer.secondsLeft--;
    updateTimerDisplay();
    if (state.timer.secondsLeft <= 0) {
      pauseTimer();
      document.getElementById('timer-label').textContent = "time's up — vote";
    }
  }, 1000);
}

function pauseTimer() {
  state.timer.running = false;
  if (state.timer.intervalId) clearInterval(state.timer.intervalId);
  state.timer.intervalId = null;
  const btn = document.getElementById('timer-btn');
  if (btn) btn.textContent = state.timer.secondsLeft < 120 && state.timer.secondsLeft > 0 ? 'RESUME' : 'START 2:00 TIMER';
}

function resetTimer() {
  pauseTimer();
  state.timer.secondsLeft = 120;
  updateTimerDisplay();
  const label = document.getElementById('timer-label');
  if (label) label.textContent = 'tap below to start';
  const btn = document.getElementById('timer-btn');
  if (btn) btn.textContent = 'START 2:00 TIMER';
}

function updateTimerDisplay() {
  const m = Math.floor(state.timer.secondsLeft / 60);
  const s = state.timer.secondsLeft % 60;
  const display = document.getElementById('timer-display');
  if (!display) return;
  display.textContent = `${m}:${String(s).padStart(2, '0')}`;
  display.classList.toggle('warn', state.timer.secondsLeft <= 30);
}

// ----- VOTING -----
function renderVote() {
  pauseTimer();
  const grid = document.getElementById('vote-grid');
  grid.innerHTML = '';
  state.players.forEach((p, i) => {
    const tile = document.createElement('div');
    tile.className = 'vote-tile' + (p.eliminated ? ' eliminated' : '');
    tile.textContent = p.name;
    if (!p.eliminated) {
      tile.addEventListener('click', () => eliminate(i));
    }
    grid.appendChild(tile);
  });
}

function eliminate(playerIdx) {
  const p = state.players[playerIdx];
  if (p.eliminated) return;
  p.eliminated = true;
  state.lastEliminated = playerIdx;

  if (p.role === 'ghost') {
    showElimination(playerIdx, () => {
      goto('ghost-guess');
      document.getElementById('ghost-name').textContent = p.name;
      document.getElementById('ghost-input').value = '';
      setTimeout(() => {
        const inp = document.getElementById('ghost-input');
        if (inp) inp.focus();
      }, 300);
    });
  } else {
    showElimination(playerIdx, () => {
      const verdict = checkWinCondition();
      if (verdict) {
        state.winningTeam = verdict;
        goto('end');
      } else {
        state.roundNumber++;
        state.speakerOrder = null;
        goto('round');
      }
    });
  }
}

function showElimination(playerIdx, callback) {
  const p = state.players[playerIdx];
  document.getElementById('elim-name').textContent = p.name;
  const roleEl = document.getElementById('elim-role');
  const wordEl = document.getElementById('elim-word');
  roleEl.classList.remove('civilian', 'undercover', 'ghost');

  if (p.role === 'civilian') {
    roleEl.textContent = t('role-civilian');
    roleEl.classList.add('civilian');
    wordEl.textContent = state.language === 'fr' ? `son mot était "${p.word}"` : `their word was "${p.word}"`;
  } else if (p.role === 'undercover') {
    roleEl.textContent = t('role-undercover');
    roleEl.classList.add('undercover');
    wordEl.textContent = state.language === 'fr' ? `son mot était "${p.word}"` : `their word was "${p.word}"`;
  } else {
    roleEl.textContent = t('role-ghost');
    roleEl.classList.add('ghost');
    wordEl.textContent = state.language === 'fr' ? "il n'avait aucun mot" : "they had no word at all";
  }

  state.afterElimCallback = callback;
  goto('elimination');
}

function afterElimination() {
  if (state.afterElimCallback) {
    const cb = state.afterElimCallback;
    state.afterElimCallback = null;
    cb();
  }
}

// ----- GHOST GUESS -----
function submitGhostGuess() {
  const inp = document.getElementById('ghost-input');
  const guess = (inp.value || '').trim();
  if (!guess) return;

  const guessNorm = guess.toLowerCase().replace(/[^a-z0-9]/g, '');
  const correctNorm = state.civilianWord.toLowerCase().replace(/[^a-z0-9]/g, '');

  state.ghostGuess = guess;

  if (guessNorm === correctNorm) {
    state.winningTeam = 'ghost';
    goto('end');
  } else {
    const verdict = checkWinCondition();
    if (verdict) {
      state.winningTeam = verdict;
      goto('end');
    } else {
      state.roundNumber++;
      state.speakerOrder = null;
      goto('round');
    }
  }
}

// ----- WIN CONDITIONS -----
function checkWinCondition() {
  const alive = state.players.filter(p => !p.eliminated);
  const aliveImpostors = alive.filter(p => p.role === 'undercover' || p.role === 'ghost');
  const aliveCivilians = alive.filter(p => p.role === 'civilian');

  if (aliveImpostors.length === 0) return 'civilian';

  if (aliveImpostors.length >= aliveCivilians.length) {
    const undercoversAlive = alive.filter(p => p.role === 'undercover').length;
    const ghostAlive = alive.filter(p => p.role === 'ghost').length;
    if (undercoversAlive > 0 && ghostAlive > 0) return 'undercover_and_ghost';
    if (undercoversAlive > 0) return 'undercover';
    if (ghostAlive > 0) return 'ghost_survives';
  }

  return null;
}

// ----- END SCREEN -----
function renderEnd() {
  const banner = document.getElementById('end-banner');
  const subtitle = document.getElementById('end-subtitle');
  banner.classList.remove('civilian-win', 'undercover-win', 'ghost-win');

  const team = state.winningTeam;
  if (team === 'civilian') {
    banner.textContent = t('win-civilians');
    banner.classList.add('civilian-win');
    subtitle.textContent = state.language === 'fr' ? 'tous les imposteurs démasqués.' : 'all impostors unmasked.';
  } else if (team === 'ghost') {
    banner.textContent = t('win-ghost');
    banner.classList.add('ghost-win');
    subtitle.textContent = state.language === 'fr' ? `démasqué — mais a deviné "${state.ghostGuess}" correctement.` : `caught — but guessed "${state.ghostGuess}" correctly.`;
  } else if (team === 'ghost_survives') {
    banner.textContent = t('win-ghost');
    banner.classList.add('ghost-win');
    subtitle.textContent = state.language === 'fr' ? "a survécu jusqu'à la fin. le bluff a tenu." : 'survived to the end. the bluff held.';
  } else if (team === 'undercover') {
    banner.textContent = t('win-undercovers');
    banner.classList.add('undercover-win');
    subtitle.textContent = state.language === 'fr' ? 'ils étaient plus nombreux que les civils.' : 'they outnumbered the herd.';
  } else if (team === 'undercover_and_ghost') {
    banner.textContent = t('win-impostors');
    banner.classList.add('undercover-win');
    subtitle.textContent = state.language === 'fr' ? 'les loups ont survécu aux moutons.' : 'the wolves outlasted the sheep.';
  }

  document.getElementById('end-civ-word').textContent = state.civilianWord;
  document.getElementById('end-und-word').textContent = state.undercoverWord;

  const list = document.getElementById('role-reveal-list');
  list.innerHTML = '';
  state.players.forEach(p => {
    const div = document.createElement('div');
    div.className = 'role-reveal-item';

    const nameSpan = document.createElement('span');
    nameSpan.textContent = p.name + (p.eliminated ? ` ${t('status-eliminated')}` : '');
    if (p.eliminated) nameSpan.style.opacity = '0.6';

    const tag = document.createElement('span');
    tag.className = 'role-tag ' + p.role;
    tag.textContent = p.role === 'ghost' ? t('role-ghost') : t(`role-${p.role}`);

    div.appendChild(nameSpan);
    div.appendChild(tag);
    list.appendChild(div);
  });
}

function newGameSameRoster() {
  state.players.forEach(p => {
    p.role = null;
    p.word = null;
    p.eliminated = false;
  });
  startGame();
}

// ============================================================
// EVENT DELEGATION (replaces all inline onclick handlers)
// ============================================================
function handleAction(action, target) {
  switch (action) {
    case 'set-lang':
      state.language = target.getAttribute('data-lang');
      updateStaticUI();
      break;
    case 'goto':
      goto(target.getAttribute('data-scene'));
      break;
    case 'player-count':
      changePlayerCount(parseInt(target.getAttribute('data-delta'), 10));
      break;
    case 'undercover-count':
      changeUndercover(parseInt(target.getAttribute('data-delta'), 10));
      break;
    case 'toggle-ghost':
      toggleGhost();
      break;
    case 'start-game':
      startGame();
      break;
    case 'reveal-secret':
      revealSecret();
      break;
    case 'next-reveal':
      nextReveal();
      break;
    case 'toggle-timer':
      toggleTimer();
      break;
    case 'after-elimination':
      afterElimination();
      break;
    case 'submit-ghost-guess':
      submitGhostGuess();
      break;
    case 'new-game-same-roster':
      newGameSameRoster();
      break;
  }
}

function bindGlobalListener() {
  document.body.addEventListener('click', (e) => {
    // Walk up from the clicked element to find a data-action
    let el = e.target;
    while (el && el !== document.body) {
      if (el.getAttribute && el.getAttribute('data-action')) {
        handleAction(el.getAttribute('data-action'), el);
        return;
      }
      el = el.parentNode;
    }
  });

  // Allow Enter to submit Ghost guess
  const ghostInput = document.getElementById('ghost-input');
  if (ghostInput) {
    ghostInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submitGhostGuess();
    });
  }
}

// ----- INIT -----
function init() {
  bindGlobalListener();
  renderSetup();

  // Prevent zoom on double-tap
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) e.preventDefault();
    lastTouchEnd = now;
  }, false);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
