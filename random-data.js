// ========================================
// RANDOM TABLES DATA
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
