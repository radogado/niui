// Component Nav – start

(function (){
    
/* Nav – start */

	function closeDropNavClickedOutside(e) { // Close the nav when clicking outside
	
		if (!e.target.closest('.n-nav li')) {
	
			qa('.n-nav li').forEach((el) => {
				
				el.removeAttribute(aria_expanded);
				
			});
			
			if (q('.n-nav :focus')) {
	
				q('.n-nav :focus').blur();
			
			}
			
		}
		
	}
	
	function isDesktop(item) { // Checks the UL sub nav element
		
		return getComputedStyle(item).getPropertyValue('position') === 'absolute';
		
	}
	
	function dropNavBlur(e) {
	
		e.stopPropagation();

		var this_nav = e.target.closest('.n-nav');
		
		let el = e.target;
		let item = el.tagName === 'LI' ? el.querySelector('ul') : el.parentElement.querySelector('ul');

		if (item && isDesktop(item) && !closestElement(e.relatedTarget, this_nav)) {
			// if e.relatedTarget is not a child of this_nav, then the next focused item is elsewhere
			this_nav.querySelectorAll('li').forEach((el) => {
	
				el.removeAttribute(aria_expanded);
				
			});
			return;
				
		}

		// Close neighboring parent nav's sub navs.
		el = e.target;
		var target_parent = el.closest('[aria-haspopup]');
		if (target_parent) { // Skip if it's a top-level-only item
			
			target_parent.querySelectorAll('li[aria-expanded]').forEach((el) => { // Disable active grandchildren
		
				el.removeAttribute(aria_expanded);
		
			});
		
		}
	
		el = e.target.parentNode;
		if (!el.nextElementSibling && // last item
			el.parentNode.parentNode.nodeName === 'LI' && // of third-level nav
			!el.parentNode.parentNode.nextElementSibling) {
				
				el.parentNode.parentNode.removeAttribute(aria_expanded);
		
		}
		
	}
			
	function dropNavFocus(e) {

		// Close focused third level child when focus moves to another top-level item
		
		e.stopPropagation();
		
		var el = e.target.closest('.n-nav > ul > li');
// To do: on LI focus, make it aria-expanded and focus its a		
		
		[[].slice.call(el.parentElement.children), [].slice.call(e.target.parentElement.parentElement.children), [].slice.call(e.target.parentElement.parentElement.parentElement.parentElement.children) ].forEach((el) => {
			
			el.forEach((el) => {
				
				el.removeAttribute('aria-expanded');
				
			})
			
			
		});

		el.setAttribute('aria-expanded', true);
// 		openItem(el.querySelector('ul'));
		
		if (el.parentNode.parentNode.getAttribute('aria-haspopup')) {
			
			el.parentNode.parentNode.setAttribute('aria-expanded', true);
			
		}
		
		// Make current focused item's ancestors visible
		
		el = e.target;
	
		el.parentNode.setAttribute(aria_expanded, true);
		var grand_parent = el.parentElement.parentElement.parentElement;
		if (grand_parent.tagName === 'LI') {
	
			grand_parent.setAttribute(aria_expanded, true);
	
		}
		
	}
	
	var closeDropNavClickedOutsideEnabled = false;

	let closeItem = (item) => {
	
		item.style.overflow = 'hidden';
		item.parentElement.setAttribute('aria-expanded', true);

		animate(item, `0% { height: ${item.scrollHeight}px; } 100% { height: 0 }`, .2, () => { 
		
			item.removeAttribute('style'); 
			item.parentElement.removeAttribute('aria-expanded');
		
		});
					
	}
	
	let openItem = (item) => {
		
		item.style.overflow = 'hidden';
		item.parentElement.setAttribute('aria-expanded', true);
		animate(item, `0% { height: 0; } 100% { height: ${item.scrollHeight}px }`, .2, () => { 

			item.removeAttribute('style'); 

		});

	}

/*
	let tapEvent = (e) => { // Using clickEvent instead

		e.stopPropagation();

		var el = e.target;

		if (draggingNow || (typeof el.href === 'string' && el.href.length > 0)) {
			
			return;
			
		}
		
		e.preventDefault();
		
		if (el.nodeName === 'LI') {
			
			el = el.querySelector('a');
			
		}
		
		if (el === document.activeElement) { // Tapping on a focused element

			el.blur();
			
			let parent_item = el.parentElement.parentElement.closest('li[aria-haspopup]');
			if (parent_item) {
				
				parent_item.querySelector('a').focus();
				
			}

		} else {

			if (el.parentElement.getAttribute('aria-expanded')) { // Click on an open element which isn't in focus
				
				let item = el.tagName === 'LI' ? el.querySelector('ul') : el.parentElement.querySelector('ul');

				if (isDesktop(item)) {

					el.parentElement.removeAttribute('aria-expanded');
					document.activeElement.blur();
					el.querySelectorAll('[aria-expanded]').forEach((item) => {
						
						item.removeAttribute('aria-expanded');
						
					});

				} else {
					
					closeItem(item);

				}
				
			} else {
				
				// Opening an item should close its open siblings
				[].slice.call(el.parentElement.parentElement.children).forEach((item) => {
					
					item.removeAttribute('aria-expanded');
					if (item !== el.parentElement) {
						
						let old_item_open_child = item.querySelector('[aria-expanded]');
						if (old_item_open_child) {
							
// 							old_item_open_child.removeAttribute('aria-expanded');
							openItem(old_item_open_child.querySelector('ul'));


						}
						
					}
					
					
				});

				if (hasClass(q('html'), 'can-touch') && typeof e.target.href === 'string' && e.target.href.length > 0) { // Clickable links

					return;

				}

				let item = el.tagName === 'LI' ? el.querySelector('ul') : el.parentElement.querySelector('ul');
				if (isDesktop(item)) {

					el.focus();
					el.parentElement.setAttribute('aria-expanded', true);

				} else {
					
					openItem(item);
					
				}

			}
		
		}
			
	};
*/

	let clickEvent = (e) => {
	
		e.stopPropagation();
		// To do: also ancestors, also close when open
		let el = e.target;

		let item = el.tagName === 'LI' ? el.querySelector('ul') : el.parentElement.querySelector('ul');
		if (isDesktop(item)) {

			if (el.getAttribute('aria-expanded')) {
				
				if (el.querySelector('a:focus')) {
					
// 						el.querySelector('a:focus').blur();
					
				} else {

					if (isDesktop(item)) {
	
						el.removeAttribute('aria-expanded');
					
					} else {
						
						closeItem(item);
												
					}

				}
				
			} else {
				
				[].slice.call(el.parentElement.children).forEach((item) => {
					
					item.removeAttribute('aria-expanded');
					let old_item_open_child = item.querySelector('[aria-expanded]');
					if (old_item_open_child) {
						
						old_item_open_child.removeAttribute('aria-expanded');

					}
				
				});

				el.setAttribute('aria-expanded', true);

				if (!isDesktop(item)) {
					
					openItem(item);
					
				}
			
			}

		} else {

			item.style.overflow = 'hidden';
			
			if (item.parentNode.hasAttribute('aria-expanded')) {
				
				closeItem(item);				
				
			} else {
				
				// If new item is top level, close another top level item, if any is open
				
				if (item.parentElement.parentElement.matches('[role=menubar]')) { // It's top level
					
					let old_item = item.closest('[role=menubar]').querySelector('[aria-expanded="true"] > ul');
					
					if (old_item) {
						
						closeItem(old_item);
											
					}
					
				}
				
				openItem(item);
				
			}

		}
		
	};

	function initNav(el) {
		
		// Delete all trigger inputs, add tabindex=0 to each li
		
		el.querySelectorAll('input').forEach((el) => {
			
			el.outerHTML = '';
			
		});
		
		el.setAttribute('role', 'menubar');
	
		el.querySelectorAll('li > a').forEach((el) => {
			
			el.setAttribute('tabindex', 0);
	
		});
	
		if (!el.closest('.n-nav.n-drop')) { // The rest is for drop nav only
			
			return;
	
		}
	
		if (!closeDropNavClickedOutsideEnabled) {
			
			window.addEventListener('touchend', closeDropNavClickedOutside);
			closeDropNavClickedOutsideEnabled = true;
		
		}
		
		el.addEventListener('keyup', (e) => {
			
			// Check for sibling or children to expand on control keys Left/Right/etc
		
			if (e.key === 'Escape') {
				
				e.target.closest('.n-nav').querySelectorAll('li').forEach((el) => {
					
					el.removeAttribute(aria_expanded);
					
				});
				
				document.activeElement.blur();
				
			}
			
		});
		
		el.querySelectorAll('li').forEach((el) => {
			
			if (el.querySelector('ul')) {
		
				el.setAttribute('aria-haspopup', true);
				if (el.children[0].nodeName === 'UL') {

					el.insertBefore(el.children[1], el.children[0]); // Swap 'a' with 'ul'

				}
			
			}
		
		});
	
		el.addEventListener('touchend', clickEvent);
		el.addEventListener('mousedown', clickEvent);
		el.addEventListener('focusin', dropNavFocus);
		el.addEventListener('focusout', dropNavBlur);
			
		draggingNow = false;
	
	}
	
/* Nav – end */

	var init = (host) => {
		
		host.querySelectorAll('.n-nav:not([data-ready]) > ul:not([role])').forEach((el) => {
			
			initNav(el);
			makeReady(el.closest('.n-nav'));
			
		});

	};
	registerComponent('nav', init);

})();

// Component Nav – end
