// Component Nav – start

(function (){
    
/* Nav – start */

	function closeDropNavClickedOutside(e) { // Close the nav when clicking outside
	
		if (!e.target.closest('.n-nav li')) {
	
			qa('.n-nav ul').forEach((el) => {
				
				el.removeAttribute(aria_expanded);
				
			});
			
			if (q('.n-nav :focus')) {
	
				q('.n-nav :focus').blur();
			
			}
			
		}
		
	}
	
	function dropNavBlur(e) {
	
		var this_nav = e.target.closest('.n-nav');
		
		if (!closestElement(e.relatedTarget, this_nav)) { // if e.relatedTarget is not a child of this_nav, then the next focused item is elsewhere
			
			this_nav.querySelectorAll('ul').forEach((el) => {
	
				el.removeAttribute(aria_expanded);
				
			});
			return;
			
		}
		// Close neighboring parent nav's sub navs.
		var el = e.target;
		var target_parent = el.closest('[aria-haspopup]');
		if (target_parent) { // Skip if it's a top-level-only item
			
			target_parent.querySelectorAll('ul[aria-expanded]').forEach((el) => { // Disable active grandchildren
		
				el.removeAttribute(aria_expanded);
		
			});
		
		}
	
		el = e.target.parentNode;
		if (!el.nextElementSibling && // last item
			el.parentNode.parentNode.nodeName === 'LI' && // of third-level nav
			!el.parentNode.parentNode.nextElementSibling) {
				
				el.parentNode.parentNode.parentNode.removeAttribute(aria_expanded);
		
		}
		
	}
			
	function dropNavFocus(e) {
	
		// Close focused third level child when focus moves to another top-level item
		
		var el = e.target.closest('.n-nav > ul > li');
		
		el.parentNode.childNodes.forEach((a) => {
	
			if (a.nodeName === 'LI' && a !== el) {
			
				a.querySelectorAll('[aria-expanded]').forEach((el) => {
					
					el.removeAttribute(aria_expanded);
					
				});
			
			}
			
		});
		
		// Make current focused item's ancestors visible
		
		el = e.target;
	
		el.parentNode.parentNode.setAttribute(aria_expanded, true);
		var grand_parent = el.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('ul');
		if (grand_parent) {
	
			grand_parent.setAttribute(aria_expanded, true);
	
		}
		
	}
	
	var closeDropNavClickedOutsideEnabled = false;
	
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
				
				e.target.closest('.n-nav').querySelectorAll('ul').forEach((el) => {
					
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
		
			let tapEvent = (e) => {
	
				var el = e.target;
	
				if (draggingNow || typeof el.href === 'string') {
					
					return;
					
				}
				
				e.preventDefault();
				e.stopPropagation();
				
				if (el.nodeName === 'LI') {
					
					el = el.querySelector('a');
					
				}
				
				if (el === document.activeElement) {
	
					el.blur();
					
					let parent_item = el.parentElement.parentElement.closest('li[aria-haspopup]');
					if (parent_item) {
						
						parent_item.querySelector('a').focus();
						
					}
	
				} else {
				
					el.focus();
				
				}
					
			};
		
			el.addEventListener('touchend', tapEvent);
			el.addEventListener('click', tapEvent);
	
			var anchor = el.querySelector('a');
	
			anchor.addEventListener('focus', dropNavFocus);
		
			anchor.addEventListener('blur', dropNavBlur);
			
		});
	
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
