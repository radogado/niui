// Component Tooltip – start

(function (){

	let setTipPosition = tip => { // Take up the most area available on top/right/bottom/left of the tool. Relative to body.

		let tool = document.querySelector('[data-n-tool="' + tip.getAttribute('for') + '"]');
		let rect = tool.getBoundingClientRect();

		let top = 		rect.top;
		let left = 		rect.left;
		let right = 	window.innerWidth - 	left - 	rect.width;
		let bottom = 	window.innerHeight - 	top - 	rect.height; // To do: check when body is shorter than viewport
		
		let area_top = top * window.innerWidth;
		let area_right = right * window.innerHeight;
		let area_bottom = bottom * window.innerWidth;
		let area_left = left * window.innerHeight;
		
		let body_rect = bodyElement.getBoundingClientRect();
		
		tip.removeAttribute('style');
		delete tip.dataset.position;
		
		let positionTop = () => {

			tip.style.bottom = (20 + body_rect.height + body_rect.y - top) + 'px';
			tip.style.maxHeight = (top - 40) + 'px';
			tip.style.left = `${rect.x + rect.width/2 - tip.scrollWidth/2}px`;
			tip.dataset.nPosition = 'top';
			
		}
		
		let positionBottom = () => {

			tip.style.top = (20 - body_rect.y + top + rect.height) + 'px';
			tip.style.maxHeight = (bottom - 40) + 'px';
			tip.style.left = `${rect.x + rect.width/2 - tip.scrollWidth/2}px`;
			tip.dataset.nPosition = 'bottom';
			
		}
		
		let positionLeft = () => {
			
			tip.style.left = 'auto';
			tip.style.right = (20 + body_rect.width + body_rect.x - window.innerWidth + right + rect.width) + 'px';
			tip.style.maxWidth = (left - 40) + 'px';
			tip.style.top = `${-1*body_rect.y + rect.top + rect.height/2 - tip.scrollHeight/2}px`;
			tip.dataset.nPosition = 'left';
			
		}

		let positionRight = () => {

			tip.style.left = (rect.x - body_rect.x + rect.width + 20) + 'px';
			tip.style.maxWidth = (right - 40) + 'px';
			tip.style.top = `${-1*body_rect.y + rect.top + rect.height/2 - tip.scrollHeight/2}px`;
			tip.dataset.nPosition = 'right';

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
		
		let rect_tip = tip.getBoundingClientRect();
		
		let offset_y = 0;
		
		if (rect_tip.y < 0) {
			
			offset_y = Math.abs(rect_tip.y) + 10;
			
		} else {
			
			if (rect_tip.bottom > window.innerHeight) {
				
				offset_y = window.innerHeight - rect_tip.bottom - 10;
				
			}
			
		}
		
		tip.style.setProperty('--offset_y', offset_y + 'px');
		
		let offset_x = 0;
		
		if (rect_tip.x < 0) {
			
			offset_x = Math.abs(rect_tip.x) + 10;
			
		} else {
			
			if (rect_tip.right > window.outerWidth) {
				
				offset_x = window.outerWidth - rect_tip.right - 10;
				
			}
			
		}
		
		tip.style.setProperty('--offset_x', offset_x + 'px');
		
	}
	
	function getToolTip(e) {
		
		return document.querySelector('.n-tool--tip[for="' + e.target.closest('.n-tool').dataset.nTool + '"]');
		
	}
	
	let hideTip = e => {
		
		let tip = getToolTip(e);
		tip.removeAttribute('aria-expanded');
		tip.removeAttribute('style');
		delete tip.dataset.position;
		
	}
	
	let showTip = e => {
		
		let tip = getToolTip(e);
		tip.setAttribute('aria-expanded', true);
	    setTipPosition(tip);
		
	}
    
	var init = host => {
		
		/* Tooltip */
		
		let tooltips = host.querySelectorAll('.n-tool').length;
		
		host.querySelectorAll('.n-tool:not([data-ready])').forEach(el => {
			
		    let tip = el.querySelector('.n-tool--tip');
		    if (!tip) return;
		    
			let content = tip.innerHTML;
			tip.innerHTML = '';
			tip.insertAdjacentHTML('afterbegin', '<span>' + content + '</span>');

		    tip.setAttribute('for', tooltips);
		    el.dataset.nTool = tooltips++;
		    bodyElement.appendChild(tip);
		    
			el.setAttribute('tabindex', 0);

			el.ontouchend = el.onmouseover = el.onfocus = showTip;
			el.onblur = el.onmouseout = hideTip;

			makeReady(el);
		
		});
		
	};
	registerComponent('tooltip', init);

})();

// Component Tooltip – end
