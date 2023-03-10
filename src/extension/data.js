export const storage = await chrome.storage.sync.get({dnd_sync: {}});
export const my_characters = storage?.dnd_sync?.characters;