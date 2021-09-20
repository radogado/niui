// Component Popin – start

(function() {

	let init = (host) => {

		host.querySelectorAll('.n-popin > * > button').forEach(el => {
			el.onclick = e => {
				let el = e.target;
				let container = el.closest('.n-popin');
				let content = el.parentNode;
				let previous = container.querySelector(':scope > [aria-expanded]');
				previous?.removeAttribute('aria-expanded');
				if (previous !== content) {
					let row = Math.floor([...el.parentNode.parentNode.children].indexOf(el.parentNode) / getComputedStyle(container).getPropertyValue('--n-popin-columns') * 1) + 2;
					container.style.setProperty('--n-popin-open-row', row);
					content.ariaExpanded = true;
				}
			}
		});

	};
	// registerComponent("popin", init);

	typeof registerComponent === "function" ? registerComponent("n-popin", init) : init(document.body);

})();

// Component Popin – end