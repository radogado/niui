/* natUIve by rado.bg */
/* DOM functions via http://youmightnotneedjquery.com */
function addClass_classList(el, className) {

	el.classList.add(className);

}

function addClass_className(el, className) {

    el.className += ' ' + className;

}

function addClass(el, className) {

    if (el.classList) {
		
        el.classList.add(className);
        addClass = addClass_classList;

    } else {

        el.className += ' ' + className;
        addClass = addClass_className;

    }

}

function removeClass_classList(el, className) {

    el.classList.remove(className);

}

function removeClass_className(el, className) {

    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');

}

function removeClass(el, className) {

    if (el.classList) {

        el.classList.remove(className);
        removeClass = removeClass_classList;

    } else {

        removeClass_className(el, className);
        removeClass = removeClass_className;

    }

}

function hasClass_classList(el, className) {

    return el.classList.contains(className);

}

function hasClass_className(el, className) {

    return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);

}

function hasClass(el, className) {
	
	if (el.classList) {
		
		hasClass = hasClass_classList;
		return el.classList.contains(className);

	} else {
		
		hasClass = hasClass_className;
		return hasClass_className(el, className);
			
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

function eventElement_e(e) {

    return e.target;

}

function eventElement_window(e) {

    return window.event.srcElement;

}

function eventElement(e) {
	
	if (e) {
		
		eventElement = eventElement_e;
		return e.target;

	} else {
		
		eventElement = eventElement_window;
		return window.event.srcElement;
		
	}

}

var parseHTML = function(str) {

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

    var nodes = el.parentNode.childNodes,
        node;
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

    Array.prototype.indexOf = function(elt) {

        var len = this.length >>> 0;

        var from = Number(arguments[1]) || 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        if (from < 0)
            from += len;

        for (; from < len; from++) {
            if (from in this && this[from] === elt)
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

/* ––– */

forEach('table', function(el) {

    el.insertAdjacentHTML('beforebegin', '<div class=table>' + el.outerHTML + '</div>');
    el.outerHTML = '';

});

/* URI parameters */

function updateURLParameter(url, param, paramVal) { // return input string with updated/added URL parameter

    newAdditionalURL = "";
    url = url.split('#')[0];
    tempArray = url.split("?");
    baseURL = tempArray[0];
    additionalURL = tempArray[1];
    temp = "";
    if (additionalURL) {
        tempArray = additionalURL.split("&");
        for (i = 0; i < tempArray.length; i++) {
            if (tempArray[i].split('=')[0] != param) {
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }
        }
    }

    var rows_txt = temp + "" + param + "=" + paramVal;
    return baseURL + "?" + newAdditionalURL + rows_txt.split('#')[0];

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

function scrollTo(to, callback) {
	
	if (typeof document.body.style.transition != 'string') {
		
		callback();
		return;

	}
	
	if (to > (document.body.clientHeight-window.innerHeight) ) {

		to = document.body.clientHeight-window.innerHeight;

	}
	
    change = to - (document.documentElement.scrollTop || document.body.scrollTop);

	addClass(q('html'), 'disable-hover');
    q('html').addEventListener('transitionend', function(e) {
		
		q('html').removeEventListener('transitionend', arguments.callee);
		removeClass(q('html'), 'disable-hover');
		q('html').style.cssText = '';
		callback();

    }, false);
	q('html').style.cssText = '-webkit-transform: translateY(' + -1*change + 'px); transform: translateY(' + -1*change + 'px);';

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

function removeBlackbox() {

    var blackbox = document.getElementById('blackbox');
    if (blackbox) {

        if (blackbox.querySelector('.slider')) { // Lightbox

            removeClass(blackbox.querySelector('.slider'), 'slider');
            var slider = q('.slider'); // Make another slider active, if any

        }
        document.body.removeChild(blackbox);

    }
    removeClass(q('html'), 'nooverflow');

	removeEventHandler(window,'keydown',arrow_keys_handler);

}

var external = RegExp('^((f|ht)tps?:)?//(?!' + location.host + ')');

function modalWindow(e) {

    removeBlackbox();

    document.body.onkeyup = function(e) {

        if ((e || window.event).keyCode == 27) { // esc

            removeBlackbox();

        }

    };

    document.body.insertAdjacentHTML('afterbegin', '<div id="blackbox"> </div>');
    addClass(q('html'), 'nooverflow');

    // Modal window of HTML as input string

    if (typeof e == 'string') {

        document.getElementById('blackbox').innerHTML = '<div class="close"> ← ' + document.title + '</div>' + e + '<div id="blackbox-bg"></div>';

        document.getElementById('blackbox-bg').onclick = q('#blackbox .close').onclick = removeBlackbox;

        return false;

    }

    // Modal window of an external file or Lightbox

    el = eventElement(e);

    if (parentByClass(el, 'modal')) { // Load an external file 

        link = parentByClass(el, 'modal').href;
/*
		if (link.split('#').length > 2) {
			
			link = link.split('#')[0] + '#' + link.split('#')[2];
		}
*/
		
        if (!php_support && external.test(link) || !(new XMLHttpRequest().upload)) { // No PHP or XHR?

            window.open(link, '_blank');
            removeBlackbox();
            return false;

        }

        request = new XMLHttpRequest();
        request.open("GET", external.test(link) ? ("include/request.php?targetformurl=" + link.split('#')[0]) : link.split('#')[0], true);

        request.onload = function() {

            if (request.status >= 200 && request.status < 400) {
                // Success
                if (!request.responseText) { // No PHP?

                    window.open(link, 'Modal');

                }
                container = (typeof link.split('#')[1] != 'undefined') ? ('#' + link.split('#')[1]) : 0;

                blackbox = document.getElementById('blackbox');
                blackbox.insertAdjacentHTML('afterbegin', '<div class="close"> ← ' + document.title + '</div>');
                if (container) {

                    parsed = parseHTML(request.responseText);
                    if (!parsed.querySelector(container)) {
                        removeBlackbox();
                        return false;
                    }
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

    var parent = parentByClass(el, 'lightbox');

    /* Add any <a><img> siblings with description to a .slider and initialise its controls */
    images = '';

    forEach(parent.querySelectorAll('a[href]'), function(el) {

        images += '<div><img src="' + el.href + '" alt="' + el.title + '"><p>' + el.title + '</p></div>';

    });

    q('.slider.lightbox').innerHTML = images;

    if (makeSlider) {

        anchor = el.parentNode;

        while (typeof anchor.href == 'undefined') {

            anchor = anchor.parentNode;

        }

        if (hasClass(anchor.parentNode, 'vertical')) {

            addClass(q('#blackbox .slider'), 'vertical');

        }

        var slider = makeSlider(q('#blackbox .slider'), thisIndex(anchor));

    }

    document.getElementById('blackbox-bg').onclick = q('#blackbox .close').onclick = removeBlackbox;

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

q(q('#footer > div > div') ? '#footer > div > div' : 'body').insertAdjacentHTML('beforeend', '<a class="backtotop" href="#"> ↑ </a>');

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
	
	hash = null;
	if (el.href.split('#').pop().length > 0) {
	
	    hash = document.getElementById(el.href.split('#').pop());

	}

	if (q('#nav-trigger')) {
		
	    q('#nav-trigger').checked = false;
	    removeClass(q('.nav-main > div'), 'open');
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

/* Modal window: open a link inside it. Also lightbox with images */

forEach('a.modal, .lightbox a', function(el, i) {

    el.onclick = modalWindow;

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
            (el.querySelector('input, select, textarea') && !el.querySelector('input, select, textarea').value) ||
            (el.querySelector('input[type="checkbox"]') && !el.querySelector('input[type="checkbox"]').checked) ||
            (el.querySelector('input[type="radio"]') && !el.querySelector('input[type="radio"]').checked)
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

    if (!(new XMLHttpRequest().upload) || !php_support) { // Browser unable to submit dynamically. To do: or if request.php isn't working

        return true;

    }

    el.insertAdjacentHTML('beforeend', '<input name=targetformurl type=hidden value=' + encodeURIComponent(el.action) + '>');

    var r = new XMLHttpRequest();
    r.open("POST", "include/request.php", true);

    r.onreadystatechange = function() {

        if (r.readyState != 4 || r.status != 200) {

            // To do: php script unreachable, submit form normally
            return true;

        }

        if (!r.responseText || r.getAllResponseHeaders().toLowerCase().indexOf('php') == -1) {

            // To do: php script unreachable, submit form normally
            el.onsubmit = function() {};
            el.submit();
            return true;

        }

        // To do: strip id's from response HTML
        if (r.responseText.indexOf('---error---') != -1) {

            // Error
            document.getElementById('formresult').innerHTML = 'Error submitting form.';
            return;

        } else {

            // Success
            loaded_html = parseHTML(r.responseText);
            document.getElementById('formresult').innerHTML = loaded_html.innerHTML;

        }

    };

    modalWindow('<div id="formresult">Submitting form...</div>');

    r.send(new FormData(el));

    return false;

}

forEach('form', function(el, i) {

    el.onsubmit = el.onsubmit || submitForm;

});

function updateFileInput(e) {

    el = eventElement(e);

    el.parentNode.querySelector('span').innerHTML = el.value.substring(el.value.lastIndexOf('\\') + 1)

}

forEach('input[type="file"]', function(el, i) {

    el.onchange = updateFileInput;

});

if (document.getElementById('language-selector')) {

    q('#language-selector select').onchange = function(e) {

        document.getElementById('language-selector').submit();

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

    document.body.insertAdjacentHTML('beforeend', '<style> a[href]:hover { color: inherit; } .tool:hover .tip { display: none; } </style>');

}

if (document.getElementById('nav-trigger')) {
	
	document.getElementById('nav-trigger').onchange = function(e) {
	
	    toggleClass(q('body'), 'semi-transparent');
	
	};

}

addEventHandler(window, 'load', function() {

    /* Baseline-align images. Using standard line height at 22px */

    var line_height = 22;

    forEach('#content img', function(el) {

        extra_padding = ((Math.round(el.height / line_height) + 1) * line_height - el.height);

        if (extra_padding >= line_height) {

            extra_padding -= line_height;

        }

        el.style.paddingBottom = extra_padding + 'px';

    });

});

var php_support = 0;
request = new XMLHttpRequest();
request.open('GET', document.location, true);
request.onload = function () {
	
	php_support = request.getAllResponseHeaders().toLowerCase().indexOf('php') == -1 ? 0 : 1;

}
request.send(null);
