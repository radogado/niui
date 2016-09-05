/* natUIve by rado.bg */
/* DOM functions via http://youmightnotneedjquery.com */

"use strict";

// classList polyfill for IE9-. If no classList support, insert classList.min.js synchronously

var scripts_location = document.getElementsByTagName('script');
scripts_location = scripts_location[scripts_location.length-1].src;
scripts_location = scripts_location.slice(0, scripts_location.length - scripts_location.split('/').pop().length);

function loadScriptFile(file_name) {
	
    var js_el = document.createElement("script");
    js_el.type = "text/javascript";
    js_el.src = scripts_location + file_name;
    document.querySelector('head').appendChild(js_el);

}

if (!("classList" in document.createElement("_"))) {

	loadScriptFile('polyfill-classList.min.js'); // IE8?

}

if (!Array.prototype.indexOf) {

	loadScriptFile('polyfill-indexof.js');

}

// DOM functions

function addClass(el, className) {
// IE8, IE9 errors
// 	el.classList.add(className);
	// To do: remove a single '.' for foolproof operation; Add multiple classes separated by space, dot, comma
if (el.classList)
  el.classList.add(className);
else
  el.className += ' ' + className;
}

/* To do: Convert to Prototype functions: el.addClass('class'); instead of addClass(el, 'class'); */
/*
Object.prototype.addClassPrototype = function (className) {
	
	this.classList.add(className);

};
*/

function removeClass(el, className) {

// 	el.classList.remove(className); // IE8, IE9 errors
	// To do: remove a single '.' for foolproof operation; Add multiple classes separated by space, dot, comma
if (el.classList)
  el.classList.remove(className);
else
  el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  
}

function hasClass(el, className) {

	if (typeof el.classList == 'undefined') { // Because of openFullWindow('asd') (when called with a string) – To do: fix that function instead
		
		return false;
	
	}
	return el.classList.contains(className);
	// To do: remove a single '.' for foolproof operation; Add multiple classes separated by space, dot, comma

}

function toggleClass(el, className) {

    if (hasClass(el, className)) {

        removeClass(el, className);

    } else {

        addClass(el, className);

    }

}

function transferClass(el_origin, el_target, className) {

    if (hasClass(el_origin, className)) {

        addClass(el_target, className);

    }

}

function eventElement(e) {
	
	return e ? e.target : window.event.srcElement;

}

function parseHTML(str) {

    var tmp = document.implementation.createHTMLDocument('Parsed');
    tmp.body.innerHTML = str;
    return tmp.body;

}

function forEach(selector, fn) { // Accepts both an array and a selector

    var elements = (typeof selector == 'string') ? qa(selector) : selector;
	if (elements.length > 0) {

	    for (var i = 0; i < elements.length; i++) {
	
	        fn(elements[i], i);
	
	    }
    
    }

}

function addEventHandler(el, eventType, handler) {

    if (el.addEventListener) {

        el.addEventListener(eventType, handler, false);

    } else {

        if (el.attachEvent) {

            el.attachEvent('on' + eventType, handler);

        }

    }

}

function removeEventHandler(el, eventType, handler) {

    if (el.removeEventListener) {

        el.removeEventListener(eventType, handler, false);

    } else {

        if (el.detachEvent) {

            el.detachEvent('on' + eventType, handler);

        }

    }

}

function stopEvent(e) {

    if (!e) {

        if (typeof window.event == 'undefined') {

            return;

        }

    }

	if ( typeof e == 'undefined' ) {
		
		return false;

	}

    //e.cancelBubble is supported by IE, this will kill the bubbling process.
    e.cancelBubble = true;
    e.returnValue = false;

    //e.stopPropagation works only in Firefox.
    if (e.stopPropagation) {

        e.stopPropagation();

    }

    if (e.preventDefault) {

        e.preventDefault();

    }

    return false;

}

