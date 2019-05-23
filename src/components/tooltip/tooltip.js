// Component Tooltip – start

(function (){

	var tooltips = 0;

	let setTipPosition = tip => { // Take up the most area available on top/right/bottom/left of the tool. Relative to body.
		
		let tool = document.querySelector('[data-n-tool="' + tip.getAttribute('for') + '"');
		let rect = tool.getBoundingClientRect();

		let top = rect.top;
		let left = rect.left;
		let right = document.body.clientWidth - left - rect.width;
		let bottom = window.innerHeight - rect.height - top; // To do: check when body is shorter than viewport
		
		let area_top = top * document.body.clientWidth;
		let area_right = right * window.innerHeight;
		let area_bottom = bottom * document.body.clientWidth;
		let area_left = left * window.innerHeight;
		
		let body_rect = document.body.getBoundingClientRect();
		
		if (area_left > area_right) {
			
			if (area_top > area_bottom) {
				
				if (area_top > area_left) { // Top.
					
					tip.style.top = (10 - body_rect.y) + 'px';
					tip.style.height = (top - 40) + 'px';
					tip.style.left = '50%';
					tip.style.transform = 'translateX(-50%)';
					
				} else { // Left.
					
					
				}
				
			} else {
				
				if (area_bottom > area_left) { // Bottom.
					
					tip.style.top = (10 - body_rect.y + top + rect.height) + 'px';
					tip.style.height = (bottom - 40) + 'px';
					tip.style.left = '50%';
					tip.style.transform = 'translateX(-50%)';
					
				} else { // Left.
					
					
				}

			}
			
		} else {
			
			if (area_top > area_bottom) {
				
				if (area_top > area_right) { // Top.
					
					tip.style.top = (10 - body_rect.y) + 'px';
					tip.style.height = (top - 40) + 'px';
					tip.style.left = '50%';
					tip.style.transform = 'translateX(-50%)';
					
				} else { // Right.
					
					
				}
				
			} else {
				
				if (area_bottom > area_right) { // Bottom.
					
					tip.style.top = (10 - body_rect.y + top + rect.height) + 'px';
					tip.style.height = (bottom - 40) + 'px';
					tip.style.left = '50%';
					tip.style.transform = 'translateX(-50%)';
					
				} else { // Right.
					
					
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
			
			el.onclick = (e) => {
	
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

// Component Fold – end
