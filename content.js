let sheet_header = document.querySelector('.ct-character-header-desktop').firstElementChild

const config = { attributes: true, childList: true, subTree: true };

const callback = (mutationList, observer) => {
	for (const mutation of mutationList) {
		if (mutation.type === 'childList') {
			console.log('A child node has been added or removed')
		} else if (mutation.type == 'attributes') {
			console.log(`The ${mutation.attributeName} attribute was modified`)
		}
	}
}

const observer = new MutationObserver(callback)
observer.observe(sheet_header)
