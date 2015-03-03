/* natUIve by rado.bg */

/* DOM functions via http://youmightnotneedjquery.com */
function addClass ( el, className ) {

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
	
	return (el.classList) ? el.classList.contains(className) : new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);

}

function toggleClass ( el, className ) {

	if ( hasClass ( el, className ) ) {

		removeClass ( el, className );

	} else {

		addClass ( el, className );

	}
	
}

function transferClass ( el_origin, el_target, className ) {
	
	if ( hasClass(el_origin, className) ) {
		
		addClass(el_target, className);

	}
	
}

function eventElement (e) {
	
	e = e || window.event;
	return e.target || e.srcElement;

}

var parseHTML = function ( str ) {

	tmp = document.implementation.createHTMLDocument('Parsed');
	tmp.body.innerHTML = str;
	return tmp.body;

}

function forEach( selector, fn ) { // Accepts both an array and a selector

	elements = (typeof selector == 'string') ? document.querySelectorAll(selector) : selector;
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
 
	if (!e) {
			
		if ( typeof window.event == 'undefined') {
			
			return;
			
		}
	
	}
 
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

	if (!el) return;

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
	
	return hasClass(el,className) && el;

}

/* ––– */

forEach( 'table', function (el) {
	
	el.insertAdjacentHTML('beforebegin', '<div class=table>' + el.outerHTML + '</div>');
	el.outerHTML = '';
	
});

/* URI parameters */

