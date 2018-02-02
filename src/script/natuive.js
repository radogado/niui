/* natUIve by rado.bg */
/* DOM functions via http://youmightnotneedjquery.com */

var aria_expanded = 'aria-expanded';

// Stop JS if old browser (IE9-). They will get the CSS-only experience. Remove below fallbacks that supported them.

(function () {

	"use strict";
	if (Function.prototype.bind && !this) { // Supports ES5

		return;

	} else { // ES5 unsupported, going CSS-only
	
	  noSuchFunction();
	  return;

	}

}());

var scripts_location = document.getElementsByTagName('script'); // To do: maybe move this global variable to window.scripts_location
scripts_location = scripts_location[scripts_location.length-1].src;
scripts_location = scripts_location.slice(0, scripts_location.length - scripts_location.split('/').pop().length);

// DOM functions

function q(selector) {

	return document.querySelector(selector);

};

Element.prototype.q = function(selector) {

	return this.querySelector(selector);

};

function qa(selector) {

	return document.querySelectorAll(selector);

};

Element.prototype.qa = function(selector) {

	return this.querySelectorAll(selector);

};

Element.prototype.addClass = function(className) {

	this.classList.add(className);

};

Element.prototype.removeClass = function(className) {

	// To do: remove a single '.' for foolproof operation; Support multiple classes separated by space, dot, comma
	this.classList.remove(className);

};

Element.prototype.hasClass = function(className) {

	return this.classList.contains(className);

};

Element.prototype.toggleClass = function(className) {

    if (this.hasClass(className)) {

        this.removeClass(className);

    } else {

        this.addClass(className);

    }

};

Element.prototype.toggleAttribute = function(attribute) {

    if (this.getAttribute(attribute)) {

        this.removeAttribute(attribute);

    } else {

        this.setAttribute(attribute, true);

    }

};

function transferClass(el_origin, el_target, className) {

    if (el_origin.hasClass(className)) {

        el_target.addClass(className);

    }

}

function parseHTML(str) {

    var tmp = document.implementation.createHTMLDocument('Parsed');
    tmp.body.innerHTML = str;
    // To do: destroy the HTMLDocument before returning
    return tmp.body;

}

function forEach(selector, fn) { // Accepts both an array and a selector
	
	if (!selector || !fn) {
		
		return;

	}
    var elements = (typeof selector === 'string') ? qa(selector) : selector;
// 	    elements.forEach(fn); // Not working in Edge
	if (elements.length > 0) {

	    for (var i = 0; i < elements.length; i++) {
	
	        fn(elements[i], i);
	
	    }
	    
    
    }

}

function wrapTables() {
	
	forEach('table', function(el) {
	
		if (!el.parentNode.hasClass('n-tbl')) {
			
			wrap(el).parentNode.addClass('n-tbl');
			el.parentNode.setAttribute('tabindex', 0);
		
		}
	
	});
	
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

}

