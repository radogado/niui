(function () {
	let clickOutsideSelect = (e) => {
		if (!e.target.closest(".n-select__options > *") && !e.target.closest(".n-select")) {
			document.querySelectorAll(".n-select__options[aria-expanded]:not([data-n-select-animation])").forEach((select) => {
				closeSelect(select);
			});
		}
	};

	let closeSelectOnResize = (e) => {
		closeSelect(document.querySelector(".n-select__options[aria-expanded]"));
	};

	let selectOption = (el, close = true) => {
		if (!el || el.tagName !== "BUTTON") {
			return;
		}

		let select = el.closest(".n-select__options");
		let selected = select.querySelector("[aria-selected]");

		if (selected) {
			selected.removeAttribute("aria-selected");
		}

		el.setAttribute("aria-selected", true);
		select.nuiSelectWrapper.dataset.value = el.value;
		if (select.hasAttribute("aria-expanded")) {
			el.focus();
			if (close) {
				closeSelect(select);
			}
		}

		let options = select.children[0];
		select.nuiSelectWrapper.style.setProperty("--active-option-height", `${el.getBoundingClientRect().height}px`);
		options.style.removeProperty("--top-offset");
		options.style.removeProperty("--max-height");

		let select_native = select.nuiNativeSelect; // The attached native select

		let index = [...el.parentNode.querySelectorAll("button")].indexOf(el);

		if (select_native) {
			//									let options = select.querySelectorAll('button');
			// 								select_native.options[[...options].indexOf(el)].selected = true; // Enable the native option index-matching this button
			select_native.value = select.children[index].value;
		}

		if (!!select.nuiOnChange) {
			select.nuiOnChange(index, select_native.value);
		}
	};

	let closeSelect = (select) => {
		delete select.dataset.nSelectAnimation;
		select.removeAttribute("aria-expanded");
		document.body.classList.remove("n-select--open");
		select.nuiSelectWrapper.prepend(select);
		window.removeEventListener("resize", closeSelectOnResize);
		select.querySelector("[aria-selected]").tabIndex = -1;
		window.requestAnimationFrame((t) => select.nuiSelectWrapper.focus());
		document.body.removeEventListener("click", clickOutsideSelect);
		select.removeEventListener("pointerup", pointerUpSelect);
		let wrapper = select.parentNode;
		wrapper.style.removeProperty("--width");
		select.style.removeProperty("--scroll-help-top");
		select.classList.remove("n-select--scroll-help-top");
		!!nuiDisableBodyScroll && nuiDisableBodyScroll(false, select);

		let parent = wrapper;
		while (parent !== document.body) {
			parent.removeEventListener("scroll", closeSelectOnScroll);
			parent = parent.parentNode;
		}
	};

	let closeSelectOnScroll = (e) => {
		let select = document.querySelector("body > .n-select__options");
		closeSelect(select);
	};

	let openSelect = (select) => {
		let previous_open_select = document.body.querySelector(".n-select__options[aria-expanded]");
		if (previous_open_select) {
			closeSelect(previous_open_select);
		}

		let wrapper = select.parentNode;
		wrapper.style.setProperty("--width", `${wrapper.getBoundingClientRect().width}px`);

		// Fix viewport overflow
		select.style.removeProperty("--top-offset");
		select.style.removeProperty("--max-height");
		select.style.removeProperty("--select-scroll-height");
		select.style.removeProperty("--active-option-offset");
		select.classList.remove("n-select--crop-top");

		let option_height = select.getBoundingClientRect().height;

		select.style.setProperty("--max-width", `${select.parentNode.getBoundingClientRect().width}px`);
		select.style.setProperty("--body-offset-x", select.getBoundingClientRect().x - document.body.getBoundingClientRect().x);
		select.style.setProperty("--body-offset-y", select.getBoundingClientRect().y - document.body.getBoundingClientRect().y);

		select.querySelector("[aria-selected]").removeAttribute("tabindex");
		document.body.classList.add("n-select--open");
		select.setAttribute("aria-expanded", true);

		document.body.appendChild(select);
		select.style.setProperty("--select-scroll-height", `${select.getBoundingClientRect().height}px`);

		let active_option_offset = select.querySelector("[aria-selected]").getBoundingClientRect().y - select.getBoundingClientRect().y;
		let top_offset = 0;

		select.style.setProperty("--active-option-offset", active_option_offset);

		if (select.getBoundingClientRect().y < 0) {
			let current_max_height = select.getBoundingClientRect().height + select.getBoundingClientRect().y;
			select.style.setProperty("--max-height", `${current_max_height}px`);
			select.scrollTop = Math.abs(select.getBoundingClientRect().y);
			top_offset = Math.abs(select.getBoundingClientRect().y);
			select.style.setProperty("--top-offset", top_offset);
			select.classList.add("n-select--crop-top");

			if (select.getBoundingClientRect().height > window.innerHeight) {
				select.style.setProperty("--max-height", `${current_max_height - Math.abs(window.innerHeight - select.getBoundingClientRect().height)}px`);
			}
		} else {
			if (select.getBoundingClientRect().y + select.getBoundingClientRect().height > window.innerHeight) {
				select.style.setProperty("--max-height", `${Math.abs(window.innerHeight - select.getBoundingClientRect().y)}px`);
			}

			let available_top_space = select.getBoundingClientRect().y;

			if (select.scrollHeight > select.getBoundingClientRect().height) {
				let cropped_space = select.getBoundingClientRect().height - select.scrollHeight;
				let scroll_help_top = Math.abs(Math.min(cropped_space, available_top_space)) - parseInt(getComputedStyle(select).paddingInlineEnd) * 2;
				if (scroll_help_top > 0) {
					select.style.setProperty("--scroll-help-top", scroll_help_top);
					select.classList.add("n-select--scroll-help-top");
				}
			}
		}

		select.classList.remove("n-scrollbar");

		if (select.getBoundingClientRect().width > select.querySelector("button").getBoundingClientRect().width + parseInt(getComputedStyle(select).paddingInlineEnd) * 2) {
			select.classList.add("n-scrollbar");
		}

		select.style.setProperty("--mask-position-y", `${active_option_offset - top_offset}`); // To do: adjust target position to equalise reveal speed on both sides: shorter side position += difference between short and long sides
		select.style.setProperty("--mask-size-y", `${option_height}px`);

		window.requestAnimationFrame((t) => {
			setTimeout(() => {
				select.dataset.nSelectAnimation = true;
				select.querySelector("[aria-selected]").focus();
			}, 1); // Timeout needed for the above CSS variables to work
		});

		window.addEventListener("resize", closeSelectOnResize);
		document.body.addEventListener("click", clickOutsideSelect);
		!!nuiDisableBodyScroll && nuiDisableBodyScroll(true, select);

		let parent = wrapper.parentNode;
		while (parent !== document.body) {
			parent.addEventListener("scroll", closeSelectOnScroll);
			parent = parent.parentNode;
		}
	};

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

	let clickSelect = (e) => {
		let select = e.target.closest(".n-select__options");
		let el = e.target;

		// 		console.log(e.type, e.target);

		if (select.hasAttribute("aria-expanded")) {
			// Open

			if (!!el.href) {
				closeSelect(select);
			} else {
				selectOption(el);
			}
		}
	};

	let pointerDownSelect = (e) => {
		let select = e.target.closest(".n-select__options") || e.target.querySelector(".n-select__options");

		// 		console.log(e.type, e.target);

		if (!select.hasAttribute("aria-expanded")) {
			// Closed

			openSelect(select);

			// Prevent the click event from closing it right away
			select.removeEventListener("click", clickSelect);
			setTimeout(() => {
				select.addEventListener("click", clickSelect);
			}, 100);
		}
	};

	let pointerUpSelect = (e) => {
		let el = e.target.closest("button");
		let select = e.target.closest(".n-select__options");

		// 		console.log(e.type, e.target, e.target.value);

		if (!!e.target.href) {
			e.target.click();
		} else {
			if (!el || !select.hasAttribute("aria-expanded") || el.hasAttribute("aria-selected")) {
				return;
			}

			selectOption(el);
		}

		document.body.style.pointerEvents = "none"; // Prevent iPad from clicking the element behind
		setTimeout(() => {
			document.body.style.pointerEvents = "";
		}, 100);
	};

	let timeout = null;

	let trapKeyboard = (e) => {
		if ([32, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) {
			// Capture Home, End, Arrows etc

			e.stopPropagation();
			e.preventDefault();
		}
	};

	let selectKeyboard = (e) => {
		/* 				console.log(e.target, e.key, e.keyCode); */

		if (e.target.tagName === "SELECT") {
			return;
		}

		trapKeyboard(e);

		let select = e.target.closest(".n-select__options");

		if (e.target.classList.contains("n-select")) {
			select = e.target.querySelector(".n-select__options");
		}

		if (!select) {
			return;
		}

		switch (e.key) {
			case "Enter": {
				if (e.target.classList.contains("n-select")) {
					openSelect(select);
				}
				break;
			}

			case "Escape": {
				closeSelect(select);
				break;
			}

			case "ArrowDown": {
				if (!select.hasAttribute("aria-expanded")) {
					openSelect(select);
				} else {
					let sibling = nextMatchingSibling(e.target, "button, a[href]");
					if (sibling) {
						sibling.focus();
					} else {
						select.querySelector("button").focus();
					}
				}
				break;
			}

			case "ArrowUp": {
				if (!select.hasAttribute("aria-expanded")) {
					openSelect(select);
				} else {
					let sibling = previousMatchingSibling(e.target, "button, a[href]");
					if (sibling) {
						sibling.focus();
					} else {
						let options = select.querySelectorAll("button");
						options[options.length - 1].focus();
					}
				}
				break;
			}

			case "Home": {
				select.querySelector("button").focus();
				break;
			}

			case "End": {
				select.querySelector("button:last-of-type").focus();
				break;
			}

			default: {
				// Filter options by text entered by keyboard

				select.nuiSearchTerm += e.key.toLowerCase();
				clearTimeout(timeout);

				timeout = setTimeout(() => {
					// select the option that starts with select.nuiSearchTerm
					for (let el of select.querySelectorAll("button")) {
						if (el.textContent.trim().toLowerCase().startsWith(select.nuiSearchTerm)) {
							selectOption(el, false);
						}
					}

					select.nuiSearchTerm = "";
				}, 200);
			}
		}

		return false;
	};

	let init = (host) => {
		if (!window.PointerEvent) {
			// CSS-only fallback when Pointer Events aren't supported

			return;
		}

		host.querySelectorAll(".n-select:not([data-ready])").forEach((el) => {
			let wrapper = el;

			if (el.tagName === "SELECT") {
				return;
			}

			el = el.querySelector(".n-select__options"); // Work with the inner wrapper
			if (!el) {
				// Or generate it from the native select and attach as n-select's first child. If only native is needed, then use only select.n-select?
				let options = "";
				wrapper.querySelectorAll("option").forEach((el) => {
					options += `<button value="${el.value}">${el.textContent}</button>`;
				});

				el = document.createElement("div");
				el.insertAdjacentHTML("beforeend", options);
				wrapper.prepend(el);
			}
			el.nuiSelectWrapper = wrapper;
			el.classList.add("n-select__options");

			el.nuiNativeSelect =
				el.nuiSelectWrapper.querySelector("select") ||
				nextMatchingSibling(el.nuiSelectWrapper, "select") ||
				document.querySelector(`[data-n_select="${el.nuiSelectWrapper.dataset.n_select}"]`); // As a sibling, child or data-n_select match (where data-n_select is the rich select's data-n_select attribute)

			if (!el.nuiNativeSelect) {
				// Missing native select, so generate it

				let input = document.createElement("input");
				input.name = el.dataset.name;
				wrapper.append(input);
				el.nuiNativeSelect = input;
			}

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

			wrapper.addEventListener("pointerdown", pointerDownSelect);

			el.addEventListener("click", clickSelect); // Selects a clicked (pointer upped) option

			el.addEventListener("focusout", (e) => {
				let select = e.target.closest(".n-select__options");

				// If relatedTarget isn't a sibling, close and focus on select wrapper

				/* console.log('relatedTarget', e.relatedTarget);				 */
				if (select.hasAttribute("aria-expanded") && !!e.relatedTarget && e.relatedTarget.parentNode !== select) {
					closeSelect(select);
					select.nuiSelectWrapper.focus();
				}
			});

			el.ontransitionend = (e) => {
				let el = e.target;
				el.style.removeProperty("--mask-position-y");
				el.style.removeProperty("--mask-size-y");
				delete el.dataset.nSelectAnimation;
				el.addEventListener("pointerup", pointerUpSelect);
			};

			el.addEventListener("keydown", selectKeyboard);
			wrapper.addEventListener("keydown", selectKeyboard);
			el.addEventListener("keyup", trapKeyboard);
			wrapper.addEventListener("keyup", trapKeyboard);

			el.lastElementChild.onkeydown = (e) => {
				// Close select on tab outside. To do: get last button only
				// 			console.log(e);
				if (e.key === "Tab" && !e.shiftKey && e.target.parentNode.hasAttribute("aria-expanded")) {
					closeSelect(e.target.parentNode);
					e.target.parentNode.nuiSelectWrapper.focus();
				}
			};

			el.querySelectorAll("button").forEach((el) => {
				el.type = "button"; // Unlike the default 'submit'
				el.value = el.value || el.textContent.trim();
			});

			wrapper.setAttribute("tabindex", 0);
			(el.querySelector("[aria-selected]") || el.firstElementChild).tabIndex = -1;

			wrapper.style.setProperty("--inline-width", `${el.getBoundingClientRect().width}px`);

			selectOption(el.querySelector("[aria-selected]") || el.querySelector("button")); // Select the first option by default
			el.nuiSearchTerm = "";

			wrapper.dataset.ready = true;
			wrapper.style.setProperty("--active-option-height", `${el.querySelector("[aria-selected]").getBoundingClientRect().height}px`);
		});
	};

	typeof registerComponent === "function" ? registerComponent("n-select", init) : init(document.body);
})();
