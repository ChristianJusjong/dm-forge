// ========================================
// DM SCREEN - Vanilla JavaScript Application
// ========================================

// ========================================
// GLOBAL STATE & I18N
// ========================================

let currentLanguage = localStorage.getItem('language') || 'en';
let geminiApiKey = localStorage.getItem('gemini_api_key') || '';

// Translation function
function t(key) {
  return translations[currentLanguage]?.[key] || key;
}

// Update all translations in the DOM
function updateTranslations() {
  // Text content translations
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  // Placeholder translations
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });

  // Option translations
  document.querySelectorAll('option[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
}

// ========================================
// INITIATIVE TRACKER
// ========================================

const initiativeState = {
  combatants: [],
  round: 1,
  currentTurn: 0
};

function loadInitiativeData() {
  const saved = localStorage.getItem('initiative_tracker');
  if (saved) {
    const data = safeJSONParse(saved, {});
    initiativeState.combatants = data.combatants || [];
    initiativeState.round = data.round || 1;
    initiativeState.currentTurn = data.currentTurn || 0;
  }
}

function saveInitiativeData() {
  localStorage.setItem('initiative_tracker', JSON.stringify(initiativeState));
}

function renderCombatants() {
  const list = document.getElementById('combatants-list');
  const noCombatants = document.getElementById('no-combatants');

  if (initiativeState.combatants.length === 0) {
    list.innerHTML = '';
    noCombatants.style.display = 'block';
    return;
  }

  noCombatants.style.display = 'none';

  // Sort by initiative (highest first)
  const sorted = [...initiativeState.combatants].sort((a, b) => b.initiative - a.initiative);

  list.innerHTML = sorted.map((combatant, index) => {
    const isActive = index === initiativeState.currentTurn;
    return `
      <div class="combatant ${isActive ? 'active' : ''}" data-id="${combatant.id}">
        <div class="combatant-main">
          <div class="combatant-info">
            <h4>${escapeHTML(combatant.name)}</h4>
            <div class="combatant-stats">
              <span>${t('initiative')}: ${combatant.initiative}</span>
              <span>${t('hp')}:
                <input type="number" class="hp-input" value="${combatant.hp}" data-id="${combatant.id}" style="width: 50px;">
                / ${combatant.maxHp}
              </span>
              <span>${t('ac')}: ${combatant.ac}</span>
            </div>
            ${combatant.conditions && combatant.conditions.length > 0 ?
        `<div class="conditions">
                ${combatant.conditions.map((cond, i) =>
          `<span class="condition-tag">${escapeHTML(cond)} <button class="remove-condition" data-id="${combatant.id}" data-index="${i}">×</button></span>`
        ).join('')}
              </div>` : ''}
          </div>
          <div class="combatant-actions">
            <input type="text" class="condition-input" placeholder="${t('addCondition')}" data-id="${combatant.id}">
            <button class="btn-small remove-combatant" data-id="${combatant.id}">${t('remove')}</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  document.getElementById('round-number').textContent = initiativeState.round;

  // Add event listeners
  document.querySelectorAll('.hp-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const id = parseInt(e.target.dataset.id);
      const combatant = initiativeState.combatants.find(c => c.id === id);
      if (combatant) {
        combatant.hp = parseInt(e.target.value);
        saveInitiativeData();
      }
    });
  });

  document.querySelectorAll('.condition-input').forEach(input => {
    input.addEventListener('keyup', (e) => {
      if (e.key === 'Enter' && e.target.value.trim()) {
        const id = parseInt(e.target.dataset.id);
        const combatant = initiativeState.combatants.find(c => c.id === id);
        if (combatant) {
          if (!combatant.conditions) combatant.conditions = [];
          combatant.conditions.push(e.target.value.trim());
          e.target.value = '';
          saveInitiativeData();
          renderCombatants();
        }
      }
    });
  });

  document.querySelectorAll('.remove-condition').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.dataset.id);
      const index = parseInt(e.target.dataset.index);
      const combatant = initiativeState.combatants.find(c => c.id === id);
      if (combatant && combatant.conditions) {
        combatant.conditions.splice(index, 1);
        saveInitiativeData();
        renderCombatants();
      }
    });
  });

  document.querySelectorAll('.remove-combatant').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.dataset.id);
      initiativeState.combatants = initiativeState.combatants.filter(c => c.id !== id);
      if (initiativeState.currentTurn >= initiativeState.combatants.length) {
        initiativeState.currentTurn = 0;
      }
      saveInitiativeData();
      renderCombatants();
    });
  });
}

function addCombatant() {
  const name = document.getElementById('combatant-name').value.trim();
  const initiative = parseInt(document.getElementById('combatant-initiative').value);
  const hp = parseInt(document.getElementById('combatant-hp').value);
  const ac = parseInt(document.getElementById('combatant-ac').value);

  if (name && !isNaN(initiative) && !isNaN(hp) && !isNaN(ac)) {
    initiativeState.combatants.push({
      id: Date.now(),
      name,
      initiative,
      hp,
      maxHp: hp,
      ac,
      conditions: []
    });

    document.getElementById('combatant-name').value = '';
    document.getElementById('combatant-initiative').value = '';
    document.getElementById('combatant-hp').value = '';
    document.getElementById('combatant-ac').value = '';

    saveInitiativeData();
    renderCombatants();
  }
}

function nextTurn() {
  if (initiativeState.combatants.length === 0) return;

  initiativeState.currentTurn++;
  if (initiativeState.currentTurn >= initiativeState.combatants.length) {
    initiativeState.currentTurn = 0;
    initiativeState.round++;
  }

  saveInitiativeData();
  renderCombatants();
}

function resetCombat() {
  if (confirm(t('resetCombatConfirm'))) {
    initiativeState.combatants = [];
    initiativeState.round = 1;
    initiativeState.currentTurn = 0;
    saveInitiativeData();
    renderCombatants();
  }
}

// ========================================
// ENCOUNTER BUILDER
// ========================================

let encounters = [];
let editingEncounterId = null;

function loadEncounters() {
  const saved = localStorage.getItem('encounters');
  if (saved) {
    encounters = safeJSONParse(saved, []);
  }
}

function saveEncounters() {
  localStorage.setItem('encounters', JSON.stringify(encounters));
}

function renderEncounters() {
  const list = document.getElementById('encounters-list');
  const noEncounters = document.getElementById('no-encounters');

  if (encounters.length === 0) {
    list.innerHTML = '';
    noEncounters.style.display = 'block';
    return;
  }

  noEncounters.style.display = 'none';

  list.innerHTML = encounters.map(encounter => {
    const totalCR = encounter.creatures.reduce((sum, c) => sum + (c.cr || 0), 0).toFixed(2);
    const isEditing = editingEncounterId === encounter.id;

    return `
      <div class="encounter-card">
        <div class="encounter-info">
          <h3>${escapeHTML(encounter.name)}</h3>
          ${encounter.description ? `<p class="description">${escapeHTML(encounter.description)}</p>` : ''}
          <div class="encounter-stats">
            <span>${t('creatures')}: ${encounter.creatures.length}</span>
            ${encounter.creatures.length > 0 ? `<span>${t('totalCR')}: ${totalCR}</span>` : ''}
          </div>
        </div>

        <div class="encounter-actions">
          <button class="btn-small edit-encounter" data-id="${encounter.id}">${t('edit')}</button>
          <button class="btn-small load-encounter" data-id="${encounter.id}">${t('loadToInitiative')}</button>
          <button class="btn-small btn-danger delete-encounter" data-id="${encounter.id}">${t('delete')}</button>
        </div>

        ${encounter.creatures.length > 0 ? `
          <div class="creatures-list">
            ${encounter.creatures.map((creature, index) => `
              <div class="creature-item">
                <div class="creature-info">
                  <span class="creature-name">${escapeHTML(creature.name)}</span>
                  <span class="creature-stat">${t('hp')}: ${creature.hp}</span>
                  <span class="creature-stat">${t('ac')}: ${creature.ac}</span>
                  <span class="creature-stat">${t('cr')}: ${creature.cr || 0}</span>
                </div>
                <button class="btn-tiny remove-creature" data-encounter-id="${encounter.id}" data-index="${index}">${t('remove')}</button>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${isEditing ? `
          <div class="add-creature-form">
            <input type="text" class="input creature-name-input" placeholder="${t('creatureName')}" data-encounter-id="${encounter.id}">
            <input type="number" class="input short creature-hp-input" placeholder="${t('hp')}" value="10" data-encounter-id="${encounter.id}">
            <input type="number" class="input short creature-ac-input" placeholder="${t('ac')}" value="10" data-encounter-id="${encounter.id}">
            <input type="number" class="input short creature-cr-input" placeholder="${t('cr')}" value="0" step="0.125" data-encounter-id="${encounter.id}">
            <input type="number" class="input short creature-count-input" placeholder="${t('count')}" value="1" min="1" data-encounter-id="${encounter.id}">
            <button class="btn-small add-creature-to-encounter" data-encounter-id="${encounter.id}">${t('add')}</button>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');

  // Add event listeners
  document.querySelectorAll('.edit-encounter').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.dataset.id);
      editingEncounterId = editingEncounterId === id ? null : id;
      renderEncounters();
    });
  });

  document.querySelectorAll('.delete-encounter').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (confirm(t('deleteEncounterConfirm'))) {
        const id = parseInt(e.target.dataset.id);
        encounters = encounters.filter(enc => enc.id !== id);
        saveEncounters();
        renderEncounters();
      }
    });
  });

  document.querySelectorAll('.load-encounter').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.dataset.id);
      const encounter = encounters.find(enc => enc.id === id);
      if (encounter) {
        encounter.creatures.forEach(creature => {
          initiativeState.combatants.push({
            id: Date.now() + Math.random(),
            name: creature.name,
            initiative: 10,
            hp: creature.hp,
            maxHp: creature.hp,
            ac: creature.ac,
            conditions: []
          });
        });
        saveInitiativeData();
        alert(`${encounter.creatures.length} ${t('creaturesLoaded')}`);

        // Switch to initiative tab
        switchTab('initiative');
        renderCombatants();
      }
    });
  });

  document.querySelectorAll('.remove-creature').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const encounterId = parseInt(e.target.dataset.encounterId);
      const index = parseInt(e.target.dataset.index);
      const encounter = encounters.find(enc => enc.id === encounterId);
      if (encounter) {
        encounter.creatures.splice(index, 1);
        saveEncounters();
        renderEncounters();
      }
    });
  });

  document.querySelectorAll('.add-creature-to-encounter').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const encounterId = parseInt(e.target.dataset.encounterId);
      const encounter = encounters.find(enc => enc.id === encounterId);

      const nameInput = document.querySelector(`.creature-name-input[data-encounter-id="${encounterId}"]`);
      const hpInput = document.querySelector(`.creature-hp-input[data-encounter-id="${encounterId}"]`);
      const acInput = document.querySelector(`.creature-ac-input[data-encounter-id="${encounterId}"]`);
      const crInput = document.querySelector(`.creature-cr-input[data-encounter-id="${encounterId}"]`);
      const countInput = document.querySelector(`.creature-count-input[data-encounter-id="${encounterId}"]`);

      const name = nameInput.value.trim();
      const hp = parseInt(hpInput.value) || 10;
      const ac = parseInt(acInput.value) || 10;
      const cr = parseFloat(crInput.value) || 0;
      const count = parseInt(countInput.value) || 1;

      if (name && encounter) {
        for (let i = 0; i < count; i++) {
          const suffix = count > 1 ? ` ${i + 1}` : '';
          encounter.creatures.push({
            name: name + suffix,
            hp,
            ac,
            cr
          });
        }

        nameInput.value = '';
        saveEncounters();
        renderEncounters();
      }
    });
  });
}

function showNewEncounterModal() {
  document.getElementById('new-encounter-modal').style.display = 'flex';
}

function hideNewEncounterModal() {
  document.getElementById('new-encounter-modal').style.display = 'none';
  document.getElementById('new-encounter-name').value = '';
  document.getElementById('new-encounter-description').value = '';
}

function createEncounter() {
  const name = document.getElementById('new-encounter-name').value.trim();
  const description = document.getElementById('new-encounter-description').value.trim();

  if (name) {
    encounters.push({
      id: Date.now(),
      name,
      description,
      creatures: []
    });
    saveEncounters();
    renderEncounters();
    hideNewEncounterModal();
  }
}

// ========================================
// NPC GENERATOR
// ========================================

let savedNPCs = [];
let generatedNPC = null;
let viewingNPC = null;

function loadSavedNPCs() {
  const saved = localStorage.getItem('saved_npcs');
  if (saved) {
    savedNPCs = safeJSONParse(saved, []);
  }
}

function saveSavedNPCs() {
  localStorage.setItem('saved_npcs', JSON.stringify(savedNPCs));
}

function renderSavedNPCs() {
  const section = document.getElementById('saved-npcs-section');
  const grid = document.getElementById('saved-npcs-grid');

  if (savedNPCs.length === 0) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';

  grid.innerHTML = savedNPCs.map(npc => `
    <div class="npc-card" data-id="${npc.id}">
      <div class="npc-card-header">
        <h4>${escapeHTML(npc.name)}</h4>
        <button class="btn-tiny btn-danger delete-npc" data-id="${npc.id}">${t('delete')}</button>
      </div>
      <p class="npc-preview">${escapeHTML(npc.preview)}</p>
    </div>
  `).join('');

  document.querySelectorAll('.npc-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (!e.target.classList.contains('delete-npc')) {
        const id = parseInt(card.dataset.id);
        const npc = savedNPCs.find(n => n.id === id);
        if (npc) {
          viewNPC(npc);
        }
      }
    });
  });

  document.querySelectorAll('.delete-npc').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm(t('deleteNPCConfirm'))) {
        const id = parseInt(e.target.dataset.id);
        savedNPCs = savedNPCs.filter(n => n.id !== id);
        saveSavedNPCs();
        renderSavedNPCs();
      }
    });
  });
}

function viewNPC(npc) {
  viewingNPC = npc;
  document.getElementById('viewing-npc-name').textContent = npc.name;
  document.getElementById('viewing-npc-content').innerHTML = formatNPC(npc.content);
  document.getElementById('view-npc-modal').style.display = 'flex';
}

function closeNPCModal() {
  viewingNPC = null;
  document.getElementById('view-npc-modal').style.display = 'none';
}

function formatNPC(content) {
  return escapeHTML(content)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
}

async function generateNPC() {
  const apiKey = geminiApiKey;

  if (!apiKey) {
    document.getElementById('npc-error').textContent = t('apiKeyWarning');
    document.getElementById('npc-error').style.display = 'block';
    document.getElementById('npc-api-warning').style.display = 'block';
    return;
  }

  document.getElementById('npc-error').style.display = 'none';
  document.getElementById('npc-api-warning').style.display = 'none';

  const npcPrompt = document.getElementById('npc-prompt').value.trim();
  const npcRace = document.getElementById('npc-race').value;
  const setting = document.getElementById('npc-setting').value.trim();

  const generateBtn = document.getElementById('generate-npc-btn');
  generateBtn.disabled = true;
  generateBtn.textContent = t('generating');

  const prompt = `Generate a detailed D&D 5e NPC with the following specifications:
${npcPrompt ? `Role/Type: ${npcPrompt}` : ''}
${npcRace ? `Race: ${npcRace}` : ''}
${setting ? `Setting: ${setting}` : ''}

Please provide:
1. Name
2. Physical appearance
3. Personality traits and mannerisms
4. Background/backstory (brief)
5. Motivation/goals
6. A memorable quirk or secret
7. Key stats (HP, AC, notable abilities if combat-relevant)
8. Potential plot hooks for the DM

Format as clear sections. Be creative and specific!`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates[0].content.parts[0].text;

    // Extract name from content
    const nameMatch = content.match(/(?:Name|NPC Name):\s*\*?\*?([^\n*]+)\*?\*?/i);
    const name = nameMatch ? nameMatch[1].trim() : 'Generated NPC';

    generatedNPC = {
      name,
      content,
      timestamp: Date.now()
    };

    document.getElementById('generated-npc-name').textContent = name;
    document.getElementById('generated-npc-content').innerHTML = formatNPC(content);
    document.getElementById('generated-npc-display').style.display = 'block';

  } catch (err) {
    document.getElementById('npc-error').textContent = `${t('generateError')} ${err.message}`;
    document.getElementById('npc-error').style.display = 'block';
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = t('generateNPC');
  }
}

function saveGeneratedNPC() {
  if (generatedNPC) {
    const preview = generatedNPC.content.substring(0, 100).replace(/[*#]/g, '');
    savedNPCs.unshift({
      id: Date.now(),
      name: generatedNPC.name,
      content: generatedNPC.content,
      preview,
      timestamp: generatedNPC.timestamp
    });
    saveSavedNPCs();
    renderSavedNPCs();
    alert(t('npcSaved'));
  }
}

// ========================================
// RANDOM TABLES / INSPIRATION
// ========================================

const names = {
  en: {
    human: {
      first: ['Aldric', 'Beatrice', 'Cedric', 'Diana', 'Edmund', 'Fiona', 'Gerard', 'Helena', 'Ivan', 'Josephine', 'Klaus', 'Lydia', 'Marcus', 'Natalia', 'Oliver', 'Petra'],
      last: ['Blackwood', 'Ironforge', 'Silverstone', 'Goldleaf', 'Stormwind', 'Ashworth', 'Brightwater', 'Darkmore', 'Fairchild', 'Greywood']
    },
    elf: {
      first: ['Aelindra', 'Thranduil', 'Galadriel', 'Legolas', 'Arwen', 'Elrond', 'Tauriel', 'Celeborn', 'Haldir', 'Lindir'],
      last: ['Moonwhisper', 'Starweaver', 'Windrunner', 'Dawnbringer', 'Nightbreeze', 'Sunshadow']
    },
    dwarf: {
      first: ['Thorin', 'Gimli', 'Balin', 'Dwalin', 'Bombur', 'Bofur', 'Dori', 'Nori', 'Ori'],
      last: ['Ironfoot', 'Stonehelm', 'Bronzebeard', 'Hammerfall', 'Rockbreaker', 'Steelforge']
    },
    halfling: {
      first: ['Bilbo', 'Frodo', 'Samwise', 'Merry', 'Pippin', 'Rosie', 'Lily', 'Daisy', 'Poppy'],
      last: ['Baggins', 'Took', 'Brandybuck', 'Gamgee', 'Proudfoot', 'Underhill']
    },
    orc: {
      first: ['Grommash', 'Thrall', 'Garrosh', 'Durotan', 'Orgrim', 'Grom', 'Drek\'thar'],
      last: ['Hellscream', 'Doomhammer', 'Bloodfist', 'Blackhand', 'Skullcrusher']
    }
  },
  da: {
    human: {
      first: ['Anders', 'Birthe', 'Christian', 'Dorthe', 'Erik', 'Freja', 'Gunnar', 'Helga', 'Ivar', 'Karen', 'Lars', 'Mette', 'Niels', 'Sigrid', 'Thor', 'Yrsa'],
      last: ['Sortbjerg', 'Jernhammer', 'Sølvsten', 'Guldblade', 'Stormvind', 'Askelund', 'Klarvand', 'Mørkdal', 'Lysskov', 'Grønmark']
    },
    elf: {
      first: ['Alvilda', 'Eldor', 'Freydis', 'Galwin', 'Hildur', 'Isarn', 'Lunara', 'Mirafel', 'Nyx', 'Sylvaine'],
      last: ['Månehvisker', 'Stjernevevr', 'Vindløber', 'Daggry', 'Natbrise', 'Solskygge']
    },
    dwarf: {
      first: ['Balder', 'Dagmar', 'Fenris', 'Gorm', 'Helge', 'Ingvar', 'Knud', 'Ragnhild', 'Sven', 'Thyra'],
      last: ['Jernfod', 'Stenhjelm', 'Bronzeskæg', 'Hammerfald', 'Klippebryder', 'Stålsmed']
    },
    halfling: {
      first: ['Bo', 'Dorthe', 'Emil', 'Fie', 'Gorm', 'Hanne', 'Ib', 'Jytte', 'Keld', 'Lone'],
      last: ['Bakkebo', 'Humlebryg', 'Grønhøj', 'Lyseng', 'Stoltefod', 'Bakkeholm']
    },
    orc: {
      first: ['Grakthar', 'Throk', 'Urgoth', 'Drogash', 'Morzul', 'Grulk', 'Kragthor'],
      last: ['Helvedes-brøl', 'Dødshammer', 'Blodnæve', 'Sorthånd', 'Kranieknus']
    }
  }
};

const tavernNames = {
  en: {
    tavern: ['The Prancing Pony', 'The Drunken Dragon', 'The Golden Goblet', 'The Rusty Sword', 'The Laughing Bard', 'The Silver Stag', 'The Broken Shield', 'The Merry Minstrel'],
    shop: ['Mystic Emporium', 'Ironworks Armory', 'Potion & Elixir', 'Curiosities & Oddities', 'The Enchanted Quill', 'Adventurer\'s Supply'],
    inn: ['The Wayfarer\'s Rest', 'The Moonlit Haven', 'Traveler\'s Respite', 'The Cozy Hearth', 'The Wanderer\'s Lodge']
  },
  da: {
    tavern: ['Den Dansende Hest', 'Den Fulde Drage', 'Det Gyldne Bæger', 'Det Rustne Sværd', 'Den Syngende Skjald', 'Sølvhjorten', 'Det Knuste Skjold', 'Den Muntre Spillemand'],
    shop: ['Mystiske Emporium', 'Jernværkets Rustning', 'Eliksir & Trylledrik', 'Kuriositeter & Rariteter', 'Den Fortryllede Fjer', 'Eventyreres Forsyning'],
    inn: ['Vandrers Hvile', 'Månelys Havn', 'Rejsendes Ro', 'Den Hyggelige Arne', 'Vandrersmandens Logi']
  }
};

const plotHooks = {
  en: [
    'A local merchant has been receiving threatening letters demanding payment.',
    'Strange lights have been seen in the old ruins outside town.',
    'The town\'s children are having identical nightmares.',
    'A noble\'s prized horse has been stolen, and they\'re offering a reward.',
    'Graves in the cemetery have been disturbed, and valuables are missing.',
    'A traveling circus has arrived, but performers are disappearing.',
    'The town guard is looking for volunteers to clear out a bandit camp.',
    'An old map has surfaced showing the location of a lost treasure.',
    'A powerful artifact has been stolen from the local temple.',
    'Farmers report their livestock acting strangely and crops failing.'
  ],
  da: [
    'En lokal købmand har modtaget truende breve med krav om betaling.',
    'Mærkelige lys er blevet set i de gamle ruiner uden for byen.',
    'Byens børn har identiske mareridt.',
    'En ædelmands værdifulde hest er blevet stjålet, og han tilbyder en belønning.',
    'Grave på kirkegården er blevet forstyrret, og værdigenstande mangler.',
    'Et omrejsende cirkus er ankommet, men artister forsvinder.',
    'Byvagten søger frivillige til at rydde en røverlejr.',
    'Et gammelt kort er dukket op, der viser placeringen af en tabt skat.',
    'En mægtig artefakt er blevet stjålet fra det lokale tempel.',
    'Bønder rapporterer, at deres kvæg opfører sig underligt, og afgrøder fejler.'
  ]
};

const encounters = {
  en: {
    forest: ['1d4 Wolves', '1d6 Bandits', '1 Owlbear', '2d4 Goblins', '1 Displacer Beast', '1d4 Giant Spiders', '1 Treant (friendly)', '1d6 Deer (peaceful)'],
    dungeon: ['2d6 Kobolds', '1d4 Zombies', '1 Gelatinous Cube', '1d6 Giant Rats', '1 Mimic', '1d4 Skeletons', '1 Rust Monster', '1 Ochre Jelly'],
    city: ['2d4 Thugs', '1d4 Cultists', '1 Spy', 'City Guard Patrol', '1d6 Rats', '1 Pickpocket', 'Street Merchant', 'Noble\'s Carriage'],
    mountain: ['1d4 Harpies', '1 Griffon', '2d6 Kobolds', '1 Young Dragon', '1d4 Giant Eagles', '1 Roc', '1d6 Mountain Goats', '1 Stone Giant'],
    swamp: ['1d6 Giant Frogs', '2d4 Lizardfolk', '1 Troll', '1d4 Will-o\'-Wisps', '1 Green Hag', '1d6 Giant Leeches', '1 Black Dragon Wyrmling', '2d6 Stirges']
  },
  da: {
    forest: ['1t4 Ulve', '1t6 Banitter', '1 Uglebjørn', '2t4 Gobliner', '1 Forflytterdyr', '1t4 Kæmpe Edderkopper', '1 Træant (venlig)', '1t6 Hjorte (fredelige)'],
    dungeon: ['2t6 Kobolder', '1t4 Zombier', '1 Gelatinøs Terning', '1t6 Kæmpe Rotter', '1 Mimik', '1t4 Skeletter', '1 Rust Monster', '1 Okker Gelé'],
    city: ['2t4 Bøller', '1t4 Kultister', '1 Spion', 'Byvagt Patrulje', '1t6 Rotter', '1 Lommetyv', 'Gadehandler', 'Ædelmands Vogn'],
    mountain: ['1t4 Harpyer', '1 Grif', '2t6 Kobolder', '1 Ung Drage', '1t4 Kæmpe Ørne', '1 Rok', '1t6 Bjergeder', '1 Sten Kæmpe'],
    swamp: ['1t6 Kæmpe Frøer', '2t4 Øglefolk', '1 Trold', '1t4 Irrblus', '1 Grøn Heks', '1t6 Kæmpe Igler', '1 Sort Drageunge', '2t6 Stingers']
  }
};

const rumors = {
  en: [
    'The mayor is secretly dealing with dark forces.',
    'There\'s a hidden passage beneath the old church.',
    'A dragon has been spotted flying over the mountains.',
    'The blacksmith found a strange gem that glows at night.',
    'Travelers have gone missing on the north road.',
    'The old hermit in the woods knows powerful magic.',
    'There\'s treasure hidden in the abandoned mine.',
    'A werewolf has been terrorizing nearby villages.'
  ],
  da: [
    'Borgmesteren handler i hemmelighed med mørke kræfter.',
    'Der er en skjult passage under den gamle kirke.',
    'En drage er blevet set flyve over bjergene.',
    'Smeden fandt en mærkelig ædelsten, der lyser om natten.',
    'Rejsende er forsvundet på nordvejen.',
    'Den gamle eremit i skoven kender til mægtig magi.',
    'Der er skjult skat i den forladte mine.',
    'En varulv har terroriseret de nærliggende landsbyer.'
  ]
};

const magicItems = {
  en: {
    common: ['Cloak of Billowing', 'Potion of Healing', 'Spell Scroll (Cantrip)', 'Bag of Tricks', 'Rope of Mending'],
    uncommon: ['Boots of Elvenkind', 'Cloak of Protection', 'Gauntlets of Ogre Power', 'Pearl of Power', 'Wand of Magic Missiles'],
    rare: ['Ring of Spell Storing', 'Flame Tongue Sword', 'Amulet of Health', 'Cloak of the Bat', 'Animated Shield'],
    'very-rare': ['Belt of Giant Strength', 'Cloak of Invisibility', 'Ring of Regeneration', 'Staff of Fire', 'Holy Avenger']
  },
  da: {
    common: ['Kappe af Bølgen', 'Helbredelsesdrik', 'Tryllerune (Lille Trylleformular)', 'Trickpose', 'Reparationsreb'],
    uncommon: ['Elverstøvler', 'Beskyttelseskappe', 'Kæmpe-krafthandsker', 'Kraftperle', 'Tryllestav af Magiske Projektiler'],
    rare: ['Ring af Tryllelagring', 'Flammetunge Sværd', 'Sundhedsamulet', 'Flagermuskappe', 'Animeret Skjold'],
    'very-rare': ['Kæmpestyrke Bælte', 'Usynlighedskappe', 'Regenereringsring', 'Ildstav', 'Hellig Hævner']
  }
};

const weather = {
  en: [
    'Clear skies and pleasant temperature',
    'Light rain, muddy roads',
    'Heavy fog, visibility reduced',
    'Strong winds, difficult terrain',
    'Thunderstorm approaching',
    'Bitterly cold, risk of frostbite',
    'Sweltering heat, exhaustion risk',
    'Overcast and gloomy',
    'Snow beginning to fall',
    'Perfect adventuring weather'
  ],
  da: [
    'Klar himmel og behagelig temperatur',
    'Let regn, mudrede veje',
    'Tæt tåge, reduceret sigtbarhed',
    'Kraftig vind, vanskeligt terræn',
    'Tordenvejr på vej',
    'Bidende kulde, risiko for forfrysninger',
    'Trykkende varme, risiko for udmattelse',
    'Overskyet og dystert',
    'Sne begynder at falde',
    'Perfekt eventyrervejr'
  ]
};

function roll(num, sides) {
  let total = 0;
  for (let i = 0; i < num; i++) {
    total += Math.floor(Math.random() * sides) + 1;
  }
  return total;
}

function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateName() {
  const nameType = document.getElementById('name-type').value;
  const type = names[currentLanguage][nameType];
  const first = randomFrom(type.first);
  const last = randomFrom(type.last);
  document.querySelector('.name-result').textContent = `${first} ${last}`;
}

function generateTavern() {
  const tavernType = document.getElementById('tavern-type').value;
  const options = tavernNames[currentLanguage][tavernType];
  document.querySelector('.tavern-result').textContent = randomFrom(options);
}

function generatePlotHook() {
  const hooks = plotHooks[currentLanguage];
  document.querySelector('.plot-result').textContent = randomFrom(hooks);
}

function generateTreasure() {
  const treasureType = document.getElementById('treasure-type').value;

  let treasure = '';
  if (currentLanguage === 'da') {
    if (treasureType === 'minor') {
      treasure = `${roll(2, 6) * 10} GP<br>${roll(1, 4)} Ædelsten (10 GP hver)`;
    } else if (treasureType === 'moderate') {
      treasure = `${roll(4, 6) * 100} GP<br>${roll(2, 6)} Ædelsten (50 GP hver)<br>1 Kunstgenstand (250 GP)<br>Rul på Magisk Genstand Tabel B`;
    } else {
      treasure = `${roll(1, 8) * 1000} GP<br>${roll(3, 6)} Ædelsten (500 GP hver)<br>${roll(1, 4)} Kunstgenstande (2500 GP hver)<br>Rul på Magisk Genstand Tabel F`;
    }
  } else {
    if (treasureType === 'minor') {
      treasure = `${roll(2, 6) * 10} GP<br>${roll(1, 4)} Gems (10 GP each)`;
    } else if (treasureType === 'moderate') {
      treasure = `${roll(4, 6) * 100} GP<br>${roll(2, 6)} Gems (50 GP each)<br>1 Art Object (250 GP)<br>Roll on Magic Item Table B`;
    } else {
      treasure = `${roll(1, 8) * 1000} GP<br>${roll(3, 6)} Gems (500 GP each)<br>${roll(1, 4)} Art Objects (2500 GP each)<br>Roll on Magic Item Table F`;
    }
  }

  document.querySelector('.treasure-result').innerHTML = treasure;
}

function generateEncounter() {
  const environment = document.getElementById('encounter-environment').value;
  const options = encounters[currentLanguage][environment];
  document.querySelector('.encounter-result').textContent = randomFrom(options);
}

function generateRumor() {
  const rumorList = rumors[currentLanguage];
  document.querySelector('.rumor-result').textContent = randomFrom(rumorList);
}

function generateMagicItem() {
  const rarity = document.getElementById('item-rarity').value;
  const options = magicItems[currentLanguage][rarity];
  document.querySelector('.magic-result').textContent = randomFrom(options);
}

function generateWeather() {
  const weatherList = weather[currentLanguage];
  document.querySelector('.weather-result').textContent = randomFrom(weatherList);
}

function rollDice(die) {
  const sides = parseInt(die.substring(1));
  const result = roll(1, sides);
  document.getElementById('dice-result-text').textContent = `${die}: ${result}`;
  document.getElementById('dice-result').style.display = 'block';
}

function rollCustomDice() {
  const customDice = document.getElementById('custom-dice').value.trim();
  try {
    const match = customDice.match(/(\d+)[dt](\d+)([+-]\d+)?/);
    if (match) {
      const num = parseInt(match[1]);
      const sides = parseInt(match[2]);
      const modifier = match[3] ? parseInt(match[3]) : 0;
      const result = roll(num, sides) + modifier;
      document.getElementById('dice-result-text').textContent = `${customDice}: ${result}`;
      document.getElementById('dice-result').style.display = 'block';
    } else {
      document.getElementById('dice-result-text').textContent = t('invalidDiceFormat');
      document.getElementById('dice-result').style.display = 'block';
    }
  } catch (e) {
    document.getElementById('dice-result-text').textContent = t('diceRollError');
    document.getElementById('dice-result').style.display = 'block';
  }
}

// ========================================
// NOTE TAKER / SESSION NOTES
// ========================================

let sessions = [];
let currentSession = null;
let saveTimeout = null;

function loadSessions() {
  const saved = localStorage.getItem('session_notes');
  if (saved) {
    sessions = JSON.parse(saved);
  }
}

function saveSessions() {
  localStorage.setItem('session_notes', JSON.stringify(sessions));
  document.getElementById('save-status').textContent = t('allChangesSaved');
}

function autoSave() {
  document.getElementById('save-status').textContent = t('saving');
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveSessions();
  }, 1000);
}

function renderSessions() {
  const sidebar = document.getElementById('sessions-sidebar');
  const noSessions = document.getElementById('no-sessions');

  if (sessions.length === 0) {
    sidebar.innerHTML = '';
    noSessions.style.display = 'block';
    return;
  }

  noSessions.style.display = 'none';

  sidebar.innerHTML = sessions.map(session => {
    const date = new Date(session.date);
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return `
      <div class="session-item ${currentSession && currentSession.id === session.id ? 'active' : ''}" data-id="${session.id}">
        <div class="session-info">
          <h4>${session.title}</h4>
          <span class="session-date">${formattedDate}</span>
        </div>
        <button class="btn-tiny btn-danger delete-session" data-id="${session.id}">×</button>
      </div>
    `;
  }).join('');

  document.querySelectorAll('.session-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (!e.target.classList.contains('delete-session')) {
        const id = parseInt(item.dataset.id);
        const session = sessions.find(s => s.id === id);
        if (session) {
          selectSession(session);
        }
      }
    });
  });

  document.querySelectorAll('.delete-session').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm(t('deleteSessionConfirm'))) {
        const id = parseInt(e.target.dataset.id);
        sessions = sessions.filter(s => s.id !== id);
        if (currentSession && currentSession.id === id) {
          currentSession = null;
          document.getElementById('note-editor').style.display = 'none';
          document.getElementById('no-session-selected').style.display = 'block';
        }
        saveSessions();
        renderSessions();
      }
    });
  });
}

function selectSession(session) {
  currentSession = session;
  document.getElementById('note-editor').style.display = 'block';
  document.getElementById('no-session-selected').style.display = 'none';
  document.getElementById('current-session-title').textContent = session.title;
  document.getElementById('save-status').textContent = t('allChangesSaved');
  renderSections();
  renderQuickNotes();
}

function renderSections() {
  if (!currentSession) return;

  const container = document.getElementById('sections-container');
  container.innerHTML = currentSession.sections.map((section, index) => `
    <div class="section">
      <div class="section-header">
        <input type="text" class="section-title-input" value="${section.title}" data-index="${index}">
        <button class="btn-tiny remove-section-btn" data-index="${index}">${t('remove')}</button>
      </div>
      <textarea class="section-textarea" data-index="${index}" rows="6" placeholder="Enter ${section.title.toLowerCase()} here...">${section.content}</textarea>
    </div>
  `).join('');

  container.querySelectorAll('.section-title-input').forEach(input => {
    input.addEventListener('input', (e) => {
      const index = parseInt(e.target.dataset.index);
      currentSession.sections[index].title = e.target.value;
      autoSave();
    });
  });

  container.querySelectorAll('.section-textarea').forEach(textarea => {
    textarea.addEventListener('input', (e) => {
      const index = parseInt(e.target.dataset.index);
      currentSession.sections[index].content = e.target.value;
      autoSave();
    });
  });

  container.querySelectorAll('.remove-section-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      currentSession.sections.splice(index, 1);
      autoSave();
      renderSections();
    });
  });
}

function renderQuickNotes() {
  if (!currentSession) return;

  const list = document.getElementById('quick-notes-list');
  list.innerHTML = currentSession.quickNotes.map((note, index) => `
    <div class="quick-note">
      <span>${note.timestamp} - ${note.text}</span>
      <button class="btn-tiny remove-quick-note" data-index="${index}">×</button>
    </div>
  `).join('');

  list.querySelectorAll('.remove-quick-note').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      currentSession.quickNotes.splice(index, 1);
      autoSave();
      renderQuickNotes();
    });
  });
}

function addSection(title) {
  if (currentSession) {
    currentSession.sections.push({
      title,
      content: ''
    });
    autoSave();
    renderSections();
  }
}

function addQuickNote() {
  const input = document.getElementById('quick-note-text');
  const text = input.value.trim();

  if (text && currentSession) {
    const timestamp = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    currentSession.quickNotes.push({
      timestamp,
      text
    });
    input.value = '';
    autoSave();
    renderQuickNotes();
  }
}

function showNewSessionModal() {
  document.getElementById('new-session-modal').style.display = 'flex';
}

function hideNewSessionModal() {
  document.getElementById('new-session-modal').style.display = 'none';
  document.getElementById('new-session-title').value = '';
}

function createSession() {
  const title = document.getElementById('new-session-title').value.trim();

  if (title) {
    const newSession = {
      id: Date.now(),
      title,
      date: new Date().toISOString(),
      sections: [
        { title: t('sessionSummary'), content: '' },
        { title: t('events'), content: '' },
        { title: t('npcsMet'), content: '' },
        { title: t('quests'), content: '' }
      ],
      quickNotes: []
    };

    sessions.unshift(newSession);
    currentSession = newSession;
    saveSessions();
    renderSessions();
    selectSession(newSession);
    hideNewSessionModal();
  }
}

// ========================================
// TAB NAVIGATION
// ========================================

function switchTab(tabId) {
  // Update tab buttons
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

  // Update tab panes
  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.remove('active');
  });
  document.getElementById(`tab-${tabId}`).classList.add('active');
}

// ========================================
// EVENT LISTENERS & INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  // Language selector
  const languageSelector = document.getElementById('language');
  languageSelector.value = currentLanguage;
  languageSelector.addEventListener('change', (e) => {
    currentLanguage = e.target.value;
    localStorage.setItem('language', currentLanguage);
    updateTranslations();
    // Re-render components that depend on language
    renderEncounters();
    renderSessions();
  });

  // API Key
  const apiKeyInput = document.getElementById('gemini-api-key');
  apiKeyInput.value = geminiApiKey;
  apiKeyInput.addEventListener('change', (e) => {
    geminiApiKey = e.target.value;
    localStorage.setItem('gemini_api_key', geminiApiKey);
  });

  // Tab navigation
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      switchTab(tabId);
    });
  });

  // Modal close on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.style.display = 'none';
      }
    });
  });

  // ========================================
  // INITIATIVE TRACKER EVENTS
  // ========================================

  document.getElementById('add-combatant-btn').addEventListener('click', addCombatant);
  document.getElementById('combatant-name').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') addCombatant();
  });
  document.getElementById('next-turn-btn').addEventListener('click', nextTurn);
  document.getElementById('reset-combat-btn').addEventListener('click', resetCombat);

  // ========================================
  // ENCOUNTER BUILDER EVENTS
  // ========================================

  document.getElementById('new-encounter-btn').addEventListener('click', showNewEncounterModal);
  document.getElementById('cancel-encounter-btn').addEventListener('click', hideNewEncounterModal);
  document.getElementById('create-encounter-btn').addEventListener('click', createEncounter);
  document.getElementById('new-encounter-name').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') createEncounter();
  });

  // ========================================
  // NPC GENERATOR EVENTS
  // ========================================

  document.getElementById('generate-npc-btn').addEventListener('click', generateNPC);
  document.getElementById('save-npc-btn').addEventListener('click', saveGeneratedNPC);
  document.getElementById('close-npc-modal-btn').addEventListener('click', closeNPCModal);

  // ========================================
  // RANDOM TABLES EVENTS
  // ========================================

  document.querySelector('.generate-name-btn').addEventListener('click', generateName);
  document.querySelector('.generate-tavern-btn').addEventListener('click', generateTavern);
  document.querySelector('.generate-plot-btn').addEventListener('click', generatePlotHook);
  document.querySelector('.generate-treasure-btn').addEventListener('click', generateTreasure);
  document.querySelector('.generate-encounter-btn').addEventListener('click', generateEncounter);
  document.querySelector('.generate-rumor-btn').addEventListener('click', generateRumor);
  document.querySelector('.generate-magic-btn').addEventListener('click', generateMagicItem);
  document.querySelector('.generate-weather-btn').addEventListener('click', generateWeather);

  document.querySelectorAll('.btn-dice').forEach(btn => {
    btn.addEventListener('click', () => {
      const die = btn.dataset.die;
      rollDice(die);
    });
  });

  document.getElementById('roll-custom-dice-btn').addEventListener('click', rollCustomDice);
  document.getElementById('custom-dice').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') rollCustomDice();
  });

  // ========================================
  // NOTE TAKER EVENTS
  // ========================================

  document.getElementById('new-session-btn').addEventListener('click', showNewSessionModal);
  document.getElementById('cancel-session-btn').addEventListener('click', hideNewSessionModal);
  document.getElementById('create-session-btn').addEventListener('click', createSession);
  document.getElementById('new-session-title').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') createSession();
  });

  document.querySelectorAll('.add-section-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const sectionName = t(btn.dataset.section);
      addSection(sectionName);
    });
  });

  document.getElementById('add-quick-note-btn').addEventListener('click', addQuickNote);
  document.getElementById('quick-note-text').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') addQuickNote();
  });

  // ========================================
  // LOAD DATA & RENDER
  // ========================================

  loadInitiativeData();
  loadEncounters();
  loadSavedNPCs();
  loadSessions();

  updateTranslations();
  renderCombatants();
  renderEncounters();
  renderSavedNPCs();
  renderSessions();

  // Initial status
  if (sessions.length === 0) {
    document.getElementById('no-session-selected').style.display = 'block';
  } else {
    document.getElementById('no-session-selected').style.display = 'none';
  }
});
