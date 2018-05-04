var nui = (function(){/* natUIve by rado.bg */
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

// 	observerOff();

    wrapper = wrapper || document.createElement('div');
	
	var sibling = toWrap.nextSibling;
	var parent = toWrap.parentNode;
	wrapper.appendChild(toWrap);
	
	if (parent) { // Already attached to DOM
	
	    if (sibling) { // Attach the wrapper
	
	        parent.insertBefore(wrapper, sibling);
	
	    } else {
	
	        parent.appendChild(wrapper);
	
	    }
    
    }
    
//     observerOn();

    return wrapper;

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

function removeHash() {

    history.pushState("", document.title, window.location.pathname + window.location.search);

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

var external = RegExp('^((f|ht)tps?:)?//(?!' + location.host + ')');
var full_window_content = null;
var previousScrollOffset = 0;
var previouslyFocused = false;

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

/* Chainable animation specified as CSS Animation */

var temp = document.createElement('temp');

var animations = {

	'animation'      	: 'animationend',
	'MozAnimation'   	: 'animationend',
	'WebkitAnimation'	: 'webkitAnimationEnd'

};

for(var t in animations) {

    if (temp.style[t] !== 'undefined') {

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
	
	var difference = document.body.clientHeight - window.innerHeight;
	if (to > difference) {

		to = difference;

	}
	
	function scrollToCallback (callback) {

		q('html').scrollTop = q('body').scrollTop = to;
		if (typeof callback === 'function') {
			
			callback();
		
		}
		
	}
	
	animate(q('html'), '100% { transform: translate3d(0, ' + -1*(to - (document.documentElement.scrollTop || document.body.scrollTop)) + 'px, 0); }', duration, scrollToCallback.bind(null, callback));

}

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

function makeReady(el) {
	
	el.setAttribute('data-ready', true);

}

function initThreshold(host) {

// Scroll effects
	forEach(host.querySelectorAll('[data-threshold]:not([data-ready])'), function(el) { // Set a variable reflecting how much of the element's height has been scrolled; .threshold on scroll over element height
	
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
		makeReady(el);
	
	});

}

function focusWithin(selector) {

	// To do: If not IE/Edge, return q(selector + ':focus-within');

	var result = null;
	forEach(qa(selector), function (el) {
		
		if (el.querySelector(':focus')) {
			
			result = el;

		}
		
	});
	
	return result;
	
}

function addComponent(host, el) {
	
	host.insertAdjacentHTML('beforeend', el);
	initComponents(host);

}

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

//			if (true/* full_window_content */) { // Remove disposable generated content. To do: In which case it's not dynamic?
	
				 // If lightbox/slider, crashes iOS Safari. not crashing with an empty div
				full_window.parentNode.removeChild(full_window);
				full_window_content = null;
	
					
//			} else { // or keep previously existing content
	
//				full_window.parentNode.replaceChild(full_window.querySelector('.content > *'), full_window);
			
//			}
	
			if (qa('.n-ovrl').length === 0) { // A single overlay

				window.removeEventListener('keydown', arrow_keys_handler);
				window.removeEventListener('keyup', keyUpClose);
				if (!q('.slider')) { // No sliders on the page to control with arrow keys
				
	// 				document.onkeyup = function () {};
					window.removeEventListener('keydown', arrow_keys_handler, false);
					
				}
			
			}
			
		   	q('html').style.pointerEvents = 'initial';
		   	removeClass(q('html'), 'nooverflow');
		   	
		   	if (previouslyFocused) {

			   	previouslyFocused.focus();
			   
			}
				
		});

	}
    
}

