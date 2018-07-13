// Component Notification bar – start

var componentNotify = (function (){
    
	function notifyClose(el) {
		
		el.parentNode.removeChild(el);
		
	}
	
	function notifyCloseEvent() {
	
		if (q('.n-notify')) {
	
			q('.n-notify').onclick = function (e) {
				
				notifyClose(e.target);	
					
			};
		
		}
		
	}
	
	function notify(content, option) {
		
		bodyElement.insertAdjacentHTML('afterbegin', '<div class="n-notify' + (option && (option.indexOf('fixed') !== -1) ? ' fixed' : '') + '">' + content + '</div>');
		notifyCloseEvent();
		if (option && option.indexOf('timeout') !== -1) {
			
			setTimeout(function() { notifyClose(q('.n-notify')) }, 2000);
	
		}
		
	}

	var init = function (host) {
		
		/* Tooltip */
		
		forEach(host.querySelectorAll('.n-notify:not([data-ready])'), function(el, i) {
			
			notifyCloseEvent();
			makeReady(el);
		
		});
		
	};
	registerComponent('notify', init);

	return { notify: notify };

})();

// Component Notification bar – end
