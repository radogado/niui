// To do:
// CSS only version
// Cursor pointer

(function (){

	window.addEventListener('click', e => {
		
		if (!e.target.closest('.n-select--options')) {
			
			document.querySelectorAll('.n-select--options[aria-expanded]').forEach(select => {
				
				closeSelect(select);
			
			});
			
		}
	
	});
	
	let selectOption = (el) => {
		
		if (!el || el.tagName !== 'BUTTON') {
			
			return;
			
		}
		
		let select = el.closest('.n-select--options');
		let selected = select.querySelector('[aria-selected]');
		
		if (selected) {
	
			selected.removeAttribute('aria-selected');
		
		}
	
		el.setAttribute('aria-selected', true);

		closeSelect(select);
		
		let options = select.children[0];
		select.nuiSelectWrapper.style.setProperty('--active-option-height', `${el.offsetHeight}px`);
		options.style.removeProperty('--top-offset');
		options.style.removeProperty('--max-height');
	
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
	
	let closeSelect = (select) => {
		
		select.removeAttribute('aria-expanded');

	}

	let openSelect = (select) => {

		// Fix viewport overflow
		select.style.removeProperty('--top-offset');
		select.style.removeProperty('--max-height');
		select.style.setProperty('--max-width', `${select.parentNode.getBoundingClientRect().width}px`);
		select.style.removeProperty('--active-option-offset');

		let option_height = `${select.scrollHeight}`;

		select.setAttribute('aria-expanded', true);
		
		let active_option_offset = select.querySelector('[aria-selected]').getBoundingClientRect().y - select.getBoundingClientRect().y;
		let top_offset = 0;

		select.style.setProperty('--active-option-offset', active_option_offset);

		if (select.getBoundingClientRect().y < 0) {
			
			let current_max_height = select.getBoundingClientRect().height + select.getBoundingClientRect().y;
			select.style.setProperty('--max-height', `${current_max_height}px`);
			select.scrollTop = Math.abs(select.getBoundingClientRect().y);
			top_offset = Math.abs(select.getBoundingClientRect().y);
			select.style.setProperty('--top-offset', top_offset);
			
			if (select.getBoundingClientRect().height > window.innerHeight) {
				
				select.style.setProperty('--max-height', `${current_max_height - Math.abs(window.innerHeight - select.getBoundingClientRect().height)}px`);
				
				
			}
	
		} else {
		
			if (select.getBoundingClientRect().y + select.getBoundingClientRect().height > window.innerHeight) {
				
				select.style.setProperty('--max-height', `${Math.abs(window.innerHeight - select.getBoundingClientRect().y)}px`);
				
			}
		
		}
		
		if (select.getBoundingClientRect().width > select.querySelector('button').getBoundingClientRect().width) {
			
			select.classList.add('n-scrollbar');
			
		} else {
			
			select.classList.remove('n-scrollbar');
			
		}
		
		select.style.setProperty('--mask-position-y', `${active_option_offset - top_offset}px`); // To do: adjust target position to equalise reveal speed on both sides: shorter side position += difference between short and long sides
		select.style.setProperty('--mask-size-y', `${option_height}px`);

		setTimeout(() => { select.dataset.nSelectAnimation = true; }, 1); // Timeout needed for the above variables to work
	
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
	
	let clickSelect = e => {
		
// 		console.log(e.type, e.target);
		
		let el = e.target.closest('button');
		if (!el) return; // Not a button
		let select = e.target.closest('.n-select--options');
		
		if (!!select.nuiPointerUp) {
			
			delete select.nuiPointerUp;
			return;
			
		}
		
		if (select.hasAttribute('aria-expanded')) { // If already open, select the clicked option
			
			selectOption(el);
			el.focus();
			
		} else { // If closed, open the drop-down

			openSelect(select);
			
		}
		
		select.addEventListener('pointerup', pointerUpSelect);
		delete select.nuiTouch;

	};
	
	let touchStartSelect = e => {
			
// 		console.log(e.type, e.target);
		e.target.closest('.n-select--options').nuiTouch = true;
		
	};
	
	let pointerDownSelect = e => {
		
		let select = e.target.closest('.n-select--options');

		if (!!select.nuiTouch) {
			
			return;

		}

// 		console.log(e.type, e.target);

		if (!select.hasAttribute('aria-expanded')) { // Closed
		
			openSelect(select);

		} else { // Open

			if (!e.target.hasAttribute('aria-expanded')) {
				
				select.removeEventListener('pointerup', pointerUpSelect);
				e.target.click();
				
			}
			
		}
		
	};

	let pointerUpSelect = e => {
		
		
		let el = e.target.closest('button');
		let select = e.target.closest('.n-select--options');

		if (!!select.nuiTouch) {
			
			return;

		}

// 		console.log(e.type, e.target);

		if (!select.hasAttribute('aria-expanded') || el.hasAttribute('aria-selected')) {
			
			if (el.hasAttribute('aria-selected')) {
							
				select.nuiPointerUp = true;
				select.addEventListener('click', clickSelect);
			
			}
			return;

		}

		selectOption(el);
		el.focus();
		select.nuiPointerUp = true;
		select.addEventListener('click', clickSelect);
		
	};

	let init = host => {

		host.querySelectorAll('.n-select:not([data-ready])').forEach(el => {
			
			let wrapper = el;
			el = el.children[0]; // Work with the inner wrapper
			el.nuiSelectWrapper = wrapper;
			el.classList.add('n-select--options');
			
			el.nuiNativeSelect = nextMatchingSibling(el.nuiSelectWrapper, 'select') || el.nuiSelectWrapper.querySelector('select') || document.querySelector(`[data-n_select="${el.nuiSelectWrapper.dataset.n_select}"]`); // As a sibling, child or data-n_select match (where data-n_select is the rich select's data-n_select attribute)
			
			// Set native select's value
			
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
		
			el.addEventListener('click', clickSelect);
			
			el.addEventListener('pointerdown', pointerDownSelect);
	
			el.addEventListener('pointerup', pointerUpSelect);
	
			el.addEventListener('touchstart', touchStartSelect);
			
			el.addEventListener('focusout', e => {
		
				let select = e.target.closest('.n-select--options');
				if (!!e.relatedTarget && (!select.contains(e.relatedTarget) || e.relatedTarget === e.target.parentNode)) {
					
					closeSelect(select);

				}
		
			});
			
			let timeout = null;
			
			el.ontransitionend = e => {
				
				let el = e.target;
				el.style.removeProperty('--mask-position-y');
				el.style.removeProperty('--mask-size-y');
				delete el.dataset.nSelectAnimation;
				
			};
						
			el.addEventListener('keydown', e => {
				
// 				console.log(e.target, e.key, e.keyCode);
		
				if([32, 35, 36, 37, 38, 39, 40].indexOf(e.keyCode) > -1) { // Capture Home, End, Arrows etc
				
					e.preventDefault();
				
				}
		
				let select = e.target.closest('.n-select--options');
				
				switch (e.key) {
					
					case 'Escape': {
					
						closeSelect(select);
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
	
						select.querySelector('button').focus();
						break;
		
					};
		
					case 'End': {
						
						select.querySelector('button:last-of-type').focus();
						break;
		
					};
					
					default: { // Filter options by text entered by keyboard
						
						if (typeof select.nuiFilterIndex === 'undefined') {
							
							select.nuiFilterIndex = 0;
							
						} else {
							
							select.nuiFilterIndex++;
							
						}
						
						clearTimeout(timeout);
						
						timeout = setTimeout(() => {
							
							delete select.nuiFilterIndex;
							
						}, 1000);
							
						for (let el of select.querySelectorAll('button')) {
							
							// Add to string unless too much time has passed (2"?)
							
							if (el.textContent.trim().length > select.nuiFilterIndex && el.textContent.trim()[select.nuiFilterIndex].toLowerCase() === e.key.toLowerCase()) {
								
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
			
			wrapper.dataset.ready = true;

			selectOption(el.querySelector('[aria-selected]') || el.querySelector('button')); // Select the first option by default
		
		});
	
	};

	typeof registerComponent === "function" ? registerComponent('n-select', init) : init(document.body);

})();