function thisIndex(el) {

    if (!el) return;
	var node, nodes;
	
    nodes = node = el.parentNode.childNodes;

    var i = 0;
    var count = 0;

    while ((node = nodes.item(i++)) && node != el) {

        if (node.nodeType == 1) {

            count++;

        }

    }

    return (count);

}

function getCookie(k) { // Thanks Simon Steinberger
	
	var v=document.cookie.match('(^|;) ?'+k+'=([^;]*)(;|$)');return v?v[2]:null;

}

function touchSupport () {
	
	return (('ontouchstart' in window) /* || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0) */);

}

function q(selector) {

	return document.querySelector(selector);
	
}

function qa(selector) {
	
	return document.querySelectorAll(selector);
	
}

function wrap(toWrap, wrapper) { // Thanks yckart

    wrapper = wrapper || document.createElement('div');

    if (toWrap.nextSibling) {

        toWrap.parentNode.insertBefore(wrapper, toWrap.nextSibling);

    } else {

        toWrap.parentNode.appendChild(wrapper);

    }

    return wrapper.appendChild(toWrap);

}

function childByClass (el, cl) {

	if ( el ) {

		var i = 0;
		while(i < el.children.length) {
			
			if (hasClass(el.children[i], cl)) {
				
				return el.children[i];
	
			}
			i++;
			
		}

	}

	return false;
		
}

function ready(fn) {

  if (document.readyState != 'loading') {

    fn();

  } else if (document.addEventListener) {

    document.addEventListener('DOMContentLoaded', fn);

  } else {

    document.attachEvent('onreadystatechange', function() {
    	if (document.readyState != 'loading')
        	fn();
    });

  }

}

/* ––– */

forEach('table', function(el) {

	addClass(wrap(el).parentNode, 'table');

});

/* URI parameters */

function updateURLParameter(url, param, paramVal) { // return input string with updated/added URL parameter

    var newAdditionalURL = '';
    url = url.split('#')[0];
    var tempArray = url.split('?');
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = '';
    if (additionalURL) {
        tempArray = additionalURL.split('&');
        for (var i = 0; i < tempArray.length; i++) {
            if (tempArray[i].split('=')[0] != param) {
                newAdditionalURL += temp + tempArray[i];
                temp = '&';
            }
        }
    }

    var rows_txt = temp + '' + param + '=' + paramVal;
    return baseURL + '?' + newAdditionalURL + rows_txt.split('#')[0];

}

function getURLParameters() { // return all URL parameters in an array

    var res = {};
    var re = /[?&]([^?&]+)=([^?&]+)/g;

    location.href.replace(re, function(_, k, v) {

        res[k] = v;

    });

    return res;

}

/* URI parameters relay. Omit links starting with "javascript", "mailto", skip parameters not listed in the array */

var parameters_list = new Array('parameter1', 'parameter2');

function relayParameters() {

    var parameters = getURLParameters();

    forEach('a[href]', function(el, i) {

        for (var name in parameters) {

            if (el.href.indexOf('javascript') == -1 && el.href.indexOf('mailto') == -1 && parameters_list.indexOf(name) != -1) {
	            
	            var hash = el.href.split('#')[1];
	            el.href = updateURLParameter(el.href, name, parameters[name]);
	            if (typeof hash != 'undefined') {
		            
		            el.href = el.href.split('#')[0] + '#' + hash;
		            
	            }
	            
            }

        }

    });

}

function arrow_keys_handler(e) {

    switch (e.keyCode) {
        case 37:
        case 39:
        case 38:
        case 40: // Arrow keys
        case 32:
            e.preventDefault();
            break; // Space
        default:
            break; // do not block other keys
    }

}

function populateLightboxItem(slider, i) {
	
	var img = slider.children[(typeof i == 'undefined') ? 0 : i].querySelector('img');

	if (img && !img.src) {
		
		img.src = img.getAttribute('data-src');
		img.onclick = function (e) {
			
			toggleClass(eventElement(e), 'zoom');

		};
		return false;

	}

}

