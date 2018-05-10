// Component Tooltip – start

(function (){
    
	var init = function (host) {
		
		/* Tooltip */
		
		forEach(host.querySelectorAll('.tool:not([data-ready])'), function(el, i) {
			
			el.onclick = function (e) {
	
				toggleAttribute(closest(e.target, '.tool'), aria_expanded);
	
			};		
		
		    var t = el.querySelector('.tip');
		    if (!t) return;
		
		    el.style.position = 'static'; // dangerous with absolutely-positioned containers, which should be avoided anyway
		    el.parentNode.style.position = 'relative'; // dangerous with absolutely-positioned containers, which should be avoided anyway
	/*
		    t.style.top = (t.parentNode.offsetTop + t.parentNode.offsetHeight) + 'px';
		    t.style.width = '100%';
	*/
	
			var label = el.querySelector('.label');
			if (label) {
				
				label.setAttribute('tabindex', 0);
				label.onkeyup = function (e) {
					
					if (e.key === 'Enter') {
						
						toggleAttribute(closest(e.target, '.tool'), aria_expanded);
	
					}
					
				}
	
				label.onblur = function (e) {
					
					closest(e.target, '.tool').removeAttribute(aria_expanded);
	
				}
	
			}
			makeReady(el);
		
		});
		
	};
	registerComponent('tooltip', init);

})();

// Component Fold – end
