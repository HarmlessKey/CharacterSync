# CharacterSync — Claude Notes

## Project Overview
A Chrome extension (Manifest V3) that scrapes D&D character data from D&D Beyond, DiceCloud, and Shieldmaiden, stores it in `chrome.storage.sync`, and exposes it to Shieldmaiden via `chrome.runtime.sendMessage`.

## Architecture

### Source files — `src/`
- `background.js` — service worker; listens for external messages and responds with stored characters/version
- `index.html` — popup UI
- `extension/` — popup scripts (loaded as ES modules)
  - `popup.js` — tab/step navigation, sync button injection
  - `my-characters.js` — character list rendering, filtering, search
  - `data.js` — `getCharacters()` / `getStorage()` helpers (async, use `await`)
  - `functions.js` — shared helpers (syncCharacter, navigate, tabSelect, etc.)
- `content/` — per-source content scripts (concatenated by gulp before injection)
  - `dndbeyond/`, `dicecloud/`, `shieldmaiden/` — scraper + content script per source
  - `models/character.js` — shared character model
- `common/` — `store.js`, `util.js` shared by content scripts

### Build — `build/base/`
Gulp copies/concatenates `src/` into `build/base/`, which is the directory loaded as the unpacked extension. **Never edit files in `build/` directly.**

Content scripts are concatenated: `common/store.js + common/util.js + [source files]` → `build/base/content/<source>_character.js`

## Build Commands
```sh
npm run gulp          # clean build + watch
npm run gulp build    # one-off build
npm run gulp export   # bump manifest version from package.json, build, zip to dist/
```
Load `build/base` as an unpacked extension in Chrome.

## Git Conventions
- Do not include Claude co-author lines or any mention of Claude in commit messages

## Key Conventions
- All popup/extension JS uses ES modules (`type="module"`)
- `getCharacters()` is async — always `await` it
- `e.currentTarget` must be captured before any `await` in event handlers (browser nulls it after dispatch)
- Character sources: `"DnDBeyond"`, `"DiceCloud"`, `"Shieldmaiden"` (also `"HarmlessKey"` legacy alias for Shieldmaiden)
- Storage keys are character URLs; `"config"` key is excluded when fetching characters
- `externally_connectable` in `manifest.json` controls which domains can message the extension
