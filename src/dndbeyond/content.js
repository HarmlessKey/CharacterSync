const documentChanged = (mutations) => {
	mutations.forEach(mut => {
		Array.from(mut.addedNodes).some((element) => {
			if (element.classList.contains('ct-quick-info__ability')) {
				console.log(element)
			}
		})
	})
}

const observer = new MutationObserver(documentChanged);

const target_nodes = document.querySelector('main').firstElementChild
observer.observe(target_nodes, { childList: true, subtree: true });