function openFullWindow(el, animation) { // el is an HTML string

// 	observerOff();
	
	previouslyFocused = document.activeElement;
	
   	q('html').style.pointerEvents = 'none';
	var offset_top = q('html').getBoundingClientRect().top;
	previousScrollOffset = offset_top; // Remember the page position.

	full_window_content = document.createElement('div');
	
	if (typeof el === 'string') {

		full_window_content.innerHTML = el;

	} else {

		full_window_content.appendChild(el);

	}


	full_window_content.setAttribute('data-anim', animation);

	var wrapper = document.createElement('div');
	addClass(wrapper, 'n-ovrl');
	wrapper.insertAdjacentHTML('beforeend', '<div class=content tabindex=0></div><div class=overlay-bg></div>');
	wrapper.firstChild.appendChild(full_window_content);
	full_window_content = wrapper;

/*     if (!hasClass(el, 'headless')) { */
	    
	    full_window_content.insertAdjacentHTML('afterbegin', '<div class=close> ← ' + document.title + '</div>');
		full_window_content.querySelector('.overlay-bg').onclick = full_window_content.querySelector('.close').onclick = closeFullWindow;
		window.addEventListener('keyup', keyUpClose);
	   
/*
	} else {
		
		addClass(full_window_content, 'headless');
		
	}
*/

	q('body').appendChild(full_window_content);
	initComponents(full_window_content.querySelector('.content')); // To do: replace by Mutation Observer

    full_window_content.querySelector('.content').focus();

	if (full_window_content.querySelector('.full-screen')) {

		if (full_window_content.webkitRequestFullScreen) { 
			
			full_window_content.webkitRequestFullScreen(); 
		
		}
		if (full_window_content.mozRequestFullScreen) { 
			
			full_window_content.mozRequestFullScreen(); 
		
		}
		if (full_window_content.requestFullScreen) {
			
			full_window_content.requestFullScreen(); 
		
		}
	
    	q('html').style.pointerEvents = 'initial';

	} else {

		animate(full_window_content, typeof animation === 'string' ? animation : '0% { transform: translate3d(0,-100vh,0) } 100% { transform: translate3d(0,0,0) }', .2, function () { 
			
			addClass(q('html'), 'nooverflow');
	    	q('body').scrollTop = q('html').scrollTop = -1 * previousScrollOffset;
	    	q('html').style.pointerEvents = 'initial';
		
		});

	}
	
// 	observerOn();
    return false;
	
}

var current_slider = q('.slider');

var components = new Array;

function registerComponent(name, selector, init) {

	components[name] = new Array;
	components[name].push({ selector: selector, init: init });

}

function initComponents(host) {

// 	observerOff();

	if (typeof host === 'undefined') {
		
		var host = q('body');

	}
	
	for (var key in components) {
	
	    components[key][0].init(host);
	
	}

	// Animate anchor link jumps
	forEach(host.querySelectorAll('a[href^="#"]'), function(el) {
	
		el.onclick = el.onclick || animateAnchors; // Don't add to previous onclick event handler
	
	});
	
	notifyCloseEvent();

// 	observerOn();

}
  
/*
var observer = false;

function observerOn() {
	
	if (observer) {
		
		observer.observe(q('body'), {childList: true, subtree: true});

	}
	
}

function observerOff() {

	if (observer) {
		
		observer.disconnect();
		
	}
	
}
*/

ready(function(){
	
/*
	if (typeof MutationObserver === 'function') {
	
		observer = new MutationObserver(function(mutations, observer) {

            observerOff();

			var mutation = mutations[0];
	        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {

				var i = 0;
				while (i < mutation.addedNodes.length) {
					
					var el = mutation.addedNodes[i++];
		            if (typeof el === 'object' && el.nodeName !== '#text' && !el.getAttribute('data-ready')) {
			            
			            initComponents(el.parentNode);
			            
		            }
					
				}

	        }

            observerOn();
		    
		});
		
	}
*/

	initComponents();
	initThreshold(q('body'));
	
});
;// Component Form – start

