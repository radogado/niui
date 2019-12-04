window.nui = (() => {/* natUIve by rado.bg */
/* DOM functions via http://youmightnotneedjquery.com */

var bodyElement = document.body;

if (!!window['chrome']) {
	
	document.body.setAttribute('data-chrome', 'true');

}

if (navigator.userAgent.match(/Safari/) && !navigator.userAgent.match(/Chrome/)) {
	
	document.body.setAttribute('data-safari', 'true');
	
}

document.body.setAttribute('data-natuive-js', 'true');

var is_iPad = !!navigator.platform.match(/iPad/);

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

        if (!window.event) {

            return;

        }

    }

	if (!e) {
		
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

/*
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
*/

	return [...el.parentNode.children].indexOf(el);

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
	            if (!!hash) {
		            
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

    if (!e || q('html').clientHeight > document.body.clientHeight) {

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
		styles.innerHTML = `@keyframes ${animation_name} {${animation_code}} [data-animation=${animation_name}] { animation-name: ${animation_name}; animation-duration: ${(!duration ? .2 : duration)}s; }`; // Where animation format is 		0% { opacity: 1 } 100% { opacity: 0 }
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
		  
		  if (!!echo && componentNotify) {
	
			  componentNotify.notify('📋 ' + target.textContent, 'fixed timeout');
		  
		  }

	  } catch(err) {

	  }  
	
	});
	
}

