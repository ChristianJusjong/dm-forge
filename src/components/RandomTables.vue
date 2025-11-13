<template>
  <div class="random-tables">
    <h2>✨ {{ t('randomTables') }}</h2>

    <div class="generators-grid">
      <!-- NPC Names -->
      <div class="generator-card">
        <h3>{{ t('npcNames') }}</h3>
        <select v-model="nameType" class="input">
          <option value="human">{{ t('human') }}</option>
          <option value="elf">{{ t('elf') }}</option>
          <option value="dwarf">{{ t('dwarf') }}</option>
          <option value="halfling">{{ t('halfling') }}</option>
          <option value="orc">{{ t('orc') }}</option>
        </select>
        <button @click="generateName" class="btn">{{ t('generate') }}</button>
        <div v-if="results.name" class="result">{{ results.name }}</div>
      </div>

      <!-- Tavern Names -->
      <div class="generator-card">
        <h3>{{ t('tavernNames') }}</h3>
        <select v-model="tavernType" class="input">
          <option value="tavern">{{ t('tavern') }}</option>
          <option value="shop">{{ t('shop') }}</option>
          <option value="inn">{{ t('inn') }}</option>
        </select>
        <button @click="generateTavern" class="btn">{{ t('generate') }}</button>
        <div v-if="results.tavern" class="result">{{ results.tavern }}</div>
      </div>

      <!-- Plot Hooks -->
      <div class="generator-card">
        <h3>{{ t('plotHooks') }}</h3>
        <button @click="generatePlotHook" class="btn">{{ t('generate') }}</button>
        <div v-if="results.plotHook" class="result">{{ results.plotHook }}</div>
      </div>

      <!-- Treasure -->
      <div class="generator-card">
        <h3>{{ t('treasure') }}</h3>
        <select v-model="treasureType" class="input">
          <option value="minor">{{ t('minor') }}</option>
          <option value="moderate">{{ t('moderate') }}</option>
          <option value="major">{{ t('major') }}</option>
        </select>
        <button @click="generateTreasure" class="btn">{{ t('generate') }}</button>
        <div v-if="results.treasure" class="result" v-html="results.treasure"></div>
      </div>

      <!-- Random Encounters -->
      <div class="generator-card">
        <h3>{{ t('randomEncounter') }}</h3>
        <select v-model="encounterEnvironment" class="input">
          <option value="forest">{{ t('forest') }}</option>
          <option value="dungeon">{{ t('dungeon') }}</option>
          <option value="city">{{ t('city') }}</option>
          <option value="mountain">{{ t('mountain') }}</option>
          <option value="swamp">{{ t('swamp') }}</option>
        </select>
        <button @click="generateEncounter" class="btn">{{ t('generate') }}</button>
        <div v-if="results.encounter" class="result">{{ results.encounter }}</div>
      </div>

      <!-- Rumors -->
      <div class="generator-card">
        <h3>{{ t('tavernRumors') }}</h3>
        <button @click="generateRumor" class="btn">{{ t('generate') }}</button>
        <div v-if="results.rumor" class="result">{{ results.rumor }}</div>
      </div>

      <!-- Magic Items -->
      <div class="generator-card">
        <h3>{{ t('magicItem') }}</h3>
        <select v-model="itemRarity" class="input">
          <option value="common">{{ t('common') }}</option>
          <option value="uncommon">{{ t('uncommon') }}</option>
          <option value="rare">{{ t('rare') }}</option>
          <option value="very-rare">{{ t('veryRare') }}</option>
        </select>
        <button @click="generateMagicItem" class="btn">{{ t('generate') }}</button>
        <div v-if="results.magicItem" class="result">{{ results.magicItem }}</div>
      </div>

      <!-- Weather -->
      <div class="generator-card">
        <h3>{{ t('weather') }}</h3>
        <button @click="generateWeather" class="btn">{{ t('generate') }}</button>
        <div v-if="results.weather" class="result">{{ results.weather }}</div>
      </div>
    </div>

    <!-- Dice Roller -->
    <div class="dice-roller">
      <h3>{{ t('diceRoller') }}</h3>
      <div class="dice-buttons">
        <button v-for="die in diceTypes" :key="die" @click="rollDice(die)" class="btn-dice">
          {{ die }}
        </button>
      </div>
      <div class="dice-custom">
        <input v-model="customDice" :placeholder="t('customDicePlaceholder')" class="input">
        <button @click="rollCustomDice" class="btn">{{ t('roll') }}</button>
      </div>
      <div v-if="diceResult" class="dice-result">
        <strong>{{ diceResult }}</strong>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useI18n } from '../composables/useI18n'

