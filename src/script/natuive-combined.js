(function(){/* natUIve by rado.bg */
/* DOM functions via http://youmightnotneedjquery.com */

var aria_expanded = 'aria-expanded';

// Stop JS if old browser (IE9-). They will get the CSS-only experience. Remove below fallbacks that supported them.

(function () { // To do: move to main encapsulator function and don't make an error, just return to stop JS functionality.

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

// DOM functions – start

function q(selector) {

	return document.querySelector(selector);

};

function qa(selector) {

	return document.querySelectorAll(selector);

};

function addClass(el, className) {

	el.classList.add(className);

}

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

function toggleAttribute(el, attribute) {

    if (el.getAttribute(attribute)) {

        el.removeAttribute(attribute);

    } else {

        el.setAttribute(attribute, true);

    }

}

function forEach(selector, fn) { // Because IE11 doesn't support el.forEach(). Accepts both an array and a selector
	
    var elements = (typeof selector === 'string') ? qa(selector) : selector;

	if (elements.length > 0) {

	    for (var i = 0; i < elements.length; i++) {
	
	        fn(elements[i], i);
	
	    }
    
    }

}

// DOM functions – end

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

/*
Object.prototype.each = String.prototype.each = function (fn) { // To do: as this could conflict with other libraries, make a special natUIve object and extend only that: q(selector), q('p') etc., a la jQuery
	
	var elements = (typeof this[0] === 'string') ? qa(this) : this;
	if (elements.length > 0) {

	    for (var i = 0; i < elements.length; i++) {
	
	        fn(elements[i], i);
	
	    }
    
    }
	
}
*/

function wrapTables() {
	
	forEach('table', function(el) {
	
		if (!hasClass(el.parentNode, 'n-tbl')) {
			
			addClass(wrap(el).parentNode, 'n-tbl');
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
	
	var img = slider.children[(typeof i === 'undefined') ? 0 : i].querySelector('img');

	if (img && !img.src) {
		
		img.src = img.getAttribute('data-src');
		img.onload = function (e) {
			
			addClass(e.target.parentNode, 'loaded');

		}
		img.onclick = function (e) { // Zoom and scan

// transformY = -50% + (poxY/sizeY)*overflowY

			if (!q('.n-ovrl .n-sldr')) {
				
				return;
				
			}
			
			var el = e.target;
			toggleClass(el, 'zoom');
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
	var slider = slider_wrap.querySelector('.slider');
	var slider_nav;

	if (slider.id && (slider_nav = q('.slider-nav[data-for=' + slider.id + ']'))) { // Detached nav

		return slider_nav;

	} else {

		return slider_wrap.querySelectorAll('.slider-nav')[slider_wrap.querySelectorAll('.slider-nav').length-1]; // With a simple query, it would get the nav of an eventual nested slider, instead of the current one. Current nav is either a direct child or a .pad direct child, taken as the last one of all.

	}

}

function closeFullWindow() {
	
	var full_window = q('.n-ovrl:last-of-type') || q('.n-ovrl');

	if (full_window) {
		
	   	q('html').style.pointerEvents = 'none';

		if (qa('.n-ovrl').length === 1) { // A single overlay
			
		    removeClass(q('html'), 'nooverflow');
	    	q('body').scrollTop = q('html').scrollTop = -1 * previousScrollOffset;
			
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

				window.removeEventListener('keydown', arrow_keys_handler);
				window.removeEventListener('keyup', keyUpClose);
				if (!q('.slider')) { // No sliders on the page to control with arrow keys
				
	// 				document.onkeyup = function () {};
					window.removeEventListener('keydown', arrow_keys_handler, false);
					
				}
			
			}
			
		   	q('html').style.pointerEvents = 'initial';
		   	
		   	if (previouslyFocused) {

			   	previouslyFocused.focus();
			   
			}
				
		});

	}
    
}

var previousScrollOffset = 0;
var previouslyFocused = false;

function openFullWindow(el, animation) {
	
	previouslyFocused = document.activeElement;
	
   	q('html').style.pointerEvents = 'none';
	var offset_top = q('html').getBoundingClientRect().top;
	previousScrollOffset = offset_top; // Remember the page position.

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
    full_window.querySelector('.content').setAttribute('tabindex', 0);
	full_window.insertAdjacentHTML('beforeend', '<div class=overlay-bg></div>');

    if (!hasClass(el, 'headless')) {
	    
	    full_window.insertAdjacentHTML('afterbegin', '<div class=close> ← ' + document.title + '</div>');
		full_window.querySelector('.overlay-bg').onclick = full_window.querySelector('.n-ovrl .close').onclick = closeFullWindow;
		window.addEventListener('keyup', keyUpClose);
	   
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
	    	q('body').scrollTop = q('html').scrollTop = -1 * previousScrollOffset;
	    	q('html').style.pointerEvents = 'initial';
		
		});

	}
	
    full_window.querySelector('.content').focus();
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

	if (lightbox.matches('.inline:not(.slider)')) { // Because if it's a slider, it's an existing lightbox and the new one should be separate and full screen
		
		lightbox.insertAdjacentHTML('afterend', '<div class="slider lightbox inline" id="' + (lightbox.id ? lightbox.id : '') + '"></div>');
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
    forEach(lightbox.children, function(el) { // To do: facilitate a[href] extraction also from within div slides, if lightbox is existing and needs to be recreated for full screen. Get them in an array item[i].link, item[i].img
	    
	    if (!el.href && !hasClass(lightbox, 'slider')) { // Ignore non-links in regular lightboxes
		    
		    return;

	    }
	    
		el.setAttribute('tabindex', 0);

	    thumbnails.push((el.querySelector('img') ? (el.querySelector('img').getAttribute('data-src') || el.querySelector('img').src) : '#'));

		if (hasClass(el, 'video') || el.querySelector('video')) {
			// video poster = the anchor's img child, if it exists

			if (hasClass(lightbox, 'slider')) { // Secondary lightbox
				
				images += '<div>' + el.querySelector('video').outerHTML + '</div>';
				
			} else {
				
				images += '<div><video poster=' + (el.querySelector('img') ? el.querySelector('img').src : '#') + ' controls=controls preload=none> <source type=video/mp4 src=' + el.href + '> </video></div>';
				
			}
			
			return;
			
		}
			
		if (hasClass(el, 'iframe')) {

			images += '<div><iframe src=' + el.href + '></iframe></div>';
			return;
			
		}

		var slide_link;
		
		if (hasClass(lightbox, 'slider') || !el.href ) {
			
			slide_link = '';

		} else {

			slide_link = document.location.href.split('#')[0] + (document.location.href.indexOf('?') >= 0 ? '&' : '?') + 'image=' + el.href.split('/').pop() + '#' + lightbox.getAttribute('id');
			
		}

	    var link_element = (hasClass(lightbox, 'inline') || !lightbox.getAttribute('id')) ? '' : '<a class="button copy" href=' + slide_link + '></a>';

	    var url = hasClass(lightbox, 'slider') ? (el.querySelector('img') ? el.querySelector('img').getAttribute('data-src') : '') : el.href;
	    
	    images += '<div><img data-src="' + url + '" alt="' + el.title + '" data-link="' + slide_link + '">' + (el.title ? ('<p>' + el.title + '</p>') : '') + link_element + '</div>';

        // Attach onload event to each image to display it only when fully loaded and avoid top-to-bottom reveal?

    });

    lightbox_target.innerHTML = images;
    
    if (lightbox.matches('.inline:not(.slider)')) { // It's an inline lightbox and needs to become full window/screen when clicked
	    
	    lightbox_target.onclick = function(e) {
		    
		    if (e.target.tagName === 'IMG') {
			    
			    openLightbox(e);

		    }
		    
	    };
	    
    }

    if (typeof makeSlider === 'function') {

        var anchor = el;
		
		if (anchor.href) { // If it's a standard lightbox with a[href], not a secondary full screen lightbox from an inline one

	        while (typeof anchor.href !== 'string') {
	
	            anchor = anchor.parentNode;
	
	        }
	
	        transferClass(anchor.parentNode, lightbox_target, 'vertical');
	        transferClass(anchor.parentNode, lightbox_target, 'right');
	
	        // Load the images in the current slide and its neighbours
	        while (anchor.tagName !== 'A') {
		        
		        anchor = anchor.parentNode;
		        
	        }
        
        }

		// To do: after closing an URI-invoked lightbox and opening a lightbox again, the index is incorrect
		var this_index = 0;

		if (hasClass(lightbox, 'inline')) { // Secondary lightbox

        	this_index = Array.prototype.indexOf.call(lightbox.children, anchor.parentNode); // Ignore non-anchor children of the lightbox container
			
		} else {

	        this_index = Array.prototype.indexOf.call(lightbox.querySelectorAll('[href]'), closest(anchor, '[href]')); // Ignore non-anchor children of the lightbox container

		}

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

        if (this_index > (lightbox_target.children.length - 1) || this_index < 1) { // To do: fix this_index for a secondary full screen lightbox
	        
	        this_index = 0;
	        
        }
        
        populateLightbox(makeSlider(lightbox_target, this_index), this_index);
        transferClass(anchor.parentNode, lightbox_target.parentNode, 'thumbnails');
        transferClass(anchor.parentNode, lightbox_target.parentNode, 'outside');
        
        if (hasClass(anchor.parentNode, 'thumbnails')) {
        
	        var i = 0;
// 	        var nav = closest(lightbox_target, '.n-sldr').querySelector('.slider-nav');
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

    while (typeof el.href !== 'string') { // If a child of the link is clicked

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

    scrollToAnimated((hash === null) ? 0 : getCumulativeOffset(hash).y, .5, function(e) { // To do: fix jumping to new hash – is the fallback executed properly in animate()?

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
/*
        Element.prototype.matchesSelector || 
        Element.prototype.mozMatchesSelector ||
*/
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
    var content = el.querySelector('.content');

	content.style.setProperty('--width', content.scrollWidth + 'px');
	content.style.setProperty('--max-height', content.scrollHeight + 'px');

	var content_height = content.style.getPropertyValue('--start-height') || 0;
	
	// Animation, not CSS, because of nested accordions
	
	if (hasClass(el, 'horizontal')) {
		
		toggleAttribute(el, aria_expanded);
		
	} else {
	
		if (el.hasAttribute(aria_expanded)) {
	
			animate(content, '0% { max-height: ' + content.scrollHeight + 'px; } 100% { max-height: ' + content_height + '; }', .2, function () {
				
				toggleAttribute(el, aria_expanded);
				
			});
			
		} else {
			
			toggleAttribute(el, aria_expanded);
			animate(content, '0% { max-height: ' + content_height + '; } 100% { max-height: ' + content.scrollHeight + 'px; }');
			
		}
	
	}

    return false;

}

/* Fold – end */

// Clicking a button copies a target element's contents

function copyButton (el, target, echo) {
	
	el.addEventListener('click', function(event) {  

	  window.getSelection().removeAllRanges(); // Clear previous clipboard
	  var range = document.createRange();  
	  range.selectNode(target);  
	  window.getSelection().addRange(range);
	
	  try {  

		  document.execCommand('copy');
		  
		  if (typeof echo !== 'undefined') {
	
			  notify('📋 ' + target.textContent, 'fixed timeout');
		  
		  }

	  } catch(err) {

	  }  
	
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
			
			el.removeAttribute(aria_expanded);
			
		});
		
	}
	
	// Focus on clicked slider
	
/*
	if (q('.n-sldr.active')) {
		
		removeClass(q('.n-sldr.active'), 'active')
		
	}
	
	if (closest(el, '.slider')) {
		
		addClass(closest(el, '.n-sldr'), 'active');
		
	}
*/

	if (closest(el, '.slider')) {

		current_slider = closest(el, '.slider');
	
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
				
				addClass(el, 'threshold');
				q('body').setAttribute('data-threshold', true);
				
			} else {
				
				removeClass(el, 'threshold');
				removeClass(q('body'), 'threshold');
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
		
		forEach(this_nav.querySelectorAll('ul'), function (el) {

			el.removeAttribute('aria-expanded');
			
		});
		return;
		
	}
	// Close neighboring parent nav's sub navs.
	var el = e.target;
	var target_parent = closest(el, '[aria-haspopup]');
	if (target_parent) { // Skip if it's a top-level-only item
		
		forEach(target_parent.querySelectorAll('ul[aria-expanded]'), function (el) { // Disable active grandchildren
	
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
		
			forEach(a.querySelectorAll('[aria-expanded]'), function (el) {
				
				el.removeAttribute('aria-expanded');
				
			});
		
		}
		
	});
	
	el = e.target;

	el.parentNode.parentNode.setAttribute('aria-expanded', true);
	if (el.parentNode.querySelector('ul')) {

		el.parentNode.querySelector('ul').setAttribute('aria-expanded', 'true');

	}
	
	var current_item = e.target.parentNode;

	forEach(current_item.parentNode.parentNode.childNodes, function (el) {

		if (el !== current_item && el.nodeName === 'LI' && el.querySelector('ul')) {

			el.querySelector('ul').removeAttribute('aria-expanded');
		
		}
		
	});
	
}

var closeDropNavClickedOutsideEnabled = false;
var draggingNow = false;

function initNav(el) {
	
	// Delete all trigger inputs, add tabindex=0 to each li
	
	forEach(el.querySelectorAll('input'), function (el) {
		
		el.outerHTML = '';
		
	});
	
	el.setAttribute('role', 'menubar');

	forEach(el.querySelectorAll('li > a'), function (el) {
		
		el.setAttribute('tabindex', 0);

	});

	if (!closest(el, 'nav.drop')) { // The rest is for drop nav only
		
		return;

	}

	if (!closeDropNavClickedOutsideEnabled) {
		
		window.addEventListener('touchend', closeDropNavClickedOutside);
		closeDropNavClickedOutsideEnabled = true;
	
	}
	
	el.addEventListener('keyup', function (e) {
		
		// Check for sibling or children to expand on control keys Left/Right/etc
	
		if (e.key === 'Escape') {
			
			forEach (closest(e.target, 'nav').querySelectorAll('ul'), function (el) {
				
				el.removeAttribute('aria-expanded');
				
			});
			
			document.activeElement.blur();
			
		}
		
	});
	
	forEach(el.querySelectorAll('li'), function (el) {
		
		if (el.querySelector('ul')) {
	
			el.setAttribute('aria-haspopup', true);
		
		}
	
		el.addEventListener('touchend', function (e) {

			var el = e.target;

			if (draggingNow || typeof el.href === 'string') {
				
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

		var anchor = el.querySelector('a');

		anchor.addEventListener('focus', dropNavFocus);
	
		anchor.addEventListener('blur', dropNavBlur);
		
	});

	draggingNow = false;

	window.addEventListener('touchstart', function (e) {
		
		draggingNow = false;
		
	});

	window.addEventListener('touchmove', function (e) {
		
		draggingNow = true;
		
	});

}

	// Limitation: each row must have equal width columns.
	
function initGridInlinePopups() {
		
		forEach(qa('.grid-inline-popup:not([data-ready])'), function (el) {
		
		var cells = el.querySelectorAll(':scope > div:not(.popup)');
		var popups = el.querySelectorAll(':scope > .popup');
		forEach(cells, function (el) {
			
			function openNewItem(e, current_popup) {
		
				var cell = e.target.closest('.grid-inline-popup > div');
				var columns = Math.round(cell.parentElement.scrollWidth/cell.scrollWidth);
				var el = cell.nextElementSibling;
				if (el === current_popup) {
					
					return;

				}
				
				var index = Array.prototype.indexOf.call(popups, el);
	
				// Rewind index to start of row (when cell horizontal offest === parent horizontal offset)
				
				var index_row = index;
				
				while (index_row >= columns && cells[index_row].offsetLeft > cells[index_row].previousElementSibling.previousElementSibling.offsetLeft) {
					
					index_row--;
	
				}
	
				if (index_row < columns) {
	
					index_row = 0;
	
				}
	
				index -= index_row;
				var i = 0;
				while(i < index_row) {
					
					cells[i++].style.order = -1;
					
				}
				
				// Set order = -1 until index_row and subtract index_row from index
				
				index -= index % columns; // compensate with remainder
				
				i = index_row;
				
				while(i < (cells.length)) {
					
					cells[i].style.order = ((i - index_row) < (index - index_row)) ? -1 : 1;
					i++;
					
				}
				
				i = 0;
				while (i < columns) {
					
					cells[i+index_row].style.order = -1;
					i++;
					
				}
	
				el.setAttribute('aria-expanded', 'true');
				var height = el.scrollHeight;
				el.style.maxHeight = 0;
				el.style.overflow = 'hidden';
				animate(el, '100% { max-height: ' + height + 'px; }', .2, function () {
		
					el.setAttribute('aria-expanded', 'true');
					el.style.cssText = '';
					
				});
	
			}
					
			function openCell(e) {
				
				var current_popup = closest(e.target, '.grid-inline-popup').querySelector('.popup[aria-expanded]');
				if (current_popup) {
					
					current_popup.style.maxHeight = current_popup.scrollHeight + 'px';
					current_popup.style.overflow = 'hidden';
					animate(current_popup, '100% { max-height: 0; }', .2, function () {
						
						current_popup.removeAttribute('aria-expanded');
						current_popup.style.cssText = '';
						openNewItem(e, current_popup);
				
					});
					
				} else {
				
					openNewItem(e);
				
				}
				
			}
	
			el.setAttribute('tabindex', 0);
			el.addEventListener('click', openCell);
			el.addEventListener('touchend', openCell);
			el.addEventListener('keyup', function (e) { 
				
				if (e.key === 'Enter') {
	
					openCell(e);
	
				}
			
			});
			
		});
		el.setAttribute('data-ready', true);
		
	});
	
	}

var current_slider = null;

/* Initialise JS-powered elements */

function init() {
	
	// Load extra CSS for JS-generated content
	
	var css = q('head [href*="natuive.min.css"]');
	if (css && !q('head [href*="natuive-extra.min"]')) {

		var extra_css = css.cloneNode()
		extra_css.href = extra_css.href.replace('natuive.min', 'natuive-extra.min');
		q('head').insertBefore(extra_css, css.nextSibling); // Insert it after natuive.min.css, not at the end of <head>, to allow subsequent CSS files to overwrite it

	}

	notifyCloseEvent();
	
	/* Enhance sliders: create arrows/numbers navigation etc */
    if (typeof makeSlider === 'function') {
		
		current_slider = q('.slider');
		
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
	
	forEach('a.modal[href]', function(el) {
	
		if (el.href !== (location.href.split('#')[0] + '#')) { // Is it an empty anchor?
			
		    el.onclick = modalWindow;
	
	    }
	    
	    if (!el.getAttribute('rel')) {
		    
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

			toggleAttribute(closest(e.target, '.tool'), aria_expanded);

		};		
	
	    var t = el.querySelector('.tip');
	    if (!t) return;
	
	    el.style.position = 'static'; // dangerous with absolutely-positioned containers, which should be avoided anyway
	    el.parentNode.style.position = 'relative'; // dangerous with absolutely-positioned containers, which should be avoided anyway
/*
	    t.style.top = (t.parentNode.offsetTop + t.parentNode.offsetHeight) + 'px';
	    t.style.width = '100%';
*/

		var label = el.querySelector('.label');
		if (label) {
			
			label.setAttribute('tabindex', 0);
			label.onkeyup = function (e) {
				
				if (e.key === 'Enter') {
					
					toggleAttribute(closest(e.target, '.tool'), aria_expanded);

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

	initGridInlinePopups();

}

ready( function () {

	init();
	
	// Automatically open a lightbox specified in the URI

	setTimeout( function () {
		
		if (q('.lightbox:target')) {
			
			addClass(q('.lightbox:target'), 'uri-target');
			openLightbox(q('.lightbox:target > a[href]'));
			
		}
		
		if (q('.modal:target')) {
			
			q('.modal:target').click();
			
		}
		
	}, 1);

});
;/* natUIve Slider */

// "use strict";

(function () {

	"use strict";
	if (Function.prototype.bind && !this) { // Supports ES5

		return;

	} else { // Doesn't support ES5, going CSS-only
	
	  noSuchFunction();
	  return;

	}

}());

// q('html').dataset.last_slide = 14045017000;
// q('html').setAttribute('data-last_slide', 14045017000);
var last_slide_time = 14045017000;
// q('html').dataset.slide_duration = 0.5;
var slide_duration = .5;

function sliderElement(e) { // Get the active slider instance

	if (closest(document.activeElement, 'n-sldr') === q('.n-sldr:focus-within')) {

		return q('.n-sldr:focus-within .slider');

	}

    var el = e.target;

    if (hasClass(el, 'n-sldr')) {

        return el.querySelector('.slider');

    } else {

        var container = closest(el, '.n-sldr');
        return container && container.querySelector('.slider');

    }

}

/* Thanks to Pete & Eike Send for the swipe events – http://www.thepetedesign.com/demos/purejs_onepage_scroll_demo.html */

function swipeEvents(el) {

    var startX, startY;

    el.addEventListener('touchstart', touchStart);

    function touchStart(e) {

		if (hasClass(q('html'), 'sliding_now')) {

			endSlide(sliderElement(e));
			return;

		}

        var touches = e.touches;
        if (touches && touches.length) {

            startX = touches[0].pageX;
            startY = touches[0].pageY;
            el.addEventListener('touchmove', touchMove);

//             q('html').addClass('sliding_now');

        }

    }

    function touchMove(e) {
	    
        var touches = e.touches;
// 	    var slider = sliderElement(e);

        if (touches && touches.length && !(hasClass(el, 'vertical') && !closest(el, '.n-ovrl'))) { // Don't slide vertically if not full window

            var deltaX = startX - touches[0].pageX;
            var deltaY = startY - touches[0].pageY;
            var delta = (Math.abs(deltaX) > Math.abs(deltaY)) ? deltaX : deltaY;
			
			// Allow vertical page scrol by swiping over the slider 
            if ((hasClass(el, 'vertical') ? (Math.abs(deltaY) < Math.abs(deltaX)) : (Math.abs(deltaX) < Math.abs(deltaY))) && !q('.n-ovrl .n-sldr')) {

                removeClass(q('html'), 'sliding_now');
                return;

            }

            e.preventDefault();

            if (Math.abs(delta) > 50) {

                var event = new Event((delta >= 50) ? 'swipeLeft' : 'swipeRight');
                el.dispatchEvent(event);
                el.removeEventListener('touchmove', touchMove);

            }
            
        }

    }

}

function initScroll(e, delta) { // Scroll happens

    var timeNow = new Date().getTime();

    // Cancel scroll if currently animating or within quiet period – don't slide again automatically after a slide
    if ((timeNow - last_slide_time) < slide_duration * 2000 || hasClass(q('html'), 'sliding_now')) {

        stopEvent(e);
		return;

    }

	last_slide_time = timeNow;

    slide(sliderElement(e), delta < 0 ? 'right' : 'left');

}

function mouseWheelHandler(e) {

	if (hasClass(q('html'), 'sliding_now')) {
		
		stopEvent(e); 
		return;
	
	}

	var el = e.target;
	
	if (closest(el, '.slider-nav')) {
		
		return;

	}

    var deltaX = (e.deltaX * -10) || e.wheelDeltaX || -e.detail; // Firefox provides 'detail' with opposite value
    var deltaY = (e.deltaY * -10) || e.wheelDeltaY || -e.detail;
/* To do: stop generating events while sliding */	
    if (!hasClass(q('html'), 'sliding_now') && Math.abs(hasClass(sliderElement(e), 'vertical') ? deltaY : deltaX) > 50) {

        e.preventDefault();
        initScroll(e, (Math.abs(deltaX) > Math.abs(deltaY)) ? deltaX : deltaY);

	}
    
}

function mouseEvents(el, toggle) {

    if (!('onwheel' in window) || (hasClass(el, 'vertical') && !closest(el, '.n-ovrl'))) { // Check for mouse wheel and Don't slide vertically if not full window
	    
	    return;
	   
	}

	var slider_wrap = closest(el, '.n-sldr');

    if (toggle === 'off') {

        slider_wrap.removeEventListener('wheel', mouseWheelHandler);

    } else {

        slider_wrap.addEventListener('wheel', mouseWheelHandler);
        if (getSliderNav(slider_wrap)) {

	        getSliderNav(slider_wrap).addEventListener('wheel', function (e) {
	
		        // Scroll as usual instead of sliding
	
	        });
        
        }

    }

}

function endSlide (slider, index) {

    if (hasClass(slider, 'lightbox')) {
		
		populateLightbox(slider, index);
        
    }

	var slider_wrap = closest(slider, '.n-sldr');

	if (getSliderNav(slider_wrap)) { // Multiple slides? // To do: get the proper slider nav, if it's detached

		addClass(getSliderNav(slider_wrap).children[index], 'active');
	
	}
    slider.style.cssText = '';

	addClass(slider.children[index], 'active');

    if (!hasClass(slider, 'vertical')) {
	    
	    slider.style.marginLeft = -100*index + '%';
	   
	}

	slider.style.pointerEvents = '';

    window.addEventListener('keyup', sliderKeyboard);
    setTimeout(function () {

	    removeClass(q('html'), 'sliding_now');
	    mouseEvents(slider);

	    // Make this slider active
	
/*
		if (q('.n-sldr.active')) {
			
			removeClass(q('.n-sldr.active'), 'active')
			
		}
	
		addClass(closest(slider, '.n-sldr'), 'active');
*/

		current_slider = slider; 

		if (slider.children[index].id) { // Scroll page to slide hash. To do: restore focus
	
			scrollToAnimated(getCumulativeOffset(slider.children[index]).y, .2, function () {
				
				var focused = document.activeElement;
				window.location.hash = slider.children[index].id;
				focused.focus();
	
			});
			
		}

	}, slide_duration/2);
	
}

function slide(el, method, index_number) {

	if (hasClass(q('html'), 'sliding_now')) {
		
		return;
	
	}

	var slider_wrap = closest(el, '.n-sldr');
    var slider = slider_wrap.querySelector('.slider');

    if (slider.children.length < 2) {

		endSlide(el, 0);
        return el;

    }
    

    mouseEvents(slider_wrap, 'off');
    slider.style.pointerEvents = 'none'; // Speed up animation
    mouseEvents(el, 'off');
    window.removeEventListener('keyup', sliderKeyboard);

	clearTimeout(slider.getAttribute('data-timeout'));
	
	var index;
	var old_index;
	var slider_nav = getSliderNav(slider_wrap);
	var active_nav_item = slider_nav.querySelector('a.active');
	if (!active_nav_item) {

		return;

	}
	index = old_index = thisIndex(active_nav_item);

    if (method === 'index') {

		if (typeof index_number === 'undefined' || index_number === index || !slider.querySelector('.active')) { /* Don't slide to current slide */
			
			endSlide(slider, index_number);
			return;

		}
        index = index_number;

    }

    if (method === 'right') {

        if (index === (slider.children.length-1)) {

            index = 0;

        } else {
	        
	        index++; 
	        
        }
        
    }

    if (method === 'left') {

        if (index === 0) {

            index = slider.children.length-1;

        } else {
	        
	        index--;
	        
        }

    }

    var offset_sign = '-'; // Slider offset depending on direction. '-' for LTR or '' (plus) for RTL. Vertical is always '-'

	// To do: auto-height slider to take the height of the taller element
	var computed_height;
	var computed_height_old;

	var target_slide = slider.children[index];

	if (hasClass(slider, 'vertical')) {
		target_slide.style.cssText = 'display: block'; // Temporarily display the target slide to get its height
		computed_height = getComputedStyle(target_slide).height;
		target_slide.style.cssText = '';
		computed_height_old = getComputedStyle(slider.children[old_index]).height;

	} else {
	
		computed_height = getComputedStyle(slider).height;
		if (slider.getAttribute('dir') === 'rtl') {
			
			offset_sign = '';
	
		}
		
	}

	slider.style.height = computed_height;

	if (slider_nav.querySelector('.active')) {

	    removeClass(slider_nav.querySelector('.active'), 'active');

    }

	var duration = slider.getAttribute('data-duration') || slide_duration;

	addClass(target_slide, 'active');

	var translate_from, translate_to;
	
    if (hasClass(slider, 'vertical')) {

	    translate_from = 'translate3d(0,' + ((index<old_index) ? '-100%' : '0') + ',0)';
		
		computed_height = parseInt(computed_height, 10);
		computed_height_old = parseInt(computed_height_old, 10);
	    var difference = Math.abs(computed_height - computed_height_old);
	    if (computed_height > computed_height_old) {
		    
		    difference = Math.max(computed_height, computed_height_old) - difference;
		    
	    } else {
		    
		    difference = Math.min(computed_height, computed_height_old) + difference;
		    
	    }
	    translate_to = 'translate3d(0,' + ((index<old_index) ? '0' : ('-' + difference + 'px')) + ',0)';
	    slider.children[old_index].style.transition = 'opacity ' + duration/2 + 's linear';
	    slider.children[old_index].style.opacity = 0;
	
	} else {
		
	    translate_from = 'translate3d(' + offset_sign + ((index<old_index) ? 1 : 0) + '00%,0,0)';
	    translate_to = 'translate3d(' + offset_sign + ((index<old_index) ? 0 : 1) + '00%,0,0)';
		
	}
    
	var animation_code;

	if (hasClass(slider, 'fade')) {

		animation_code = '0% { opacity: 1; transform: ' + translate_from + ' } 49% { transform: ' + translate_from + ' } 51% { opacity: 0; transform:' + translate_to + ' } 100% { opacity: 1; transform:' + translate_to + ' }';
	
	} else {
		
		animation_code = '0% { transform: ' + translate_from + '; } 100% { transform: ' + translate_to + '; }';

	}

	slider.setAttribute('data-sliding', true);

	slider.style.margin = 0;

	animate(slider, animation_code, duration, function slideEndHandler(e) { // On slide end

		slider.removeAttribute('data-sliding');
		removeClass(slider.children[old_index], 'active');
	    slider.children[old_index].style.transition = '';
	    slider.children[old_index].style.opacity = '';

		slider.style.height = '';
		endSlide(slider, index);

    });

}

function shouldNotSlideVertically(el) {
	
	if (q('.n-ovrl')) { 
		
		return false; 
	
	}
	return !hasClass(el, 'vertical') || window.innerHeight < q('body').scrollHeight;
	
}

function sliderKeyboard(e) {

    if (typeof e === 'undefined' || 
    	hasClass(q('html'), 'sliding_now') || 
    	q('.slider[data-sliding]') || 
    	(q('.n-ovrl') && !q('.n-ovrl .n-sldr')) // There is an overlay open and it doesn't have a slider in it
		) {

        return;

    }

	var el = e.target;

	if (!closest(el, '.n-sldr') && q('.n-sldr')) { // Focused element is outside of any slider
		
// 		current_slider = q('.n-sldr').querySelector('.slider');
		var scrollable = el; // Don't slide when current element is scrollable. Check all parent nodes for scrollability – cheak each parent until body.
		while (scrollable.nodeName !== 'BODY') {
			
			if (scrollable.scrollWidth > scrollable.clientWidth || scrollable.scrollHeight > scrollable.clientHeight) { 
				
				return;
		
			}
	
			scrollable = scrollable.parentElement;
	
		}
		
	} else {
		
		current_slider = closest(el, '.n-sldr').querySelector('.slider');

	}

	if (q('.slider:focus-within')) {
		
		current_slider = q('.slider:focus-within');
		
	}

	if 	(el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA' && 
// 		(document.activeElement === el ? (el.scrollWidth <= el.clientWidth) : true) &&
// 		(!closest(document.activeElement, '.n-sldr.active') && (el.scrollWidth <= el.clientWidth) ) &&
		(el = q('.n-ovrl .slider') || current_slider || q('.slider'))
		) { // Priority: full window slider, active slider, first slider

        switch (e.which) {

            case 38:
            	if (shouldNotSlideVertically(el)) { // Page can be scrolled by the arrow key so don't slide
                	
                	return;

            	}
            case 37:
                slide(el, 'left');
                break;
            case 40:
            	if (shouldNotSlideVertically(el)) {
                	
                	return;

            	}
            case 39:
                slide(el, 'right');
            default:
                return;

        }
		
	}

}

function cancelTouchEvent(el) {
	
	el.addEventListener('touchstart', function (e) { e.stopPropagation(); return false; });
	
}

function makeSlider(el, current_slide) {

	if (hasClass(el.parentNode, 'n-sldr') || hasClass(el.parentNode.parentNode, 'n-sldr')) { // Already created
		
		return;
		
	}
	
    addClass(el, 'slider');

	if (hasClass(el, 'full-window')) {
		
		openFullWindow(el);
		
	}

	var container = el.parentNode;

	if (!hasClass(container, 'n-sldr')) {

	    container = wrap(el).parentNode;
		addClass(container, 'n-sldr');
	    el = container.querySelector('.slider');
		
		if (hasClass(el, 'pad')) {
			
		    container = wrap(el).parentNode;
			addClass(container, 'pad');
		    container = container.parentNode;
		    el = container.querySelector('.slider');

		}
		
	    transferClass(el, container, 'vertical');
        transferClass(el, container, 'wrap');
        transferClass(el, container, 'top');
        transferClass(el, container, 'right');
    
    }
	
	if (el.children.length > 1) { // Add controls only to a slider with multiple slides
		
		var slider_nav;

		if (el.id && (slider_nav = q('.slider-nav[data-for=' + el.id + ']'))) { // Detached nav
			
			addClass(container, 'detached-nav');
			addClass(el, 'detached-nav');
	
		} else {

		    container.insertAdjacentHTML(hasClass(container, 'top') ? 'afterbegin' : 'beforeend', '<div class=slider-nav></div>');
            slider_nav = container.querySelector('.slider-nav:not([data-for])'); // Not data-for to avoid nested detached nav for nested sliders
		
		}
		
	    container.insertAdjacentHTML('beforeend', '<a class="slider-arrow left" tabindex=0></a><a class="slider-arrow right" tabindex=0></a>');
	
		var slider_wrap = closest(el, '.n-sldr');
	
	    // Generate controls

	    for (var i = 0; i < el.children.length; i++) {
	
	        if (hasClass(el, 'tabs')) {
	
	            addClass(slider_wrap, 'tabs');
	            addClass(slider_nav, 'row');
	            transferClass(slider_wrap, slider_nav, 'wrap');
	            transferClass(el, slider_wrap, 'vertical');
	            var tab_title = el.children[i].getAttribute('data-tab_title') || (el.children[i].querySelector('.tab-title') ? el.children[i].querySelector('.tab-title').innerHTML : i+1);
	            slider_nav.insertAdjacentHTML('beforeend', '<a tabindex="0">' + tab_title + '</a>');

	        } else {
	
	            slider_nav.insertAdjacentHTML('beforeend', '<a tabindex=0>' + (i + 1) + '</a>');
	
	        }
	
			slider_nav.lastChild.onclick = slider_nav.lastChild.onkeyup = function(e) {
				
				if (e.type === 'keyup' && e.keyCode !== 13) { // Slide on Enter key
					
					return;

				}
				
	            slide( // Select slider either through id or as a parent
		            slider_nav.getAttribute('data-for') ? q('.slider#' + slider_nav.getAttribute('data-for')) : e.target,
					'index', thisIndex(e.target)
				);
	
	        };
	        
	        cancelTouchEvent(slider_nav.lastChild);
	        
	    }
	
	    container.querySelector('.slider-arrow').onclick = container.querySelector('.slider-arrow').onkeyup = function(e) {
	
			if (e.type === 'keyup' && e.keyCode !== 13) { // Slide on Enter key
				
				return;

			}

	        slide(e.target, 'left');
	
	    };
	    
	    cancelTouchEvent(container.querySelector('.slider-arrow'));
	
	    container.querySelector('.slider-arrow.right').onclick = container.querySelector('.slider-arrow.right').onkeyup = function(e) {
	
			if (e.type === 'keyup' && e.keyCode !== 13) { // Slide on Enter key
				
				return;

			}
	        slide(e.target, 'right');
	
	    };
	
	    cancelTouchEvent(container.querySelector('.slider-arrow.right'));
	
	    mouseEvents(el);
	
	    swipeEvents(slider_wrap);
	
	    slider_wrap.addEventListener('swipeLeft', function(e) {
	
	        var el = sliderElement(e);
	        slide(el, 'right');
	
	    });
	
	    slider_wrap.addEventListener('swipeRight', function(e) {
	
	        var el = sliderElement(e);
	        slide(el, 'left');
	
	    });
	    
	    slider_wrap.addEventListener('mouseover', function(e) {

		    clearTimeout(el.getAttribute('data-timeout'));
		   
		});
	    
	    // Don't slide when using a range input in a form in a slider
	    if (el.querySelector('input[type=range]')) {
		   	
		   	forEach(el.querySelector('input[type=range]'), function (el) {
	        
		        el.ontouchmove = function(e) {
		
					e.stopPropagation();
					removeClass(q('html'), 'sliding_now');
			        
		        };
		        
		    });
	    
	    }
	
	    if (el.getAttribute('data-autoslide')) { // auto slide
	
			var delay = el.getAttribute('data-autoslide');
			delay = delay.length > 0 ? (1000 * delay) : 4000;
	        var autoSlide = function() {
	
	            slide(el, 'right');
	            el.setAttribute('data-timeout', setTimeout(autoSlide, delay));
	
	        };
	
	        setTimeout(autoSlide, delay);
	
	    }
		
		// If URI #id matches a slide #id, go to that slide and scroll the page to the slider.
		if (!current_slide && window.location.hash && el.querySelector(window.location.hash)) {
			
			var current_slide = thisIndex(el.querySelector(window.location.hash));
// 			addClass(slider_wrap, 'active');
			current_slider = slider_wrap;
			
		} 
		endSlide(el, current_slide || 0); // Start from (other than) the first slide
	    
	} else {
		
		addClass(el.children[0], 'active');

	}

	// Detect text direction
	el.setAttribute('dir', getComputedStyle(el, null).getPropertyValue('direction'));
	    
    window.addEventListener('keyup', sliderKeyboard);
	
    return el;

}
}());