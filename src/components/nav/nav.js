// Component Nav – start

(function (){
    
/* Nav – start */

	function closeDropNavClickedOutside(e) { // Close the nav when clicking outside
	
		if (!closest(e.target, 'nav li')) {
	
			forEach('nav ul', function (el) {
				
				el.removeAttribute(aria_expanded);
				
			});
			
			if (q('nav :focus')) {
	
				q('nav :focus').blur();
			
			}
			
		}
		
	}
	
	function dropNavBlur(e) {
	
		var this_nav = closest(e.target, 'nav');
		
		if (!closest(e.relatedTarget, this_nav)) { // if e.relatedTarget is not a child of this_nav, then the next focused item is elsewhere
			
			forEach(this_nav.querySelectorAll('ul'), function (el) {
	
				el.removeAttribute(aria_expanded);
				
			});
			return;
			
		}
		// Close neighboring parent nav's sub navs.
		var el = e.target;
		var target_parent = closest(el, '[aria-haspopup]');
		if (target_parent) { // Skip if it's a top-level-only item
			
			forEach(target_parent.querySelectorAll('ul[aria-expanded]'), function (el) { // Disable active grandchildren
		
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
		
		var el = closest(e.target, 'nav > ul > li');
		
		forEach(el.parentNode.childNodes, function (a) {
	
			if (a.nodeName === 'LI' && a !== el) {
			
				forEach(a.querySelectorAll('[aria-expanded]'), function (el) {
					
					el.removeAttribute(aria_expanded);
					
				});
			
			}
			
		});
		
		el = e.target;
	
		el.parentNode.parentNode.setAttribute(aria_expanded, true);
		if (el.parentNode.querySelector('ul')) {
	
			el.parentNode.querySelector('ul').setAttribute(aria_expanded, true);
	
		}
		
		var current_item = e.target.parentNode;
	
		forEach(current_item.parentNode.parentNode.childNodes, function (el) {
	
			if (el !== current_item && el.nodeName === 'LI' && el.querySelector('ul')) {
	
				el.querySelector('ul').removeAttribute(aria_expanded);
			
			}
			
		});
		
	}
	
	var closeDropNavClickedOutsideEnabled = false;
	
	function initNav(el) {
		
		// Delete all trigger inputs, add tabindex=0 to each li
		
		forEach(el.querySelectorAll('input'), function (el) {
			
			el.outerHTML = '';
			
		});
		
		el.setAttribute('role', 'menubar');
	
		forEach(el.querySelectorAll('li > a'), function (el) {
			
			el.setAttribute('tabindex', 0);
	
		});
	
		if (!closest(el, 'nav.n-drop')) { // The rest is for drop nav only
			
			return;
	
		}
	
		if (!closeDropNavClickedOutsideEnabled) {
			
			window.addEventListener('touchend', closeDropNavClickedOutside);
			closeDropNavClickedOutsideEnabled = true;
		
		}
		
		el.addEventListener('keyup', function (e) {
			
			// Check for sibling or children to expand on control keys Left/Right/etc
		
			if (e.key === 'Escape') {
				
				forEach(closest(e.target, 'nav').querySelectorAll('ul'), function (el) {
					
					el.removeAttribute(aria_expanded);
					
				});
				
				document.activeElement.blur();
				
			}
			
		});
		
		forEach(el.querySelectorAll('li'), function (el) {
			
			if (el.querySelector('ul')) {
		
				el.setAttribute('aria-haspopup', true);
				if (el.children[0].nodeName === 'UL') {

					el.insertBefore(el.children[1], el.children[0]); // Swap 'a' with 'ul'

				}
			
			}
		
			el.addEventListener('touchend', function (e) {
	
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
	
				} else {
				
					el.focus();
				
				}
					
			});
	
			var anchor = el.querySelector('a');
	
			anchor.addEventListener('focus', dropNavFocus);
		
			anchor.addEventListener('blur', dropNavBlur);
			
		});
	
		draggingNow = false;
	
	}
	
/* Nav – end */

	var init = function (host) {
		
		forEach(host.querySelectorAll('nav:not([data-ready]) > ul:not([role])'), function (el) {
			
			initNav(el);
			makeReady(closest(el, 'nav'));
			
		});

	};
	registerComponent('nav', init);

})();

// Component Nav – end
