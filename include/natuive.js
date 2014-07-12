/* natUIve by rado.bg */
	
function addClass ( el, className ) { // To do: fix unnecessary spaces

	if (el.classList) {
		el.classList.add(className);
	} else {
		el.className += ' ' + className;
	}
  	
}

function removeClass ( el, className ) {
	if (!el) return;
	if (el.classList) {
		el.classList.remove(className);
	} else {
		el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
	}
  	
}

function hasClass ( el, className ) {

	if (el.classList) {
		return el.classList.contains(className);
	} else {
		return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
	}

}

var parseHTML = function ( str ) {

	tmp = document.implementation.createHTMLDocument('Parsed');
	tmp.body.innerHTML = str;
	return tmp.body;

}

function forEach( selector, fn ) {

	elements = document.querySelectorAll(selector);
	for (var i = 0; i < elements.length; i++) {
		fn(elements[i], i);
	}

}
	
function addEventHandler( elem,eventType,handler ) {

	if (elem.addEventListener) {
	     elem.addEventListener (eventType,handler,false);
	} else {
		if (elem.attachEvent) {
	    	elem.attachEvent ('on'+eventType,handler);
		}
	}     

}

function stopEvent( e ) {
 
	if (!e) var e = window.event;
 
	//e.cancelBubble is supported by IE, this will kill the bubbling process.
	e.cancelBubble = true;
	e.returnValue = false;
 
	//e.stopPropagation works only in Firefox.
	if ( e.stopPropagation ) {
		e.stopPropagation();
	}
	if ( e.preventDefault ) {
		e.preventDefault();
	}
 
	return false;

}

function thisIndex (elm) {
    var nodes = elm.parentNode.childNodes, node;
    var i = count = 0;
    while( (node=nodes.item(i++)) && node!=elm )
        if( node.nodeType==1 ) count++;
    return (count);
}

if ( typeof document.body.style.textShadow == 'undefined' ) { // Old browsers without (good) CSS3 support. IE9- detector

	// To do: Define getElementsByClassName for IE8 and use it instead of querySelectorAll for speed

	forEach( 'table', function (el, i) {
		
		el.insertAdjacentHTML('beforebegin', '<div style="overflow-x: scroll"></div>');
		el.previousSibling.insertAdjacentHTML('beforeend', el.outerHTML);
		el.outerHTML = '';
		
	});

}

/* URI parameters */

function updateURLParameter ( url, param, paramVal ) { // return input string with updated/added URL parameter

    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = "";
    if (additionalURL) {
		tempArray = additionalURL.split("&");
		for (i=0; i<tempArray.length; i++){
			if(tempArray[i].split('=')[0] != param){
				newAdditionalURL += temp + tempArray[i];
				temp = "&";
            }
        }
    }

    var rows_txt = temp + "" + param + "=" + paramVal;
    return baseURL + "?" + newAdditionalURL + rows_txt;

}

function getURLParameters () { // return all URL parameters in an array

	var res = {},
		re = /[?&]([^?&]+)=([^?&]+)/g;
	location.href.replace(re, function(_,k,v) {
		res[k] = v;
	});
	return res;

}

/* Tooltip */

var tip;

function hideTip (e) {
	
	if (tip) {

		removeClass ( tip, 'open' );

	}

}

function showTip (e) {

	var event = e || window.event;
	var target = event.target || event.srcElement;

	tip = target.querySelector('.tip');
	if (!tip) return; //  fix it not to log error in console
	
	tip.parentNode.parentNode.style.position = 'relative'; // dangerous with absolutely-positioned containers, which should be avoided anyway
	tip.style.top = (tip.parentNode.offsetTop + tip.parentNode.offsetHeight) + 'px';
	addClass ( tip, 'open' );
	
}

/* URI parameters relay. Omit links starting with "javascript", "mailto", skip parameters not listed in the array */

var parameters_list = new Array ('parameter1','parameter2' );

function relayParameters () {

	parameters = getURLParameters();

	forEach('a[href]', function(el, i) {

		for (var name in parameters) {

			if ( parameters_list.indexOf(name) == -1 ) continue;

			if ( !el.href.indexOf('javascript') || (!el.href.indexOf('mailto') ) ) continue;
			var hash = el.href.split('#')[1] ? ( '#' + el.href.split('#')[1] ) : '';
			el.href = updateURLParameter( el.href.split('#')[0], name, parameters[name] ) + hash;
	
		} 
	
	});

}