function populateLightbox(slider, i) {
	
	populateLightboxItem(slider, i);
		
	populateLightboxItem(slider, (i > 0) ? i-1 : slider.children.length-1);

	populateLightboxItem(slider, (i < slider.children.length-1) ? i+1 : 0);

}

var external = RegExp('^((f|ht)tps?:)?//(?!' + location.host + ')');
var full_window_content = null;

function preventEvent(e) { // For iOS scrolling behind blackbox
	
	e.preventDefault();

}

function keyUpClose(e) {
	
    if ((e || window.event).keyCode == 27) { // esc

        closeFullWindow();

    }

}

function closeFullWindow() {
	
	var full_window = q('.full-window-wrap');
    if (full_window) {
		
		if (full_window_content) { // Remove disposable generated content

			 // If lightbox/slider, crashes iOS Safari. not crashing with an empty div
			full_window.parentNode.removeChild(full_window);
			full_window_content = null;

				
		} else { // or keep previously existing content

			full_window.parentNode.replaceChild(full_window.querySelector('.content > *'), full_window);
		
		}

	    removeClass(q('html'), 'nooverflow');
	    if (touchSupport()) {

		    document.removeEventListener('touchmove', preventEvent, false);
		    q('body').removeEventListener('touchmove', preventEvent, false);
	    
	    }

		removeEventHandler(window, 'keydown', arrow_keys_handler);
// 		document.body.removeEventListener('keyup', keyUpClose);
		removeEventHandler(q('body'), 'keyup', keyUpClose);
		
    }
    
}

function openFullWindow(el) {
	
	closeFullWindow();

    addClass(q('html'), 'nooverflow');
	
	if (typeof el == 'string') {
		
		full_window_content = document.createElement('div');
		q('body').appendChild(full_window_content);
		full_window_content.innerHTML = el;
		el = full_window_content;
		
	}
	    
    addClass(wrap(el).parentNode, 'content');
    wrap(el.parentNode).parentNode.setAttribute('class', 'full-window-wrap');
	var full_window = q('.full-window-wrap');
	full_window.insertAdjacentHTML('beforeend', '<div class=full-window-wrap-bg></div>');

    if (!hasClass(el, 'headless')) {
	    
	    full_window.insertAdjacentHTML('afterbegin', '<div class=close> ← ' + document.title + '</div>');
		q('.full-window-wrap-bg').onclick = q('.full-window-wrap .close').onclick = closeFullWindow;
		
	    document.body.onkeyup = keyUpClose;
	   
	} else {
		
		addClass(full_window, 'headless');
		
	}

	if (touchSupport() && el.children[0] && hasClass(el.children[0], 'slider')) {

		document.addEventListener('touchmove', preventEvent, false);
		q('body').addEventListener('touchmove', preventEvent, false);

	}

    if (el.childNodes.length > 0 && hasClass(el.childNodes[0], 'full-screen')) {

		if (full_window.webkitRequestFullScreen) { 
			
			full_window.webkitRequestFullScreen(); 
			return false; 
		
		}
		if (full_window.mozRequestFullScreen) { 
			
			full_window.mozRequestFullScreen(); 
			return false; 
		
		}
		if (full_window.requestFullScreen) {
			
			full_window.requestFullScreen(); 
			return false; 
		
		}
	
	}
	
    return false;
	
}

/* To improve: Open and close a modal window with a generated element, to fix iOS Safari crash on modal close */
var temp_div = document.createElement('div');
q('body').appendChild(temp_div);
openFullWindow(temp_div);
closeFullWindow();

