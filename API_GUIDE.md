# AI API Guide - Sådan får du uendelig gratis AI adgang

## Problem med Gemini
Google Gemini har strenge rate limits på gratis tier:
- **15 requests per minut**
- **1,500 requests per dag**

Dette giver ofte "503 Overloaded" eller "429 Rate Limit" fejl.

## Løsning: Brug Groq (Anbefalet)

**Groq** tilbyder MEGET bedre gratis tier:
- ✅ **30,000 tokens per minut** (200x hurtigere end Gemini!)
- ✅ **14,400 requests per dag**
- ✅ Ekstremt hurtig response tid (< 1 sekund)
- ✅ Bruger open-source Llama 3.1 modeller

### Sådan får du din gratis Groq API key:

1. Gå til: https://console.groq.com
2. Sign up (gratis, ingen kreditkort påkrævet)
3. Klik på "API Keys" i venstre menu
4. Klik "Create API Key"
5. Kopier din key (starter med `gsk_...`)

### Indsæt din Groq key:

1. Åbn `npcs.html` fil
2. Find linje 95: `const GROQ_API_KEY = 'gsk_your_key_here';`
3. Erstat `gsk_your_key_here` med din key
4. Skift linje 96 til: `const USE_GROQ = true;`

Gør det samme i:
- `encounters.html`
- `monsters.html` (hvis du vil have AI translation)

Nu vil din app bruge Groq først og kun falde tilbage til Gemini hvis Groq fejler!

## Alternative løsninger

### 1. Cohere (Mindre anbefalet)
- 1000 requests/måned gratis
- Signup på: https://cohere.com

### 2. Together AI
- $25 gratis kredit ved signup
- Signup på: https://together.ai

### 3. OpenRouter (Multiple AI providers)
- Kan bruge gratis modeller
- Signup på: https://openrouter.ai

## Anbefaling

**Brug Groq** - Det er klart den bedste gratis løsning til D&D apps. Hurtig, pålidelig, og meget generøse limits.