Math.easeInOutQuad = function ( t, b, c, d ) {

	t /= d/2;
	if (t < 1) {
		return c/2*t*t + b
	}
	t--;
	return -c/2 * (t*(t-2) - 1) + b;

};

var requestAnimFrame = (function() {
	
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function( callback ) {
		window.setTimeout(callback, 1000 / 60); 
	};
	
})();

function scrollTo( to, callback ) {

	// figure out if this is moz || IE because they use documentElement
	var doc = (navigator.userAgent.indexOf('Firefox') != -1 || navigator.userAgent.indexOf('Trident') != -1) ? document.documentElement : document.body,
	start = doc.scrollTop,
	change = to - start,
	currentTime = 0,
	increment = 20;

	if ( (navigator.userAgent.indexOf('Trident') ) != -1 ) { // Turn off animation for IE; WP8 animates by itself
		
		doc.scrollTop = to;
		return;
		
	}

	var animateScroll = function(){
	    // increment the time
	    currentTime += increment;
	    // find the value with the quadratic in-out easing function
	    var val = Math.easeInOutQuad(currentTime, start, change, 400);
	    // move the document.body
	    doc.scrollTop = val;
	    // do the animation unless its over
	    if(currentTime < 400) {
			requestAnimFrame(animateScroll);
	    } else {
	    	
			if (callback && typeof(callback) === 'function') {
				// the animation is done so lets callback
				callback();
			}
	    }
	};
	animateScroll();

}

function removeBlackbox () {

	var blackbox = document.getElementById('blackbox');
	if (blackbox) document.body.removeChild( blackbox );
/* 	document.body.style.overflow = 'auto'; */
	removeClass ( document.querySelector('html'), 'nooverflow' );

}

function modalWindow (e) {

	document.body.onkeyup = function(e) {

		var event = e || window.event;

	    if (event.keyCode == 27) { // esc
			
			removeBlackbox ();
			
	    }

	};
	
	var event = e || window.event;
	var target = event.target || event.srcElement;

	if ( hasClass( target, 'lightbox') ) { // Show an image lightbox...

		document.body.insertAdjacentHTML('afterbegin', '<div id="blackbox"> </div>');
/* 		document.body.style.overflow = 'hidden'; */
		addClass ( document.querySelector('html'), 'nooverflow' );
		
		/* Add any <a><img> siblings with description to a .slider and initialise its controls */
		images = '';

		elements = target.parentNode.querySelectorAll('.lightbox');
		current_slide = 0;
		for (var i = 0; i < elements.length; i++) {
			images += '<div><img src="' + elements[i].href + '"></div>';
			if ( elements[i] == target ) { current_slide = i; }
		}

		document.getElementById('blackbox').innerHTML = '<div class="close"> ← ' + document.title + '</div><div class="slider lightbox">' + images + '</div><div id="blackbox-bg"></div>';
		document.querySelector('#blackbox > .close').onclick = document.getElementById('blackbox-bg').onclick = removeBlackbox;
		
		if ( makeSlider ) { 

			new_slider = makeSlider( document.querySelector('#blackbox .slider') );
			new_slider.scrollLeft = current_slide * new_slider.offsetWidth;
			moveIndex ( new_slider );

		}
		
	} else { // ... or load external content in a modal window 
		
		if ( navigator.userAgent.indexOf('MSIE 8') != -1 ) {
alert('ie8');			
			window.open (target.href, '_blank'); 
			return false;

		}

		request = new XMLHttpRequest();
		request.open('GET', target.href.split('#')[0], true);

		request.onload = function() {

			if (request.status >= 200 && request.status < 400){
			// Success
				container = (typeof target.href.split('#')[1] != 'undefined') ? ( '#' + target.href.split('#')[1] ) : 0;
				document.body.insertAdjacentHTML('afterbegin', '<div id="blackbox"> </div>');
/* 				document.body.style.overflow = 'hidden'; */
				addClass ( document.querySelector('html'), 'nooverflow' );
				blackbox = document.getElementById('blackbox');
				blackbox.insertAdjacentHTML('afterbegin', '<div class="close"> ← ' + document.title + '</div>');
				if (container) {
					parsed = parseHTML(request.responseText);
					if ( !parsed.querySelector(container) ) { removeBlackbox (); return false; }
					blackbox.insertAdjacentHTML('beforeend', parsed.querySelector(container).innerHTML);
						
				} else {
					blackbox.insertAdjacentHTML('beforeend', request.responseText);
				}
				
				blackbox.insertAdjacentHTML('beforeend', '<div id="blackbox-bg"></div>');
				blackbox.querySelector('.close').onclick = document.getElementById('blackbox-bg').onclick = removeBlackbox;
				
				relayParameters();
			
			} else { 
			// Error
				
			}

		};
		
		request.onerror = function() {
		  // Error
		};
		
		request.send();
		
	}
	
	return false;

}

