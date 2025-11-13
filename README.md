# DM Screen - D&D Dungeon Master Webapp

A comprehensive web application for Dungeon Masters to manage their D&D sessions. Works on any device - desktop, tablet, or phone!

## Features

### ⚔️ Initiative Tracker
- Add combatants with initiative, HP, and AC
- Track turn order and combat rounds
- Manage conditions and status effects
- Quick HP adjustments
- Auto-saves combat state

### 👹 Encounter Builder
- Create and save encounters
- Add multiple creatures with stats
- Calculate total CR
- Load encounters directly to Initiative Tracker
- Organize your campaign's battles

### 🧙 NPC Generator (AI-Powered)
- Generate detailed NPCs using Google Gemini AI
- Customize by race, role, and setting
- Save generated NPCs for later
- Get complete NPC details: appearance, personality, backstory, stats, and plot hooks

### ✨ Inspiration & Random Tables
- Generate random NPC names (multiple races)
- Tavern and shop name generator
- Plot hooks and rumors
- Random encounters by environment
- Treasure generator by CR
- Magic items by rarity
- Weather generator
- Built-in dice roller (supports custom dice notation like 2d6+5)

### 📝 Session Notes
- Create sessions and track your story
- Organized sections (Events, NPCs, Quests, Locations, etc.)
- Quick notes for combat logs
- Auto-save functionality
- All notes persist locally

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Get a Free Google Gemini API Key (Optional - for AI features)
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

**Note:** The Gemini API has a generous free tier (15 requests/min, 1500/day)

### 3. Run the Development Server
```bash
npm run dev
```

The app will open at `http://localhost:3000`

### 4. Configure the API Key (Optional)
1. Click the "⚙️ API Key" button in the top right
2. Paste your Gemini API key
3. Click Save

The app will work without an API key, but NPC generation won't be available.

## Building for Production

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

The built files will be in the `dist` folder. You can deploy these to any static hosting service (Netlify, Vercel, GitHub Pages, etc.)

## How to Use

### Running a Combat
1. Go to the **Initiative Tracker** tab
2. Add your players and monsters with their initiative rolls
3. Set HP and AC for each combatant
4. Use "Next Round" to advance through turns
5. Adjust HP with +/- buttons or type directly
6. Add conditions (Prone, Stunned, etc.) as needed

### Building Encounters
1. Go to the **Encounters** tab
2. Click "+ New Encounter"
3. Give it a name and description
4. Click "Edit" on your encounter
5. Add creatures with their stats
6. Use "Load to Initiative" to start the encounter

### Generating NPCs
1. Go to the **NPCs** tab
2. Enter the type of NPC you want (e.g., "grumpy shopkeeper", "noble knight")
3. Optionally select race and setting
4. Click "Generate NPC"
5. Save the NPC if you want to keep it

### Using Random Tables
1. Go to the **Inspiration** tab
2. Choose what you want to generate
3. Click "Generate" for instant results
4. Use the dice roller for any rolls you need

### Taking Notes
1. Go to the **Notes** tab
2. Create a new session
3. Add sections for different aspects (Events, NPCs, Quests, etc.)
4. Use Quick Notes for combat logs or important moments
5. Everything auto-saves!

## Data Storage

All data is stored locally in your browser's localStorage:
- Initiative tracker state
- Saved encounters
- Generated NPCs
- Session notes
- API key (encrypted in browser storage)

**Important:** Clearing your browser data will delete all saved information. Consider exporting important notes elsewhere for backup.

## Mobile/Tablet Usage

The app is fully responsive and works great on tablets and phones:
- Landscape mode recommended for tablets
- All features accessible on mobile
- Touch-friendly interface
- Perfect for in-person sessions where players use their own devices for D&D Beyond

## Tech Stack

- **Vue.js 3** - Modern reactive framework
- **Vite** - Fast build tool
- **Google Gemini API** - AI-powered NPC generation
- **LocalStorage** - Persistent data storage

## Tips for DMs

1. **Pre-build encounters** before your session to save time
2. **Generate NPCs** ahead of time for key story characters
3. **Use Quick Notes** during combat to track important events
4. **Keep the app open on a tablet** during in-person sessions
5. **Roll multiple d20s** at the start of combat for monster initiatives
6. **Use the random tables** when players go off-script

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## Support

For issues or feature requests, please check the documentation or contact support.

## License

MIT License - feel free to modify and use for your campaigns!

---

**Happy DMing! May your rolls be high and your players always surprised!** 🎲
