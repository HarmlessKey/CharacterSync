export const storage = await chrome.storage.sync.get();
export const my_characters = Object.fromEntries(
	Object.entries(storage).filter(([key]) => key !== "config")
);