export default {
  name: 'RandomTables',
  setup() {
    const { t, currentLanguage } = useI18n()

    const results = ref({})
    const nameType = ref('human')
    const tavernType = ref('tavern')
    const treasureType = ref('minor')
    const encounterEnvironment = ref('forest')
    const itemRarity = ref('common')
    const diceResult = ref('')
    const customDice = ref('')
    const diceTypes = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100']

    // Name generators - with Danish names
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
    }

    const generateName = () => {
      const lang = currentLanguage.value
      const type = names[lang][nameType.value]
      const first = type.first[Math.floor(Math.random() * type.first.length)]
      const last = type.last[Math.floor(Math.random() * type.last.length)]
      results.value.name = `${first} ${last}`
    }

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
    }

    const generateTavern = () => {
      const lang = currentLanguage.value
      const options = tavernNames[lang][tavernType.value]
      results.value.tavern = options[Math.floor(Math.random() * options.length)]
    }

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
    }

    const generatePlotHook = () => {
      const lang = currentLanguage.value
      const hooks = plotHooks[lang]
      results.value.plotHook = hooks[Math.floor(Math.random() * hooks.length)]
    }

    const generateTreasure = () => {
      const treasure = { minor: '', moderate: '', major: '' }
      const lang = currentLanguage.value

      if (lang === 'da') {
        treasure.minor = `${roll(2, 6) * 10} GP<br>${roll(1, 4)} Ædelsten (10 GP hver)`
        treasure.moderate = `${roll(4, 6) * 100} GP<br>${roll(2, 6)} Ædelsten (50 GP hver)<br>1 Kunstgenstand (250 GP)<br>Rul på Magisk Genstand Tabel B`
        treasure.major = `${roll(1, 8) * 1000} GP<br>${roll(3, 6)} Ædelsten (500 GP hver)<br>${roll(1, 4)} Kunstgenstande (2500 GP hver)<br>Rul på Magisk Genstand Tabel F`
      } else {
        treasure.minor = `${roll(2, 6) * 10} GP<br>${roll(1, 4)} Gems (10 GP each)`
        treasure.moderate = `${roll(4, 6) * 100} GP<br>${roll(2, 6)} Gems (50 GP each)<br>1 Art Object (250 GP)<br>Roll on Magic Item Table B`
        treasure.major = `${roll(1, 8) * 1000} GP<br>${roll(3, 6)} Gems (500 GP each)<br>${roll(1, 4)} Art Objects (2500 GP each)<br>Roll on Magic Item Table F`
      }

      results.value.treasure = treasure[treasureType.value]
    }

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
    }

    const generateEncounter = () => {
      const lang = currentLanguage.value
      const options = encounters[lang][encounterEnvironment.value]
      results.value.encounter = options[Math.floor(Math.random() * options.length)]
    }

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
    }

    const generateRumor = () => {
      const lang = currentLanguage.value
      const rumorList = rumors[lang]
      results.value.rumor = rumorList[Math.floor(Math.random() * rumorList.length)]
    }

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
    }

    const generateMagicItem = () => {
      const lang = currentLanguage.value
      const options = magicItems[lang][itemRarity.value]
      results.value.magicItem = options[Math.floor(Math.random() * options.length)]
    }

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
    }

    const generateWeather = () => {
      const lang = currentLanguage.value
      const weatherList = weather[lang]
      results.value.weather = weatherList[Math.floor(Math.random() * weatherList.length)]
    }

    // Dice roller
    const roll = (num, sides) => {
      let total = 0
      for (let i = 0; i < num; i++) {
        total += Math.floor(Math.random() * sides) + 1
      }
      return total
    }

    const rollDice = (die) => {
      const sides = parseInt(die.substring(1))
      const result = roll(1, sides)
      diceResult.value = `${die}: ${result}`
    }

    const rollCustomDice = () => {
      try {
        const match = customDice.value.match(/(\d+)[dt](\d+)([+-]\d+)?/)
        if (match) {
          const num = parseInt(match[1])
          const sides = parseInt(match[2])
          const modifier = match[3] ? parseInt(match[3]) : 0
          const result = roll(num, sides) + modifier
          diceResult.value = `${customDice.value}: ${result}`
        } else {
          diceResult.value = t('invalidDiceFormat')
        }
      } catch (e) {
        diceResult.value = t('diceRollError')
      }
    }

    return {
      t,
      currentLanguage,
      results,
      nameType,
      tavernType,
      treasureType,
      encounterEnvironment,
      itemRarity,
      diceResult,
      customDice,
      diceTypes,
      generateName,
      generateTavern,
      generatePlotHook,
      generateTreasure,
      generateEncounter,
      generateRumor,
      generateMagicItem,
      generateWeather,
      rollDice,
      rollCustomDice
    }
  }
}
</script>
