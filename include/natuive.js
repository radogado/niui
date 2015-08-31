/* natUIve by rado.bg */
/* DOM functions via http://youmightnotneedjquery.com */
function addClass(el, className) {

    if (el.classList) {
		
        el.classList.add(className);

    } else {

        el.className += ' ' + className;

    }

}

function removeClass(el, className) {

    if (el.classList) {

        el.classList.remove(className);

    } else {

	    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');

    }

}

function hasClass(el, className) {
	
	if (el.classList) {
		
		return el.classList.contains(className);

	} else {
		
	    return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
			
	}
	
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
	
	if (e) {
		
		return e.target;

	} else {
		
		return window.event.srcElement;
		
	}

}

parseHTML = function(str) {

    tmp = document.implementation.createHTMLDocument('Parsed');
    tmp.body.innerHTML = str;
    return tmp.body;

}

function forEach(selector, fn) { // Accepts both an array and a selector

    elements = (typeof selector == 'string') ? qa(selector) : selector;
    for (var i = 0; i < elements.length; i++) {

        fn(elements[i], i);

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

    nodes = node = el.parentNode.childNodes;

    var i = count = 0;

    while ((node = nodes.item(i++)) && node != el) {

        if (node.nodeType == 1) {

            count++;

        }

    }

    return (count);

}

function parentByClass(el, className) {

    while (el.parentNode && !hasClass(el, className)) {

        el = el.parentNode;

    }
	if (typeof el.tagName == 'undefined') {
		
		return false;

	}

    return hasClass(el, className) && el;

}

if (!Array.prototype.indexOf) {

    Array.prototype.indexOf = function(el) {

        len = this.length >>> 0;

        from = Number(arguments[1]) || 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        if (from < 0)
            from += len;

        for (; from < len; from++) {
            if (from in this && this[from] === el)
                return from;
        }
        return -1;

    };

}

function q(selector) {
	
	return document.querySelector(selector);
	
}

function qa(selector) {
	
	return document.querySelectorAll(selector);
	
}

var wrap = function (toWrap, wrapper) { // Thanks yckart

    wrapper = wrapper || document.createElement('div');
    if (toWrap.nextSibling) {

        toWrap.parentNode.insertBefore(wrapper, toWrap.nextSibling);

    } else {

        toWrap.parentNode.appendChild(wrapper);

    }

    return wrapper.appendChild(toWrap);

};

/* ––– */

scripts_location = document.getElementsByTagName('script');
scripts_location = scripts_location[scripts_location.length-1].src;
scripts_location = scripts_location.slice(0, scripts_location.length - scripts_location.split('/').pop().length);

forEach('table', function(el) {

	addClass(wrap(el).parentNode, 'table');

});

/* URI parameters */

function updateURLParameter(url, param, paramVal) { // return input string with updated/added URL parameter

    newAdditionalURL = '';
    url = url.split('#')[0];
    tempArray = url.split('?');
    baseURL = tempArray[0];
    additionalURL = tempArray[1];
    temp = '';
    if (additionalURL) {
        tempArray = additionalURL.split('&');
        for (i = 0; i < tempArray.length; i++) {
            if (tempArray[i].split('=')[0] != param) {
                newAdditionalURL += temp + tempArray[i];
                temp = '&';
            }
        }
    }

    rows_txt = temp + '' + param + '=' + paramVal;
    return baseURL + '?' + newAdditionalURL + rows_txt.split('#')[0];

}

function getURLParameters() { // return all URL parameters in an array

    res = {};
    re = /[?&]([^?&]+)=([^?&]+)/g;

    location.href.replace(re, function(_, k, v) {

        res[k] = v;

    });

    return res;

}

/* URI parameters relay. Omit links starting with "javascript", "mailto", skip parameters not listed in the array */

var parameters_list = new Array('parameter1', 'parameter2');

function relayParameters() {

    parameters = getURLParameters();

    forEach('a[href]', function(el, i) {

        for (name in parameters) {

            if (el.href.indexOf('javascript') == -1 && el.href.indexOf('mailto') == -1 && parameters_list.indexOf(name) != -1) {
	            
	            hash = el.href.split('#')[1];
	            el.href = updateURLParameter(el.href, name, parameters[name]);
	            if (typeof hash != 'undefined') {
		            
		            el.href = el.href.split('#')[0] + '#' + hash;
		            
	            }
	            
            }

        }

    });

}

temp = document.createElement('temp');

transitions = {

	'transition'		: 'transitionend',
	'OTransition'		: 'oTransitionEnd',
	'MozTransition'		: 'transitionend',
	'WebkitTransition'	: 'webkitTransitionEnd'

}

animations = {

// 	'animation'      	: 'animationend', // Disable IE because of a Slider glitch
	'OAnimation'     	: 'oAnimationEnd',
	'MozAnimation'   	: 'animationend',
	'WebkitAnimation'	: 'webkitAnimationEnd'

}

for(t in transitions){

    if (temp.style[t] !== undefined) {

        var transitionEvent = transitions[t];

    }

}

for(t in animations){

    if (temp.style[t] !== undefined) {

        var animationEvent = animations[t];

    }

}

function scrollTo(to, callback) {
	
	if (typeof document.body.style.transition != 'string') {
		
		callback();
		return;

	}
	
	if (to > (document.body.clientHeight-window.innerHeight) ) {

		to = document.body.clientHeight-window.innerHeight;

	}
	
    change = to - (document.documentElement.scrollTop || document.body.scrollTop);

	addClass(q('html'), 'no-hover');
    q('html').addEventListener(transitionEvent, function(e) {

		q('html').removeEventListener(transitionEvent, arguments.callee);
		removeClass(q('html'), 'no-hover');
		q('html').style.cssText = '';
		callback();

    }, false);
	q('html').style.cssText = '-webkit-transform: translate3d(0,' + -1*change + 'px,0); transform: translate3d(0,' + -1*change + 'px,0);';

}

var arrow_keys_handler = function(e) {

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

};

function populateLightboxItem(slider, i) {
	
	img = slider.children[i].querySelector('img');

	if (!img.src) {
		
		img.src = img.getAttribute('data-src');
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

function closeFullWindow() {
	
    if (full_window = document.getElementById('full-window')) {
		
		if (full_window_content) { // Remove disposable generated content

			 // If lightbox/slider, crashes iOS Safari. not crashing with an empty div
			full_window.parentNode.removeChild(full_window);
			full_window_content = null;

				
		} else { // or keep previously existing content

			full_window.parentNode.replaceChild(full_window.querySelector('.content > *'), full_window);
		
		}

	    removeClass(q('html'), 'nooverflow');
	    if ('ontouchstart' in window) {

		    document.removeEventListener('touchmove', preventEvent, false);
		    q('body').removeEventListener('touchmove', preventEvent, false);
	    
	    }

		removeEventHandler(window, 'keydown', arrow_keys_handler);
		
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
    wrap(el.parentNode).parentNode.setAttribute('id', 'full-window');
	q('#full-window').insertAdjacentHTML('beforeend', '<div id=full-window-bg></div>');

    if (!hasClass(el, 'headless')) {
	    
	    q('#full-window').insertAdjacentHTML('afterbegin', '<div class=close> ← ' + document.title + '</div>');
		q('#full-window-bg').onclick = q('#full-window .close').onclick = closeFullWindow;
		
	    document.body.onkeyup = function(e) {
	
	        if ((e || window.event).keyCode == 27) { // esc
	
	            closeFullWindow();
	
	        }
	
	    };
	   
	} else {
		
		addClass(q('#full-window'), 'headless');
		
	}

	if (('ontouchstart' in window) && el.children[0] && hasClass(el.children[0], 'slider')) {

		document.addEventListener('touchmove', preventEvent, false);
		q('body').addEventListener('touchmove', preventEvent, false);

	}
	
    return false;
	
}

/* To imporve: Open and close a modal window with a generated element, to fix iOS Safari crash on modal close */
el = document.createElement('div');
q('body').appendChild(el);
openFullWindow(el);
closeFullWindow();

function modalWindow(e) {

    // Modal window of an external file

	openFullWindow('...');

    el = eventElement(e);

    link = parentByClass(el, 'modal').href;
	
    if (!php_support && external.test(link) || !(new XMLHttpRequest().upload)) { // No PHP or XHR?

        window.open(link, '_blank');
        return false;

    }

    request = new XMLHttpRequest();
    request.open('GET', external.test(link) ? (scripts_location + 'request.php?targetformurl=' + link.split('#')[0]) : link.split('#')[0], true);

    request.onload = function() {

        if (request.status >= 200 && request.status < 400) {
            // Success
            if (!request.responseText) { // No PHP?

                closeFullWindow();
                window.open(link, 'Modal');
                return false;

            }
            container = (typeof link.split('#')[1] != 'undefined') ? ('#' + link.split('#')[1]) : 0;

			parsed = request.responseText;
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

	openFullWindow('<div class="slider lightbox"></div>');
	q('#full-window').style.overflow = 'hidden';
	
	el = eventElement(e);

    /* Add any <a><img> siblings with description to a .slider and initialise its controls */
    images = '';

    forEach(parentByClass(el, 'lightbox').querySelectorAll('a[href]'), function(el) {

        images += '<div><img data-src="' + el.href + '" alt="' + el.title + '"><p>' + el.title + '</p></div>';
        // Attach onload event to each image to display it only when fully loaded and avoid top-to-bottom reveal?

    });

    q('.slider.lightbox').innerHTML = images;

    if (makeSlider) {

        anchor = el;

        while (typeof anchor.href == 'undefined') {

            anchor = anchor.parentNode;

        }

        if (hasClass(anchor.parentNode, 'vertical')) {

            addClass(q('#full-window .slider'), 'vertical');

        }

        // Load the images in the current slide and its neighbours
        while ( anchor.tagName.toLowerCase() != 'a' ) {
	        
	        anchor = anchor.parentNode;
	        
        }
        this_index = thisIndex(anchor);
        populateLightbox(makeSlider(q('#full-window .slider'), this_index), this_index);

    }

    window.addEventListener('keydown', arrow_keys_handler, false);

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

q(q('footer > div > div') ? 'footer > div > div' : 'body').insertAdjacentHTML('beforeend', '<a class="backtotop" href="#"> ↑ </a>');

/* Animate anchor links */

var getCumulativeOffset = function(obj) { // Offset from element to top of page

	var left, top;
    left = top = 0;

    if (obj.offsetParent) {

        do {

            left += obj.offsetLeft;
            top += obj.offsetTop;

        } while (obj = obj.offsetParent);

    }

    return {

        x: left,
        y: top

    };

};

function animateAnchors(e) {

    e = e || window.event;
    if (typeof e == 'undefined') {

        return;

    }
    el = e.target || e.srcElement;

    while (typeof el.href == 'undefined') {

        el = el.parentNode;

    }
	
	if (el.href.split(/#|\?/)[0] != window.location.href.split(/#|\?/)[0]) { // External page?
		
		return;
	
	}

	hash = null;
	if (el.href.split('#').pop().length > 0) {
	
	    hash = document.getElementById(el.href.split('#').pop());

	}

	if (q('#nav-trigger')) {
		
	    q('#nav-trigger').checked = false;
	    removeClass(q('header > nav > div'), 'open');
	    removeClass(q('body'), 'semi-transparent');

	}

    scrollTo((hash == null) ? 0 : getCumulativeOffset(hash).y, function(e) {

        window.location = el.href.split('#')[0] + '#' + el.href.split('#').pop();

    });

    return false;

};

forEach('a[href*="#"]', function(el, i) {

    el.onclick = animateAnchors;

});

/* Modal window: open a link inside it. */

forEach('a.modal', function(el, i) {

    el.onclick = modalWindow;

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

        el.rows++

    };

});

/* Form validation */

function submitForm(e) {

    el = eventElement(e);

    ready_to_submit = true;

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

    if (!(new XMLHttpRequest().upload) || !php_support) { // Browser unable to submit dynamically.

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
console.log(request.responseText);
            // Success
            loaded_html = parseHTML(request.responseText);
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

    el = eventElement(e);

    el.parentNode.querySelector('span').innerHTML = el.value.substring(el.value.lastIndexOf('\\') + 1)

}

forEach('input[type=file]', function(el, i) {

    el.onchange = updateFileInput;

});

if (q('#language-selector')) {

    q('#language-selector select').onchange = function(e) {

        q('#language-selector').submit();

    };

}

/* Accordion */

function toggleAccordion(e) {

    el = eventElement(e);

    stopEvent(e);
    el = el.parentNode;
    toggleClass(el, 'open');

    el.querySelector('div').style.maxHeight = ((el.querySelector('div').style.maxHeight == '') ? (el.querySelector('div').scrollHeight + 'px') : '');

    if (hasClass(el.parentNode.parentNode, 'accordion')) { // Embedded accordion

        el.parentNode.style.maxHeight = el.querySelector('div').scrollHeight + el.parentNode.scrollHeight + 'px';

    }

    return false;

}

forEach('.accordion > label', function(el, i) {

    el.onclick = toggleAccordion;

    el = el.parentNode;

    if (el.querySelector('input.trigger')) { // Remove CSS-only triggers

        el.querySelector('input.trigger').outerHTML = '';

    }

    el.querySelector('div').onclick = function(e) {

        stopEvent(e);

    };

});

if ('ontouchstart' in window) { // Touch device: remove iOS sticky hover state

	addClass(q('html'), 'touch-device');

}

if (q('#nav-trigger')) {
	
	q('#nav-trigger').onchange = function(e) {
		
	    toggleClass(q('body'), 'semi-transparent');

	};

}

function getStyle(oElm, strCssRule){ // Thanks http://robertnyman.com/2006/04/24/get-the-rendered-style-of-an-element/

	strValue = '';

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

var line_height = parseInt(getStyle(q('body'), 'line-height'));

addEventHandler(window, 'load', function() {

    /* Baseline-align images */

    forEach('main img', function(el) {

        extra_padding = ((Math.round(el.height / line_height) + 1) * line_height - el.height);

        if (extra_padding >= line_height) {

            extra_padding -= line_height;

        }

        el.style.paddingBottom = extra_padding + 'px';

    });

});

/* Check for host PHP support */
var php_support = 0;
request = new XMLHttpRequest();
request.open('GET', document.location, true);
request.onload = function () {
	
	php_support = request.getAllResponseHeaders().toLowerCase().indexOf('php') == -1 ? 0 : 1;

}
request.send(null);

/* Polyfill to uncheck all radio buttons of a form with form owner attribute. Single set of radios currently, for drop-down menu. */
if (q('input[type=reset][form]') && !q('input[type=reset][form]').form) {
	
	forEach('input[type=reset][form]', function(el) {

		el.onclick = function (e) { /* Assuming a single set of radios per form (for drop down menu) */
			
			el = eventElement(e);
			q('input[type=radio][form=' + el.getAttribute('form') + ']:checked').checked = false;
			
		};

	});

}

if ('ontouchstart' in window) { // For touch devices CSS

	addClass(document.querySelector('body'), 'touch');

}

if (q('.overthrow')) { /* Load touch scroll polyfill */

    // DOM: Create the script element
    js_el = document.createElement("script");
    // set the type attribute
    js_el.type = "application/javascript";
    // make the script element load file
    js_el.src = scripts_location + 'overthrow.js';
    // finally insert the element to the body element in order to load the script
    document.body.appendChild(js_el);
	
}

