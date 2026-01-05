/**
 * Monster Browser Module
 * Handles fetching, searching, and displaying monsters from the Open5e API.
 */

// State
let monsters = [];
let currentMonster = null;

export function initMonsters() {
    // Event listeners
    document.getElementById('search-btn').addEventListener('click', searchMonsters);
    document.getElementById('monster-search').addEventListener('keyup', (e) => {
        if (e.key === 'Enter') searchMonsters();
    });
    document.getElementById('close-modal-btn').addEventListener('click', closeModal);
    document.getElementById('monster-modal').addEventListener('click', (e) => {
        if (e.target.id === 'monster-modal') closeModal();
    });

    // Load initial monsters
    searchMonsters();
}

async function searchMonsters() {
    const searchTerm = document.getElementById('monster-search').value.trim();
    const grid = document.getElementById('monsters-grid');
    const loading = document.getElementById('loading');
    const noMonsters = document.getElementById('no-monsters');

    grid.innerHTML = '';
    loading.style.display = 'block';
    noMonsters.style.display = 'none';

    try {
        const url = searchTerm
            ? `https://api.open5e.com/v1/monsters/?search=${encodeURIComponent(searchTerm)}&limit=50`
            : 'https://api.open5e.com/v1/monsters/?limit=50';

        const response = await fetch(url);
        if (!response.ok) throw new Error('API Error');

        const data = await response.json();
        monsters = sortMonsters(data.results, searchTerm);

        loading.style.display = 'none';

        if (monsters.length === 0) {
            noMonsters.style.display = 'block';
            return;
        }

        renderMonsters();

    } catch (error) {
        loading.style.display = 'none';
        grid.innerHTML = `<div class="error-message">Error loading monsters: ${error.message}. Try again later.</div>`;
    }
}

function sortMonsters(monsters, searchTerm) {
    if (!searchTerm) return monsters;
    const term = searchTerm.toLowerCase();
    return monsters.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();

        // Exact match
        if (nameA === term && nameB !== term) return -1;
        if (nameB === term && nameA !== term) return 1;

        // Starts with
        if (nameA.startsWith(term) && !nameB.startsWith(term)) return -1;
        if (nameB.startsWith(term) && !nameA.startsWith(term)) return 1;

        // Contains in name
        if (nameA.includes(term) && !nameB.includes(term)) return -1;
        if (nameB.includes(term) && !nameA.includes(term)) return 1;

        return 0;
    });
}

function renderMonsters() {
    const grid = document.getElementById('monsters-grid');

    grid.innerHTML = monsters.map(monster => {
        const dndBeyondSlug = monster.name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');

        return `
      <div class="monster-card" data-slug="${monster.slug}">
        <h3>${monster.name}</h3>
        <p class="monster-meta">
          ${monster.size} ${monster.type}, ${monster.alignment}
        </p>

        <div class="monster-stats">
          <span class="monster-stat"><strong class="text-gold">CR:</strong> ${monster.challenge_rating}</span>
          <span class="monster-stat"><strong class="text-gold">HP:</strong> ${monster.hit_points}</span>
          <span class="monster-stat"><strong class="text-gold">AC:</strong> ${monster.armor_class}</span>
        </div>

        <div class="monster-links mt-md">
          <a href="https://www.dndbeyond.com/monsters/${dndBeyondSlug}" target="_blank" class="monster-link" onclick="event.stopPropagation()">
            📖 D&D Beyond
          </a>
        </div>
      </div>
    `;
    }).join('');

    // Add click listeners
    document.querySelectorAll('.monster-card').forEach(card => {
        card.addEventListener('click', () => {
            const slug = card.dataset.slug;
            const monster = monsters.find(m => m.slug === slug);
            if (monster) showMonsterDetails(monster);
        });
    });
}

async function showMonsterDetails(monster) {
    currentMonster = monster;

    // Show modal immediately
    document.getElementById('monster-modal').style.display = 'flex';
    document.getElementById('monster-name').textContent = monster.name;
    document.getElementById('monster-type').textContent = `${monster.size} ${monster.type}, ${monster.alignment}`;

    document.getElementById('monster-ac').textContent = monster.armor_class;
    document.getElementById('monster-hp').textContent = `${monster.hit_points} (${monster.hit_dice})`;
    document.getElementById('monster-cr').textContent = monster.challenge_rating;

    try {
        // Keep ALL monster content in English (names AND descriptions)
        let abilities = [];
        if (monster.special_abilities && monster.special_abilities.length > 0) {
            abilities = monster.special_abilities.slice(0, 5).map(ability => ({
                name: ability.name,
                desc: ability.desc
            }));
        }

        let actions = [];
        if (monster.actions && monster.actions.length > 0) {
            actions = monster.actions.slice(0, 5).map(action => ({
                name: action.name,
                desc: action.desc
            }));
        }

        // Build stats display
        const stats = `
      <div class="card">
        <h4 class="section-title">Ability Scores</h4>
        <div class="ability-score-grid">
          <div><strong class="ability-score-label">STR</strong><br>${monster.strength} (${Math.floor((monster.strength - 10) / 2)})</div>
          <div><strong class="ability-score-label">DEX</strong><br>${monster.dexterity} (${Math.floor((monster.dexterity - 10) / 2)})</div>
          <div><strong class="ability-score-label">CON</strong><br>${monster.constitution} (${Math.floor((monster.constitution - 10) / 2)})</div>
          <div><strong class="ability-score-label">INT</strong><br>${monster.intelligence} (${Math.floor((monster.intelligence - 10) / 2)})</div>
          <div><strong class="ability-score-label">WIS</strong><br>${monster.wisdom} (${Math.floor((monster.wisdom - 10) / 2)})</div>
          <div><strong class="ability-score-label">CHA</strong><br>${monster.charisma} (${Math.floor((monster.charisma - 10) / 2)})</div>
        </div>
      </div>

      ${monster.speed ? `<p class="info-text mt-md"><strong class="info-label">Speed:</strong> ${JSON.stringify(monster.speed).replace(/[{}":]/g, ' ')}</p>` : ''}
      ${monster.senses ? `<p class="info-text"><strong class="info-label">Senses:</strong> ${monster.senses}</p>` : ''}
      ${monster.languages ? `<p class="info-text"><strong class="info-label">Languages:</strong> ${monster.languages}</p>` : ''}

      ${abilities.length > 0 ? `
        <div class="card mt-md">
          <h4 class="section-title mb-sm">Special Abilities</h4>
          ${abilities.map(ability => `
            <div class="ability-block">
              <strong class="info-label">${ability.name}:</strong> ${ability.desc}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${actions.length > 0 ? `
        <div class="card mt-md">
          <h4 class="section-title mb-sm">Actions</h4>
          ${actions.map(action => `
            <div class="ability-block">
              <strong class="info-label">${action.name}:</strong> ${action.desc}
            </div>
          `).join('')}
        </div>
      ` : ''}
    `;

        document.getElementById('monster-stats').innerHTML = stats;

    } catch (error) {
        console.error('Error displaying monster details:', error);
        document.getElementById('monster-stats').innerHTML = '<p class="text-danger text-shadow-sm">Error loading monster details. Please try again.</p>';
    }

    // Set D&D Beyond link
    const dndBeyondSlug = monster.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    document.getElementById('dndbeyond-link').href = `https://www.dndbeyond.com/monsters/${dndBeyondSlug}`;
}

function closeModal() {
    document.getElementById('monster-modal').style.display = 'none';
    currentMonster = null;
}
