/* natUIve by rado.bg */
	
function isTouchDevice () {

	return !!('ontouchstart' in window);

}

function addClass ( el, className ) { // To do: fix unnecessary spaces

	if (el.classList) {
		el.classList.add(className);
	} else {
		el.className += ' ' + className;
	}
  	
}

function removeClass ( el, className ) {

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

function forEachElement( selector, fn ) {

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
 
	if(!e) var e = window.event;
 
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

if ( typeof document.body.style.textShadow == 'undefined' ) { // Old browsers without (good) CSS3 support

	forEachElement('.accordion label', function(el, i) {
		
		el.onclick = function (e){ // To fix: Works only on the arrow, not the whole label
		
			if ( hasClass ( window.event.srcElement, 'open' ) ) {
				removeClass ( window.event.srcElement, 'open' )
			} else {
				addClass ( window.event.srcElement, 'open' )
			}
			
			return false;
			
		};

	});

	forEachElement('label.trigger', function (el, i) {
		
		el.onclick = function (e) {

			var event = e || window.event;
			var target = event.target || event.srcElement;
			el = target.parentNode.querySelector('ul');

			if ( hasClass ( el, 'open' ) ) {
				removeClass ( el, 'open' );
			} else {
				addClass ( el, 'open' );
			}
			
		}

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
	
	if (!tip) return;
	tip.style.display = 'none';
	tip.style.opacity = 0;

}

function showTip (e) {

	var event = e || window.event;
	var target = event.target || event.srcElement;

	tip = target.querySelector('.tip');
	if (!tip) return; //  fix it not to log error in console
	
	tip.parentNode.parentNode.style.position = 'relative'; // dangerous with absolutely-positioned containers, which should be avoided anyway

	tip.style.top = (tip.parentNode.offsetTop + tip.parentNode.offsetHeight) + 'px';
			
	tip.style.opacity = 1;
	tip.style.display = 'block';
	
}

/* URI parameters relay. Omit links starting with "javascript", "mailto" */

function relayParameters () {

	parameters = getURLParameters();

	forEachElement('a[href]', function(el, i) {

		for (var name in parameters) {
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

Math.easeInCubic = function( t, b, c, d ) {

	var tc = (t/=d)*t*t;
	return b+c*(tc);

};

Math.inOutQuintic = function( t, b, c, d ) {

	var ts = (t/=d)*t,
	tc = ts*t;
	return b+c*(6*tc*ts + -15*ts*ts + 10*tc);

};

// requestAnimationFrame for Smart Animating http://goo.gl/sx5sts
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
	document.body.style.overflow = 'auto';

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
		document.body.style.overflow = 'hidden';
		document.getElementById('blackbox').innerHTML = '<div class="close"> ← ' + document.title + '</div><img src="' + target.href + '" alt="Lightbox">';
		document.getElementById('blackbox').querySelector('.close').onclick = removeBlackbox;
		
	} else { // ... or load external content in a modal window 
		
		if ( navigator.userAgent.indexOf('MSIE 8') != -1 ) {
			
			window.open (target.href, '_blank');
			return;

		}

		request = new XMLHttpRequest();
		request.open('GET', target.href.split('#')[0], true);

		request.onload = function() {

			if (request.status >= 200 && request.status < 400){
			// Success
				container = (typeof target.href.split('#')[1] != 'undefined') ? ( '#' + target.href.split('#')[1] ) : 0;
				document.body.insertAdjacentHTML('afterbegin', '<div id="blackbox"> </div>');
				document.body.style.overflow = 'hidden';
				blackbox = document.getElementById('blackbox');
				blackbox.insertAdjacentHTML('afterbegin', '<div class="close"> ← ' + document.title + '</div>');
				blackbox.querySelector('.close').onclick = removeBlackbox;
				if (container) {
					parsed = parseHTML(request.responseText);
					if ( !parsed.querySelector(container) ) { removeBlackbox (); return false; }
					blackbox.insertAdjacentHTML('beforeend', parsed.querySelector(container).innerHTML);
						
				} else {
					blackbox.insertAdjacentHTML('beforeend', request.responseText);
				}
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
	
/* Modal window: open a link inside it */

   	forEachElement('a.modal-link, a.lightbox', function(el, i) {
		
		el.onclick = modalWindow;
		
	});

/* Tooltip */
	
	forEachElement('.tool', function(el, i) {
		
		el.onclick = showTip;
			
		if (!isTouchDevice()) {
			
			el.onmouseover = showTip;
			el.onmouseout = hideTip;
			
		}
	
		addEventHandler(el, 'touchmove', hideTip, false);
				
	});

/* Add 'Back to top' button */

	document.body.insertAdjacentHTML('beforeend', '<a class="backtotop" href="#"> ⬆ </a>');
/* 	document.body.querySelector('.backtotop').onclick = function() { scrollTo(0); return false; }; */ /* Not working in Chrome */

/* Auto textarea height - fix bug after manually resize in Safari*/
   	
   	forEachElement('textarea', function(el, i){
	
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

	forEachElement('form', function (el, i) {
		
		el.onsubmit = function () {
			ready_to_submit = true;
			elements = el.querySelectorAll('.mandatory');
			Array.prototype.forEach.call(elements, function (el, i) {
				
				if (!el.querySelector('input, select, textarea').value) { 

					ready_to_submit = false;
					addClass (el, 'alert');

				} else {
					
					removeClass (el, 'alert');
					
				}

			});

			return ready_to_submit;
			
		};
		
	});

});
