// Firefox bridge: relays window.postMessage from Shieldmaiden/HarmlessKey to the extension background.
// Required because Firefox does not support externally_connectable or onMessageExternal.
// The Shieldmaiden website sends window.postMessage({CS_BRIDGE, requestId, ...payload})
// and listens for window.postMessage({CS_BRIDGE_RESPONSE, requestId, ...response}).
window.addEventListener("message", (event) => {
	if (event.source !== window) return;
	if (!event.data?.CS_BRIDGE) return;

	const { CS_BRIDGE, requestId, ...payload } = event.data;

	chrome.runtime.sendMessage({ CS_BRIDGE: true, requestId, ...payload }, (response) => {
		window.postMessage({
			CS_BRIDGE_RESPONSE: true,
			requestId,
			...response,
		}, "*");
	});
});
