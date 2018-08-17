// Component Tooltip – start

(function (){
    
	var init = function (host) {
		
		/* Tooltip */
		
		forEach(host.querySelectorAll('.n-tool:not([data-ready])'), function(el, i) {
			
			el.onclick = function (e) {
	
				toggleAttribute(closest(e.target, '.n-tool'), aria_expanded);
	
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
				label.onkeyup = function (e) {
					
					if (e.key === 'Enter') {
						
						toggleAttribute(closest(e.target, '.n-tool'), aria_expanded);
	
					}
					
				}
	
				label.onblur = function (e) {
					
					closest(e.target, '.n-tool').removeAttribute(aria_expanded);
	
				}
	
			}
			makeReady(el);
		
		});
		
	};
	registerComponent('tooltip', init);

})();

// Component Fold – end
