const isMobile = () => {
	return !!(document.querySelector('.ct-character-sheet-mobile'))
}

const isTablet = () => {
	return !!(document.querySelector('.ct-character-sheet-tablet'))
}

const isDesktop = () => {
	return !!(document.querySelector('.ct-character-sheet-desktop'))
}