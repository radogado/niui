/* natUIve by rado.bg */
/* DOM functions via http://youmightnotneedjquery.com */

// Stop JS if old browser (IE9-). They will get the CSS-only experience. Remove below fallbacks that supported them.

(function () {

	"use strict";
	if (Function.prototype.bind && !this) { // Supports ES5

		return;

	} else { // Doesn't support ES5, going CSS-only
	
	  noSuchFunction();
	  return;

	}

}());

var scripts_location = document.getElementsByTagName('script');
scripts_location = scripts_location[scripts_location.length-1].src;
scripts_location = scripts_location.slice(0, scripts_location.length - scripts_location.split('/').pop().length);

// DOM functions

function addClass(el, className) {

	el.classList.add(className);

}

/* To do: Convert to Prototype functions: el.addClass('class'); instead of addClass(el, 'class'); */
/*
Element.prototype.addClassPrototype = function (className) { // Not working with an array of elements
	
	this.classList.add(className);

};

*/

function removeClass(el, className) {

	// To do: remove a single '.' for foolproof operation; Support multiple classes separated by space, dot, comma
	el.classList.remove(className);
  
}

function hasClass(el, className) {

	return el.classList.contains(className);
	// To do: remove a single '.' for foolproof operation; Support multiple classes separated by space, dot, comma

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

function parseHTML(str) {

    var tmp = document.implementation.createHTMLDocument('Parsed');
    tmp.body.innerHTML = str;
    // To do: destroy the HTMLDocument before returning
    return tmp.body;

}

function forEach(selector, fn) { // Accepts both an array and a selector

    var elements = (typeof selector === 'string') ? qa(selector) : selector;
	if (elements.length > 0) {

	    for (var i = 0; i < elements.length; i++) {
	
	        fn(elements[i], i);
	
	    }
	    
// 	    elements.forEach(fn); // Not working in Edge
    
    }

}

function addEventHandler(el, eventType, handler) {

	el.addEventListener(eventType, handler, false);

}

function removeEventHandler(el, eventType, handler) {

	el.removeEventListener(eventType, handler, false);

}

function stopEvent(e) {

    if (!e) {

        if (typeof window.event === 'undefined') {

            return;

        }

    }

	if ( typeof e === 'undefined' ) {
		
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

    while ((node = nodes.item(i++)) && node !== el) {

        if (node.nodeType === 1) {

            count++;

        }

    }

    return (count);

/*
    var nodes = el.parentNode.childNodes;

	return nodes.indexOf(el);
*/

}

function getCookie(k) { // Thanks Simon Steinberger
	
	var v = document.cookie.match('(^|;) ?'+k+'=([^;]*)(;|$)');return v?v[2]:null;

}

/*
function touchSupport () { // Not working properly
	
	return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));

}
*/

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

function getURLParameters() { // return all URL parameters in an array

    var res = {};
    var re = /[?&]([^?&]+)=([^?&]+)/g;

    location.href.replace(re, function(_, k, v) {

        res[k] = v;

    });

    return res;

}

/*
// URI parameters

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

// URI parameters relay. Omit links starting with "javascript", "mailto", skip parameters not listed in the array

var parameters_list = new Array('parameter1', 'parameter2'); // To do: load this from an external JSON file. Such data has no place here.

function relayParameters() {

    var parameters = getURLParameters();

    forEach('a[href]', function(el, i) {

        for (var name in parameters) {

            if (el.href.indexOf('javascript') === -1 && el.href.indexOf('mailto') === -1 && parameters_list.indexOf(name) != -1) {
	            
	            var hash = el.href.split('#')[1];
	            el.href = updateURLParameter(el.href, name, parameters[name]);
	            if (typeof hash != 'undefined') {
		            
		            el.href = el.href.split('#')[0] + '#' + hash;
		            
	            }
	            
            }

        }

    });

}
*/

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
	
	var img = slider.children[(typeof i === 'undefined') ? 0 : i].querySelector('img');

	if (img && !img.src) {
		
		img.src = img.getAttribute('data-src');
		img.onload = function (e) {
			
			addClass(e.target.parentNode, 'loaded');

		}
		img.onclick = function (e) { // Zoom and scan

// transformY = -50% + (poxY/sizeY)*overflowY

			toggleClass(e.target, 'zoom');
			e.target.style.cssText = '';
			e.target.style.setProperty('--x', '-50%');
			e.target.style.setProperty('--y', '-50%');
			e.target.onmousemove = function (e) {
				
				var width = q('.n-ovrl .n-sldr').offsetWidth;
				var height = q('.n-ovrl .n-sldr').offsetHeight;
				
				var overflowX = e.target.width - width;
				var overflowY = e.target.height - height;

				if (overflowX > 0) {
	
					e.target.style.setProperty('--x', (-1 * overflowX * e.x / width) + 'px');
					e.target.style.left = 0;
					e.target.style.right = 'auto';
	
				}
				
				if (overflowY > 0) {

					e.target.style.setProperty('--y', (-1 * overflowY * e.y / height) + 'px');
					e.target.style.top = 0;
					e.target.style.bottom = 'auto';
				
				}

			};

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

function keyUpClose(e) {
	
    if ((e || window.event).keyCode === 27) { // Esc

        closeFullWindow();

    }

}

function closeFullWindow() {
	
	var full_window = q('.n-ovrl:last-of-type') || q('.n-ovrl');

	if (full_window) {
		
	   	q('html').style.pointerEvents = 'none';

		if (qa('.n-ovrl').length === 1) { // A single overlay
			
		    removeClass(q('html'), 'nooverflow');
	    	q('body').scrollTop = q('html').scrollTop = -1 * q('html').getAttribute('data-offset');
	    	q('html').removeAttribute('data-offset');	
			
		}
		var animation = full_window.querySelector('.content > div').getAttribute('data-anim'); // Custom animation?

		if (animation === 'null' || animation === 'undefined') {
			
			animation = '0% { transform: translate3d(0,0,0) } 100% { transform: translate3d(0,-100vh,0) }';
			
		} else {
			
// 			full_window.style.animationDirection = 'reverse'; // Not working with Closure Compiler, hence:
			full_window.style.cssText = 'animation-direction: reverse;';

		}

		animate(full_window, animation, .2, function (e) {

			if (true/* full_window_content */) { // Remove disposable generated content. To do: In which case it's not dynamic?
	
				 // If lightbox/slider, crashes iOS Safari. not crashing with an empty div
				full_window.parentNode.removeChild(full_window);
				full_window_content = null;
	
					
			} else { // or keep previously existing content
	
				full_window.parentNode.replaceChild(full_window.querySelector('.content > *'), full_window);
			
			}
	
			if (qa('.n-ovrl').length === 0) { // A single overlay

				removeEventHandler(window, 'keydown', arrow_keys_handler);
				removeEventHandler(window, 'keyup', keyUpClose);
				if (!q('.slider')) { // No sliders on the page to control with arrow keys
				
	// 				document.onkeyup = function () {};
					window.removeEventListener('keydown', arrow_keys_handler, false);
					
				}
			
			}
			
		   	q('html').style.pointerEvents = 'initial';
				
		});

	}
    
}

function openFullWindow(el, animation) {

//	closeFullWindow();
	
   	q('html').style.pointerEvents = 'none';
	var offset_top = q('html').getBoundingClientRect().top;
	q('html').setAttribute('data-offset', offset_top); // Remember the page position.

	if (typeof el === 'string') {

		full_window_content = document.createElement('div');
		q('body').appendChild(full_window_content);
		full_window_content.innerHTML = el;
		el = full_window_content;

	}
	el.setAttribute('data-anim', animation);
    addClass(wrap(el).parentNode, 'content');
    wrap(el.parentNode).parentNode.setAttribute('class', 'n-ovrl');
	var full_window = q('.n-ovrl:last-of-type') || q('.n-ovrl');
	full_window.insertAdjacentHTML('beforeend', '<div class=overlay-bg></div>');

    if (!hasClass(el, 'headless')) {
	    
	    full_window.insertAdjacentHTML('afterbegin', '<div class=close> ← ' + document.title + '</div>');
		full_window.querySelector('.overlay-bg').onclick = full_window.querySelector('.n-ovrl .close').onclick = closeFullWindow;
		addEventHandler(window, 'keyup', keyUpClose);
	   
	} else {
		
		addClass(full_window, 'headless');
		
	}

	if (el.querySelector('.full-screen')) {

		if (full_window.webkitRequestFullScreen) { 
			
			full_window.webkitRequestFullScreen(); 
		
		}
		if (full_window.mozRequestFullScreen) { 
			
			full_window.mozRequestFullScreen(); 
		
		}
		if (full_window.requestFullScreen) {
			
			full_window.requestFullScreen(); 
		
		}
	
    	q('html').style.pointerEvents = 'initial';

	} else {

		animate(full_window, typeof animation === 'string' ? animation : '0% { transform: translate3d(0,-100vh,0) } 100% { transform: translate3d(0,0,0) }', .2, function () { 
			
			addClass(q('html'), 'nooverflow');
	    	q('body').scrollTop = q('html').scrollTop = -1 * q('html').getAttribute('data-offset');
	    	q('html').style.pointerEvents = 'initial';
		
		});

	}
	
    return false;
	
}

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

            init(); // Initialise the modal's new JS content like slider, sortable table etc.

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

	var el = e.target;
	if (el.length === 0) {
		
		el = e;

	}
	
    var lightbox = closest(el, '.lightbox');
    var animation = lightbox.getAttribute('data-anim');

	if (hasClass(lightbox, 'inline')) {
		
		lightbox.insertAdjacentHTML('afterend', '<div class="slider lightbox inline"></div>');
		var lightbox_target = lightbox.parentNode.querySelector('.slider.lightbox');
		lightbox.outerHTML = '';
		
		
	} else {
		
		openFullWindow('<div class="slider lightbox' + (hasClass(lightbox, 'full-screen') ? ' full-screen' : '') + '"></div>', animation);
		q('.n-ovrl').style.overflow = 'hidden';
		var lightbox_target = q('.n-ovrl .slider.lightbox');
		
	}
	
    /* Add any <a><img> siblings with description to a .slider and initialise its controls */
    var images = '';
	var thumbnails = [];
    forEach(lightbox.querySelectorAll('a[href]'), function(el) {
		
	    thumbnails.push((el.querySelector('img') ? el.querySelector('img').src : '#'));

		if (hasClass(el, 'video')) {
			// video poster = the anchor's img child, if it exists
			images += '<div><video poster=' + (el.querySelector('img') ? el.querySelector('img').src : '#') + ' controls=controls preload=none> <source type=video/mp4 src=' + el.href + '> </video></div>';
			return;
			
		}
			
		if (hasClass(el, 'iframe')) {

			images += '<div><iframe src=' + el.href + '></iframe></div>';
			return;
			
		}
		
		var slide_link = document.location.protocol + '//' + document.location.hostname + document.location.pathname + '?image=' + el.href.split('/').pop() + '#' + lightbox.getAttribute('id');

	    var link_element = (hasClass(lightbox,'inline') || !lightbox.getAttribute('id')) ? '' : '<a class="button copy" href=' + slide_link + '></a>';
	    
	    images += '<div><img data-src="' + el.href + '" alt="' + el.title + '" data-link="' + slide_link + '">' + (el.title ? ('<p>' + el.title + '</p>') : '') + link_element + '</div>';

        // Attach onload event to each image to display it only when fully loaded and avoid top-to-bottom reveal?

    });

    lightbox_target.innerHTML = images;

    if (typeof makeSlider === 'function') {

        var anchor = el;

        while (typeof anchor.href === 'undefined') {

            anchor = anchor.parentNode;

        }

        transferClass(anchor.parentNode, lightbox_target, 'vertical');
        transferClass(anchor.parentNode, lightbox_target, 'right');

        // Load the images in the current slide and its neighbours
        while ( anchor.tagName.toLowerCase() != 'a' ) {
	        
	        anchor = anchor.parentNode;
	        
        }
		// To do: after closing an URI-invoked lightbox and opening a lightbox again, the index is incorrect
		var lightbox_items = lightbox.querySelectorAll('a[href]');
        var this_index = Array.prototype.indexOf.call(lightbox_items, anchor); // Ignore non-anchor children of the lightbox container

        if (location.href.indexOf('#' + lightbox.getAttribute('id')) > -1 && hasClass(lightbox, 'uri-target')) {
	        
	        removeClass(lightbox, 'uri-target'); // Open URI-specified index only once, because subsequent lightbox instances would have incorrect index
	        if (typeof getURLParameters()['slide'] != 'undefined') {

		        this_index = getURLParameters()['slide'].split('#')[0] - 1;

		    }

			if (typeof getURLParameters()['image'] != 'undefined') {

				var target_image = lightbox_target.querySelector('[data-src*="' + getURLParameters()['image'].split('#')[0] + '"]');
				if (target_image) {

			        this_index = thisIndex(target_image.parentNode);

			    }
		    
		    }

        }

        if (this_index > lightbox_target.children.length - 1 || this_index < 1) {
	        
	        this_index = 0;
	        
        }
        
        populateLightbox(makeSlider(lightbox_target, this_index), this_index);
        transferClass(anchor.parentNode, lightbox_target.parentNode, 'thumbnails');
        transferClass(anchor.parentNode, lightbox_target.parentNode, 'outside');
        
        if (hasClass(anchor.parentNode, 'thumbnails')) {
        
	        var i = 0;
	        var nav = closest(lightbox_target, '.n-sldr').querySelector('.slider-nav');
	        forEach(thumbnails, function (el) {
				
				if (nav.children[i]) {

			        nav.children[i].style.backgroundImage = 'url(' + thumbnails[i] + ')';

			    }
		        i++;
		        
	        });
        
        }

    }

	if (!hasClass(lightbox, 'inline')) { // Don't block global keyboard if the lightbox is inline
	
	    window.addEventListener('keydown', arrow_keys_handler, false);
    
    }
    
    return false;

}

/*** Start ***/

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

    if (typeof e === 'undefined') {

        return;

    }
    var el = e.target;

    while (typeof el.href === 'undefined') {

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

/* Form validation – start */

function submitForm(e) {

    var el = e.target;

    var ready_to_submit = true;

    forEach(el.querySelectorAll('.mandatory'), function(el) {
	    
	    if (closest(el, '[disabled]')) { // Ignore disabled conditional fields
		    
		    return;

	    }

        if (
			( el.querySelector('input, select, textarea') && !el.querySelector('input, select, textarea').value ) 
			|| 
			( el.querySelector('input[type=checkbox]') && !el.querySelector('input[type=checkbox]').checked ) 
			||
			( el.querySelector('input[type=email]') && !RegExp(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/).test(el.querySelector('input[type=email]').value) ) 
			||
			( el.querySelector('input[type=url]') && !RegExp(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/).test(el.querySelector('input[type=url]').value) ) 
			||
			( el.querySelector('input[type=number]') 
				&& 
				!(RegExp(/^\d+$/).test(el.querySelector('input[type=number]').value))
				||
				(el.querySelector('input[type=number][data-digits]') && (el.querySelector('input[type=number]').value.length != el.querySelector('input[type=number]').getAttribute('data-digits')))
			) ||
			( el.querySelector('input[type=radio]') && !el.querySelector('input[type=radio]').checked )
		   ) 
		
		{

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

    el.insertAdjacentHTML('beforeend', '<input name=targetformurl type=hidden value=' + encodeURIComponent( el.method === 'get' ? el.action.replace(/\/?(\?|#|$)/, '/$1') : el.action ) + '>');

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

function updateFileInput(e) {

    var el = e.target;

    el.parentNode.querySelector('span').innerHTML = el.value.substring(el.value.lastIndexOf('\\') + 1);

}

if (q('form.language')) { // To do: make it universal .submitonchange and for more than 1 form

    q('form.language select').onchange = function(e) {

        q('form.language').submit();

    };

}

function toggleConditionalFieldset(e) {
	
	var el = e.target;
	var fieldset = closest(el, '.condition').nextElementSibling;
	var attribute = 'disabled';
	
	if (el.checked) {
	
		fieldset.removeAttribute(attribute);
	
	} else {
		
		fieldset.setAttribute(attribute, 'disabled');
		
	}
	
}

/* Form validation – end */

// addClass(q('body'), touchSupport() ? 'touch' : 'no-touch');

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

/*
function isInViewport(el) { // Thanks http://gomakethings.com/ditching-jquery/

    var distance = el.getBoundingClientRect();
    return (
        distance.top >= 0 &&
        distance.left >= 0 &&
        distance.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        distance.right <= (window.innerWidth || document.documentElement.clientWidth)
    );

}
*/

// Element.matches(selector) polyfill for Android Browser, IE8, Edge (!)

if (!Element.prototype.matches) {
    Element.prototype.matches = 
        Element.prototype.matchesSelector || 
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector /*
|| 
        Element.prototype.oMatchesSelector || 
        Element.prototype.webkitMatchesSelector ||
        function(s) {
            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                i = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1;            
        }
*/
        ;
}

function closest(el, selector) { // Thanks http://gomakethings.com/ditching-jquery/

    for ( ; el && el !== document; el = el.parentNode ) {

		if (el.matches(selector)) {
			
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
	
	php_support = request.getAllResponseHeaders().toLowerCase().indexOf('php') === -1 ? 0 : 1;

};
request.send(null);

/* Sort parent table's rows by matching column number alternatively desc/asc on click */
function sortTable (table, column, f) {
	
	var rows = Array.prototype.slice.call(table.querySelectorAll('tbody tr'), 0);;
	
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

/*
// Polyfill to uncheck all radio buttons of a form with form owner attribute. Single set of radios currently, for drop-down menu.
if (q('input[type=reset][form]') && !q('input[type=reset][form]').form) {
	
	forEach('input[type=reset][form]', function(el) {

		el.onclick = function (e) { // Assuming a single set of radios per form (for drop down menu)
			
			el = e.target;
			q('input[type=radio][form=' + el.getAttribute('form') + ']:checked').checked = false;
			
		};

	});

}
*/

function notifyClose(el) {
	
	el.parentNode.removeChild(el);
	
}

function notifyCloseEvent() {

	if (q('.notify')) {

		q('.notify').onclick = function (e) {
			
			notifyClose(e.target);	
				
		};
	
	}
	
}

function notify(content, option) {
	
	q('body').insertAdjacentHTML('afterbegin', '<div class="notify' + (option && (option.indexOf('fixed') !== -1) ? ' fixed' : '') + '">' + content + '</div>');
	notifyCloseEvent();
	if (option && option.indexOf('timeout') !== -1) {
		
		setTimeout(function() { notifyClose(q('.notify')) }, 2000);

	}
	
}

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
/*
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
*/

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

function animate(el, animation_code, duration, callback) { // Default duration = .2s, callback optional

// To do: add animation-fill-mode: forwards to keep the end state

	if (!el.getAttribute('data-animation')) {

		el.addEventListener(animationEndEvent, function animationEndHandler(e) {
			
			stopEvent(e);
			var el = e.target; 
			q('head').removeChild(q('.' + el.getAttribute('data-animation')));
			el.removeAttribute('data-animation');
	 		el.removeEventListener(animationEndEvent, animationEndHandler);
			if (typeof callback === 'function') {
		
				callback();
		
			}
		
		}, false);

		var animation_name = 'a' + new Date().getTime(); // Unique animation name
		var styles = document.createElement('style');
		styles.innerHTML = '@keyframes ' + animation_name + ' {' + animation_code + '} [data-animation=' + animation_name + '] { animation-name: ' + animation_name + '; animation-duration: ' + ((typeof duration === 'undefined') ? .2 : duration) + 's; }'; // Where animation format is 		0% { opacity: 1 } 100% { opacity: 0 }
		q('head').appendChild(styles);
		addClass(styles, animation_name);

// 		el.dataset.animation = animation_name;
		el.setAttribute('data-animation', animation_name);
	
	}
	
}

// Scroll the page to any position

function scrollToAnimated(to, callback) {
	
	if (to > (document.body.clientHeight - window.innerHeight) ) {

		to = document.body.clientHeight - window.innerHeight;

	}
	
	function scrollToCallback (callback) {
		
		q('body').scrollTop = to; 
		if (typeof callback === 'function') {
			
			callback();
		
		}
		
	}
	
	animate(q('body'), '100% { transform: translate3d(0, ' + -1*(to - (document.documentElement.scrollTop || document.body.scrollTop)) + 'px, 0); }', .5, scrollToCallback.bind(null, callback)); // To do: IE8 error fix

}

/* Fold – start */

function toggleAccordion(e) {

    stopEvent(e);
    var el = closest(e.target, '.fold');

    var content = el.querySelector('.content');

/*
    if (!animationSupport()) { // Browsers without animation support

	    toggleClass(el, 'open');
	    return;
	    
    }
*/

	content.style.setProperty('--width', content.scrollWidth + 'px');
	content.style.setProperty('--max-height', content.scrollHeight + 'px');

	var content_height = content.style.getPropertyValue('--start-height') || 0;
	
// 	toggleClass(el, 'open');
	
	// Animation, not CSS, because of nested accordions
	
	if (hasClass(el, 'horizontal')) {
		
		toggleClass(el, 'open');
		
	} else {
	
		if (hasClass(el, 'open')) {
	
			animate(content, '0% { max-height: ' + content.scrollHeight + 'px; } 100% { max-height: ' + content_height + '; }', .2, function () {
				
				toggleClass(el, 'open'); 
				
			});
			
		} else {
			
			toggleClass(el, 'open');
			animate(content, '0% { max-height: ' + content_height + '; } 100% { max-height: ' + content.scrollHeight + 'px; }');
			
		}
	
	}

    return false;

}

/* Fold – end */

// Clicking a button copies a target element's contents

function copyButton (el, target) {
	
	el.addEventListener('click', function(event) {  

	  var range = document.createRange();  
	  range.selectNode(target);  
	  window.getSelection().addRange(range);  
	
	  try {  

		  document.execCommand('copy');
		  notify('📋 ' + target.textContent, 'fixed timeout');

	  } catch(err) {

	  }  
	
	  window.getSelection().removeAllRanges();  

	});
	
}

/*
function loadScriptFile(file_name) {
	
    var js_el = document.createElement('script');
    js_el.type = 'text/javascript';
    js_el.src = scripts_location + file_name;
    if (!js_el || typeof js_el === 'undefined') {
	    
	    document.head.appendChild(js_el);
	
	}

}
*/

// Real time touch detection to support devices with both touch and mouse. http://www.javascriptkit.com/dhtmltutors/sticky-hover-issue-solutions.shtml

;(function(){

    var isTouch = false; //var to indicate current input type (is touch versus no touch) 
    var isTouchTimer;
    var curRootClass = ''; //var indicating current document root class ("can-touch" or "")
     
    function addtouchclass(e) {

        clearTimeout(isTouchTimer);
        isTouch = true;
        if (curRootClass != 'can-touch') { //add "can-touch' class if it's not already present

            curRootClass = 'can-touch';
            addClass(q('html'), curRootClass);

        }

        isTouchTimer = setTimeout(function(){isTouch = false}, 500); //maintain "istouch" state for 500ms so removetouchclass doesn't get fired immediately following a touch event

    }
     
    function removetouchclass(e){

        if (!isTouch && curRootClass === 'can-touch'){ //remove 'can-touch' class if not triggered by a touch event and class is present

            isTouch = false;
            curRootClass = '';
            removeClass(q('html'), 'can-touch');

        }

    }
     
    document.addEventListener('mouseover', removetouchclass, false); //this event gets called when input type is everything from touch to mouse/ trackpad
    document.addEventListener('touchstart', addtouchclass, false); //this event only gets called when input type is touch

})();

// Close all Fold elements when clicking/tapping outside of them

function closeFoldClickOutside(e) {
	
	var el = e.target;

	if (!closest(el, '.fold') && !closest(el, '.tool')) { // Clicking/tapping outside of a fold/tooltip element...
		
		forEach('.fold.mobile, .tool', function (el) { // ... closes all burger nav menus and tooltips
			
			removeClass(el, 'open');
			
		});
		
	}
	
	if (!closest(el, 'nav.drop')) { // reset all forms, closing the drop down
		
		forEach('nav.drop form', function (el) {
			
			el.reset();
			
		});
		
	}
	
	if (q('.n-sldr.active')) {
		
		removeClass(q('.n-sldr.active'), 'active')
		
	}
	
	if (closest(el, '.slider')) {
		
		addClass(closest(el, '.n-sldr'), 'active');
		
	}
	
}
		
forEach('.fold > .label', function(el, i) {

    el.onclick = toggleAccordion;

    el = el.parentNode;
	var content = el.querySelector('.content');
	
	if (hasClass(el, 'horizontal')) {
		
		addClass(el, 'init');
		content.style.setProperty('--width', content.scrollWidth + 'px');
		content.style.height = 'auto';
		removeClass(el, 'init');
		setTimeout(function () { content.style.transition = 'width .2s ease-in-out'; }, 100);
		
	}

	content.style.setProperty('--max-height', content.scrollHeight + 'px');

    if (el.querySelector('input.trigger')) { // Remove CSS-only triggers

        el.querySelector('input.trigger').outerHTML = '';

    }

    if (!hasClass(el, 'mobile')) { // Keep the accordion content clickable
	    
	    content.onclick = function(e) {

	        stopEvent(e);
	
	    };

    }
    
});

addEventHandler(window, 'click', function (e) { // Close all Fold elements when clicking outside of them
	
	closeFoldClickOutside(e);
	
});

addEventHandler(window, 'touchend', function (e) { // Close all Fold elements when clicking outside of them
	
	closeFoldClickOutside(e);
	
});
	
addEventHandler(window, 'scroll', function() {  // Close fixed n-ovrl if its scrolling becomes a window scroll. Idea by a Google mobile nav.
	
	if (q('.fixed-mobile .fold.mobile.open')) {
		
		removeClass(q('.fixed-mobile .fold.mobile.open'), 'open');
	
	}
	
});

// Scroll effects
forEach('[data-threshold]', function(el) { // Set a variable reflecting how much of the element's height has been scrolled; .threshold on scroll over element height

	addEventHandler(window, 'scroll', function() {

		setTimeout(function () {
			
			var relativeScroll = q('html').scrollTop || q('body').scrollTop;
/*
			q('html').style.setProperty('--scroll-top', relativeScroll);
			q('html').style.setProperty('--scroll-bottom', q('html').scrollHeight - relativeScroll - q('html').offsetHeight);
			q('html').style.setProperty('--page-height', q('html').scrollHeight);
*/
			var threshold = el.scrollHeight; // To do: either element height or data-threshold height in px, % or vh

			if (relativeScroll > threshold) {
				
				relativeScroll = threshold;

			}
			
			if (relativeScroll < 0) {
				
				relativeScroll = 0;

			}
			
			el.style.setProperty('--height', threshold);
			el.style.setProperty('--threshold', parseFloat((relativeScroll / threshold), 10).toPrecision(1)); // Percentage of threshold reached. 0 – 1. Can be used with CSS calc().
			// To do: Add --offset-top, --offset-bottom (distance from top/bottom of element to top/bottom of viewport)

			if (relativeScroll >= threshold) {
				
				addClass(el, 'threshold');
				addClass(q('body'), 'threshold');
				
			} else {
				
				removeClass(el, 'threshold');
				removeClass(q('body'), 'threshold');
				
			}
			
		}, 50);
		
	});

});

/* Initialise JS-powered elements */

function init() {
	
	// Load extra CSS for JS-generated content
	
	var css = q('head [href*="natuive.min.css"]');
	if (css) {

		var extra_css = css.cloneNode()
		extra_css.href = extra_css.href.replace('natuive.min', 'natuive-extra.min');
		q('head').insertBefore(extra_css, css.nextSibling); // Insert it after natuive.min.css, not at the end of <head>, to allow subsequent CSS files to overwrite it

	}

	notifyCloseEvent();
	
	/* Enhance sliders: create arrows/numbers navigation etc */
    if (typeof makeSlider === 'function') {

		forEach('.slider', function(el) {
		
		    makeSlider(el);
		
		});
	
	}
	
/*
	forEach('input.trigger, input[type=reset]', function(el, i) {
		
		el.onclick = function(e) {
			
			e.stopPropagation();
	
		};
	
	});
*/
	
	forEach('td[data-sort]', function (el) {
		// asc or desc
		if (el.dataset.sort !== 'asc' && el.dataset.sort !== 'desc') {
			
			el.dataset.sort = 'asc';
			
		}
		
		el.onclick = function (e) {
			
			stopEvent(e);
			var el = e.target;
			var cell = el.type === 'td' ? el : closest(el, 'td');
			var f; // Ascending
			if (cell.dataset.sort === 'desc') {
				
				f = -1;
				cell.dataset.sort = 'asc';
				
			} else {
				
				f = 1;
				cell.dataset.sort = 'desc';
				
			}
	
			sortTable(closest(el, 'table'), thisIndex(cell), f);
			
		};
	
	});
	
	forEach('form', function(el, i) {
	
	    el.onsubmit = el.onsubmit || submitForm;
	
	});
	
	forEach('input[type=file]', function(el, i) {
	
	    el.onchange = updateFileInput;
	
	});
	
// 	Conditional form fieldsets

	forEach('.checkbox.condition input', function(el, i) {
		
		el.onchange = toggleConditionalFieldset;
	
	});
	
	// Auto textarea height.
	
	forEach('textarea[data-auto]', function(el) {
	
	    el.onkeyup = function(e) {
	
	        el = e.target;
	
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
	
	// Animate anchor link jumps
	forEach('a[href^="#"]', function(el, i) {
	
		if (el.onclick) { // Don't add to previous onclick event handler
			
			return;
	
		}
	    el.onclick = animateAnchors;
	
	});
	
	// Modal window: open a link's target inside it
	
	forEach('a.modal', function(el, i) {
	
		if (el.href != (location.href.split('#')[0] + '#')) {
			
		    el.onclick = modalWindow;
	
	    }
	    
	    if (el.getAttribute('rel') === null) {
		    
		    el.setAttribute('rel', 'prefetch');
	
	    }
	
	});
	
	// Lightbox with images
	
	forEach('.lightbox', function(el) {
	
		// Abort on IE, because of IE bug on dynamic img.src change
		if (navigator.userAgent.indexOf('MSIE') != -1 || navigator.userAgent.indexOf('Trident') != -1) {
			
			return;
	
		}

		if (hasClass(el.parentNode, 'n-sldr')) {
			
			return;
	
		}
		
		if (hasClass(el, 'inline')) {
			
			openLightbox(el.querySelector('a'));
			
		} else {
			
			forEach(el.querySelectorAll('a'), function(el) {
		
			    el.onclick = openLightbox;
			
			});
		
		}
	
	});
	
/*
	// Relay URI parameters to links
	
	relayParameters();
*/
	
	/* Tooltip */
	
	forEach('.tool', function(el, i) {
		
		el.onclick = function (e) {

			if (hasClass(q('html'), 'can-touch')) {
	
				toggleClass(e.target, 'open');
					
			}

		};		
	
	    var t = el.querySelector('.tip');
	    if (!t) return;
	
	    el.style.position = 'static'; // dangerous with absolutely-positioned containers, which should be avoided anyway
	    el.parentNode.style.position = 'relative'; // dangerous with absolutely-positioned containers, which should be avoided anyway
/*
	    t.style.top = (t.parentNode.offsetTop + t.parentNode.offsetHeight) + 'px';
	    t.style.width = '100%';
*/
	
	});
	
	forEach('table', function(el) {
	
		if (!hasClass(el.parentNode, 'n-tbl')) {
			
			addClass(wrap(el).parentNode, 'n-tbl');
		
		}
	
	});
	
}

ready( function () {

	init();
	
	// Automatically open a lightbox specified in the URI

	setTimeout( function () {
		
		if (q('.lightbox:target')) {
			
			addClass(q('.lightbox:target'), 'uri-target');
			openLightbox(q('.lightbox:target > a[href]'));
			
		}
		
	}, 1);

});