function updateURLParameter ( url, param, paramVal ) { // return input string with updated/added URL parameter

    newAdditionalURL = "";
    tempArray = url.split("?");
    baseURL = tempArray[0];
    additionalURL = tempArray[1];
    temp = "";
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

	res = {};
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

var requestAnimFrame = ( function() {
	
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function( callback ) {

		window.setTimeout(callback, 1000 / 60); 

	};
	
})();

function scrollTo( to, callback ) {

	start = document.documentElement.scrollTop || document.body.scrollTop,
	change = to - start,
	currentTime = 0,
	increment = 20;

	var animateScroll = function(){
	    // increment the time
	    currentTime += increment;
	    // find the value with the quadratic in-out easing function
	    var val = Math.easeInOutQuad(currentTime, start, change, 400);
	    // move the document.body
		document.documentElement.scrollTop = document.body.scrollTop = val;

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

var arrow_keys_handler = function(e) {

    switch(e.keyCode){
        case 37: case 39: case 38:  case 40: // Arrow keys
        case 32: e.preventDefault(); break; // Space
        default: break; // do not block other keys
    }

};

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

	window.removeEventListener("keydown", arrow_keys_handler, false);

}

var external = RegExp('^((f|ht)tps?:)?//(?!' + location.host + ')');

function modalWindow (e) {

	removeBlackbox ();

	document.body.onkeyup = function(e) {

	    if ( (e || window.event).keyCode == 27 ) { // esc
			
			removeBlackbox ();
			
	    }

	};
	
	document.body.insertAdjacentHTML('afterbegin', '<div id="blackbox"> </div>');
	addClass ( document.querySelector('html'), 'nooverflow' );

	// Modal window of HTML as input string
	
	if ( typeof e == 'string') {

		document.getElementById('blackbox').innerHTML = '<div class="close"> ← ' + document.title + '</div>' + e + '<div id="blackbox-bg"></div>';

		document.getElementById('blackbox-bg').onclick = document.querySelector('#blackbox .close').onclick = removeBlackbox;

		return false;
		
	}
	
	// Modal window of an external file or Lightbox
	
	el = eventElement(e);

	if ( parentByClass ( el, 'modal' ) && !(new XMLHttpRequest().upload) ) {
		
		el = parentByClass ( el, 'modal' );
		window.open(el.href, '_blank');
		return false;

	}

	if ( parentByClass ( el, 'modal' ) ) { // Load an external file 

		link = parentByClass ( el, 'modal' ).href;

		request = new XMLHttpRequest();
		request.open("GET", external.test(link) ? ("include/request.php?targetformurl=" + link.split('#')[0]) : link.split('#')[0], true);

		request.onload = function() {
	
			if (request.status >= 200 && request.status < 400){
			// Success
				if (!request.responseText) { // No PHP?
					
					window.open(link, 'Modal');
					
				}
				container = (typeof link.split('#')[1] != 'undefined') ? ( '#' + link.split('#')[1] ) : 0;

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
	
	// Lightbox
	
	document.getElementById('blackbox').innerHTML = '<div class="close"> ← ' + document.title + '</div><div class="slider lightbox"></div><div id="blackbox-bg"></div>';

	var parent = parentByClass ( el, 'lightbox' );
	
	/* Add any <a><img> siblings with description to a .slider and initialise its controls */
	images = '';
	
	forEach( parent.querySelectorAll('a[href]'), function (el) {
		
		images += '<div><img src="' + el.href + '" alt="' + el.title + '"><p>' + el.title + '</p></div>';
		
	});

	document.querySelector('.slider.lightbox').innerHTML = images;

	if ( makeSlider ) { 
		
		anchor = el.parentNode;

		while ( typeof anchor.href == 'undefined' ) {
			
			anchor = anchor.parentNode;
			
		}

		if ( hasClass( anchor.parentNode, 'vertical' ) ) {

			addClass ( document.querySelector('#blackbox .slider'), 'vertical' );

		}
		
		var slider = makeSlider( document.querySelector('#blackbox .slider'), thisIndex(anchor) );
		
	}

	document.getElementById('blackbox-bg').onclick = document.querySelector('#blackbox .close').onclick = removeBlackbox;

	window.addEventListener("keydown", arrow_keys_handler, false);
	
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
	
	e = e || window.event;
	if ( typeof e == 'undefined' ) {
		
		return;
		
	}
	var el = e.target || e.srcElement;
	
	while( typeof el.href == 'undefined' ) {
		
		el = el.parentNode;
		
	}

	hash = document.getElementById( el.href.split('#').pop() );

	document.querySelector('#nav-trigger').checked = false; 
	removeClass ( document.querySelector('.nav-main > div'), 'open' );
	removeClass ( document.querySelector('body'), 'semi-transparent' );

	scrollTo( (hash == null) ? 0 : getCumulativeOffset(hash).y, function (e) { 
		
		window.location = el.href.split('#')[0] + '#' + el.href.split('#').pop();

	});

	return false;
	
};
	
forEach( 'a[href*="#"]', function (el, i) {

	el.onclick = animateAnchors;
	
});

/* Modal window: open a link inside it. Also lightbox with images */

forEach('a.modal, .lightbox a', function(el, i) {

	el.onclick = modalWindow;
	
});

/* Auto textarea height */
	
forEach('textarea', function(el) {

	el.onkeyup = function (e) {

		el = eventElement(e);

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

	el = eventElement(e);

	ready_to_submit = true;

	forEach( el.querySelectorAll('.mandatory'), function (el) {
		
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

	if ( !ready_to_submit ) {
		
		scrollTo(el.offsetTop + el.parentNode.offsetTop)
		return false;
	
	}
	
	if ( !(new XMLHttpRequest().upload) ) { // Browser unable to submit dynamically. To do: or if request.php isn't working
		
		return true;
		
	}

	el.insertAdjacentHTML('beforeend', '<input name=targetformurl type=hidden value=' + encodeURIComponent(el.action) + '>');

	var r = new XMLHttpRequest(); 
	r.open("POST", "include/request.php", true);

	r.onreadystatechange = function () {

		if ( r.readyState != 4 || r.status != 200 ) {
			
			// To do: php script unreachable, submit form normally
			return true;
			
		}

		if ( r.status == 405 || !r.responseText ) {
			
			// To do: php script unreachable, submit form normally
			el.onsubmit = function () {};
			el.submit();
			return true;
			
		}
		
		// To do: strip id's from response HTML
		if ( r.responseText.indexOf('---error---') != -1 ) {
			
			// Error
			document.getElementById('formresult').innerHTML = 'Error submitting form.';
			return;
		
		} else {
			
			// Success
			loaded_html = parseHTML( r.responseText );
			document.getElementById('formresult').innerHTML = loaded_html.innerHTML;
			
		}

	};

	modalWindow ( '<div id="formresult">Submitting form...</div>' );

	r.send( new FormData(el) );

	return false;
	
}
	
forEach( 'form', function (el, i) {
	
	el.onsubmit = el.onsubmit || submitForm;
	
});
	
function updateFileInput (e) {
	
	el = eventElement(e);

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
	
	el = eventElement(e);

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

		stopEvent( e );

	};

});

if ( 'ontouchstart' in window ) { // Touch device: remove iOS sticky hover state

	document.body.insertAdjacentHTML('beforeend', '<style> a[href]:hover { color: inherit; } .tool:hover .tip { display: none; } </style>');

}

document.getElementById('nav-trigger').onchange = function (e) {
	
	toggleClass ( document.querySelector('body'), 'semi-transparent' );

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