// Real time touch detection to support devices with both touch and mouse. http://www.javascriptkit.com/dhtmltutors/sticky-hover-issue-solutions.shtml
// To do: use an attribute instead of class
;(function(){

    var isTouch = false; //var to indicate current input type (is touch versus no touch) 
    var isTouchTimer;
     
    let addtouchclass = e => {

        clearTimeout(isTouchTimer);
        isTouch = true;
		addClass(q('html'), 'can-touch');

        isTouchTimer = setTimeout(() => {isTouch = false}, 500); //maintain "istouch" state for 500ms so removetouchclass doesn't get fired immediately following a touch event

    };
     
    let removetouchclass = e => {

        if (!isTouch){ //remove 'can-touch' class if not triggered by a touch event and class is present

            isTouch = false;
            removeClass(q('html'), 'can-touch');

        }

    };
     
    document.addEventListener('mouseover', removetouchclass, false); //this event gets called when input type is everything from touch to mouse/ trackpad
    document.addEventListener('touchstart', addtouchclass, false); //this event only gets called when input type is touch
    
    addtouchclass();

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
	
	var _host = !host ? bodyElement : host;

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
qa('a[href^="#"]').forEach((el) => {

	el.onclick = el.onclick || animateAnchors; // Don't add to previous onclick event handler

});
	
/*
	notifyCloseEvent();

	window.addEventListener('touchstart', function (e) {
		
		draggingNow = false;
		
	});

	window.addEventListener('touchmove', function (e) {
		
		draggingNow = true;
		
	});
*/

// Viewport element for iOS

if (navigator.userAgent.match(/(iPod|iPhone|iPad)/i)) {

	let adjustViewport = () => {
		
		document.querySelectorAll('.n-viewport').forEach(el => {
	
			el.style.height = '100vh';
			el.style.marginTop = 0;
	// 		console.log('Element: ' + el.offsetHeight, 'Window: ' + window.innerHeight);
	
			if (el.offsetHeight > window.innerHeight) {
				
				el.style.height = `calc(100vh - ${el.offsetHeight - window.innerHeight}*1px)`;
				
			}
			
			if (el.getBoundingClientRect().y < 0) {
				
				el.style.marginTop = `${Math.abs(el.getBoundingClientRect().y)}px`;
				
			}
			
		});
		
	};
	
	adjustViewport();
	
	window.addEventListener('resize', e => {
		
		adjustViewport();
		setTimeout(adjustViewport, 200);
		
	});

}
;// Component Form – start

(function (){
    
/* Form – start */

	function submitForm(e) {
	
	    var el = e.target;
	
	    var ready_to_submit = true;
	
	    el.querySelectorAll('.n-form__mandatory').forEach((el) => {
		    
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
	
	if (q('.n-form__language')) { // To do: make it universal .submitonchange and for more than 1 form
	
	    q('.n-form__language select').onchange = (e) => {
	
	        q('.n-form__language').submit();
	
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

	let init = host => {
		
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
	
			qa('.n-nav li').forEach(el => {
				
				el.removeAttribute('aria-expanded');
				
			});
			
			if (q('.n-nav :focus')) {
	
				q('.n-nav :focus').blur();
			
			}
			
		}
		
	}
	
	function isDesktop(nav) { // Checks the UL sub nav element
		
		return !!getComputedStyle(nav).getPropertyValue('--desktop');
		
	}
	
	let navAnimating = false;

	function dropNavBlur(e) {
	
		var this_nav = e.target.closest('.n-nav');
		
		if (navAnimating || !e.relatedTarget) {
			
			return;
			
		}

		e.stopPropagation();

		let el = e.target;
		let item = el.tagName === 'LI' ? el.querySelector('ul') : el.parentElement.querySelector('ul');
		
		if (!this_nav.contains(e.relatedTarget) || isDesktop(this_nav) && !!e.relatedTarget && !closestElement(e.relatedTarget, this_nav)) {
			// if e.relatedTarget is not a child of this_nav, then the next focused item is elsewhere
			this_nav.querySelectorAll('li').forEach(el => {
	
				el.removeAttribute('aria-expanded');
				
			});
			return;
				
		}

		if (item) {
			
			if (item.parentNode.parentNode.querySelector('ul [aria-expanded]')) { // To do: Unless it's the first/last item and user has back/forward tabbed away from it?
	
				return;
	
			}
	
			item.parentElement.removeAttribute('aria-expanded');
	
		}
		
		// Close neighboring parent nav's sub navs.
		el = e.target;
		var target_parent = el.closest('[aria-haspopup]');
		if (target_parent) { // Skip if it's a top-level-only item
			
			target_parent.querySelectorAll('li[aria-expanded]').forEach(el => { // Disable active grandchildren
		
				el.removeAttribute('aria-expanded');
		
			});
		
		}
	
		el = e.target.parentNode;
		if (!el.nextElementSibling && // last item
			el.parentNode.parentNode.nodeName === 'LI' && // of third-level nav
			!el.parentNode.parentNode.nextElementSibling) {
				
				el.parentNode.parentNode.removeAttribute('aria-expanded');
		
		}
		
	}
			
	function dropNavFocus(e) {

		// Close focused third level child when focus moves to another top-level item
		
		e.stopPropagation();
		
		var el = e.target.closest('.n-nav > ul > li');
// To do: on LI focus, make it aria-expanded and focus its a		
		
		if (navAnimating) {
			
			return;
			
		}

		[[].slice.call(el.parentElement.children), [].slice.call(e.target.parentElement.parentElement.children), [].slice.call(e.target.parentElement.parentElement.parentElement.parentElement.children) ].forEach(el => {
			
			el.forEach(el => {
				
				el.removeAttribute('aria-expanded');
				
			})
			
			
		});

		el.setAttribute('aria-expanded', true);
// 		openItem(el.querySelector('ul'));
		
		if (el.parentNode.parentNode.getAttribute('aria-haspopup')) {
			
			el.parentNode.parentNode.setAttribute('aria-expanded', true);
			
		}
		
		el.querySelectorAll('li[aria-expanded]').forEach(el => { // Hide grandchildren
			
			el.removeAttribute('aria-expanded');
			
		});
			
		// Make current focused item's ancestors visible
		
		el = e.target;
	
		el.parentNode.setAttribute('aria-expanded', true);
		var grand_parent = el.parentElement.parentElement.parentElement;
		if (grand_parent.tagName === 'LI') {
	
			grand_parent.setAttribute('aria-expanded', true);
	
		}
		
	}
	
	var closeDropNavClickedOutsideEnabled = false;

	let closeItem = item => {
	
		navAnimating = true;
		item.style.overflow = 'hidden';
		item.parentElement.setAttribute('aria-expanded', true);

		animate(item, `0% { height: ${item.scrollHeight}px; } 100% { height: 0 }`, .2, () => { 
		
			item.removeAttribute('style'); 
			item.parentElement.removeAttribute('aria-expanded');
			navAnimating = false;
			
			item.querySelectorAll('[aria-expanded]').forEach(el => {
				
				el.removeAttribute('aria-expanded');
				
			});
		
		});
					
	}
	
	let openItem = item => {
		
		navAnimating = true;
		item.style.overflow = 'hidden';
		item.parentElement.setAttribute('aria-expanded', true);
		animate(item, `0% { height: 0; } 100% { height: ${item.scrollHeight}px }`, .2, () => { 

			item.removeAttribute('style'); 
			navAnimating = false;

		});

	}

	let clickEvent = e => {
	
		e.stopPropagation();
		// To do: also ancestors, also close when open
		let el = e.target;
		var this_nav = el.closest('.n-nav');

		this_nav.removeEventListener('focusout', dropNavBlur);
		if (this_nav.contains(document.activeElement)) {
			
			document.activeElement.blur();
			
		}

		let item = el.tagName === 'LI' ? el.querySelector('ul') : el.parentElement.querySelector('ul');
		if (isDesktop(this_nav)) {

			if (el.getAttribute('aria-expanded')) {
				
				if (el.querySelector('a:focus')) {
					
// 						el.querySelector('a:focus').blur();
					
				} else {

					if (isDesktop(this_nav)) {
	
						el.removeAttribute('aria-expanded');
					
					} else {
						
						closeItem(item);
												
					}

				}
				
			} else {
				
				[].slice.call(el.parentElement.children).forEach(item => {
					
					item.removeAttribute('aria-expanded');
					let old_item_open_child = item.querySelector('[aria-expanded]');
					if (old_item_open_child) {
						
						old_item_open_child.removeAttribute('aria-expanded');

					}
				
				});

				el.setAttribute('aria-expanded', true);

				if (!isDesktop(this_nav)) {
					
					openItem(item);
					
				}
			
			}

		} else {

			if (item.parentNode.hasAttribute('aria-expanded')) {
				
				closeItem(item);				
				
			} else {
				
				// If new item is top level, close another top level item, if any is open
				
				if (item.parentElement.parentElement.matches('ul')) { // It's top level, To do: also on secondary level, close open sibling
					
					let old_item = item.parentElement.closest('ul').querySelector('[aria-expanded="true"] > ul');
					
					if (old_item) {
						
						closeItem(old_item);
											
					}
					
				}
				
				openItem(item);
				
			}

		}
		
		this_nav.addEventListener('focusout', dropNavBlur);

	};

	function checkSides(ul, menubar) {
	
		removeClass(ul, 'n-right-overflow');
		ul.style.removeProperty('--n-right-overflow');

//		var rect = ul.getBoundingClientRect(); // Firefox doesn't preserve this var
		
		if (ul.getBoundingClientRect().left > document.body.offsetWidth - (ul.getBoundingClientRect().left + ul.getBoundingClientRect().width)) {
			
			if (ul.getBoundingClientRect().right > window.innerWidth) {
				
				ul.style.setProperty('--n-right-overflow', (window.innerWidth - ul.getBoundingClientRect().right) + 'px');
				addClass(ul, 'n-right-overflow');
				
			}
	
			addClass(ul, 'n-left-side');
			
		} else {
			
			removeClass(ul, 'n-left-side');
			
		}
		
	}

	function initNav(el) {
		
		// Delete all trigger inputs, add tabindex=0 to each li
		
		el.querySelectorAll('input').forEach(el => {
			
			el.outerHTML = '';
			
		});
		
		el.setAttribute('role', 'menubar');
	
		el.querySelectorAll('li > a').forEach(el => {
			
			el.setAttribute('tabindex', 0);
	
		});
	
		if (!el.closest('.n-nav.n-nav__drop')) { // The rest is for drop nav only
			
			return;
	
		}
	
		if (!closeDropNavClickedOutsideEnabled) {
			
			window.addEventListener('touchend', closeDropNavClickedOutside);
			window.addEventListener('mouseup', closeDropNavClickedOutside);
			closeDropNavClickedOutsideEnabled = true;
		
		}
		
		el.addEventListener('keyup', e => {
			
			// Check for sibling or children to expand on control keys Left/Right/etc
		
			if (e.key === 'Escape') {
				
				e.target.closest('.n-nav').querySelectorAll('li').forEach(el => {
					
					el.removeAttribute('aria-expanded');
					
				});
				
				document.activeElement.blur();
				
			}
			
		});
		
		let menubar = el;
		
		el.querySelectorAll('li').forEach(el => {
			
			let ul = el.querySelector('ul');
			if (ul) {
				
				el.setAttribute('aria-haspopup', true);

				if (el.children[0].nodeName === 'UL') {

					el.insertBefore(el.children[1], el.children[0]); // Swap 'a' with 'ul'

				}
				
			}
		
		});

		el.querySelectorAll('ul').forEach(ul => {
			
			checkSides(ul, menubar);
		
		});

		el.addEventListener('mousedown', clickEvent);
		el.addEventListener('focusin', dropNavFocus);
		el.addEventListener('focusout', dropNavBlur);

		draggingNow = false;
	
	}
	
	window.addEventListener('resize', function (e) {
		
		document.querySelectorAll('.n-nav.n-nav__drop ul[role="menubar"]').forEach(menubar => {
			
			menubar.querySelectorAll('ul').forEach(ul => {
				
				checkSides(ul, menubar);
			
			});
			
		});
		
	});
			
/* Nav – end */

	let init = host => {
		
		host.querySelectorAll('.n-nav:not([data-ready]) > ul:not([role])').forEach(el => {
			
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

	let init = host => {
		
		host.querySelectorAll('.n-table:not([data-ready])').forEach((el) => {
		
			addClass(wrap(el), 'n-table--wrap');
			makeReady(el);
			el.parentNode.setAttribute('tabindex', 0);
		
		});
	
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
	
	};
	registerComponent('table', init);

})();

// Component Table – end
;// Component Fold – start

(function (){
    
/* Fold – start */

	let closeAccordion = (el, content) => {
		
		let content_height = content.style.getPropertyValue('--start-height') || 0;
		animate(content, `0% { max-height: ${content.scrollHeight}px; } 100% { max-height: ${content_height}; }`, .2, () => {
			
			toggleAttribute(el, 'aria-expanded');
			
		});
		
	};

	let openAccordion = (el, content) => {
		
		let content_height = content.style.getPropertyValue('--start-height') || 0;
		toggleAttribute(el, 'aria-expanded');
		animate(content, `0% { max-height: ${content_height}; } 100% { max-height: ${content.scrollHeight}px; }`);
		
	};

	function toggleAccordion(e) {
	
	    stopEvent(e);
	    var el = e.target.closest('.n-fold');
	    var content = el.querySelector('.n-fold--content');

		content.style.setProperty('--width', content.scrollWidth + 'px');
		content.style.setProperty('--max-height', content.scrollHeight + 'px');
	
		// Animation, not CSS, because of nested accordions
		
		if (hasClass(el, 'n-fold__horizontal')) {
			
			toggleAttribute(el, 'aria-expanded');
			
		} else {
		
			if (el.hasAttribute('aria-expanded')) { // Close
				
				closeAccordion(el, content);
				
			} else { // Open

				let other = hasClass(el.parentNode, 'n-fold--group') && el.parentNode.querySelector('[aria-expanded]');
				
				openAccordion(el, content);				

				if (other !== el) { // There is another one open, close it if in a group
					
					closeAccordion(other, other.querySelector('.n-fold--content'));
					
				}
				
			}
		
		}
	
	    return false;
	
	}
	
	// Close all Fold elements when clicking/tapping outside of them
	
	function closeFoldClickOutside(e) {
		
		var el = e.target;
	
		if (!el.closest('.n-fold') && !el.closest('.n-tool')) { // Clicking/tapping outside of a fold/tooltip element...
			
			qa('.n-fold.n-fold__mobile[aria-expanded], .n-tool--tip[aria-expanded]').forEach(el => { // ... closes all n-burger nav menus and tooltips
				
				el.removeAttribute('aria-expanded');
				
			});
			
		}
		
		// Focus on clicked slider
		
		if (el.closest('.n-slider')) {
	
			current_slider = el.closest('.n-slider');
		
		}
		
	}
	
	function initFold(host) {
		
		host.querySelectorAll('.n-fold:not([data-ready]) > .n-fold--label').forEach((el) => {
	
		    el.onclick = toggleAccordion;
		
		    el = el.parentNode;
			var content = el.querySelector('.n-fold--content');
			
			if (!hasClass(el, 'n-fold__mobile')) {
			
				content.addEventListener('focusin', e => {
					
					if (!e.target.closest('.n-fold').hasAttribute('aria-expanded')) {
						
						toggleAccordion(e);
						
					}
					
				});
			
			}
			
			if (hasClass(el, 'n-fold__horizontal')) {
				
				el.setAttribute('data-init', true);
				content.style.setProperty('--width', content.scrollWidth + 'px');
				content.style.height = 'auto';
				el.removeAttribute('data-init');
				setTimeout(() => {
					
					content.style.transition = 'width .2s ease-in-out'; 
				
				}, 100);
				
			}
		
			content.style.setProperty('--max-height', content.scrollHeight + 'px');
		
		    if (el.querySelector('input.n-trigger')) { // Remove CSS-only triggers
		
		        el.querySelector('input.n-trigger').outerHTML = '';
		
		    }
		    
		    if (hasClass(el, 'n-fold__defocus')) {
		    
				el.addEventListener('focusout', e => { // Close it when tabbing outside
	
					let el = e.target.closest('.n-fold');
					if (!el.contains(e.relatedTarget)) {
	
						el.removeAttribute('aria-expanded');
	
					}
					
				});
			
			}
		
		    makeReady(el);
		    
		});
		
	}
	
	window.addEventListener('mousedown', closeFoldClickOutside); // Close all Fold elements when clicking outside of them
	
	window.addEventListener('touchend', closeFoldClickOutside); // Close all Fold elements when clicking outside of them
		
	window.addEventListener('scroll', () => {  // Close fixed n-ovrl if its scrolling becomes a window scroll. Idea by a Google mobile nav.
		
		let expanded_nav = q('.n-header__fixed-mobile .n-fold.n-fold__mobile[aria-expanded]');
		if (expanded_nav) {
			
			expanded_nav.removeAttribute('aria-expanded');
		
		}
		
	});

/* Fold – end */

	registerComponent('fold', initFold);

})();

// Component Fold – end
initComponents(); return { initComponents, animate, copyButton, addComponent } })();