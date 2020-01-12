(function (){

	window.addEventListener('click', e => {
		
		if (!e.target.closest('.n-select')) {
			
			document.querySelectorAll('.n-select[aria-expanded]').forEach(select => {
				
				closeSelect(select);
			
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
		closeSelect(select);
		select.style.setProperty('--active-option-height', `${el.offsetHeight}px`);
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
	
	let closeSelect = (select) => {
		
		select.removeAttribute('aria-expanded');
   		delete select.dataset.nSelectAnimation;

	}

	let openSelect = (select) => {

		// Fix viewport overflow
		let options = select.children[0];
		options.style.removeProperty('--top-offset');
		options.style.removeProperty('--max-height');
		select.style.removeProperty('--active-option-offset');
		let option_height = `${options.scrollHeight}px`;

		select.setAttribute('aria-expanded', true);
		
		let active_option_offset = select.querySelector('[aria-selected]').getBoundingClientRect().y - select.getBoundingClientRect().y;
		let top_offset = 0;

		select.style.setProperty('--active-option-offset', active_option_offset);

		if (options.getBoundingClientRect().y < 0) {
			
			let current_max_height = options.getBoundingClientRect().height + options.getBoundingClientRect().y;
			options.style.setProperty('--max-height', `${current_max_height}px`);
			options.scrollTop = Math.abs(options.getBoundingClientRect().y);
			top_offset = Math.abs(options.getBoundingClientRect().y);
			options.style.setProperty('--top-offset', top_offset);
			
			if (options.getBoundingClientRect().height > window.innerHeight) {
				
				options.style.setProperty('--max-height', `${current_max_height - Math.abs(window.innerHeight - options.getBoundingClientRect().height)}px`);
				
				
			}
	
		} else {
		
			if (options.getBoundingClientRect().y + options.getBoundingClientRect().height > window.innerHeight) {
				
				options.style.setProperty('--max-height', `${Math.abs(window.innerHeight - options.getBoundingClientRect().y)}px`);
				
			}
		
		}
		
		if (select.scrollWidth > select.querySelector('button').scrollWidth) {
			
			options.classList.add('n-scrollbar');
			
		} else {
			
			options.classList.remove('n-scrollbar');
			
		}
		
		options.style.webkitMaskPositionY = `${active_option_offset - top_offset}px`;
		options.style.webkitMaskSize = `100% ${option_height}`;
		options.style.transition = '-webkit-mask-size .75s ease-in-out, -webkit-mask-position-y .75s ease-in-out';
		
		options.ontransitionend = e => {

			e.target.style.transition = '';
			delete e.target.dataset.nSelectAnimation;
			
		};

		select.dataset.nSelectAnimation = true;
	
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
		let select = e.target.closest('.n-select');
		
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
		let select = e.target.closest('.n-select');
		select.nuiTouch = true;
		
	};
	
	let pointerDownSelect = e => {
		
		
		let select = e.target.closest('.n-select');

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
		let select = e.target.closest('.n-select');

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
			
			el.nuiNativeSelect = nextMatchingSibling(el, 'select') || el.querySelector('select') || document.querySelector(`[data-n_select="${el.dataset.n_select}"]`); // As a sibling, child or data-n_select match (where data-n_select is the rich select's data-n_select attribute)
			
			// Set native select's value
			
			selectOption(el.querySelector('[aria-selected]') || el.querySelector('button')); // Select the first option by default
			
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
		
				let select = e.target.closest('.n-select');
				if (!!e.relatedTarget && (!select.contains(e.relatedTarget) || e.relatedTarget === e.target.parentNode)) {
					
					closeSelect(select);

				}
		
			});
			
			let timeout = null;
			
			el.addEventListener('keydown', e => {
				
// 				console.log(e.target, e.key, e.keyCode);
		
				if([32, 35, 36, 37, 38, 39, 40].indexOf(e.keyCode) > -1) { // Capture Home, End, Arrows etc
				
					e.preventDefault();
				
				}
		
				let select = e.target.closest('.n-select');
				
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
							
							if (el.textContent.trim().length > select.nuiFilterIndex && el.textContent.trim()[select.nuiFilterIndex].toLowerCase() === e.key.toLowerCase()) { // To do: remove initial spaces from string, support multiple characters entry
								
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
			
			openSelect(el);
			closeSelect(el);
		
		});
	
	};

	typeof registerComponent === "function" ? registerComponent('n-select', init) : init(document.body);

})();

// To do: fix animation on first time opening the first few options
