/* natUIve by rado.bg */

var ua = navigator.userAgent;

/* DOM functions via http://youmightnotneedjquery.com */
function addClass ( el, className ) {

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

function toggleClass ( el, className ) {

	if ( hasClass ( el, className ) ) {

		removeClass ( el, className );

	} else {

		addClass ( el, className );

	}
	
}

var parseHTML = function ( str ) {

	tmp = document.implementation.createHTMLDocument('Parsed');
	tmp.body.innerHTML = str;
	return tmp.body;

}

function forEach( selector, fn ) { // Accepts both an array and a selector

	elements = (typeof selector == 'object') ? selector : document.querySelectorAll(selector);
	for (var i = 0; i < elements.length; i++) {

		fn(elements[i], i);

	}

}
	
function addEventHandler( el, eventType, handler ) {

	if (el.addEventListener) {

	     el.addEventListener ( eventType, handler, false );

	} else {

		if (el.attachEvent) {

	    	el.attachEvent ( 'on'+eventType, handler);

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

function thisIndex (el) {

    var nodes = el.parentNode.childNodes, node;
    var i = count = 0;

    while( (node=nodes.item(i++)) && node!=el ) {
    
        if ( node.nodeType==1 ) {
        	
        	count++;
		
		}
       
    }

    return (count);

}

function parentByClass ( el, className ) { 
	
	while ( el.parentNode && !hasClass(el,className) ) { 
		
		el = el.parentNode; 
	} 
	
	if ( hasClass(el,className) ) { 
	
		return el; 
	
	} else { 
		
		return null;
	}

}

/* ––– */

forEach( 'table', function (el, i) {
	
	el.insertAdjacentHTML('beforebegin', '<div class="table">' + el.outerHTML + '</div>');
	el.outerHTML = '';
	
});

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
	var doc = (ua.indexOf('Chrome') != -1 || ua.indexOf('Firefox') != -1 || ua.indexOf('Trident') != -1) ? document.documentElement : document.body,
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
	if (blackbox) {

		if ( blackbox.querySelector('.slider')) { // Lightbox
			
			removeClass( blackbox.querySelector('.slider'), 'slider');
			var slider = document.querySelector('.slider'); // Make another slider active, if any
			
		}
		document.body.removeChild( blackbox );

	}
	removeClass ( document.querySelector('html'), 'nooverflow' );

}

function modalWindow (e) {

	document.body.onkeyup = function(e) {

		var event = e || window.event;

	    if (event.keyCode == 27) { // esc
			
			removeBlackbox ();
			
	    }

	};
	
	document.body.insertAdjacentHTML('afterbegin', '<div id="blackbox"> </div>');
	addClass ( document.querySelector('html'), 'nooverflow' );

	if ( typeof e == 'string') { // HTML input

		document.getElementById('blackbox').innerHTML = '<div class="close"> ← ' + document.title + '</div>' + e + '<div id="blackbox-bg"></div>';

		document.getElementById('blackbox-bg').onclick = document.querySelector('#blackbox .close').onclick = removeBlackbox;

		return false;
		
	}
	
	var event = e || window.event;
	var el = event.target || event.srcElement;

	if ( parentByClass ( el, 'modal' ) ) { // Load an external file 
		
		el = parentByClass ( el, 'modal' );

/*
		if ( ua.indexOf('MSIE 8') != -1 ) {
	
			window.open (el.href, '_blank'); 
			return false;
	
		}
*/
	
		request = new XMLHttpRequest();
		request.open('GET', el.href.split('#')[0], true);
	
		request.onload = function() {
	
			if (request.status >= 200 && request.status < 400){
			// Success
				container = (typeof el.href.split('#')[1] != 'undefined') ? ( '#' + el.href.split('#')[1] ) : 0;
	
				blackbox = document.getElementById('blackbox');
				blackbox.insertAdjacentHTML('afterbegin', '<div class="close"> ← ' + document.title + '</div>');
				if (container) {
	
					parsed = parseHTML(request.responseText);
					if ( !parsed.querySelector(container) ) { removeBlackbox (); return false; }
					blackbox.insertAdjacentHTML('beforeend', parsed.querySelector(container).innerHTML);
						
	
				} else {
	
					blackbox.insertAdjacentHTML('beforeend', request.responseText);
	
				}
	
				blackbox.querySelector('.close').onclick = removeBlackbox;
				
				relayParameters();
			
			} else { 
				// Error
				removeBlackbox();
	
			}
	
		};
		
		request.onerror = function() {
		  // Error
		  removeBlackbox();
		};
		
		request.send();
			
		return false;
		
	}
	
	// Assuming it's a lightbox item

	document.getElementById('blackbox').innerHTML = '<div class="close"> ← ' + document.title + '</div><div class="slider lightbox"></div><div id="blackbox-bg"></div>';

	var parent = parentByClass ( el, 'lightbox' );
	
	/* Add any <a><img> siblings with description to a .slider and initialise its controls */
	images = '';
	
	forEach( parent.querySelectorAll('a[href]'), function (el) {
		
		images += '<div style="background-image: url(' + el.href + ');"><p>' + el.title + '</p></div>';
		
	});

	document.querySelector('.slider.lightbox').innerHTML = images;

	if ( makeSlider ) { 
		
		var anchor = el.parentNode;

		while ( typeof anchor.href == 'undefined' ) {
			
			anchor = anchor.parentNode;
			
		}
		
		var slider = makeSlider( document.querySelector('#blackbox .slider'), thisIndex(anchor) );
		
	}

	document.getElementById('blackbox-bg').onclick = document.querySelector('#blackbox .close').onclick = removeBlackbox;
	
	return false;

}

/*** Start ***/

/* Relay URI parameters to links */

relayParameters();

/* Tooltip */

forEach('.tool', function(el, i) {
	
	t = el.querySelector('.tip');
	if (!t) return;
	
	el.style.position = 'static'; // dangerous with absolutely-positioned containers, which should be avoided anyway
	el.parentNode.style.position = 'relative'; // dangerous with absolutely-positioned containers, which should be avoided anyway
	t.style.top = (t.parentNode.offsetTop + t.parentNode.offsetHeight) + 'px';
	t.style.width = '100%';
			
});

/* Add 'Back to top' button */

document.querySelector(	document.querySelector('#footer > div > div') ? '#footer > div > div' : 'body' ).insertAdjacentHTML('beforeend', '<a class="backtotop" href="#"> ↑ </a>');

/* Animate anchor links */

var getCumulativeOffset = function (obj) { // Offset from element to top of page

    var left, top;
    left = top = 0;

    if (obj.offsetParent) {

        do {

            left += obj.offsetLeft;
            top  += obj.offsetTop;

        } while (obj = obj.offsetParent);

    }

    return {

        x: left,
        y: top

    };

};

function animateAnchors (e) {
	
	var event = e || window.event;
	var el = event.target || event.srcElement;
	
	hash = document.getElementById( el.href.split('#')[1] );

	document.querySelector('#nav-trigger').checked = false; 
	removeClass ( document.querySelector('.nav-main > div'), 'open' );
	removeClass ( document.getElementById('content'), 'semi-transparent' );
	removeClass ( document.getElementById('footer'), 'semi-transparent' );
	removeClass ( document.querySelector('#head > .row'), 'semi-transparent' );

		scrollTo( (hash == null) ? 0 : getCumulativeOffset(hash).y, function (e) { 

			window.location = el.href; 

		});
		return false;
	
};
	
forEach( 'a[href*="#"]', function (el, i) {
	
	el.onclick = animateAnchors;
	
});

document.querySelector('.backtotop').onclick = function (e) {

	scrollTo( 0 );
	return false;
	
}

/* Modal window: open a link inside it. Also lightbox with images */

forEach('a.modal, .lightbox a', function(el, i) {

	el.onclick = modalWindow;
	
});

/* Auto textarea height */
	
forEach('textarea', function(el, i){

	el.onkeyup = function (e) {

		var event = e || window.event;
		var el = event.target || event.srcElement;

		while ( el.rows > 1 && el.scrollHeight < el.offsetHeight ) {	
			
			el.rows--; 
		
		}
		
		while (el.scrollHeight > el.offsetHeight) {	

			if (el.rows > 20) {

				break;

			}
			el.rows++;

		}

		el.rows++
		
	};

});

/* Form validation */

function submitForm (e) {

	var event = e || window.event;
	el = event.target || event.srcElement;

	ready_to_submit = true;

	forEach( el.querySelectorAll('.mandatory'), function (el, i) {
		
		if ( 
			( el.querySelector('input, select, textarea') && !el.querySelector('input, select, textarea').value ) || 
			( el.querySelector('input[type="checkbox"]') && !el.querySelector('input[type="checkbox"]').checked ) ||
			( el.querySelector('input[type="radio"]') && !el.querySelector('input[type="radio"]').checked )
		   ) { 

			ready_to_submit = false;
			el.querySelector('input').focus();
			addClass (el, 'alert');
			return;

		} else {
			
			removeClass (el, 'alert');
			
		}

	});

	if (!ready_to_submit) scrollTo(el.offsetTop + el.parentNode.offsetTop);

	return ready_to_submit;
	
}
	
forEach( 'form', function (el, i) {
	
	el.onsubmit = el.onsubmit || submitForm;
	
});
	
function updateFileInput (e) {
	
	var event = e || window.event;
	el = event.target || event.srcElement;
	el.parentNode.querySelector('span').innerHTML = el.value.substring(el.value.lastIndexOf('\\') +1)
	
}

forEach( 'input[type="file"]', function (el, i ) {
	
	el.onchange = updateFileInput;
	
});

if ( document.getElementById('language-selector') ) {

	document.querySelector('#language-selector select').onchange = function (e) { 
	
		document.getElementById('language-selector').submit(); 

	};

}

/* Accordion */
	
function toggleAccordion (e) {
	
	var event = e || window.event;
	el = event.target || event.srcElement;
	stopEvent( e );
	el = el.parentNode;
	toggleClass(el, 'open');

	el.querySelector('div').style.maxHeight = ((el.querySelector('div').style.maxHeight == '') ? (el.querySelector('div').scrollHeight + 'px') : '');
	
	
	if ( hasClass ( el.parentNode.parentNode, 'accordion' ) ) { // Embedded accordion

		el.parentNode.style.maxHeight = el.querySelector('div').scrollHeight + el.parentNode.scrollHeight + 'px';

	}

	return false;
	
}

forEach( '.accordion > label', function(el, i) {
	
	el.onclick = toggleAccordion;
	
	el = el.parentNode;

	if ( el.querySelector('input.trigger') ) { // Remove CSS-only triggers
	
		el.querySelector('input.trigger').outerHTML = '';
	
	}
	
	el.querySelector('div').onclick = function (e) {  

		var event = e || window.event; event.cancelBubble = true; 

	};

});

if ( 'ontouchstart' in window ) { // Touch device: remove iOS sticky hover state

	document.body.insertAdjacentHTML('beforeend', '<style> a[href]:hover { color: inherit; } .tool:hover .tip { display: none; } </style>');

}

document.getElementById('nav-trigger').onchange = function (e) {
	
	toggleClass ( document.getElementById('content'), 'semi-transparent' );
	toggleClass ( document.getElementById('footer'), 'semi-transparent' );
	toggleClass ( document.querySelector('#head > .row'), 'semi-transparent' );

};

addEventHandler( window, 'load', function() {

/* Baseline-align images. Using standard line height at 22px */

	var line_height = 22;
	
	forEach( '#content img', function (el) {
		
		extra_padding = ((Math.round(el.height/line_height)+1)*line_height - el.height);
		
		if ( extra_padding >= line_height ) { 
		
			extra_padding -= line_height; 
		
		}
		
		el.style.paddingBottom = extra_padding + 'px';
		
	});

});
