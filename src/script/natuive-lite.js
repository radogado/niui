var nui = (() => {/* natUIve by rado.bg */
/* DOM functions via http://youmightnotneedjquery.com */

// To do: translate to ES6, as the packager adds a check to skip the below when ES6 unavailable and optionally server Babel-transpiled version using the extra footer script

var bodyElement = document.body;

if (typeof window['chrome'] !== 'undefined') {
	
	document.body.setAttribute('data-chrome', 'true');

}

document.body.setAttribute('data-natuive-js', 'true');

var is_iPad = !!navigator.platform.match(/iPad/);

var aria_expanded = 'aria-expanded';

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

/*
function forEach(selector, fn) { // Because IE11 doesn't support el.forEach(). Accepts both an array and a selector
	
    var elements = (typeof selector === 'string') ? qa(selector) : selector;

	if (elements.length > 0) {

	    for (var i = 0; i < elements.length; i++) {
	
	        fn(elements[i], i);
	
	    }
    
    }

}
*/

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

/*
function ready(fn) { // Not working with async and defer

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
*/

function removeHash() {

    history.pushState("", document.title, window.location.pathname + window.location.search);

}

/* ––– */

function getURLParameters() { // return all URL parameters in an array

    var res = {};
    var re = /[?&]([^?&]+)=([^?&]+)/g;

    location.href.replace(re, (_, k, v) => {

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

/*
function animateAnchors(e) {

    if (typeof e === 'undefined' || q('html').clientHeight > document.body.clientHeight) {

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

    scrollToAnimated((hash === null) ? 0 : getCumulativeOffset(hash).y, .5, (e) => { // To do: fix jumping to new hash – is the fallback executed properly in animate()?

        window.location = el.href.split('#')[0] + '#' + el.href.split('#').pop();

    });

    return false;

}
*/

function closestElement(el, target) { // Thanks http://gomakethings.com/ditching-jquery/ – Accepts either a selector string or an actual element

    for ( ; el && el !== document; el = el.parentNode ) {

		if (el === target) {
			
			return el;

		}

    }

    return false;

}

// Add .n-target to the :target element now, because :target is available too late, after all page content is loaded

let setHashClass = () => {
	
	if (q('.n-target')) {
	
		removeClass(q('.n-target'), 'n-target');
	
	}

	if (!!location.hash && q(location.hash)) {
		
		addClass(q(location.hash), 'n-target');
		
	}

}

setHashClass();

window.addEventListener('hashchange', setHashClass);

/* Chainable animation specified as CSS Animation */

var temp = document.createElement('temp');

var animations = {

	'animation'      	: 'animationend',
	'MozAnimation'   	: 'animationend',
	'WebkitAnimation'	: 'webkitAnimationEnd'

};

var animationEndEvent = false;

for(var t in animations) {

    if (temp.style[t] !== 'undefined') {

        animationEndEvent = animations[t];

    }

}

function animate(el, animation_code, duration, callback) { // Default duration = .2s, callback optional

// To do: add animation-fill-mode: forwards to keep the end state

	if (!el.getAttribute('data-animation') && animationEndEvent) {

		el.addEventListener(animationEndEvent, function animationEndHandler(e) {
			
			stopEvent(e);
			var el = e.target; 
			document.head.removeChild(q('.' + el.getAttribute('data-animation')));
			el.removeAttribute('data-animation');
	 		el.removeEventListener(animationEndEvent, animationEndHandler);
			if (typeof callback === 'function') {
		
				callback();
		
			}
		
		}, false);

// 		var animation_name = 'a' + new Date().getTime(); // Unique animation name
		var animation_name = `a${Math.round((Math.random()*1000000),10)}`; // Unique animation name
/*
		if (q('head .' + animation_name)) {
			
			animation_name += '-';
			
		}
*/
		var styles = document.createElement('style');
		styles.innerHTML = `@keyframes ${animation_name} {${animation_code}} [data-animation=${animation_name}] { animation-name: ${animation_name}; animation-duration: ${((typeof duration === "undefined") ? .2 : duration)}s; }`; // Where animation format is 		0% { opacity: 1 } 100% { opacity: 0 }
		document.head.appendChild(styles);
		addClass(styles, animation_name);

// 		el.dataset.animation = animation_name;
		el.setAttribute('data-animation', animation_name);
	
	}
	
}

// Scroll the page to any position

function scrollToAnimated(to, duration, callback) {
	
	var difference = bodyElement.clientHeight - window.innerHeight;
	if (to > difference) {

		to = difference;

	}
	
	function scrollToCallback (callback) {

		q('html').scrollTop = bodyElement.scrollTop = to;
		if (typeof callback === 'function') {
			
			callback();
		
		}
		
	}
	
	animate(q('html'), `100% { transform: translate3d(0, ${-1*(to - (document.documentElement.scrollTop || bodyElement.scrollTop))}px, 0); }`, duration, scrollToCallback.bind(null, callback));

}

// Clicking a button copies a target element's contents

function copyButton (el, target, echo) {
	
	el.addEventListener('click', (event) => {

	  window.getSelection().removeAllRanges(); // Clear previous clipboard
	  var range = document.createRange();  
	  range.selectNode(target);  
	  window.getSelection().addRange(range);
	
	  try {  

		  document.execCommand('copy');
		  
		  if (typeof echo !== 'undefined' && componentNotify) {
	
			  componentNotify.notify('📋 ' + target.textContent, 'fixed timeout');
		  
		  }

	  } catch(err) {

	  }  
	
	});
	
}

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

        isTouchTimer = setTimeout(() => {isTouch = false}, 500); //maintain "istouch" state for 500ms so removetouchclass doesn't get fired immediately following a touch event

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

function focusWithin(selector) {

	// To do: If not IE/Edge, return q(selector + ':focus-within');

	var result = null;
	qa(selector).forEach((el) => {
		
		if (el.querySelector(':focus')) {
			
			result = el;

		}
		
	});
	
	return result;
	
}

function addComponent(host, el) {
	
	host.insertAdjacentHTML('afterbegin', el);
// 	initComponents(host); // No need, observer does it automatically

}

function initThreshold(host) {

// Scroll effects
	host.querySelectorAll('[data-threshold]:not([data-ready])').forEach((el) => { // Set a variable reflecting how much of the element's height has been scrolled; .threshold on scroll over element height
	
		window.addEventListener('scroll', () => {
	
			setTimeout(() => {
				
				var relativeScroll = q('html').scrollTop || bodyElement.scrollTop;
//				q('html').style.setProperty('--scroll-top', relativeScroll);
//				q('html').style.setProperty('--scroll-bottom', q('html').scrollHeight - relativeScroll - q('html').offsetHeight);
//				q('html').style.setProperty('--page-height', q('html').scrollHeight);
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
					bodyElement.setAttribute('data-threshold', true);
					
				} else {
					
					removeClass(el, 'threshold');
					removeClass(bodyElement, 'threshold');
					bodyElement.removeAttribute('data-threshold');
					
				}
				
			}, 50);
			
		});
		makeReady(el);
	
	});

}

var current_slider = q('.slider');
var draggingNow = false;

var components = new Array;

function registerComponent(name, init) {

	components[name] = new Array;
	components[name].push({ init: init });

}

function initComponents(host) {

	observerOff();
	
	var _host = typeof host === 'undefined' ? bodyElement : host;

	for (var key in components) {
	
	    components[key][0].init(_host);
	
	}

	observerOn();

}
  
var observer = false;

function observerOn() {
	
	if (observer) {
		
		observer.observe(bodyElement, {childList: true, subtree: true});

	}
	
}

function observerOff() {

	if (observer) {
		
		observer.disconnect();
		
	}
	
}

if (typeof MutationObserver === 'function') {

	observer = new MutationObserver((mutations, observer) => {

        observerOff();

		var mutation = mutations[0];
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {

			var i = 0;
			while (i < mutation.addedNodes.length) {
				
				var el = mutation.addedNodes[i++];
	            if (typeof el === 'object' && el.nodeName !== '#text' && !el.getAttribute('data-ready') && el.parentNode) {
		            
		            initComponents(el.parentNode);
		            
	            }
				
			}

        }

        observerOn();
	    
	});
	
}

initThreshold(bodyElement);

// Animate anchor link jumps
/*
qa('a[href^="#"]').forEach((el) => {

	el.onclick = el.onclick || animateAnchors; // Don't add to previous onclick event handler

});
*/
	
/*
	notifyCloseEvent();

	window.addEventListener('touchstart', function (e) {
		
		draggingNow = false;
		
	});

	window.addEventListener('touchmove', function (e) {
		
		draggingNow = true;
		
	});
*/
;// Component Form – start

(function (){
    
/* Form – start */

	function submitForm(e) {
	
	    var el = e.target;
	
	    var ready_to_submit = true;
	
	    el.querySelectorAll('.n-form--mandatory').forEach((el) => {
		    
		    if (el.closest('[disabled]')) { // Ignore disabled conditional fields
			    
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
	            addClass(el, 'n-form--alert');
// 				animate(el.closest('form'), '33% { transform: translateX(-9px) } 66% { transform: translateX(9px) } 100% { transform: translateX(0) } ', 999);
				// Margin animation, because transform animation hides neighbouring content on iPad
				let form = el.closest('form');
				animate(form, `0% { width: ${form.scrollWidth}px; } 33% { margin-left: -9px; } 66% { margin-left: 18px; } 100% { width: ${form.scrollWidth}px; margin-left: 0; }`, .25);
	            return;
	
	        } else {
	
	            removeClass(el, 'n-form--alert');
	
	        }
	
	    });
	
	    return ready_to_submit;
	
	}
	
	function updateFileInput(e) {
	
	    var el = e.target;
	
	    el.parentNode.querySelector('span.n-form--file-name').innerHTML = el.value.substring(el.value.lastIndexOf('\\') + 1);
	
	}
	
	if (q('.n-form--language')) { // To do: make it universal .submitonchange and for more than 1 form
	
	    q('.n-form--language select').onchange = (e) => {
	
	        q('.n-form--language').submit();
	
	    };
	
	}
	
	function toggleConditionalFieldset(e) {
		
		var el = e.target;
		var fieldset = el.closest('.n-form--condition').nextElementSibling;
		var attribute = 'disabled';
		
		if (el.checked) {
		
			fieldset.removeAttribute(attribute);
		
		} else {
			
			fieldset.setAttribute(attribute, 'disabled');
			
		}
		
	}

/* Form – end */

	var init = (host) => {
		
		host.querySelectorAll('form.n-form').forEach((el, i) => {
		
		    el.onsubmit = el.onsubmit || submitForm;
		
			el.querySelectorAll('input[type=file]').forEach((el, i) => {
			
			    el.onchange = updateFileInput;
			    el.parentNode.querySelector('span').insertAdjacentHTML('afterbegin', '<span class=n-form--file-name></span>')
			
			});
			
		// 	Conditional form fieldsets
		
			el.querySelectorAll('.n-form--check.n-form--condition input').forEach((el, i) => {
				
				el.onchange = toggleConditionalFieldset;
			
			});
			
			// Auto textarea height.
			
			el.querySelectorAll('textarea[data-auto]').forEach((el) => {
			
			    el.onkeyup = (e) => {
			
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

		    makeReady(el);
		
		});
	
	};

	registerComponent('form', init);

})();

// Component Form – end
;// Component Nav – start

(function (){
    
/* Nav – start */

	function closeDropNavClickedOutside(e) { // Close the nav when clicking outside
	
		if (!e.target.closest('.n-nav li')) {
	
			qa('.n-nav li').forEach((el) => {
				
				el.removeAttribute(aria_expanded);
				
			});
			
			if (q('.n-nav :focus')) {
	
				q('.n-nav :focus').blur();
			
			}
			
		}
		
	}
	
	function isDesktop(item) { // Checks the UL sub nav element
		
		return getComputedStyle(item).getPropertyValue('position') === 'absolute';
		
	}
	
	function dropNavBlur(e) {
	
		e.stopPropagation();

		var this_nav = e.target.closest('.n-nav');
		
		let el = e.target;
		let item = el.tagName === 'LI' ? el.querySelector('ul') : el.parentElement.querySelector('ul');

		if (item && isDesktop(item) && !closestElement(e.relatedTarget, this_nav)) {
			// if e.relatedTarget is not a child of this_nav, then the next focused item is elsewhere
			this_nav.querySelectorAll('li').forEach((el) => {
	
				el.removeAttribute(aria_expanded);
				
			});
			return;
				
		}

		// Close neighboring parent nav's sub navs.
		el = e.target;
		var target_parent = el.closest('[aria-haspopup]');
		if (target_parent) { // Skip if it's a top-level-only item
			
			target_parent.querySelectorAll('li[aria-expanded]').forEach((el) => { // Disable active grandchildren
		
				el.removeAttribute(aria_expanded);
		
			});
		
		}
	
		el = e.target.parentNode;
		if (!el.nextElementSibling && // last item
			el.parentNode.parentNode.nodeName === 'LI' && // of third-level nav
			!el.parentNode.parentNode.nextElementSibling) {
				
				el.parentNode.parentNode.removeAttribute(aria_expanded);
		
		}
		
	}
			
	function dropNavFocus(e) {

		// Close focused third level child when focus moves to another top-level item
		
		e.stopPropagation();
		
		var el = e.target.closest('.n-nav > ul > li');
// To do: on LI focus, make it aria-expanded and focus its a		
		
		[[].slice.call(el.parentElement.children), [].slice.call(e.target.parentElement.parentElement.children), [].slice.call(e.target.parentElement.parentElement.parentElement.parentElement.children) ].forEach((el) => {
			
			el.forEach((el) => {
				
				el.removeAttribute('aria-expanded');
				
			})
			
			
		});

		el.setAttribute('aria-expanded', true);
// 		openItem(el.querySelector('ul'));
		
		if (el.parentNode.parentNode.getAttribute('aria-haspopup')) {
			
			el.parentNode.parentNode.setAttribute('aria-expanded', true);
			
		}
		
		// Make current focused item's ancestors visible
		
		el = e.target;
	
		el.parentNode.setAttribute(aria_expanded, true);
		var grand_parent = el.parentElement.parentElement.parentElement;
		if (grand_parent.tagName === 'LI') {
	
			grand_parent.setAttribute(aria_expanded, true);
	
		}
		
	}
	
	var closeDropNavClickedOutsideEnabled = false;

	let closeItem = (item) => {
	
		item.style.overflow = 'hidden';
		item.parentElement.setAttribute('aria-expanded', true);

		animate(item, `0% { height: ${item.scrollHeight}px; } 100% { height: 0 }`, .2, () => { 
		
			item.removeAttribute('style'); 
			item.parentElement.removeAttribute('aria-expanded');
		
		});
					
	}
	
	let openItem = (item) => {
		
		item.style.overflow = 'hidden';
		item.parentElement.setAttribute('aria-expanded', true);
		animate(item, `0% { height: 0; } 100% { height: ${item.scrollHeight}px }`, .2, () => { 

			item.removeAttribute('style'); 

		});

	}

/*
	let tapEvent = (e) => { // Using clickEvent instead

		e.stopPropagation();

		var el = e.target;

		if (draggingNow || (typeof el.href === 'string' && el.href.length > 0)) {
			
			return;
			
		}
		
		e.preventDefault();
		
		if (el.nodeName === 'LI') {
			
			el = el.querySelector('a');
			
		}
		
		if (el === document.activeElement) { // Tapping on a focused element

			el.blur();
			
			let parent_item = el.parentElement.parentElement.closest('li[aria-haspopup]');
			if (parent_item) {
				
				parent_item.querySelector('a').focus();
				
			}

		} else {

			if (el.parentElement.getAttribute('aria-expanded')) { // Click on an open element which isn't in focus
				
				let item = el.tagName === 'LI' ? el.querySelector('ul') : el.parentElement.querySelector('ul');

				if (isDesktop(item)) {

					el.parentElement.removeAttribute('aria-expanded');
					document.activeElement.blur();
					el.querySelectorAll('[aria-expanded]').forEach((item) => {
						
						item.removeAttribute('aria-expanded');
						
					});

				} else {
					
					closeItem(item);

				}
				
			} else {
				
				// Opening an item should close its open siblings
				[].slice.call(el.parentElement.parentElement.children).forEach((item) => {
					
					item.removeAttribute('aria-expanded');
					if (item !== el.parentElement) {
						
						let old_item_open_child = item.querySelector('[aria-expanded]');
						if (old_item_open_child) {
							
// 							old_item_open_child.removeAttribute('aria-expanded');
							openItem(old_item_open_child.querySelector('ul'));


						}
						
					}
					
					
				});

				if (hasClass(q('html'), 'can-touch') && typeof e.target.href === 'string' && e.target.href.length > 0) { // Clickable links

					return;

				}

				let item = el.tagName === 'LI' ? el.querySelector('ul') : el.parentElement.querySelector('ul');
				if (isDesktop(item)) {

					el.focus();
					el.parentElement.setAttribute('aria-expanded', true);

				} else {
					
					openItem(item);
					
				}

			}
		
		}
			
	};
*/

	let clickEvent = (e) => {
	
		e.stopPropagation();
		// To do: also ancestors, also close when open
		let el = e.target;

		let item = el.tagName === 'LI' ? el.querySelector('ul') : el.parentElement.querySelector('ul');
		if (isDesktop(item)) {

			if (el.getAttribute('aria-expanded')) {
				
				if (el.querySelector('a:focus')) {
					
// 						el.querySelector('a:focus').blur();
					
				} else {

					if (isDesktop(item)) {
	
						el.removeAttribute('aria-expanded');
					
					} else {
						
						closeItem(item);
												
					}

				}
				
			} else {
				
				[].slice.call(el.parentElement.children).forEach((item) => {
					
					item.removeAttribute('aria-expanded');
					let old_item_open_child = item.querySelector('[aria-expanded]');
					if (old_item_open_child) {
						
						old_item_open_child.removeAttribute('aria-expanded');

					}
				
				});

				el.setAttribute('aria-expanded', true);

				if (!isDesktop(item)) {
					
					openItem(item);
					
				}
			
			}

		} else {

			item.style.overflow = 'hidden';
			
			if (item.parentNode.hasAttribute('aria-expanded')) {
				
				closeItem(item);				
				
			} else {
				
				// If new item is top level, close another top level item, if any is open
				
				if (item.parentElement.parentElement.matches('[role=menubar]')) { // It's top level
					
					let old_item = item.closest('[role=menubar]').querySelector('[aria-expanded="true"] > ul');
					
					if (old_item) {
						
						closeItem(old_item);
											
					}
					
				}
				
				openItem(item);
				
			}

		}
		
	};

	function initNav(el) {
		
		// Delete all trigger inputs, add tabindex=0 to each li
		
		el.querySelectorAll('input').forEach((el) => {
			
			el.outerHTML = '';
			
		});
		
		el.setAttribute('role', 'menubar');
	
		el.querySelectorAll('li > a').forEach((el) => {
			
			el.setAttribute('tabindex', 0);
	
		});
	
		if (!el.closest('.n-nav.n-drop')) { // The rest is for drop nav only
			
			return;
	
		}
	
		if (!closeDropNavClickedOutsideEnabled) {
			
			window.addEventListener('touchend', closeDropNavClickedOutside);
			closeDropNavClickedOutsideEnabled = true;
		
		}
		
		el.addEventListener('keyup', (e) => {
			
			// Check for sibling or children to expand on control keys Left/Right/etc
		
			if (e.key === 'Escape') {
				
				e.target.closest('.n-nav').querySelectorAll('li').forEach((el) => {
					
					el.removeAttribute(aria_expanded);
					
				});
				
				document.activeElement.blur();
				
			}
			
		});
		
		el.querySelectorAll('li').forEach((el) => {
			
			if (el.querySelector('ul')) {
		
				el.setAttribute('aria-haspopup', true);
				if (el.children[0].nodeName === 'UL') {

					el.insertBefore(el.children[1], el.children[0]); // Swap 'a' with 'ul'

				}
			
			}
		
		});
	
		el.addEventListener('touchend', clickEvent);
		el.addEventListener('mousedown', clickEvent);
		el.addEventListener('focusin', dropNavFocus);
		el.addEventListener('focusout', dropNavBlur);
			
		draggingNow = false;
	
	}
	
/* Nav – end */

	var init = (host) => {
		
		host.querySelectorAll('.n-nav:not([data-ready]) > ul:not([role])').forEach((el) => {
			
			initNav(el);
			makeReady(el.closest('.n-nav'));
			
		});

	};
	registerComponent('nav', init);

})();

// Component Nav – end
;// Component Table – start

(function (){
    
/* Sort parent table's rows by matching column number alternatively desc/asc on click */
	function sortTable(table, column, f) {

		var rows = Array.prototype.slice.call(table.querySelectorAll('tbody tr'), 0);;
		
		rows.sort((a, b) => {
		
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

	var init = (host) => {
		
		host.querySelectorAll('.n-table:not([data-ready])').forEach((el) => {
		
			addClass(wrap(el), 'n-table--wrap');
			makeReady(el);
			el.parentNode.setAttribute('tabindex', 0);
		
		});
	
		if (typeof bodyElement.dataset !== 'undefined') { // el.dataset.sort not supported by IE10
		
			host.querySelectorAll('td[data-sort]').forEach((el) => { // To do: work only on tables that aren't ready
				// asc or desc
				if (el.dataset.sort !== 'asc' && el.dataset.sort !== 'desc') {
					
					el.dataset.sort = 'desc';
					
				}
				
				function sortTableEvent(e) {
					
					stopEvent(e);
					var el = e.target;
					var cell = el.type === 'td' ? el : el.closest('td');
					var f; // Ascending
					if (cell.dataset.sort === 'desc') {
						
						f = -1;
						cell.dataset.sort = 'asc';
						
					} else {
						
						f = 1;
						cell.dataset.sort = 'desc';
						
					}
			
					sortTable(el.closest('table'), thisIndex(cell), f);
					
				}
				
				el.onclick = el.ontouchend = sortTableEvent;
			
			});
		
		}
	
	};
	registerComponent('table', init);

})();

// Component Table – end
;// Component Tooltip – start

(function (){
    
	var init = (host) => {
		
		/* Tooltip */
		
		host.querySelectorAll('.n-tool:not([data-ready])').forEach((el, i) => {
			
			el.onclick = (e) => {
	
				toggleAttribute(e.target.closest('.n-tool'), aria_expanded);
	
			};		
		
		    var t = el.querySelector('.n-tool--tip');
		    if (!t) return;
		
		    el.style.position = 'static'; // dangerous with absolutely-positioned containers, which should be avoided anyway
		    el.parentNode.style.position = 'relative'; // dangerous with absolutely-positioned containers, which should be avoided anyway
	/*
		    t.style.top = (t.parentNode.offsetTop + t.parentNode.offsetHeight) + 'px';
		    t.style.width = '100%';
	*/
	
			var label = el.querySelector('.n-tool--label');
			if (label) {
				
				label.setAttribute('tabindex', 0);
				label.onkeyup = (e) => {
					
					if (e.key === 'Enter') {
						
						toggleAttribute(e.target.closest('.n-tool'), aria_expanded);
	
					}
					
				}
	
				label.onblur = (e) => {
					
					e.target.closest('.n-tool').removeAttribute(aria_expanded);
	
				}
	
			}
			makeReady(el);
		
		});
		
	};
	registerComponent('tooltip', init);

})();

// Component Fold – end
initComponents(); return { initComponents, animate, copyButton, addComponent } })()