(function (){
    
/* Form – start */

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

/* Form – end */

	var selector = 'form';
	var init = function(host) {
		
		forEach(host.querySelectorAll('form'), function(el, i) {
		
		    el.onsubmit = el.onsubmit || submitForm;
		
		});
		
		forEach(host.querySelectorAll('input[type=file]'), function(el, i) {
		
		    el.onchange = updateFileInput;
		
		});
		
	// 	Conditional form fieldsets
	
		forEach(host.querySelectorAll('.checkbox.condition input'), function(el, i) {
			
			el.onchange = toggleConditionalFieldset;
		
		});
		
		// Auto textarea height.
		
		forEach(host.querySelectorAll('textarea[data-auto]'), function(el) {
		
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
	
	};
	registerComponent('form', selector, init);

})();

// Component Form – end
;// Component Nav – start

(function (){
    
/* Nav – start */

function closeDropNavClickedOutside(e) { // Close the nav when clicking outside

	if (!closest(e.target, 'nav li')) {

		forEach ('nav ul', function (el) {
			
			el.removeAttribute(aria_expanded);
			
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

			el.removeAttribute(aria_expanded);
			
		});
		return;
		
	}
	// Close neighboring parent nav's sub navs.
	var el = e.target;
	var target_parent = closest(el, '[aria-haspopup]');
	if (target_parent) { // Skip if it's a top-level-only item
		
		forEach(target_parent.querySelectorAll('ul[aria-expanded]'), function (el) { // Disable active grandchildren
	
			el.removeAttribute(aria_expanded);
	
		});
	
	}

	el = e.target.parentNode;
	if (!el.nextElementSibling && // last item
		el.parentNode.parentNode.nodeName === 'LI' && // of third-level nav
		!el.parentNode.parentNode.nextElementSibling) {
			
			el.parentNode.parentNode.parentNode.removeAttribute(aria_expanded);
	
	}
	
}
		
function dropNavFocus(e) {

	// Close focused third level child when focus moves to another top-level item
	
	var el = closest(e.target, 'nav > ul > li');
	
	forEach(el.parentNode.childNodes, function (a) {

		if (a.nodeName === 'LI' && a !== el) {
		
			forEach(a.querySelectorAll('[aria-expanded]'), function (el) {
				
				el.removeAttribute(aria_expanded);
				
			});
		
		}
		
	});
	
	el = e.target;

	el.parentNode.parentNode.setAttribute(aria_expanded, true);
	if (el.parentNode.querySelector('ul')) {

		el.parentNode.querySelector('ul').setAttribute(aria_expanded, 'true');

	}
	
	var current_item = e.target.parentNode;

	forEach(current_item.parentNode.parentNode.childNodes, function (el) {

		if (el !== current_item && el.nodeName === 'LI' && el.querySelector('ul')) {

			el.querySelector('ul').removeAttribute(aria_expanded);
		
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
				
				el.removeAttribute(aria_expanded);
				
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
	
/* Nav – end */

	var selector = 'nav';
	var init = function (host) {
		
		forEach(host.querySelectorAll('nav:not([data-ready]) > ul:not([role])'), function (el) {
			
			initNav(el);
			makeReady(el);
			
		});

	};
	registerComponent('nav', selector, init);

})();

// Component Nav – end
;// Component Table – start

(function (){
    
/* Sort parent table's rows by matching column number alternatively desc/asc on click */
	function sortTable(table, column, f) {

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

// 	observerOff();

    for (var i = 0; i < rows.length; i++) {

        table.querySelector('tbody').appendChild(rows[i]);

    }
    
// 	observerOn();

}

	var selector = 'table';
	var init = function (host) {
		
		forEach(host.querySelectorAll('table:not([data-ready])'), function(el) {
		
			addClass(wrap(el), 'n-tbl');
			makeReady(el);
			el.parentNode.setAttribute('tabindex', 0);
		
		});
	
		if (typeof q('body').dataset !== 'undefined') { // el.dataset.sort not supported by IE10
		
			forEach(host.querySelectorAll('td[data-sort]'), function (el) { // To do: work only on tables that aren't ready
				// asc or desc
				if (el.dataset.sort !== 'asc' && el.dataset.sort !== 'desc') {
					
					el.dataset.sort = 'asc';
					
				}
				
				function sortTableEvent (e) {
					
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
					
				}
				
				el.onclick = el.ontouchend = sortTableEvent;
			
			});
		
		}
	
	};
	registerComponent('table', selector, init);

})();

// Component Table – end
;// Component Tooltip – start

(function (){
    
	var selector = '.tool';
	var init = function (host) {
		
		/* Tooltip */
		
		forEach(host.querySelectorAll('.tool'), function(el, i) {
			
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
		
	};
	registerComponent('tooltip', selector, init);

})();

// Component Fold – end
return { initComponents: initComponents, animate: animate, copyButton: copyButton, openFullWindow: openFullWindow, closeFullWindow: closeFullWindow, notify: notify, addComponent: addComponent }; })();