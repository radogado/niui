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

var parseHTML = function(str) {

    var tmp = document.implementation.createHTMLDocument('Parsed');
    tmp.body.innerHTML = str;
    return tmp.body;

};

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

function touchSupport () {
	
	return (('ontouchstart' in window)
	     || (navigator.maxTouchPoints > 0)
	     || (navigator.msMaxTouchPoints > 0));

}

if (!Array.prototype.indexOf) {

    Array.prototype.indexOf = function(el) {

        var len = this.length >>> 0;

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

function childByClass (el, cl) {

	var i = 0;
	while(i < el.children.length) {
		
		if (hasClass(el.children[i], cl)) {
			
			return el.children[i];

		}
		i++;
		
	}

	return false;
		
}

/* ––– */

var scripts_location = document.getElementsByTagName('script');
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

    rows_txt = temp + '' + param + '=' + paramVal;
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

        for (name in parameters) {

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

var temp = document.createElement('temp');

var transitions = {

	'transition'		: 'transitionend',
	'OTransition'		: 'oTransitionEnd',
	'MozTransition'		: 'transitionend',
	'WebkitTransition'	: 'webkitTransitionEnd'

}

var animations = {

// 	'animation'      	: 'animationend', // Disable IE because of a Slider glitch
	'OAnimation'     	: 'oAnimationEnd',
	'MozAnimation'   	: 'animationend',
	'WebkitAnimation'	: 'webkitAnimationEnd'

}

for(var t in transitions){

    if (temp.style[t] !== undefined) {

        var transitionEvent = transitions[t];

    }

}

for(var t in animations){

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
	
    var change = to - (document.documentElement.scrollTop || document.body.scrollTop);

	addClass(q('html'), 'animate-scroll');
    q('html').addEventListener(transitionEvent, function scrollEndHandler(e) {

		q('html').removeEventListener(transitionEvent, scrollEndHandler);
		removeClass(q('html'), 'animate-scroll');
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
	
	var img = slider.children[i].querySelector('img');

	if (!img.src) {
		
		img.src = img.getAttribute('data-src');
		img.onclick = function (e) {
			
			toggleClass(eventElement(e), 'zoom');

		}
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
	
	var full_window;
    if (full_window = q('.full-window-wrap')) {
		
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
	q('.full-window-wrap').insertAdjacentHTML('beforeend', '<div class=full-window-wrap-bg></div>');

    if (!hasClass(el, 'headless')) {
	    
	    q('.full-window-wrap').insertAdjacentHTML('afterbegin', '<div class=close> ← ' + document.title + '</div>');
		q('.full-window-wrap-bg').onclick = q('.full-window-wrap .close').onclick = closeFullWindow;
		
	    document.body.onkeyup = function(e) {
	
	        if ((e || window.event).keyCode == 27) { // esc
	
	            closeFullWindow();
	
	        }
	
	    };
	   
	} else {
		
		addClass(q('.full-window-wrap'), 'headless');
		
	}

	if (touchSupport() && el.children[0] && hasClass(el.children[0], 'slider')) {

		document.addEventListener('touchmove', preventEvent, false);
		q('body').addEventListener('touchmove', preventEvent, false);

	}
	
    return false;
	
}

/* To imporve: Open and close a modal window with a generated element, to fix iOS Safari crash on modal close */
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

	openFullWindow('<div class="slider lightbox"></div>');
	q('.full-window-wrap').style.overflow = 'hidden';
	
	var el = eventElement(e);

    /* Add any <a><img> siblings with description to a .slider and initialise its controls */
    var images = '';

    forEach(getClosest(el, '.lightbox').querySelectorAll('a[href]'), function(el) {

        images += '<div><img data-src="' + el.href + '" alt="' + el.title + '">' + (el.title ? ('<p>' + el.title + '</p>') : '') + '</div>';
        // Attach onload event to each image to display it only when fully loaded and avoid top-to-bottom reveal?

    });

    q('.slider.lightbox').innerHTML = images;

    if (makeSlider) {

        var anchor = el;

        while (typeof anchor.href == 'undefined') {

            anchor = anchor.parentNode;

        }

        if (hasClass(anchor.parentNode, 'vertical')) {

            addClass(q('.full-window-wrap .slider'), 'vertical');

        }

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
	    removeClass(q('body'), 'semi-transparent');

	}

    scrollTo((hash == null) ? 0 : getCumulativeOffset(hash).y, function(e) {

        window.location = el.href.split('#')[0] + '#' + el.href.split('#').pop();

    });

    return false;

};

forEach('a[href^="#"]', function(el, i) {

	if (el.onclick) { // Don't overwrite previous onclick event handler
		
		return;

	}
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

    var el = eventElement(e);

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

    var el = eventElement(e);

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

if (!touchSupport()) { // Touch device: remove iOS sticky hover state

	addClass(q('body'), 'no-touch');
	
}

if (q('#nav-trigger')) {
	
	q('#nav-trigger').onchange = function(e) {
		
	    toggleClass(q('body'), 'semi-transparent');

	};

}

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

var line_height = parseInt(getStyle(q('body'), 'line-height'));

/* Baseline-align images etc */

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

var isInViewport = function (el) { // Thanks http://gomakethings.com/ditching-jquery/

    var distance = el.getBoundingClientRect();
    return (
        distance.top >= 0 &&
        distance.left >= 0 &&
        distance.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        distance.right <= (window.innerWidth || document.documentElement.clientWidth)
    );

};

var getClosest = function (el, selector) { // Thanks http://gomakethings.com/ditching-jquery/

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

};

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
	
		A = a.querySelectorAll('td')[column].textContent.toUpperCase();
		B = b.querySelectorAll('td')[column].textContent.toUpperCase();
		
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

forEach ('td[data-sort]', function (el) {
	// asc or desc
	if (el.getAttribute('data-sort') != 'asc' && el.getAttribute('data-sort') != 'desc') {
		
		el.setAttribute('data-sort', 'asc');
		
	}
	
	el.onclick = function (e) {
		
		stopEvent(e);
		var el = eventElement(e);
		cell = el.type == 'td' ? el : getClosest(el, 'td');
		var f; // Ascending
		if (cell.getAttribute('data-sort') == 'desc') {
			
			f = -1;
			cell.setAttribute('data-sort', 'asc')
			
		} else {
			
			f = 1;
			cell.setAttribute('data-sort', 'desc')
			
		}

		sortTable(getClosest(el, 'table'), thisIndex(cell), f);
		
	};

});

/* Polyfill to uncheck all radio buttons of a form with form owner attribute. Single set of radios currently, for drop-down menu. */
if (document.querySelector('input[type=reset][form]') && !document.querySelector('input[type=reset][form]').form) {
	
	forEach('input[type=reset][form]', function(el) {

		el.onclick = function (e) { // Assuming a single set of radios per form (for drop down menu)
			
			el = eventElement(e);
			document.querySelector('input[type=radio][form=' + el.getAttribute('form') + ']:checked').checked = false;
			
		};

	});

}

