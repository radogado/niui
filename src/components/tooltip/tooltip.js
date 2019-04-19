// Component Tooltip – start

(function (){
    
	var init = (host) => {
		
		/* Tooltip */
		
		host.querySelectorAll('.n-tool:not([data-ready])').forEach((el, i) => {
			
			el.onclick = (e) => {
	
				toggleAttribute(e.target.closest('.n-tool'), 'aria-expanded');
	
			};		
		
		    var t = el.querySelector('.n-tool--tip');
		    if (!t) return;
		
		    el.style.position = 'static'; // dangerous with absolutely-positioned containers, which should be avoided anyway
		    el.parentNode.style.position = 'relative'; // dangerous with absolutely-positioned containers, which should be avoided anyway
	/*
		    t.style.top = (t.parentNode.offsetTop + t.parentNode.offsetHeight) + 'px';
		    t.style.width = '100%';
	*/
	
			var label = el.querySelector('.n-tool--label');
			if (label) {
				
				label.setAttribute('tabindex', 0);
				label.onkeyup = (e) => {
					
					if (e.key === 'Enter') {
						
						toggleAttribute(e.target.closest('.n-tool'), 'aria-expanded');
	
					}
					
				}
	
				label.onblur = (e) => {
					
					e.target.closest('.n-tool').removeAttribute('aria-expanded');
	
				}
	
			}
			makeReady(el);
		
		});
		
	};
	registerComponent('tooltip', init);

})();

// Component Fold – end
