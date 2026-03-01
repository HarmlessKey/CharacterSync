# D&D Character Sync

A browser extension to store D&D Character data from different resources.

[D&D Character Sync on Chrome Web Store](https://chrome.google.com/webstore/detail/dd-character-sync/jgcbbmbchbkdjbgiiheminkkkecjohpg)

## Local development

Install dependencies

```sh
npm i
```

### Build commands

| Command | Description |
|---|---|
| `npm run gulp` | Clean build + watch (Chrome) |
| `npm run gulp build` | One-off Chrome build |
| `npm run gulp build:firefox` | One-off Firefox build |
| `npm run gulp watch:firefox` | Clean build + watch (Chrome & Firefox) |
| `npm run gulp export` | Bump manifest version, build, zip for Chrome Web Store |
| `npm run gulp export:firefox` | Same as above, packaged for Firefox Add-ons |
| `npm run gulp export:edge` | Same as above, packaged for Edge Add-ons |
| `npm run gulp export:all` | Builds and zips all three targets in parallel |

The `export` commands automatically sync the version from `package.json` into `manifest.json`, so bump the version there first:

```sh
npm version [patch | minor | major]
npm run gulp export:all
```

Zips are written to `./dist/`.

### Installing a debug build

#### Chrome

1. Go to `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked** and select the `build/base` directory

#### Firefox

First run a Firefox build:

```sh
npm run gulp build:firefox
```

1. Go to `about:debugging`
2. Click **This Firefox**
3. Click **Load Temporary Add-on…** and select any file inside the `build/firefox` directory

> Firefox add-ons loaded this way are temporary and removed when the browser restarts.

#### Edge

1. Go to `edge://extensions`
2. Enable **Developer mode** (left sidebar)
3. Click **Load unpacked** and select the `build/base` directory

### Note on local extension development

Development builds of the extension (via `npm run gulp` or `npm run gulp build`) work with both a local Shieldmaiden dev environment and the live Shieldmaiden.app — no extension ID configuration is needed. The bridge content script is injected automatically and communication happens via `window.postMessage`.

Note that production/export builds strip `localhost` from the manifest, so they will not work against a local Shieldmaiden dev environment.

## Accessing storage data from your website

The extension exposes character storage to allowed websites via a **bridge content script** that relays `window.postMessage` calls to the extension background. This works in all supported browsers without requiring access to the `chrome` global from page scripts.

### Getting access

The extension must grant access to your domain. Add it to `manifest.json` in two places:

```json
"content_scripts": [
  {
    "matches": [
      ...
      "*://your-domain.com/*"
    ],
    "js": ["content/bridge.js"],
    "run_at": "document_start"
  }
],
"externally_connectable": {
  "matches": [
    ...
    "*://your-domain.com/*"
  ]
}
```

Submit a pull request with these changes to request access.

### Accessing storage data

Send a `window.postMessage` with `CS_BRIDGE: true` and a unique `requestId`. The bridge content script relays it to the extension and posts the response back to the page.

```javascript
function sendBridgeMessage(payload) {
  return new Promise((resolve) => {
    const requestId = crypto.randomUUID();

    const handler = (event) => {
      if (event.source !== window) return;
      if (!event.data?.CS_BRIDGE_RESPONSE) return;
      if (event.data.requestId !== requestId) return;
      window.removeEventListener("message", handler);
      resolve(event.data);
    };

    window.addEventListener("message", handler);
    window.postMessage({ CS_BRIDGE: true, requestId, ...payload }, "*");
  });
}
```

With `request_content` you can specify what to include in the response. Supported values are `"characters"` and `"version"`.

#### Retrieve all characters

```javascript
async function getCharacterSyncCharacters() {
  const response = await sendBridgeMessage({ request_content: ["characters"] });
  if (response.characters) {
    return response.characters;
  }
  throw new Error("No characters found or the extension is not installed.");
}
```

#### Check if the extension is installed

```javascript
async function extensionInstalled() {
  try {
    const response = await sendBridgeMessage({ request_content: ["version"] });
    return !!response.version;
  } catch {
    return false;
  }
}
```

### Response shape

```typescript
{
  CS_BRIDGE_RESPONSE: true,
  requestId: string,
  characters?: Record<string, Character>, // keyed by character URL
  version?: string,                        // e.g. "0.11.0"
}
```

### Legacy: chrome.runtime.sendMessage

The extension still supports direct `chrome.runtime.sendMessage` calls from allowed domains for backwards compatibility, but the bridge / `postMessage` approach above is preferred as it works across all supported browsers.

```javascript
chrome.runtime.sendMessage(
  "jgcbbmbchbkdjbgiiheminkkkecjohpg",
  { request_content: ["characters"] },
  (response) => console.log(response.characters)
);
```
