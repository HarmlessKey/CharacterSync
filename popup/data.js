export const storage = await chrome.storage.local.get({dnd_sync: {}});
export const my_characters = storage?.dnd_sync?.characters;