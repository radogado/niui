// Component Tooltip – start

(function (){

	let tooltips = 0;

	let setTipPosition = tip => { // Take up the most area available on top/right/bottom/left of the tool. Relative to body.

		let tool = document.querySelector('[data-n-tool="' + tip.getAttribute('for') + '"');
		let rect = tool.getBoundingClientRect();

		let top = 		rect.top;
		let left = 		rect.left;
		let right = 	window.innerWidth - 	left - 	rect.width;
		let bottom = 	window.innerHeight - 	top - 	rect.height; // To do: check when body is shorter than viewport
		
		let area_top = top * window.innerWidth;
		let area_right = right * window.innerHeight;
		let area_bottom = bottom * window.innerWidth;
		let area_left = left * window.innerHeight;
		
		let body_rect = document.body.getBoundingClientRect();
		
		tip.removeAttribute('style');
		tip.removeAttribute('data-n-position');
		
		let positionTop = () => {

			tip.style.top = (10 - body_rect.y) + 'px';
			tip.style.height = (top - 40) + 'px';
			tip.style.left = `${-1*body_rect.x + window.innerWidth/2 - tip.scrollWidth/2}px`;
			tip.setAttribute('data-n-position', 'top');
			
		}
		
		let positionBottom = () => {

			tip.style.top = (10 - body_rect.y + top + rect.height) + 'px';
			tip.style.height = (bottom - 40) + 'px';
			tip.style.left = `${-1*body_rect.x + window.innerWidth/2 - tip.scrollWidth/2}px`;
			tip.setAttribute('data-n-position', 'bottom');
			
		}
		
		let positionLeft = () => {
			
			tip.style.left = 'auto';
			tip.style.right = (10 + body_rect.width + body_rect.x - window.innerWidth + right + rect.width) + 'px';
			tip.style.width = (left - 40) + 'px';
			tip.style.top = `${-1*body_rect.y + window.innerHeight/2 - tip.scrollHeight/2}px`;
			tip.setAttribute('data-n-position', 'left');
			
		}

		let positionRight = () => {

			tip.style.left = (rect.x - body_rect.x + rect.width + 10) + 'px';
			tip.style.width = (right - 40) + 'px';
			tip.style.top = `${-1*body_rect.y + window.innerHeight/2 - tip.scrollHeight/2}px`;
			tip.setAttribute('data-n-position', 'right');

		}
		
		if (area_left > area_right) {
			
			if (area_top > area_bottom) {
				
				if (area_top > area_left) { // Top
					
					positionTop();
					
				} else { // Left
					
					positionLeft();
					
				}
				
			} else {
				
				if (area_bottom > area_left) { // Bottom
					
					positionBottom();
					
				} else { // Left
					
					positionLeft();
					
				}

			}
			
		} else {
			
			if (area_top > area_bottom) {
				
				if (area_top > area_right) { // Top
					
					positionTop();
					
				} else { // Right
					
					positionRight();
					
				}
				
			} else {
				
				if (area_bottom > area_right) { // Bottom
					
					positionBottom();					
					
				} else { // Right
					
					positionRight();
					
				}
				
			}
			
		}
		
	}
	
	function getToolTip(e) {
		
		return document.querySelector('.n-tool--tip[for="' + e.target.closest('.n-tool').getAttribute('data-n-tool') + '"]');
		
	}
    
	var init = (host) => {
		
		/* Tooltip */
		
		host.querySelectorAll('.n-tool:not([data-ready])').forEach((el, i) => {
			
			el.onclick = el.onmouseover = el.onmouseout = (e) => {
	
			    setTipPosition(getToolTip(e));
				toggleAttribute(getToolTip(e), 'aria-expanded');
	
			};
		
		    var tip = el.querySelector('.n-tool--tip');
		    if (!tip) return;
		    
		    tip.setAttribute('for', tooltips);
		    el.setAttribute('data-n-tool', tooltips++);
		    document.body.appendChild(tip);
		    
			var label = el.querySelector('.n-tool--label');
			if (label) {
				
				label.setAttribute('tabindex', 0);
				label.onkeyup = (e) => {
					
					if (e.key === 'Enter') {
						
						toggleAttribute(getToolTip(e), 'aria-expanded');
	
					}
					
				}
	
				label.onblur = (e) => {
					
					getToolTip(e).removeAttribute('aria-expanded');
	
				}
	
			}
			makeReady(el);
		
		});
		
	};
	registerComponent('tooltip', init);

})();

// Component Tooltip – end