function getCookie(k) { // Thanks Simon Steinberger
	
	var v = document.cookie.match('(^|;) ?'+k+'=([^;]*)(;|$)');return v?v[2]:null;

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
	
	var img = slider.children[(typeof i === 'undefined') ? 0 : i].q('img');

	if (img && !img.src) {
		
		img.src = img.getAttribute('data-src');
		img.onload = function (e) {
			
			e.target.parentNode.addClass('loaded');

		}
		img.onclick = function (e) { // Zoom and scan

// transformY = -50% + (poxY/sizeY)*overflowY

			if (!q('.n-ovrl .n-sldr')) {
				
				return;
				
			}
			
			var el = e.target;
			el.toggleClass('zoom');
			el.style.cssText = '';
			el.style.setProperty('--x', '-50%');
			el.style.setProperty('--y', '-50%');
			el.onmousemove = function (e) {
				
				var width = q('.n-ovrl .n-sldr').offsetWidth;
				var height = q('.n-ovrl .n-sldr').offsetHeight;
				
				var el = e.target;
				var overflowX = el.width - width;
				var overflowY = el.height - height;

				if (overflowX > 0) {
	
					el.style.setProperty('--x', (-1 * overflowX * e.x / width) + 'px');
					el.style.left = 0;
					el.style.right = 'auto';
	
				}
				
				if (overflowY > 0) {

					el.style.setProperty('--y', (-1 * overflowY * e.y / height) + 'px');
					el.style.top = 0;
					el.style.bottom = 'auto';
				
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

function getSliderNav(slider_wrap) {

	// Select either a child slider-nav or the one specified by the slider id, if it exists
	var slider = slider_wrap.q('.slider');
	var slider_nav;

	if (slider.id && (slider_nav = q('.slider-nav[data-for=' + slider.id + ']'))) { // Detached nav

		return slider_nav;

	} else {

		return slider_wrap.qa('.slider-nav')[slider_wrap.qa('.slider-nav').length-1]; // With a simple query, it would get the nav of an eventual nested slider, instead of the current one. Current nav is either a direct child or a .pad direct child, taken as the last one of all.

	}

}

function closeFullWindow() {
	
	var full_window = q('.n-ovrl:last-of-type') || q('.n-ovrl');

	if (full_window) {
		
	   	q('html').style.pointerEvents = 'none';

		if (qa('.n-ovrl').length === 1) { // A single overlay
			
		    q('html').removeClass('nooverflow');
	    	q('body').scrollTop = q('html').scrollTop = -1 * window.previousScrollOffset;
			
		}
		var animation = full_window.q('.content > div').getAttribute('data-anim'); // Custom animation?

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
	
				full_window.parentNode.replaceChild(full_window.q('.content > *'), full_window);
			
			}
	
			if (qa('.n-ovrl').length === 0) { // A single overlay

				window.removeEventListener('keydown', arrow_keys_handler);
				window.removeEventListener('keyup', keyUpClose);
				if (!q('.slider')) { // No sliders on the page to control with arrow keys
				
	// 				document.onkeyup = function () {};
					window.removeEventListener('keydown', arrow_keys_handler, false);
					
				}
			
			}
			
		   	q('html').style.pointerEvents = 'initial';
		   	
		   	if (window.previouslyFocused) {

			   	window.previouslyFocused.focus();
			   
			}
				
		});

	}
    
}

function openFullWindow(el, animation) {
	
	window.previouslyFocused = document.activeElement;
	
   	q('html').style.pointerEvents = 'none';
	var offset_top = q('html').getBoundingClientRect().top;
	window.previousScrollOffset = offset_top; // Remember the page position.

	if (typeof el === 'string') {

		full_window_content = document.createElement('div');
		q('body').appendChild(full_window_content);
		full_window_content.innerHTML = el;
		el = full_window_content;

	}
	el.setAttribute('data-anim', animation);
    wrap(el).parentNode.addClass('content');
    wrap(el.parentNode).parentNode.setAttribute('class', 'n-ovrl');
	var full_window = q('.n-ovrl:last-of-type') || q('.n-ovrl');
    full_window.q('.content').setAttribute('tabindex', 0);
	full_window.insertAdjacentHTML('beforeend', '<div class=overlay-bg></div>');

    if (!el.hasClass('headless')) {
	    
	    full_window.insertAdjacentHTML('afterbegin', '<div class=close> ← ' + document.title + '</div>');
		full_window.q('.overlay-bg').onclick = full_window.q('.n-ovrl .close').onclick = closeFullWindow;
		window.addEventListener('keyup', keyUpClose);
	   
	} else {
		
		full_window.addClass('headless');
		
	}

	if (el.q('.full-screen')) {

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
			
			q('html').addClass('nooverflow');
	    	q('body').scrollTop = q('html').scrollTop = -1 * window.previousScrollOffset;
	    	q('html').style.pointerEvents = 'initial';
		
		});

	}
	
    full_window.q('.content').focus();
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
                if (!parsed.q(container)) {
                    closeFullWindow();
                    return false;
                }
                parsed = parsed.q(container).innerHTML;

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

	if (lightbox.hasClass('inline')) {
		
		lightbox.insertAdjacentHTML('afterend', '<div class="slider lightbox inline" id="' + (lightbox.id ? lightbox.id : '') + '"></div>');
		var lightbox_target = lightbox.parentNode.q('.slider.lightbox');
		lightbox.outerHTML = '';
		
		
	} else {
		
		openFullWindow('<div class="slider lightbox' + (lightbox.hasClass('full-screen') ? ' full-screen' : '') + '"></div>', animation);
		q('.n-ovrl').style.overflow = 'hidden';
		var lightbox_target = q('.n-ovrl .slider.lightbox');
		
	}
	
    /* Add any <a><img> siblings with description to a .slider and initialise its controls */
    var images = '';
	var thumbnails = [];
    forEach(lightbox.qa('a[href]'), function(el) {
		el.setAttribute('tabindex', 0);
	    thumbnails.push((el.q('img') ? el.q('img').src : '#'));

		if (el.hasClass('video')) {
			// video poster = the anchor's img child, if it exists
			images += '<div><video poster=' + (el.q('img') ? el.q('img').src : '#') + ' controls=controls preload=none> <source type=video/mp4 src=' + el.href + '> </video></div>';
			return;
			
		}
			
		if (el.hasClass('iframe')) {

			images += '<div><iframe src=' + el.href + '></iframe></div>';
			return;
			
		}
		
		var slide_link = document.location.href.split('#')[0] + (document.location.href.indexOf('?') >= 0 ? '&' : '?') + 'image=' + el.href.split('/').pop() + '#' + lightbox.getAttribute('id');

	    var link_element = (lightbox.hasClass('inline') || !lightbox.getAttribute('id')) ? '' : '<a class="button copy" href=' + slide_link + '></a>';
	    
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
		var lightbox_items = lightbox.qa('a[href]');
        var this_index = Array.prototype.indexOf.call(lightbox_items, anchor); // Ignore non-anchor children of the lightbox container

        if (location.href.indexOf('#' + lightbox.getAttribute('id')) > -1 && lightbox.hasClass('uri-target')) {
	        
	        lightbox.removeClass('uri-target'); // Open URI-specified index only once, because subsequent lightbox instances would have incorrect index
	        if (typeof getURLParameters()['slide'] != 'undefined') {

		        this_index = getURLParameters()['slide'].split('#')[0] - 1;

		    }

			if (typeof getURLParameters()['image'] != 'undefined') {

				var target_image = lightbox_target.q('[data-src*="' + getURLParameters()['image'].split('#')[0] + '"]');
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
        
        if (anchor.parentNode.hasClass('thumbnails')) {
        
	        var i = 0;
// 	        var nav = closest(lightbox_target, '.n-sldr').q('.slider-nav');
	        var nav = getSliderNav(closest(lightbox_target, '.n-sldr'));

	        if (nav) { // Multiple slides?

		        forEach(thumbnails, function (el) {
					
					if (nav.children[i]) {
	
				        nav.children[i].style.backgroundImage = 'url(' + thumbnails[i] + ')';
	
				    }
			        i++;
			        
		        });

	        }
        
        }

    }

	if (!lightbox.hasClass('inline')) { // Don't block global keyboard if the lightbox is inline
	
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
		    
			q('header > nav > div').removeClass('open');
			
		}

	}

    scrollToAnimated((hash === null) ? 0 : getCumulativeOffset(hash).y, .5, function(e) { // To do: fix jumping to new hash – is the fallback executed properly in animate()?

        window.location = el.href.split('#')[0] + '#' + el.href.split('#').pop();

    });

    return false;

}

/* Form validation – start */

function submitForm(e) {

    var el = e.target;

    var ready_to_submit = true;

    forEach(el.qa('.mandatory'), function(el) {
	    
	    if (closest(el, '[disabled]')) { // Ignore disabled conditional fields
		    
		    return;

	    }

        if (
			( el.q('input, select, textarea') && !el.q('input, select, textarea').value ) 
			|| 
			( el.q('input[type=checkbox]') && !el.q('input[type=checkbox]').checked ) 
			||
			( el.q('input[type=email]') && !RegExp(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/).test(el.q('input[type=email]').value) ) 
			||
			( el.q('input[type=url]') && !RegExp(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/).test(el.q('input[type=url]').value) ) 
			||
			( el.q('input[type=number]') 
				&& 
				!(RegExp(/^\d+$/).test(el.q('input[type=number]').value))
				||
				(el.q('input[type=number][data-digits]') && (el.q('input[type=number]').value.length != el.q('input[type=number]').getAttribute('data-digits')))
			) ||
			( el.q('input[type=radio]') && !el.q('input[type=radio]').checked )
		   ) 
		
		{

            ready_to_submit = false;
            el.q('input').focus();
            el.addClass('alert');
            return;

        } else {

            el.removeClass('alert');

        }

    });

    if (!ready_to_submit) {

        return false;

    }

    if (!el.hasClass('dynamic') || !(new XMLHttpRequest().upload) || !php_support) { // Browser unable to submit dynamically.

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

    el.parentNode.q('span').innerHTML = el.value.substring(el.value.lastIndexOf('\\') + 1);

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
/*
        Element.prototype.matchesSelector || 
        Element.prototype.mozMatchesSelector ||
*/
        Element.prototype.msMatchesSelector /*
|| 
        Element.prototype.oMatchesSelector || 
        Element.prototype.webkitMatchesSelector ||
        function(s) {
            var matches = (this.document || this.ownerDocument).qa(s),
                i = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1;            
        }
*/
        ;
}

function closest(el, target) { // Thanks http://gomakethings.com/ditching-jquery/ – Accepts either a selector string or an actual element

    for ( ; el && el !== document; el = el.parentNode ) {

		if (typeof target === 'string' ? el.matches(target) : el === target) {
			
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
	
	var rows = Array.prototype.slice.call(table.qa('tbody tr'), 0);;
	
	rows.sort(function(a, b) {
	
		var A = a.qa('td')[column].textContent.toUpperCase();
		var B = b.qa('td')[column].textContent.toUpperCase();
		
		if(A < B) {
			
			return 1*f;
			
		}

		if(A > B) {
			
			return -1*f;

		}

		return 0;
	
	});

    for (var i = 0; i < rows.length; i++) {

        table.q('tbody').appendChild(rows[i]);

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
		styles.addClass(animation_name);

// 		el.dataset.animation = animation_name;
		el.setAttribute('data-animation', animation_name);
	
	}
	
}

// Scroll the page to any position

function scrollToAnimated(to, duration, callback) {
	
	if (to > (document.body.clientHeight - window.innerHeight) ) {

		to = document.body.clientHeight - window.innerHeight;

	}
	
	function scrollToCallback (callback) {

		q('html').scrollTop = q('body').scrollTop = to;
		if (typeof callback === 'function') {
			
			callback();
		
		}
		
	}
	
	animate(q('html'), '100% { transform: translate3d(0, ' + -1*(to - (document.documentElement.scrollTop || document.body.scrollTop)) + 'px, 0); }', duration, scrollToCallback.bind(null, callback)); // To do: IE8 error fix

}

/* Fold – start */

function toggleAccordion(e) {

    stopEvent(e);
    var el = closest(e.target, '.fold');
    var content = el.q('.content');

	content.style.setProperty('--width', content.scrollWidth + 'px');
	content.style.setProperty('--max-height', content.scrollHeight + 'px');

	var content_height = content.style.getPropertyValue('--start-height') || 0;
	
	// Animation, not CSS, because of nested accordions
	
	if (el.hasClass('horizontal')) {
		
		el.toggleAttribute(aria_expanded);
		
	} else {
	
		if (el.hasAttribute(aria_expanded)) {
	
			animate(content, '0% { max-height: ' + content.scrollHeight + 'px; } 100% { max-height: ' + content_height + '; }', .2, function () {
				
				el.toggleAttribute(aria_expanded);
				
			});
			
		} else {
			
			el.toggleAttribute(aria_expanded);
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
// To do: use an attribtue instead of class
;(function(){

    var isTouch = false; //var to indicate current input type (is touch versus no touch) 
    var isTouchTimer;
    var curRootClass = ''; //var indicating current document root class ("can-touch" or "")
     
    function addtouchclass(e) {

        clearTimeout(isTouchTimer);
        isTouch = true;
        if (curRootClass != 'can-touch') { //add "can-touch' class if it's not already present

            curRootClass = 'can-touch';
            q('html').addClass(curRootClass);

        }

        isTouchTimer = setTimeout(function(){isTouch = false}, 500); //maintain "istouch" state for 500ms so removetouchclass doesn't get fired immediately following a touch event

    }
     
    function removetouchclass(e){

        if (!isTouch && curRootClass === 'can-touch'){ //remove 'can-touch' class if not triggered by a touch event and class is present

            isTouch = false;
            curRootClass = '';
            q('html').removeClass('can-touch');

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
			
			el.removeAttribute(aria_expanded);
			
		});
		
	}
	
	// Focus on clicked slider
	
	if (q('.n-sldr.active')) {
		
		q('.n-sldr.active').removeClass('active')
		
	}
	
	if (closest(el, '.slider')) {
		
		closest(el, '.n-sldr').addClass('active');
		
	}
	
}
		
forEach('.fold > .label', function(el, i) {

    el.onclick = toggleAccordion;
	el.setAttribute('tabindex', 0);
	el.onkeyup = function (e) {

		if (e.key === 'Enter') {
			
			toggleAccordion(e);

		}
		
	};

    el = el.parentNode;
	var content = el.q('.content');
	
	if (el.hasClass('horizontal')) {
		
		el.addClass('init');
		content.style.setProperty('--width', content.scrollWidth + 'px');
		content.style.height = 'auto';
		el.removeClass('init');
		setTimeout(function () { content.style.transition = 'width .2s ease-in-out'; }, 100);
		
	}

	content.style.setProperty('--max-height', content.scrollHeight + 'px');

    if (el.q('input.trigger')) { // Remove CSS-only triggers

        el.q('input.trigger').outerHTML = '';

    }

    if (!el.hasClass('mobile')) { // Keep the accordion content clickable
	    
	    content.onclick = function(e) {

	        stopEvent(e);
	
	    };

    }
    
});

window.addEventListener('click', function (e) { // Close all Fold elements when clicking outside of them
	
	closeFoldClickOutside(e);
	
});

window.addEventListener('touchend', function (e) { // Close all Fold elements when clicking outside of them
	
	closeFoldClickOutside(e);
	
});
	
window.addEventListener('scroll', function() {  // Close fixed n-ovrl if its scrolling becomes a window scroll. Idea by a Google mobile nav.
	
	if (q('.fixed-mobile .fold.mobile[aria-expanded]')) {
		
		q('.fixed-mobile .fold.mobile[aria-expanded]').removeAttribute(aria_expanded);
	
	}
	
});

// Scroll effects
forEach('body [data-threshold]', function(el) { // Set a variable reflecting how much of the element's height has been scrolled; .threshold on scroll over element height

	window.addEventListener('scroll', function() {

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
				
				el.addClass('threshold');
				q('body').setAttribute('data-threshold', true);
				
			} else {
				
				el.removeClass('threshold');
				q('body').removeClass('threshold');
				q('body').removeAttribute('data-threshold');
				
			}
			
		}, 50);
		
	});

});

/* Drop nav */

function closeDropNavClickedOutside(e) { // Close the nav when clicking outside

	if (!closest(e.target, 'nav li')) {

		forEach ('nav ul', function (el) {
			
			el.removeAttribute('aria-expanded');
			
		});
		
		if (q('nav :focus')) {

			q('nav :focus').blur();
		
		}
		
	}
	
}

function dropNavBlur(e) {

	var this_nav = closest(e.target, 'nav');
	
	if (!closest(e.relatedTarget, this_nav)) { // if e.relatedTarget is not a child of this_nav, then the next focused item is elsewhere
		
		forEach ( this_nav.qa('ul'), function (el) {

			el.removeAttribute('aria-expanded');
			
		});
		return;
		
	}
	// Close neighboring parent nav's sub navs.
	var el = e.target;
	var target_parent = closest(el, '[aria-haspopup]');
	if (target_parent) { // Skip if it's a top-level-only item
		
		forEach(target_parent.qa('ul[aria-expanded]'), function (el) { // Disable active grandchildren
	
			el.removeAttribute('aria-expanded');
	
		});
	
	}

	el = e.target.parentNode;
	if (!el.nextElementSibling && // last item
		el.parentNode.parentNode.nodeName === 'LI' && // of third-level nav
		!el.parentNode.parentNode.nextElementSibling) {
			
			el.parentNode.parentNode.parentNode.removeAttribute('aria-expanded');
	
	}
	
}
		
function dropNavFocus(e) {

	// Close focused third level child when focus moves to another top-level item
	
	var el = closest(e.target, 'nav > ul > li');
	
	forEach(el.parentNode.childNodes, function (a) {

		if (a.nodeName === 'LI' && a !== el) {
		
			forEach(a.qa('[aria-expanded]'), function (el) {
				
				el.removeAttribute('aria-expanded');
				
			});
		
		}
		
	});
	
	el = e.target;

	el.parentNode.parentNode.setAttribute('aria-expanded', true);
	if (el.parentNode.q('ul')) {

		el.parentNode.q('ul').setAttribute('aria-expanded', 'true');

	}
	
	var current_item = e.target.parentNode;

	forEach(current_item.parentNode.parentNode.childNodes, function (el) {

		if (el !== current_item && el.nodeName === 'LI' && el.q('ul')) {

			el.q('ul').removeAttribute('aria-expanded');
		
		}
		
	});
	
}

function initNav(el) {
	
	// Delete all trigger inputs, add tabindex=0 to each li
	
	forEach(el.qa('input'), function (el) {
		
		el.outerHTML = '';
		
	});
	
	el.setAttribute('role', 'menubar');

	forEach(el.qa('li'), function (el) {
		
		el.q('a').setAttribute('tabindex', 0);

	});

	if (!closest(el, 'nav.drop')) { // The rest is for drop nav only
		
		return;

	}

	if (!window.closeDropNavClickedOutsideEnabled) {
		
		window.addEventListener('touchend', closeDropNavClickedOutside);
		window.closeDropNavClickedOutsideEnabled = true;
	
	}
	
	el.addEventListener('keyup', function (e) {
		
		// Check for sibling or children to expand on control keys Left/Right/etc
	
		if (e.key === 'Escape') {
			
			forEach (closest(e.target, 'nav').qa('ul'), function (el) {
				
				el.removeAttribute('aria-expanded');
				
			});
			
			document.activeElement.blur();
			
		}
		
	});
	
	forEach(el.qa('li'), function (el) {
		
		if (el.q('ul')) {
	
			el.setAttribute('aria-haspopup', true);
		
		}
	
		el.addEventListener('touchend', function (e) {

			var el = e.target;

			if (window.dragging || el.getAttribute('href')) {
				
				return;
				
			}
			
			e.preventDefault();
			e.stopPropagation();
			
			if (el.nodeName === 'LI') {
				
				el = el.querySelector('a');
				
			}
			
			if (el === document.activeElement) {

				el.blur();

			} else {
			
				el.focus();
			
			}
				
		});

		var anchor = el.q('a');

		anchor.addEventListener('focus', dropNavFocus);
	
		anchor.addEventListener('blur', dropNavBlur);
		
	});

	window.dragging = false;

	window.addEventListener('touchstart', function (e) {
		
		window.dragging = false;
		
	});

	window.addEventListener('touchmove', function (e) {
		
		window.dragging = true;
		
	});

}

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
	
	if (typeof q('body').dataset !== 'undefined') { // el.dataset.sort not supported by IE10
	
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
	
	}
	
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

		if (el.parentNode.hasClass('n-sldr')) {
			
			return;
	
		}
		
		if (el.hasClass('inline')) {
			
			openLightbox(el.q('a'));
			
		} else {
			
			forEach(el.qa('a'), function(el) {

				el.setAttribute('tabindex', 0);
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

			closest(e.target, '.tool').toggleAttribute(aria_expanded);

		};		
	
	    var t = el.q('.tip');
	    if (!t) return;
	
	    el.style.position = 'static'; // dangerous with absolutely-positioned containers, which should be avoided anyway
	    el.parentNode.style.position = 'relative'; // dangerous with absolutely-positioned containers, which should be avoided anyway
/*
	    t.style.top = (t.parentNode.offsetTop + t.parentNode.offsetHeight) + 'px';
	    t.style.width = '100%';
*/

		var label = el.q('.label');
		if (label) {
			
			label.setAttribute('tabindex', 0);
			label.onkeyup = function (e) {
				
				if (e.key === 'Enter') {
					
					closest(e.target, '.tool').toggleAttribute(aria_expanded);

				}
				
			}

			label.onblur = function (e) {
				
				closest(e.target, '.tool').removeAttribute(aria_expanded);

			}

		}
	
	});
	
	wrapTables();
	
	forEach('nav > ul:not([role])', function (el) {
		
		initNav(el);
		
	});

}

ready( function () {

	init();
	
	// Automatically open a lightbox specified in the URI

	setTimeout( function () {
		
		if (q('.lightbox:target')) {
			
			q('.lightbox:target').addClass('uri-target');
			openLightbox(q('.lightbox:target > a[href]'));
			
		}
		
		if (q('.modal:target')) {
			
			q('.modal:target').click();
			
		}
		
	}, 1);

});