function modalWindow(e) {

    // Modal window of an external file

	openFullWindow('...');

    var el = eventElement(e);

    var link = getClosest(el, '.modal').href;
	
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

            openFullWindow(parsed);

            relayParameters();

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

function openLightbox(e) {

	var el = eventElement(e);
	if (el.length === 0) {
		
		el = e;
	}
	
	openFullWindow('<div class="slider lightbox' + (hasClass(el.parentNode.parentNode, 'full-screen') ? ' full-screen' : '') + '"></div>');
	q('.full-window-wrap').style.overflow = 'hidden';
	
    /* Add any <a><img> siblings with description to a .slider and initialise its controls */
    var images = '';

    forEach(getClosest(el, '.lightbox').querySelectorAll('a[href]'), function(el) {
		
		if (hasClass(el, 'video')) {
			// video poster = the anchor's img child, if it exists
			images += '<div><video poster=' + (el.querySelector('img') ? el.querySelector('img').src : '#') + ' controls=controls preload=none> <source type=video/mp4 src=' + el.href + '> </video></div>';
			
		} else {

	        images += '<div><img data-src="' + el.href + '" alt="' + el.title + '">' + (el.title ? ('<p>' + el.title + '</p>') : '') + '</div>';

        }
        // Attach onload event to each image to display it only when fully loaded and avoid top-to-bottom reveal?

    });

    q('.slider.lightbox').innerHTML = images;

    if (typeof makeSlider == 'function') {

        var anchor = el;

        while (typeof anchor.href == 'undefined') {

            anchor = anchor.parentNode;

        }

        transferClass(anchor.parentNode, q('.full-window-wrap .slider'), 'vertical');
        transferClass(anchor.parentNode, q('.full-window-wrap .slider'), 'right');

        // Load the images in the current slide and its neighbours
        while ( anchor.tagName.toLowerCase() != 'a' ) {
	        
	        anchor = anchor.parentNode;
	        
        }
        var this_index = thisIndex(anchor);
        populateLightbox(makeSlider(q('.full-window-wrap .slider'), this_index), this_index);

    }

    window.addEventListener('keydown', arrow_keys_handler, false);

    return false;

}

/*** Start ***/

/* Relay URI parameters to links */

relayParameters();

/* Tooltip */

forEach('.tool', function(el, i) {

	if (touchSupport()) {

		el.onclick = function (e) {

			toggleClass(eventElement(e), 'open');
			
		};
	
	}

    var t = el.querySelector('.tip');
    if (!t) return;

    el.style.position = 'static'; // dangerous with absolutely-positioned containers, which should be avoided anyway
    el.parentNode.style.position = 'relative'; // dangerous with absolutely-positioned containers, which should be avoided anyway
    t.style.top = (t.parentNode.offsetTop + t.parentNode.offsetHeight) + 'px';
    t.style.width = '100%';

});

/* Add 'Back to top' button */

q(q('footer > div > div') ? 'footer > div > div' : 'body').insertAdjacentHTML('beforeend', '<a class="backtotop" href="#"></a>');

/* Animate anchor links */

function getCumulativeOffset(obj) { // Offset from element to top of page

	var left, top;
    left = top = 0;

    if (obj.offsetParent) {

        do {

            left += obj.offsetLeft;
            top += obj.offsetTop;
            obj = obj.offsetParent;

        } while (obj);

    }

    return {

        x: left,
        y: top

    };

}

function animateAnchors(e) {

    e = e || window.event;
    if (typeof e == 'undefined') {

        return;

    }
    var el = e.target || e.srcElement;

    while (typeof el.href == 'undefined') {

        el = el.parentNode;

    }
	
	if (el.href.split(/#|\?/)[0] != window.location.href.split(/#|\?/)[0]) { // External page?
		
		return;
	
	}

	var hash = null;
	if (el.href.split('#').pop().length > 0) {
	
	    hash = document.getElementById(el.href.split('#').pop());

	}

	if (q('#nav-trigger')) {
		
	    q('#nav-trigger').checked = false;
	    if (q('header > nav > div')) {
		    
			removeClass(q('header > nav > div'), 'open');
			
		}

	}

    scrollToAnimated((hash === null) ? 0 : getCumulativeOffset(hash).y, function(e) { // To do: fix jumping to new hash – is the fallback executed properly in animate()?

        window.location = el.href.split('#')[0] + '#' + el.href.split('#').pop();

    });

    return false;

}

forEach('a[href^="#"]', function(el, i) {

	if (el.onclick) { // Don't overwrite previous onclick event handler
		
		return;

	}
    el.onclick = animateAnchors;

});

/* Modal window: open a link inside it. */

forEach('a.modal', function(el, i) {

	if (el.href != (location.href.split('#')[0] + '#')) {
		
	    el.onclick = modalWindow;

    }
    
    if (el.getAttribute && el.getAttribute('rel') === null) {
	    
	    el.setAttribute('rel', 'prefetch');

    }

});

/* Also lightbox with images */

forEach('.lightbox a', function(el, i) {

	/* Abort on IE, because of IE bug on dynamic img.src change */
	if (navigator.userAgent.indexOf('MSIE') != -1 || navigator.userAgent.indexOf('Trident') != -1) {
		
		el.target = '_blank';		
		return;

	}

    el.onclick = openLightbox;

});

/* Auto textarea height */

forEach('textarea', function(el) {

    el.onkeyup = function(e) {

        el = eventElement(e);

        while (el.rows > 1 && el.scrollHeight < el.offsetHeight) {

            el.rows--;

        }

        while (el.scrollHeight > el.offsetHeight) {

            if (el.rows > 20) {

                break;

            }
            el.rows++;

        }

        el.rows++;

    };

});

/* Form validation */

function submitForm(e) {

    var el = eventElement(e);

    var ready_to_submit = true;

    forEach(el.querySelectorAll('.mandatory'), function(el) {

        if (
			( el.querySelector('input, select, textarea') && !el.querySelector('input, select, textarea').value ) || 
			( el.querySelector('input[type=checkbox]') && !el.querySelector('input[type=checkbox]').checked ) ||
			( el.querySelector('input[type=email]') && !RegExp(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/).test(el.querySelector('input[type=email]').value) ) ||
			( el.querySelector('input[type=url]') && !RegExp(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/).test(el.querySelector('input[type=url]').value) ) ||
			( el.querySelector('input[type=number]') && 
				!(RegExp(/^\d+$/).test(el.querySelector('input[type=number]').value)) ||
				(el.querySelector('input[type=number][data-digits]') && (el.querySelector('input[type=number]').value.length != el.querySelector('input[type=number]').getAttribute('data-digits')))
			) ||
			( el.querySelector('input[type=radio]') && !el.querySelector('input[type=radio]').checked )
        ) {

            ready_to_submit = false;
            el.querySelector('input').focus();
            addClass(el, 'alert');
            return;

        } else {

            removeClass(el, 'alert');

        }

    });

    if (!ready_to_submit) {

        return false;

    }

    if (!hasClass(el, 'dynamic') || !(new XMLHttpRequest().upload) || !php_support) { // Browser unable to submit dynamically.

        return true;

    }

    el.insertAdjacentHTML('beforeend', '<input name=targetformurl type=hidden value=' + encodeURIComponent( el.method == 'get' ? el.action.replace(/\/?(\?|#|$)/, '/$1') : el.action ) + '>');

    request = new XMLHttpRequest();
    request.open('POST', scripts_location + 'request.php', true);

    request.onreadystatechange = function() {

        if (request.readyState != 4 || request.status != 200) {

            // php script unreachable, submit form normally
            return true;

        }

        if (!request.responseText || !php_support) {

            // php script unreachable, submit form normally
            el.onsubmit = function() {};
			el.constructor.prototype.submit.call(el); // el.submit();
            return true;

        }

        // strip id's from response HTML
        if (request.responseText.indexOf('---error---') != -1) {

            // Error
            document.getElementById('formresult').innerHTML = 'Error submitting form.';
            return;

        } else {

            // Success
            var loaded_html = parseHTML(request.responseText);
            document.getElementById('formresult').innerHTML = loaded_html.innerHTML;

        }

    };

    openFullWindow('<div id=formresult>Submitting form...</div>');

    request.send(new FormData(el));

    return false;

}

forEach('form', function(el, i) {

    el.onsubmit = el.onsubmit || submitForm;

});

function updateFileInput(e) {

    var el = eventElement(e);

    el.parentNode.querySelector('span').innerHTML = el.value.substring(el.value.lastIndexOf('\\') + 1);

}

forEach('input[type=file]', function(el, i) {

    el.onchange = updateFileInput;

});

if (q('#language-selector')) {

    q('#language-selector select').onchange = function(e) {

        q('#language-selector').submit();

    };

}

if (!touchSupport()) { // Touch device: remove iOS sticky hover state

	addClass(q('body'), 'no-touch');
	
}

/* Baseline-align images etc */

/*
function getStyle(oElm, strCssRule){ // Thanks http://robertnyman.com/2006/04/24/get-the-rendered-style-of-an-element/

	var strValue = '';

	if(document.defaultView && document.defaultView.getComputedStyle) {

		strValue = document.defaultView.getComputedStyle(oElm, '').getPropertyValue(strCssRule);

	}
	else if(oElm.currentStyle) {

		strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1){
			return p1.toUpperCase();
		});
		strValue = oElm.currentStyle[strCssRule];

	}

	return strValue;

}

var line_height = parseInt(getStyle(q('body'), 'line-height')); // Replace with getComputedStyle(q('body')).lineHeight for IE9+
*/

/*
	
// Not working after page resize and undesired in many cases. Need to rethink.

function baselineAlign () {

    forEach('main img, .aspect' + ((typeof(document.createElement('video').canPlayType) != 'undefined') ? ', main video' : ''), function(el) {

        var extra_padding = ((Math.round(el.scrollHeight / line_height) + 1) * line_height - el.scrollHeight);

        if (extra_padding >= line_height) {

            extra_padding -= line_height;

        }

        el.style.paddingBottom = extra_padding + 'px';

    });

}

addEventHandler(window, 'load', baselineAlign);
*/

/*
// Disabled for jumpiness
addEventHandler(window, 'resize', function () { 
	
	t = setTimeout(baselineAlign, 1000);

});
*/

function isInViewport(el) { // Thanks http://gomakethings.com/ditching-jquery/

    var distance = el.getBoundingClientRect();
    return (
        distance.top >= 0 &&
        distance.left >= 0 &&
        distance.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        distance.right <= (window.innerWidth || document.documentElement.clientWidth)
    );

}

function getClosest(el, selector) { // Thanks http://gomakethings.com/ditching-jquery/

    var firstChar = selector.charAt(0);

    // Get closest match
    for ( ; el && el !== document; el = el.parentNode ) {

        // If selector is a class
        if ( firstChar === '.' ) {
            if ( hasClass(el, selector.substr(1) ) ) {
                return el;
            }
        }

        // If selector is an ID
        if ( firstChar === '#' ) {
            if ( el.id === selector.substr(1) ) {
                return el;
            }
        } 

        // If selector is a data attribute
        if ( firstChar === '[' ) {
            if ( el.hasAttribute( selector.substr(1, selector.length - 2) ) ) {
                return el;
            }
        }

        // If selector is a tag
        if ( el.tagName.toLowerCase() === selector ) {
            return el;
        }

    }

    return false;

}

/* Check for host PHP support */
var php_support = 0;
var request = new XMLHttpRequest();
request.open('GET', document.location, true);
request.onload = function () {
	
	php_support = request.getAllResponseHeaders().toLowerCase().indexOf('php') == -1 ? 0 : 1;

};
request.send(null);

/* Sort parent table's rows by matching column number alternatively desc/asc on click */
function sortTable (table, column, f) {
	
	var rows;
	
	try { // IE8
	
		rows = Array.prototype.slice.call(table.querySelectorAll('tbody tr'), 0);
	
	} catch (err) {
	
	    return;
	
	}

	rows.sort(function(a, b) {
	
		var A = a.querySelectorAll('td')[column].textContent.toUpperCase();
		var B = b.querySelectorAll('td')[column].textContent.toUpperCase();
		
		if(A < B) {
			return 1*f;
		}
		if(A > B) {
			return -1*f;
		}

		return 0;
	
	});

    for (var i = 0; i < rows.length; i++) {

        table.querySelector('tbody').appendChild(rows[i]);

    }

}

forEach('td[data-sort]', function (el) {
	// asc or desc
	if (el.getAttribute('data-sort') != 'asc' && el.getAttribute('data-sort') != 'desc') {
		
		el.setAttribute('data-sort', 'asc');
		
	}
	
	el.onclick = function (e) {
		
		stopEvent(e);
		var el = eventElement(e);
		var cell = el.type == 'td' ? el : getClosest(el, 'td');
		var f; // Ascending
		if (cell.getAttribute('data-sort') == 'desc') {
			
			f = -1;
			cell.setAttribute('data-sort', 'asc');
			
		} else {
			
			f = 1;
			cell.setAttribute('data-sort', 'desc');
			
		}

		sortTable(getClosest(el, 'table'), thisIndex(cell), f);
		
	};

});

/* Polyfill to uncheck all radio buttons of a form with form owner attribute. Single set of radios currently, for drop-down menu. */
if (q('input[type=reset][form]') && !q('input[type=reset][form]').form) {
	
	forEach('input[type=reset][form]', function(el) {

		el.onclick = function (e) { // Assuming a single set of radios per form (for drop down menu)
			
			el = eventElement(e);
			q('input[type=radio][form=' + el.getAttribute('form') + ']:checked').checked = false;
			
		};

	});

}

function notifyCloseEvent() {

	if (q('.notify')) {

		q('.notify').onclick = function (e) {
			
			var el = eventElement(e);
			el.parentNode.removeChild(el);
			
		};
	
	}
	
}

function notify(content, option) {
	
	q('body').insertAdjacentHTML('afterbegin', '<div class="notify' + ((option == 'fixed') ? ' fixed' : '') + '">' + content + '</div>');
	notifyCloseEvent();
	
}

notifyCloseEvent();

/* Automatically open a lightbox specified in the URI */

ready( function () {

	try { // Android Browser etc?
	
	    var test_event = new Event('t');
	
	} catch (err) {
	
	    addClass(q('html'), 'no_new_event_support');
	
	}

	setTimeout( function () {
		
		try { /* No IE8 :target support */
			
			if (q('.lightbox:target')) {
				
				openLightbox(q('.lightbox:target > a[href]'));
				
			}
		
		} catch (err) {
			
			return;	
		
		}
	
	}, 1);

});

/* 
	
On page resize, scroll to the previous element visible on top.
On scroll, remember the element from 
allElementsFromPoint(start_of_contents or center, widnowscroll offset)[allElementsFromPoint(start_of_contents or center, widnowscroll offset).length-1]
and on resize, scroll to that element's position
Problem: a long paragraph might be re-positioned incorrectly. Which part of a tall element was on top?
Thanks http://stackoverflow.com/a/27884653	

function allElementsFromPoint(x, y) {

    var element, elements = [];
    var old_visibility = [];

    while (true) {
        element = document.elementFromPoint(x, y);
        if (!element || element === document.documentElement) {
            break;
        }
        elements.push(element);
        old_visibility.push(element.style.visibility);
        element.style.visibility = 'hidden'; // Temporarily hide the element (without changing the layout)
    }

    for (var k = 0; k < elements.length; k++) {
        elements[k].style.visibility = old_visibility[k];
    }

    elements.reverse();
    return elements;

}

*/

/*
$(".page").on("touchmove", function(event) {
  event.preventDefault()
});
*/

/* Mobile menu – freeze page content behind the menu */
function toggleFixedBody(e) {
		
	if (hasClass(q('body'),'fixed')) {
		
		var offset = q('body').style.top;
		q('body').style.top = 0;
		removeClass(q('body'), 'fixed');
		window.scrollTo(0, Math.abs(parseInt(offset, 10)));
		
	} else {
		
		q('body').style.top = (-1 * window.scrollY) + 'px';
		addClass(q('body'), 'fixed');
	
	}

}

/* Chainable animation specified as CSS Animation */

var temp = document.createElement('temp');

var animations = {

	'animation'      	: 'animationend',
	'MozAnimation'   	: 'animationend',
	'WebkitAnimation'	: 'webkitAnimationEnd'

};

for(var t in animations) {

    if (temp.style[t] !== undefined) {

        var animationEndEvent = animations[t];

    }

}

function animate(el, animation, duration, callback) {

	if (!el.addEventListener || q('.animation-code')) { // Animation in progress
		
		return;

	}
	el.addEventListener(animationEndEvent, function animationEndHandler(e) {
		
		var el = e.target;
		el.style.pointerEvents = '';
		removeClass(el, q('.animation-code').getAttribute('data-class'));
		q('.animation-code').outerHTML = '';
 		el.removeEventListener(animationEndEvent, animationEndHandler);
		if (typeof callback == 'function') {
	
			callback();
	
		}
	
	}, false);
	var animation_name = 'a' + new Date().getTime(); // Unique animation name for more animate() as callback
	var styles = document.createElement('style');
	styles.innerHTML = '@keyframes ' + animation_name + ' {' + animation + '} .' + animation_name + ' { animation-name: ' + animation_name + '; animation-duration: ' + duration + 's; }'; // Where animation format is 		0% { opacity: 1 } 100% { opacity: 0 }
	q('head').appendChild(styles);
	addClass(styles, 'animation-code');
	styles.setAttribute('data-class', animation_name);
	addClass(el, animation_name);
	el.style.pointerEvents = 'none';
	
}

// Scroll the page to any position

function scrollToAnimated(to, callback) {
	
	if (to > (document.body.clientHeight - window.innerHeight) ) {

		to = document.body.clientHeight - window.innerHeight;

	}
	
	function scrollToCallback (callback) {
		
		q('html').scrollTop = to; 
		if (typeof callback === 'function') {
			
			callback();
		
		}
		
	}
	
	animate(q('html'), '100%{transform: translate3d(0,' + -1*(to - (document.documentElement.scrollTop || document.body.scrollTop)) + 'px,0)}', .5, scrollToCallback.bind(null, callback));

}

/* Fold */

function toggleAccordion(e) {

    stopEvent(e);
    var el = getClosest(eventElement(e), '.fold');

    if (getClosest(el, '.fixed')) {
	    
	    toggleFixedBody();

    }

    var content = el.querySelector('div');

	if (hasClass(el, 'open')) {
		
		animate(content, '0% { max-height: ' + content.scrollHeight + 'px; } 100% { max-height: 0; }', .2, function () { toggleClass(el, 'open'); });
		
	} else {
		
		toggleClass(el, 'open');
		animate(content, '0% { max-height: 0; } 100% { max-height: ' + content.scrollHeight + 'px; }', .2);
		
	}

    return false;

}

forEach('input.trigger, input[type=reset]', function(el, i) {
	
	el.onclick = function(e) {
		
		e.stopPropagation();

	};

});

forEach('.fold > label', function(el, i) {

    el.onclick = toggleAccordion;

    el = el.parentNode;

    if (el.querySelector('input.trigger')) { // Remove CSS-only triggers

        el.querySelector('input.trigger').outerHTML = '';

    }

    el.querySelector('div').onclick = function(e) {

        stopEvent(e);

    };
    
});

// Close all .trigger-activated content when clicking outside of them

addEventHandler(q('body'), 'click', function (e) {

	if (!getClosest(eventElement(e), '.trigger')) {
		
		forEach('input.trigger', function (el) {
			
			el.checked = false;
			
		});
		
		removeClass(q('body'), 'fixed');
		
	}
	
});
