window.addEventListener('click', e => {
	
	if (!e.target.closest('.n-select')) {
		
		document.querySelectorAll('.n-select[aria-expanded]').forEach(el => {
			
			el.removeAttribute('aria-expanded');
		
		});
		
	}

});

let selectOption = (el) => {
	
	if (!el || el.tagName !== 'BUTTON') {
		
		return;
		
	}
	
	let select = el.closest('.n-select');
	
	let selected = select.querySelector('[aria-selected]');
	
	if (selected) {

		selected.removeAttribute('aria-selected');
	
	}

	el.setAttribute('aria-selected', true);
	select.setAttribute('aria-expanded', true);
	select.style.setProperty('--active-option-height', `${el.offsetHeight}px`);
// 								console.log(el, el.offsetHeight);
	select.removeAttribute('aria-expanded');
	select.children[0].style.removeProperty('--top-offset');
	select.children[0].style.removeProperty('--max-height');

	let select_native = select.nuiNativeSelect; // The attached native select
	
	let index = [...el.parentNode.querySelectorAll('button')].indexOf(el);

	if (select_native) {

//									let options = select.querySelectorAll('button');
// 								select_native.options[[...options].indexOf(el)].selected = true; // Enable the native option index-matching this button
		select_native.value = select_native.children[index].textContent;
	
	}
	
	if (!!select.nuiOnChange) {
		
		select.nuiOnChange(index, select_native.value);
		
	}
	
}

let openSelect = (select) => {
	
	select.setAttribute('aria-expanded', true);
	
	// Fix viewport overflow
	let options = select.children[0];
	options.style.removeProperty('--top-offset');
	options.style.removeProperty('--max-height');
	select.style.removeProperty('--active-option-offset');
	select.style.setProperty('--active-option-offset', select.querySelector('[aria-selected]').getBoundingClientRect().y - select.getBoundingClientRect().y);

	if (options.getBoundingClientRect().y < 0) {
		
		let current_max_height = options.getBoundingClientRect().height + options.getBoundingClientRect().y;
		options.style.setProperty('--max-height', `${current_max_height}px`);
		options.scrollTop = Math.abs(options.getBoundingClientRect().y);
		options.style.setProperty('--top-offset', Math.abs(options.getBoundingClientRect().y));
		
		if (options.getBoundingClientRect().height > window.innerHeight) {
			
			options.style.setProperty('--max-height', `${current_max_height - Math.abs(window.innerHeight - options.getBoundingClientRect().height)}px`);
			
			
		}

	} else {
	
		if (options.getBoundingClientRect().y + options.getBoundingClientRect().height > window.innerHeight) {
			
			options.style.setProperty('--max-height', `${Math.abs(window.innerHeight - options.getBoundingClientRect().y)}px`);
			
			
		}
	
	}
	
	select.querySelector('[aria-selected]').focus();
	
}

let nextMatchingSibling = (el, selector) => {
	
	let sibling = el.nextElementSibling;
	while (sibling) {
			if (sibling.matches(selector)) return sibling;
			sibling = sibling.nextElementSibling;
		}
	return false;

};

let previousMatchingSibling = (el, selector) => {
	
	let sibling = el.previousElementSibling;
	while (sibling) {
			if (sibling.matches(selector)) return sibling;
			sibling = sibling.previousElementSibling;
		}
	return false;

};

document.querySelectorAll('.n-select:not([data-ready])').forEach(el => {
	
	el.nuiNativeSelect = nextMatchingSibling(el, 'select') || el.querySelector('select') || document.querySelector(`[data-n_select="${el.dataset.n_select}"]`); // As a sibling, child or data-n_select match (where data-n_select is the rich select's data-n_select attribute)
	
	// Set native select's value
	
	if (!el.querySelector('[aria-selected]')) { // Select the first option by default
		
		selectOption(el.querySelector('button'));
		
	}
	
/*
	el.nextElementSibling.onchange = e => {
		
		// Also change the visible select
		let el = e.target;
		selectOption(el.previousElementSibling.querySelectorAll('button')[el.selectedIndex]);
		
	};
*/
	
/*
	Object.defineProperty(el.nextElementSibling, 'value', {
		
		set: value => {
			
			console.log(this);
			
			if (this.tagName !== 'SELECT') {
				
				return;
				
			}
			
			this.value = value; // Why is "this" the window object?

			[...this.children].forEach(el => {
				
				if (el.textContent === value) {
					
					this.selectedIndex = el.index;

				}
				
			});

			console.log('Setting', value, this.selectedIndex);

			selectOption(this.previousElementSibling.querySelectorAll('button')[this.selectedIndex]);
			this.children[this.selectedIndex].selected = true;

		},
		get: () => {
			
			console.log('Getting', this.value);
			return this.value; 

		}
	
	});
*/

	el.addEventListener('touchstart', e => {
		
		e.target.closest('.n-select').nuiTouch = true;

	});

	el.addEventListener('click', e => {

		let el = e.target.closest('button');
		let select = e.target.closest('.n-select');
		
		if (select.hasAttribute('aria-expanded')) { // If already open, select the clicked option
			
			selectOption(el);
			el.focus();
			
		} else { // If closed, open the drop-down
			
			openSelect(select);
			
		}
		
		delete select.nuiTouch;

	});
	
	el.addEventListener('focusout', e => {

		let select = e.target.closest('.n-select');
		if (!!e.relatedTarget && (!select.contains(e.relatedTarget) || e.relatedTarget === e.target.parentNode)) {
			
			select.removeAttribute('aria-expanded');
		
		}

	});
	
	el.addEventListener('keydown', e => {
		
		console.log(e.target, e.key, e.keyCode);

		if([32, 35, 36, 37, 38, 39, 40].indexOf(e.keyCode) > -1) { // Capture Home, End, Arrows etc
		
			e.preventDefault();
		
		}

		let select = e.target.closest('.n-select');
		
		switch (e.key) {
			
			case 'Escape': {
			
				select.removeAttribute('aria-expanded');
				break;
			
			}; 

			case 'ArrowDown': {
				
				if (!select.hasAttribute('aria-expanded')) {
					
					openSelect(select);
					
				} else {
					
					let sibling = nextMatchingSibling(e.target, 'button');
					if (sibling) {

						sibling.focus();
					
					}
					
				}
				break;

			};
			
			case 'ArrowUp': {

				if (!select.hasAttribute('aria-expanded')) {
					
					openSelect(select);
					
				} else {

					let sibling = previousMatchingSibling(e.target, 'button');
					if (sibling) {

						sibling.focus();
					
					}
				
				}
				break;

			};
			
			case 'Home': {
				
				e.target.parentNode.querySelector('button').focus();
				break;

			};

			case 'End': {
				
				e.target.parentNode.querySelector('button:last-of-type').focus();
				break;

			};
			
			default: { // Filter options by text entered by keyboard
				
				for (let el of e.target.parentNode.querySelectorAll('button')) {
					
					if (el.textContent[0].toLowerCase() === e.key.toLowerCase()) { // To do: remove initial space from string
						
						if (!select.hasAttribute('aria-expanded')) {
	
							selectOption(el);
							
						}
						el.focus();
						break;
						
					}
					
				}
				
			}

		}
		
	});
	
	el.dataset.ready = true;

});
