(function (){

/* Modal – start */

function modalWindow(e) {

    // Modal window of an external file

    var el = e.target;

    var link = closest(el, '.modal').href;
    var animation = closest(el, '.modal').getAttribute('data-anim');

    if (!php_support && external.test(link) || !(new XMLHttpRequest().upload)) { // No PHP or XHR?

        window.open(link, '_blank');
        return false;

    }

    var request = new XMLHttpRequest();
    request.open('GET', external.test(link) ? (scripts_location + 'request.php?targetformurl=' + link.split('#')[0]) : link.split('#')[0], true);

    request.onload = function() {

        if (request.status >= 200 && request.status < 400) {
            // Success
            if (!request.responseText) { // No PHP?

                closeFullWindow();
                window.open(link, 'Modal');
                return false;

            }
            var container = (typeof link.split('#')[1] != 'undefined') ? ('#' + link.split('#')[1]) : 0;

			var parsed = request.responseText;
            if (container) {

                parsed = parseHTML(request.responseText);
                if (!parsed.querySelector(container)) {
                    closeFullWindow();
                    return false;
                }
                parsed = parsed.querySelector(container).innerHTML;

            }

            openFullWindow(parsed, animation); // To do: If .modal[data-animation], pass it to openFullWindow() as second parameter. Also in openLightbox().
			transferClass(closest(el, '.modal'), q('.n-ovrl'), 'limited');

        } else {
            // Error
            closeFullWindow();

        }

    };

    request.onerror = function() {
        // Error
        closeFullWindow();

    };

    request.send();

    return false;

}

	var init = function(host) {
		
	// Modal window: open a link's target inside it
	
		forEach(host.querySelectorAll('a.modal[href]:not([data-ready])'), function(el) {
		
			if (el.href !== (location.href.split('#')[0] + '#')) { // Is it an empty anchor?
				
			    el.onclick = modalWindow;
		
		    }
		    
		    if (!el.getAttribute('rel')) {
			    
			    el.setAttribute('rel', 'prefetch');
		
		    }
		    
		    makeReady(el);
		
		});
		
	};
	registerComponent('modal', init);

/* Modal – start */

})();