/* ███ After DOM is created ███ */

addEventHandler(window, 'load', function() {

/* Relay URI parameters to links */

	relayParameters();
	
/* Animate anchor links */

	forEach( 'a[href*="#"]:not([href="#"])', function (el, i) {
		
		el.onclick = function (e) {
			
			var event = e || window.event;
			var target = event.target || event.srcElement;
			
			hash = document.getElementById( target.href.split('#')[1] );

			scrollTo( (hash == null) ? 0 : hash.offsetTop );
			
			return false;
			
		};
		
	});

/* Modal window: open a link inside it. Also lightbox with images */

   	forEach('a.modal, a.lightbox', function(el, i) {
		
		el.onclick = modalWindow;
		
	});

/* Tooltip */
	
	forEach('.tool', function(el, i) {
		
		el.onclick = showTip;
			
			el.onmouseover = showTip;
			el.onmouseout = hideTip;
	
		addEventHandler(el, 'touchmove', hideTip, false);
				
	});

/* Add 'Back to top' button */

		document.querySelector(	document.querySelector('#footer > div > div') ? '#footer > div > div' : 'body' ).insertAdjacentHTML('beforeend', '<a class="backtotop" href="#head"> ⬆ </a>');

/* Auto textarea height */
   	
   	forEach('textarea', function(el, i){
	
		el.onkeyup = function (e) {
			var event = e || window.event;
			var textArea = event.target || event.srcElement;
			while (
				textArea.rows > 1 &&
				textArea.scrollHeight < textArea.offsetHeight
			)
			{	textArea.rows--}
			
			while (textArea.scrollHeight > textArea.offsetHeight)
			{	textArea.rows++ }
			textArea.rows++
			
		};

	});

/* Form validation */

	forEach('form', function (el, i) {
		
		el.onsubmit = function (e) {
			ready_to_submit = true;

			forEach('.mandatory', function (el, i) {
				
				if ( 
					( el.querySelector('input, select, textarea') && !el.querySelector('input, select, textarea').value ) || 
					( el.querySelector('input[type="checkbox"]') && !el.querySelector('input[type="checkbox"]').checked ) 
				   ) { 

					ready_to_submit = false;
					addClass (el, 'alert');
					return;

				} else {
					
					removeClass (el, 'alert');
					
				}

			});

			if (!ready_to_submit) scrollTo(el.parentNode.offsetTop);

			return ready_to_submit;
			
		};
		
	});
	
/* Accordion */

	forEach('.accordion', function(el, i) {
		
		if ( el.querySelector('input.trigger') ) {
		
			el.querySelector('input.trigger').outerHTML = '';
		
		}
		
		el.onclick = function (e) {
			
			stopEvent( e );
					
			el.querySelector('div').style.maxHeight = ((el.querySelector('div').style.maxHeight == '') ? (el.querySelector('div').scrollHeight + 'px') : '');
			
			if ( hasClass ( el, 'open' ) ) {
				removeClass ( el, 'open' );
			} else {
				addClass ( el, 'open' );
			}
			
			if ( hasClass ( el.parentNode.parentNode, 'accordion' ) ) { // Embedded accordion
				el.parentNode.style.maxHeight = el.querySelector('div').scrollHeight + el.parentNode.scrollHeight + 'px';
			}

			return false;
			
		};
		
		el.querySelector('div').onclick = function (e) {  
			var event = e || window.event; event.cancelBubble = true; 
		};

	});

/* Fixed position top offset */
	
	document.getElementById('head').style.minHeight = document.querySelector('#head .row').scrollHeight + 'px';
	
/* Prevent body scroll when mobile navigation is open */

	if ( document.querySelector('#nav-main > input.trigger') ) {
	
		document.querySelector('#nav-main > input.trigger').onchange = function (e) {
	
			 if (document.querySelector('#nav-main > input.trigger').checked) {
			 	addClass(document.body, 'lock-position'); 
			 } else {
			 	removeClass(document.body, 'lock-position');
			 }
	
		};
	
	}
	
	if ('ontouchstart' in window) { /* iOS: remove sticky hover state */
	
		document.body.insertAdjacentHTML('beforeend', '<style> a[href]:hover { color: inherit; } </style>');
	
	}

});
