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
;// Component Fold – start

(function (){
    
/* Fold – start */

	function toggleAccordion(e) {
	
	    stopEvent(e);
	    var el = e.target.closest('.n-fold');
	    var content = el.querySelector('.n-fold--content');

		content.style.setProperty('--width', content.scrollWidth + 'px');
		content.style.setProperty('--max-height', content.scrollHeight + 'px');
	
		var content_height = content.style.getPropertyValue('--start-height') || 0;
		
		// Animation, not CSS, because of nested accordions
		
		if (hasClass(el, 'n-fold--horizontal')) {
			
			toggleAttribute(el, 'aria-expanded');
			
		} else {
		
			if (el.hasAttribute('aria-expanded')) {
		
				animate(content, `0% { max-height: ${content.scrollHeight}px; } 100% { max-height: ${content_height}; }`, .2, () => {
					
					toggleAttribute(el, 'aria-expanded');
					
				});
				
			} else {
				
				toggleAttribute(el, 'aria-expanded');
				animate(content, `0% { max-height: ${content_height}; } 100% { max-height: ${content.scrollHeight}px; }`);
				
			}
		
		}
	
	    return false;
	
	}
	
	// Close all Fold elements when clicking/tapping outside of them
	
	function closeFoldClickOutside(e) {
		
		var el = e.target;
	
		if (!el.closest('.n-fold') && !el.closest('.n-tool')) { // Clicking/tapping outside of a fold/tooltip element...
			
			qa('.n-fold.n-fold--mobile[aria-expanded], .n-tool--tip[aria-expanded]').forEach(el => { // ... closes all n-burger nav menus and tooltips
				
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
			
			if (!hasClass(el, 'n-fold--mobile')) {
			
				content.addEventListener('focusin', e => {
					
					if (!e.target.closest('.n-fold').hasAttribute('aria-expanded')) {
						
						toggleAccordion(e);
						
					}
					
				});
			
			}
			
			if (hasClass(el, 'n-fold--horizontal')) {
				
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
		
		let expanded_nav = q('.n-fixed-mobile .n-fold.n-fold--mobile[aria-expanded]');
		if (expanded_nav) {
			
			expanded_nav.removeAttribute('aria-expanded');
		
		}
		
	});

/* Fold – end */

	registerComponent('fold', initFold);

})();

// Component Fold – end
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
;// Component Grid with inline popups – start

(function (){
    
/* Grid with inline popups – start */

function initGridInlinePopups(host) { // Limitation: each row must have equal width columns.
		
	host.querySelectorAll('.grid-inline-popup:not([data-ready])').forEach((el) => {
		
		var id = `id${new Date().getTime()}`; // Unique id
		el.id = el.id || id;
		var cells = el.querySelectorAll(`#${el.id} > div:not(.grid-inline-popup--popup)`);
		var popups = el.querySelectorAll(`#${el.id} > .grid-inline-popup--popup`);
		
		if (el.id === id) {
			
			el.removeAttribute('id');

		}
		
		cells.forEach((el) => {
			
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
				el.previousElementSibling.setAttribute('aria-expanded', 'true');
				var height = el.scrollHeight;
				el.style.maxHeight = 0;
				el.style.overflow = 'hidden';
				animate(el, `100% { max-height: ${height}px; }`, .2, () => {
		
					el.style.cssText = '';
					
				});
	
			}
					
			function openCell(e) {
				
				var current_popup = e.target.closest('.grid-inline-popup').querySelector('.grid-inline-popup--popup[aria-expanded]');
				if (current_popup) {
					
					current_popup.style.maxHeight = current_popup.scrollHeight + 'px';
					current_popup.style.overflow = 'hidden';
					animate(current_popup, '100% { max-height: 0; }', .2, () => {
						
						current_popup.removeAttribute('aria-expanded');
						current_popup.previousElementSibling.removeAttribute('aria-expanded');
						current_popup.style.cssText = '';
						openNewItem(e, current_popup);
				
					});
					
				} else {
				
					openNewItem(e);
				
				}
				
			}
	
			el.setAttribute('tabindex', 0);
			el.addEventListener('click', openCell);
// 			el.addEventListener('touchend', openCell);
			el.addEventListener('keyup', (e) => { 
				
				if (e.key === 'Enter') {
	
					openCell(e);
	
				}
			
			});
			
		});
		makeReady(el);
		
	});
	
}

/* Grid with inline popups – end */

	let init = host => {

		initGridInlinePopups(host);
		
	};
	registerComponent('grid-inline-popups', init);

})();

// Component Grid with inline popups – end
;var componentLightbox = (function (){

/* Lightbox – start */

	function adjustZoom(e) { // Event is click on image
		
		let overlay = qa('.n-ovrl');
		overlay = overlay[overlay.length-1];
		
		var width = overlay.querySelector('.n-slider--wrap').offsetWidth;
		var height = overlay.querySelector('.n-slider--wrap').offsetHeight;
		
		var el = e.target;

		var overflowX = el.width - width;
		var overflowY = el.height - height;

		if (overflowX > 0) {

			el.style.setProperty('--x', (-1 * overflowX * e.x / width) + 'px');
			el.style.left = 0;
			el.style.right = 'auto';

		}
		
		if (overflowY > 0) {

			el.style.setProperty('--y', (-1 * overflowY * (e.y - window.innerHeight + height) / height) + 'px'); // removes 48px from the top bar height
			el.style.top = 0;
			el.style.bottom = 'auto';
		
		}
		
	}

	function imageLoaded (img) {

		addClass(img.closest('.n-slider > div'), 'n-lightbox--loaded');
		
		img.onclick = (e) => { // Zoom and scan

			var el = e.target;
			let parent_width = el.parentNode.offsetWidth;
			let parent_height = el.parentNode.offsetHeight;

			if (!q('.n-ovrl .n-slider--wrap') || (el.naturalWidth <= parent_width && el.naturalHeight <= parent_height)) {
				
				return;
				
			}
			
			let calculateOffset = () => {
				
				let coef_x = parent_width/el.width;
				let coef_y = parent_height/el.height;
				
				let coef = coef_y;

				if ((el.offsetWidth*coef - el.parentNode.offsetWidth) > 3) { // Wrong coefficient, swap them

					coef = coef_x;
					
				}
				
				var translate_x = (el.width  > parent_width)  ? `calc(1px * (${(parent_width/2 - el.width/2) / coef}))`   : `calc(-50% / ${coef})`;
				var translate_y = (el.height > parent_height) ? `calc(1px * (${(parent_height/2 - el.height/2) / coef}))` : `calc(-50% / ${coef})`;
				return `{ transform: scale(${coef}) translate3d(${translate_x}, ${translate_y}, 0); }`;
				
			}
			
			if (!hasClass(el, 'n-lightbox--zoom')) {
				
				el.style.cssText = '';
				el.style.setProperty('--x', '-50%');
				el.style.setProperty('--y', '-50%');
				addClass(el, 'n-lightbox--zoom');
				adjustZoom(e);

				animate(el, `0% ${calculateOffset()}`, .25);
				
				el.onmousemove = (e) => {
					
					adjustZoom(e);
	
				};
	
			} else {
				
				animate(el, `100% ${calculateOffset()}`, .25, () => {

					el.style.cssText = '';
					removeClass(el, 'n-lightbox--zoom'); 

				});
							
			}

		};

	}	

	function populateLightboxItem(slider, i) {
		
		var img = slider.children[!i ? 0 : i].querySelector('img');
	
		if (img && !img.src) {
			
			img.src = img.getAttribute('data-src') + '?'; // '?' fixes a weird iOS bug showing small images
			if (img.complete) {
				
				imageLoaded(img);
				
			}
			img.onload = img.onerror = e => {
				
				imageLoaded(e.target);
	
			};

			return false;
	
		}
	
	}
	
	function populateLightbox(slider, i) {
		
		let slides = slider.children.length-1;
		[i, (i > 0) ? i-1 : slides, (i < slides) ? i+1 : 0].forEach((el) => {
			
			populateLightboxItem(slider, el);	
			
		});
	
	}
	
	function openLightbox(e) { // To do: create all content in an unattached element and call openFullWindow(el), which will take over
		
	    if (typeof componentSlider.makeSlider !== 'function') { // Slider JS not present
		    
		    return;
	
		}
		
		observerOff();
	
		var el = e.target;
		if (el.length === 0) {
			
			el = e;
	
		}
		
	    var lightbox = el.closest('.n-lightbox');
	    var animation = lightbox.getAttribute('data-anim');
		var lightbox_target = document.createElement('div');
		var inline_static = lightbox.matches('.n-lightbox--inline:not(.n-slider)');
		
		if (inline_static) {
			
			addClass(lightbox_target, 'n-lightbox--inline');
			
		}
	
		['n-slider', 'n-lightbox'].forEach(item => addClass(lightbox_target, item));
		['n-lightbox--thumbnails', 'n-slider--top', 'n-slider--fade'].forEach(item => transferClass(lightbox, lightbox_target, item));
		
		if (lightbox.getAttribute('data-duration')) {
			
			lightbox_target.setAttribute('data-duration', lightbox.getAttribute('data-duration'));

		}

		if (lightbox.getAttribute('data-autoslide') !== null) {
			
			lightbox_target.setAttribute('data-autoslide', lightbox.getAttribute('data-autoslide'));

		}
	
		if (inline_static) { // If it's inline, it must become a slider/lightbox to replace the original lightbox element
			lightbox_target.id = lightbox.id ? lightbox.id : '';
			var parent = lightbox.parentNode;
			var next_sibling = lightbox.nextElementSibling;
			lightbox.outerHTML = ''; // Remove from DOM, but still existing as a variable
			
		} else { // else it's an existing lightbox and the new one should be separate and full screen
			
			if (hasClass(lightbox, 'n-full-screen')) {
		
				addClass(lightbox_target, 'n-full-screen');
				
				
			}
	
		}
	
		['n-slider--vertical', 'n-slider--right'].forEach(item => transferClass(lightbox, lightbox_target, item));
	
		if (lightbox.getAttribute('data-peek')) {
					
			lightbox_target.setAttribute('data-peek', lightbox.getAttribute('data-peek'));
	
		}	
		
	    /* Add any <a><img> siblings with description to a .n-slider and initialise its controls */
	    var images = '';
		var thumbnails = [];
	    [].slice.call(lightbox.children).forEach((el) => { // To do: facilitate a[href] extraction also from within div slides, if lightbox is existing and needs to be recreated for full screen. Get them in an array item[i].link, item[i].img
		    
		    if (!el.href && !hasClass(lightbox, 'n-slider')) { // Ignore non-links in regular lightboxes
			    
			    return;
	
		    }
		    
			el.setAttribute('tabindex', 0);
	
		    thumbnails.push((el.querySelector('img') ? (el.querySelector('img').getAttribute('data-src') || el.querySelector('img').src) : '#'));
	
			if (hasClass(el, 'n-lightbox--video') || el.querySelector('n-lightbox--video')) {
				// video poster = the anchor's img child, if it exists
				if (hasClass(lightbox, 'n-slider')) { // Secondary lightbox
					
					images += `<div>${el.querySelector('n-lightbox--video').outerHTML}</div>`;
					
				} else {
					
					images += `<div><video poster=${(el.querySelector('img') ? el.querySelector('img').src : '#')} controls=controls preload=none> <source type=video/mp4 src=${el.href}> </video></div>`;
					
				}
				
				return;
				
			}
				
			if (hasClass(el, 'iframe')) {
	
				images += `<div><iframe src=${el.href}></iframe></div>`;
				return;
				
			}
	
			var slide_link =  (hasClass(lightbox, 'n-slider') || !el.href) ? '' : document.location.href.split('#')[0].split('?')[0] + '?image=' + el.href.split('/').pop() + '#' + lightbox.getAttribute('id');
	
		    var link_element = (hasClass(lightbox, 'n-lightbox--inline') || !lightbox.getAttribute('id')) ? '' : `<a class="n-btn n-lightbox--copy" href=${slide_link}></a>`;
	
		    var url = hasClass(lightbox, 'n-slider') ? (el.querySelector('img') ? el.querySelector('img').getAttribute('data-src') : '') : el.href;
		    
			var caption = el.title ? el.title : (el.querySelector('img') ? el.querySelector('img').title : '');
			var caption_attribute = el.querySelector('img') ? el.querySelector('img').getAttribute('data-caption') : false;
			
			if (typeof caption_attribute === 'string') { // When an inline lightbox opens a full window one
				
				caption = caption_attribute;

			} else {
				
				if (el.querySelector('.n-lightbox--caption')) {
					
					caption = el.querySelector('.n-lightbox--caption').textContent;
					
				}
				
			}
			
			let target_width = !el.dataset.width ? '' : `width=${el.dataset.width}`;
			let target_height = !el.dataset.height ? '' : `height=${el.dataset.height}`;
			
			let aspect = '';
			let aspect_tail = '';
			
			if (!!target_width && !!target_height) {
				
				aspect = `<span class=n-aspect style="--width: ${el.dataset.width}; --height: ${el.dataset.height}">`;
				aspect_tail = '</span>';
				
			}
					    
		    images += el.querySelector('img') ? 
		    
		    `<div>${aspect}<img data-src="${url}" title="" data-link="${slide_link}" ${target_width} ${target_height}>${aspect_tail}${(caption ? ('<p class=n-lightbox--caption>' + caption + '</p>') : '') + link_element}</div>`
		    
		    :
		    
		    `<div class="n-lightbox--no-image">${el.innerHTML}</div>`;
		    
		    ;
	
	        // Attach onload event to each image to display it only when fully loaded and avoid top-to-bottom reveal?
	
	    });
	
	    lightbox_target.innerHTML = images;
	    	
	// If secondary, openFullWindow(lightbox_target)
	// If normal, attach lightbox_target on the former place of the lightbox and init(their_parent)
	
	    var anchor = el;
		
		if (anchor.href) { // If it's a standard lightbox with a[href], not a secondary full screen lightbox from an inline one
	
	        while (typeof anchor.href !== 'string') {
	
	            anchor = anchor.parentNode;
	
	        }
	
	        // Load the images in the current slide and its neighbours
	        while (anchor.tagName !== 'A') {
		        
		        anchor = anchor.parentNode;
		        
	        }
	    
	    }
	
		// To do: after closing an URI-invoked lightbox and opening a lightbox again, the index is incorrect
		var this_index = 0;
	
		if (hasClass(lightbox, 'n-lightbox--inline')) { // Secondary lightbox
	
	    	this_index = Array.prototype.indexOf.call(lightbox.children, anchor.closest('.n-slider > *')); // Ignore non-anchor children of the lightbox container
			
		} else {
	
	        this_index = Array.prototype.indexOf.call(lightbox.querySelectorAll('[href]'), anchor.closest('[href]')); // Ignore non-anchor children of the lightbox container
	
		}
	
	    if (location.href.indexOf('#' + lightbox.id) > -1 && hasClass(lightbox, 'uri-target')) {
	        
	        removeClass(lightbox, 'uri-target'); // Open URI-specified index only once, because subsequent lightbox instances would have incorrect index
	        if (!!getURLParameters()['slide']) {
	
		        this_index = getURLParameters()['slide'].split('#')[0] - 1;
	
		    }
	
			if (!!getURLParameters()['image']) {
	
				var target_image = lightbox_target.querySelector('[data-src*="' + getURLParameters()['image'].split('#')[0] + '"]');
				if (target_image) {
	
			        this_index = thisIndex(target_image.parentNode);
	
			    }
		    
		    }
	
	    }
	
	    if (this_index > (lightbox_target.children.length - 1) || this_index < 1) { // To do: fix this_index for a secondary full screen lightbox
	        
	        this_index = 0;
	        
	    }
	
	    populateLightbox(lightbox_target, this_index);
	
		var slider = componentSlider.makeSlider(lightbox_target, this_index); 
	// attach lightbox_target to the DOM
		if (inline_static) {
	
			if (!next_sibling) {
	
				parent.appendChild(slider);
			
			} else {
	
				parent.insertBefore(slider, next_sibling);
			
			}
	
		} else { // OpenFullWindow() and attach the slider to it
			
			addClass(slider, 'n-slider--overlay');
			addClass(slider.querySelector('.n-slider'), 'n-slider--overlay');
			componentModal.openFullWindow(slider);
			componentSlider.mouseEvents(slider);
	
		}
	
	    transferClass(anchor.parentNode, lightbox_target.parentNode, 'n-slider--outside');
	    
	    if (hasClass(lightbox, 'n-lightbox--thumbnails')) {
	    
		    transferClass(lightbox, lightbox_target.parentNode, 'n-lightbox--thumbnails');
	        var i = 0;
	        var nav = componentSlider.getSliderNav(lightbox_target.closest('.n-slider--wrap'));
	
	        if (nav) { // Multiple slides?
	
				transferClass(lightbox, nav, 'n-lightbox--thumbnails');
		        thumbnails.forEach((el) => {
					
					if (nav.children[i]) {
	
				        nav.children[i].style.backgroundImage = 'url(' + thumbnails[i] + ')';
	
				    }
			        i++;
			        
		        });
	
	        }
			
	    }
	
		if (!hasClass(lightbox, 'n-lightbox--inline')) { // Don't block global keyboard if the lightbox is inline
		
		    window.addEventListener('keydown', arrow_keys_handler, false);
	    
	    }
	    
		observerOn();

	    return false;
	
	}
	
	// Automatically open a lightbox specified in the URI
	
	setTimeout(() => {
		
		let target_el = q('.n-lightbox:target:not(.n-lightbox--inline), .n-lightbox.n-target:not(.n-lightbox--inline)');
		
		if (target_el) {
			
			addClass(target_el, 'uri-target');
			openLightbox(q('.n-lightbox:target > a[href], .n-lightbox.n-target > a[href]'));
			
		}
		
		if (q('.n-modal:target')) {
			
			q('.n-modal:target').click();
			
		}
		
	}, 1);
	
	let init = host => {
		
		host.querySelectorAll('.n-lightbox:not([data-ready])').forEach((el) => {
		
			// Abort on IE, because of IE bug on dynamic img.src change
			if (navigator.userAgent.indexOf('MSIE') != -1 || navigator.userAgent.indexOf('Trident') != -1 || hasClass(el.parentNode, 'n-slider--wrap')) {
				
				return;
		
			}
	
			if (hasClass(el, 'n-lightbox--inline')) {
				
				openLightbox(el.querySelector('a'));
				
			} else {
				
				el.querySelectorAll('a').forEach((el) => {
	
					el.setAttribute('tabindex', 0);
				    el.onclick = openLightbox;
				
				});
			
			}
			
			makeReady(el);
		
		});
		
	};
	registerComponent('lightbox', init);

/* Lightbox – end */

	return { populateLightbox: populateLightbox, openLightbox: openLightbox };

})();
;var componentModal = (function (){

/* Modal – start */

/**
 * This is a function where type checking is disabled.
 * @suppress {misplacedTypeAnnotation}
 */
	var disableBodyScroll = (function () { // Thanks Thijs Huijssoon https://gist.github.com/thuijssoon

	    /**
	     * Private variables
	     */
	    var _selector = false,
	        _element = false,
	        _clientY;
	
	    /**
	     * Prevent default unless within _selector
	     * 
	     * @param  event object event
	     * @return void
	     */
	    var preventBodyScroll = (event) => {
	        if (!_element || !event.target.closest || !_selector.contains(event.target)) {
	            event.preventDefault();
	        }
	    };
	
	    /**
	     * Cache the clientY co-ordinates for
	     * comparison
	     * 
	     * @param  event object event
	     * @return void
	     */
	    var captureClientY = (event) => {
	        // only respond to a single touch
	        if (event.targetTouches.length === 1) { 
	            _clientY = event.targetTouches[0].clientY;
	        }
	    };
	
	    /**
	     * Detect whether the element is at the top
	     * or the bottom of their scroll and prevent
	     * the user from scrolling beyond
	     * 
	     * @param  event object event
	     * @return void
	     */
	    var preventOverscroll = (event) => {
	        // only respond to a single touch
		    if (event.targetTouches.length !== 1 || event.target.closest('.n-slider--nav')) { // also if trying to swipe slider/lightbox nav
		    	return;
		    }
	
		    var clientY = event.targetTouches[0].clientY - _clientY;
	
		    // The element at the top of its scroll,
		    // and the user scrolls down
		    if (_element.scrollTop === 0 && clientY > 0) {
		        event.preventDefault();
		    }
	
		    // The element at the bottom of its scroll,
		    // and the user scrolls up
			// https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#Problems_and_solutions
			if ((_element.scrollHeight - _element.scrollTop <= _element.clientHeight) && clientY < 0) {
		        event.preventDefault();
		    }
	
	    };
	
	    /**
	     * Disable body scroll. Scrolling with the selector is
	     * allowed if a selector is provided.
	     * 
	     * @param  boolean allow
	     * @param  string selector Selector to element to change scroll permission
	     * @return void
	     */
 	    return function (allow, selector) {
	    	if (!!selector) {
		        _selector = selector;
		        _element = selector;
	    	}
	
	        if (true === allow) {
	        	if (false !== _element) {
		            _element.addEventListener('touchstart', captureClientY, { passive: false });
		            _element.addEventListener('touchmove', preventOverscroll, { passive: false });
	        	}
	            document.body.addEventListener("touchmove", preventBodyScroll, { passive: false });
	        } else {
	        	if (false !== _element) {
		            _element.removeEventListener('touchstart', captureClientY, { passive: false });
		            _element.removeEventListener('touchmove', preventOverscroll, { passive: false });
		        }
	          document.body.removeEventListener("touchmove", preventBodyScroll, { passive: false });
	        }
	    };
	}());
	
	function adjustModal(e) {
		
		if (!!window.visualViewport) {
		
			bodyElement.style.setProperty('--overlay-top', `${window.visualViewport.offsetTop}px`);
			bodyElement.style.setProperty('--overlay-bottom', `${window.innerHeight - window.visualViewport.height}px`);
		
		}
		
/*
		var modal = q('.n-ovrl');
		var previous_overlay_top = parseInt(document.body.style.getPropertyValue('--overlay-top'));
		var actual_viewport = window.innerHeight;
		var offset_y = modal ? modal.getBoundingClientRect().y : 0;
		if ((previous_overlay_top + '') === 'NaN') {
			
			previous_overlay_top = 0;

		}

		document.body.style.setProperty('--overlay-top', 0);
		document.body.style.setProperty('--overlay-bottom', 0);
		var screen_height = modal ? modal.scrollHeight : 0;

		if (!navigator.userAgent.match(/(iPod|iPhone)/i) || Math.abs(window.orientation) !== 90 || actual_viewport === screen_height) { // Only for mobile Safari in landscape mode
			
			return;

		}
		
		if (!!e) { // On resize event (toolbars have appeared by tapping at the top or bottom area

			bodyElement.style.setProperty('--overlay-top', (previous_overlay_top - offset_y) + 'px');
			bodyElement.style.setProperty('--overlay-bottom', (screen_height - actual_viewport + offset_y) + 'px');
			
		} else {
		
			if (qa('.n-ovrl').length > 1) { // Multiple modals: offset has been set, no need to do anything
				
				return;
	
			}

			if (actual_viewport <= screen_height) { // modal is cropped, adjust its top/bottom
				
				if ((bodyElement.scrollHeight + bodyElement.getBoundingClientRect().y) === actual_viewport) {// page scrolled at the bottom

					bodyElement.style.setProperty('--overlay-bottom', 0);
					bodyElement.style.setProperty('--overlay-top', (screen_height - actual_viewport) + 'px');
	
				} else {
	
					bodyElement.style.setProperty('--overlay-top', 0);
					bodyElement.style.setProperty('--overlay-bottom', (screen_height - actual_viewport) + 'px');
				}
			
			}
		
			if (modal && modal.getBoundingClientRect().y !== 0) { // A little off
	
				bodyElement.style.setProperty('--overlay-top', (parseInt(bodyElement.style.getPropertyValue('--overlay-top')) - modal.getBoundingClientRect().y) + 'px');
				bodyElement.style.setProperty('--overlay-bottom', (parseInt(bodyElement.style.getPropertyValue('--overlay-bottom')) + modal.getBoundingClientRect().y) + 'px');
				
			}
			
			if ((actual_viewport + parseInt(bodyElement.style.getPropertyValue('--overlay-top')) + parseInt(bodyElement.style.getPropertyValue('--overlay-bottom'))) > screen_height) { // Extra bug when scrolled near the bottom
				
				bodyElement.style.setProperty('--overlay-bottom', (screen_height - actual_viewport - parseInt(bodyElement.style.getPropertyValue('--overlay-top'))) + 'px');
				
			}
		
		}
*/

	}

	function keyUpClose(e) {
		
	    if ((e || window.event).keyCode === 27) { // Esc
	
	        closeFullWindow();
	
	    }
	
	}

	var previousScrollX = 0;
	var previousScrollY = 0;

	function closeFullWindow() {
	
		let full_window = qa('.n-ovrl');
		full_window = full_window[full_window.length-1];
	
		if (full_window) {
			
			window.scrollTo(previousScrollX, previousScrollY);
			var animation = full_window.querySelector('.n-ovrl--content > div').getAttribute('data-anim'); // Custom animation?
			if (animation.length < 11) { // '', 'null' or 'undefined'?
				
				animation = '0% { transform: translate3d(0,0,0) } 100% { transform: translate3d(0,-100%,0) }'; // 100% instead of 100vh, bc IE fails
				
			} else {
				
				full_window.style.cssText = 'animation-direction: reverse;';
	
			}
	
			animate(full_window, animation, .2, (e) => {
	
				disableBodyScroll(false, full_window.querySelector('.n-ovrl--content')); // Turn off and restore page scroll
				full_window.parentNode.removeChild(full_window);
				full_window_content = null;
		
				if (!q('.n-ovrl')) { // A single overlay is gone, leaving no overlays on the page
	
					window.removeEventListener('resize', adjustModal);
					window.removeEventListener('keydown', arrow_keys_handler); // To do: unglobal this and apply only to modal
					window.removeEventListener('keyup', keyUpClose);
					removeClass(q('html'), 'no-scroll');
	
					if (!q('.n-slider')) { // No sliders on the page to control with arrow keys
					
						window.removeEventListener('keydown', arrow_keys_handler, false);
						
					}
				
				} else {
				
					disableBodyScroll(true, full_window.querySelector('.n-ovrl--content'));
					adjustModal();
					
				}
				
			   	if (previouslyFocused) {
	
				   	previouslyFocused.focus();
				   
				}
					
			});
			
		}
	    
	}

	function openFullWindow(el, animation) { // el is an HTML string

		previouslyFocused = document.activeElement;
		
		full_window_content = document.createElement('div');
		
		if (typeof el === 'string') {
	
			full_window_content.innerHTML = el;
	
		} else {
	
			full_window_content.appendChild(el);
	
		}
	
		full_window_content.setAttribute('data-anim', animation);
	
		var wrapper = document.createElement('div');
		addClass(wrapper, 'n-ovrl');
		wrapper.insertAdjacentHTML('beforeend', '<div class=n-ovrl--content tabindex=0></div><div class=n-overlay-bg></div>');
		wrapper.firstChild.appendChild(full_window_content);
		full_window_content = wrapper;
	
	    full_window_content.insertAdjacentHTML('afterbegin', `<button class=n-ovrl--close> ← ${document.title}</button>`);
		full_window_content.querySelector('.n-overlay-bg').onclick = full_window_content.querySelector('.n-ovrl--close').onclick = closeFullWindow;
		full_window_content.querySelector('.n-ovrl--close').addEventListener("touchmove", (e) => { e.preventDefault(); }, { passive: false });
		full_window_content.querySelector('.n-overlay-bg').addEventListener("touchmove", (e) => { e.preventDefault(); }, { passive: false });
		window.addEventListener('keyup', keyUpClose);
		   
		bodyElement.appendChild(full_window_content);
	
		let full_window_container = full_window_content.querySelector('.n-ovrl--content');
	
	    full_window_container.focus();
	
		disableBodyScroll(true, full_window_container); // Turn on and block page scroll
		
		if (qa('.n-ovrl').length === 1) { // Sole (first) modal

			addClass(q('html'), 'no-scroll');
			previousScrollX = window.scrollX;
			previousScrollY = window.scrollY;
			window.addEventListener('resize', adjustModal);
			adjustModal();

		}
			
		if (full_window_content.querySelector('.n-full-screen') && !is_iPad) { // iPad iOS 12 full screen is still experimental and buggy
	
			if (full_window_content.webkitRequestFullScreen) { 
				
				full_window_content.webkitRequestFullScreen(); 
			
			}
			if (full_window_content.mozRequestFullScreen) { 
				
				full_window_content.mozRequestFullScreen(); 
			
			}
			if (full_window_content.requestFullScreen) {
				
				full_window_content.requestFullScreen(); 
			
			}
	
		} else {
	
			animate(full_window_content, typeof animation === 'string' ? animation : '0% { transform: translate3d(0,-100%,0) } 100% { transform: translate3d(0,0,0) }', .2);
	
		}
		
	    return false;
		
	}

	function modalWindow(e) {

    // Modal window of an external file content

	    var el = e.target;
	
	    var link = el.closest('.n-modal').href;
	    var animation = el.closest('.n-modal').getAttribute('data-anim');
	
	    var request = new XMLHttpRequest();
	    request.open('GET', link.split('#')[0], true);
	
	    request.onload = () => {
	
	        if (request.status >= 200 && request.status < 400) {
	            // Success
	            if (!request.responseText) {
	
	                closeFullWindow();
	                window.open(link, 'Modal');
	                return false;
	
	            }
	            var container = !!link.split('#')[1] ? ('#' + link.split('#')[1]) : 0;
	
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
				transferClass(el.closest('.n-modal'), q('.n-ovrl'), 'n-modal--limited');
	
	        } else {
	            // Error
	            closeFullWindow();
	
	        }
	
	    };
	
	    request.onerror = () => {
	        // Error
	        closeFullWindow();
	        window.open(link, '_blank');
	
	    };
	
	    request.send();
	
	    return false;
	
	}

	let init = host => {
		
	// Modal window: open a link's target inside it
	
		host.querySelectorAll('a.n-modal[href]:not([data-ready])').forEach((el) => {
		
			if (el.href !== (location.href.split('#')[0] + '#')) { // Is it an empty anchor?
				
			    el.onclick = modalWindow;
		
		    }
		    
		    if (!el.getAttribute('rel')) {
			    
			    el.setAttribute('rel', 'prefetch');
		
		    }
		    
		    makeReady(el);
		
		});
		
	};
	registerComponent('modal', init);

	return { closeFullWindow, openFullWindow, adjustModal };

/* Modal – end */

})();

// To do: √ adjust multiple modals – if a prior modal exists, don't re-adjust, use the current offsets
// To do: √ When second modal triggers a resize (toolbars appear), it should call adjustModal()
// To do: √ allow scrolling in modal content, don't let a slider inside the modal block modal's vertical swipe scroll 
// To do: disable page scroll by arrow keys
// To do: √ after closing the second modal, page is scrollable
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
	
		if (!el.closest('.n-nav.n-drop')) { // The rest is for drop nav only
			
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
		
		document.querySelectorAll('.n-nav.n-drop ul[role="menubar"]').forEach(menubar => {
			
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
;// Component Notification bar – start

var componentNotify = (function (){
    
	function notifyClose(el) {
		
		if (!!el) {
		
			el.parentNode.removeChild(el);
		
		}
		
	}
	
	function notifyCloseEvent() {
	
		if (q('.n-notify')) {
	
			q('.n-notify').onclick = (e) => {
				
				notifyClose(e.target);	
					
			};
		
		}
		
	}
	
	function notify(content, option) {
		
		bodyElement.insertAdjacentHTML('afterbegin', `<div class="n-notify${(option && (option.indexOf('fixed') !== -1) ? ' n-notify--fixed' : '')}">${content}</div>`);
		notifyCloseEvent();
		if (option && option.indexOf('timeout') !== -1) {
			
			setTimeout(() => { notifyClose(q('.n-notify')) }, 2000);
	
		}
		
	}

	let init = host => {
		
		/* Tooltip */
		
		host.querySelectorAll('.n-notify:not([data-ready])').forEach((el, i) => {
			
			notifyCloseEvent();
			makeReady(el);
		
		});
		
	};
	registerComponent('notify', init);

	return { notify: notify };

})();

// Component Notification bar – end
;// Component Parallax – start

(function (){
    
// Thanks Dave Rupert

	let parallaxSpeed = 0.2;
	
	let updateParallax = () => {
	
		qa('.n-parallax').forEach(el => {
			
			let parent = el.parentElement;
			let scroll_offset = parent.scrollHeight > parent.offsetHeight ? Math.abs(parent.getBoundingClientRect().y) : (document.body.scrollTop || document.documentElement.scrollTop);
			el.style.setProperty("--scrollparallax",  scroll_offset * parallaxSpeed);
		
		});
			
	};
	
	if (q('.n-parallax')) {
	
		window.addEventListener('scroll', updateParallax, true);
	
	}

	let init = host => {
		
	
	};
	registerComponent('parallax', init);

})();

// Component Parallax – end
;// Component Slider – start

var componentSlider = (function (){
    
/* natUIve Slider */

	var last_slide_time = 14045017000;
	var slide_duration = .5;
	
	function sliderElement(e) { // Get the active slider instance
		
// 		var closest_slider_wrap = document.activeElement.closest('.n-slider--wrap');
		var closest_slider_wrap = e.target.closest('.n-slider--wrap');
		
		if (closest_slider_wrap && closest_slider_wrap === focusWithin('.n-slider--wrap')) {
	
			return focusWithin('.n-slider--wrap').querySelector('.n-slider');
	
		}
	
	    var el = e.target;
	
	    if (hasClass(el, 'n-slider--wrap')) {
	
	        return el.querySelector('.n-slider');
	
	    } else {
	
	        var container = el.closest('.n-slider--wrap');
	        return container && container.querySelector('.n-slider');
	
	    }
	
	}
	
	function getSliderNav(slider_wrap) {
	
		// Select either a child n-slider--nav or the one specified by the slider id, if it exists
		var slider = slider_wrap.querySelector('.n-slider');
		var slider_nav;
	
		if (slider.id && (slider_nav = q(`.n-slider--nav[data-for=${slider.id}]`))) { // Detached nav
	
			return slider_nav;
	
		} else {
			
			let nav = slider_wrap.querySelectorAll('.n-slider--nav');
			return nav[nav.length-1]; // With a simple query, it would get the nav of an eventual nested slider, instead of the current one. Current nav is either a direct child or a .n-pad direct child, taken as the last one of all.
	
		}
	
	}
	
	/* Thanks to Pete & Eike Send for the swipe events – http://www.thepetedesign.com/demos/purejs_onepage_scroll_demo.html */
	
	function swipeEvents(el) {
	
	    var startX, startY;
	
	    el.addEventListener('touchstart', touchStart);
	
	    function touchStart(e) {
	
	        var touches = e.touches;
	        if (touches && touches.length) {
	
	            startX = touches[0].pageX;
	            startY = touches[0].pageY;
	            el.addEventListener('touchmove', touchMove);
	
	        }
	
	    }
	
	    function touchMove(e) {
		    
	        var touches = e.touches;
	
	        if (touches && touches.length && !(hasClass(el, 'n-slider--vertical') && !el.closest('.n-ovrl'))) { // Don't slide vertically if not full window
	
	            var deltaX = startX - touches[0].pageX;
	            var deltaY = startY - touches[0].pageY;
	            var delta = (Math.abs(deltaX) > Math.abs(deltaY)) ? deltaX : deltaY;				
				var overlay_content = el.closest('.n-ovrl') ? el.closest('.n-ovrl').querySelector('.n-ovrl--content') : null;

				// Allow vertical page scroll by swiping over the slider. Also when parent modal is scrollable vertically
	            if (((hasClass(el, 'n-slider--vertical') ? (Math.abs(deltaY) < Math.abs(deltaX)) : (Math.abs(deltaX) < Math.abs(deltaY))) && !q('.n-ovrl .n-slider--wrap'))
	            	|| (overlay_content && (overlay_content.scrollHeight > overlay_content.offsetHeight) && (Math.abs(deltaX) < Math.abs(deltaY)))
	            	|| (e.target.nodeName === 'INPUT' && e.target.type === 'range')
	            	|| hasClass(e.target.parentNode, 'n-slider--nav') || hasClass(e.target, 'n-slider--nav')
					) {
	
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
	
	var scroll_timestamp = 0;

	function mouseWheelHandler(e) {
	
		let el = e.target;
		
		let current_slider_wrap = el.closest('.n-slider--wrap');
		let current_slider = el.closest('.n-slider');

		if ((e.timeStamp - scroll_timestamp > 1666) && current_slider && !el.closest('.n-slider--nav') && !current_slider_wrap.getAttribute('data-active')) {
		
		    var deltaX = (e.deltaX * -10) || e.wheelDeltaX || -e.detail; // Firefox provides 'detail' with opposite value
		    var deltaY = (e.deltaY * -10) || e.wheelDeltaY || -e.detail;
	
		    if (Math.abs(hasClass(current_slider, 'n-slider--vertical') ? deltaY : deltaX) > 50) {
	
				scroll_timestamp = e.timeStamp;
		        e.stopPropagation();
				slide(current_slider, ((Math.abs(deltaX) > Math.abs(deltaY)) ? deltaX : deltaY) < 0 ? 'right' : 'left');
		
			}
		
		}
	    
	}
	
	function mouseEvents(el, toggle) {
	
	    if (!('onwheel' in window) || (hasClass(el, 'n-slider--vertical') && !el.closest('.n-ovrl'))) { // Check for mouse wheel and don't slide vertically if not full window
		    
		    return;
		   
		}
	
	    if (toggle === 'off') {

	        el.removeEventListener('wheel', mouseWheelHandler);
	
	    } else {
	
	        el.addEventListener('wheel', mouseWheelHandler);

	    }
	
	}
	
	function endSlide(slider, index, old_index) {
	
	    if (hasClass(slider, 'n-lightbox')) {
			
			componentLightbox.populateLightbox(slider, index);

	    }
	
		var slider_wrap = slider.closest('.n-slider--wrap');
	
		if (getSliderNav(slider_wrap)) { // Multiple slides? // To do: get the proper slider nav, if it's detached
	
			getSliderNav(slider_wrap).children[index].setAttribute('data-active', true);
		
		}
	
		slider.children[index].dataset.active = true; // Can't use 'sliding', because Closure Compiler obfuscates it
	
	    if (!hasClass(slider, 'n-slider--vertical')) {
		    
		    slider.style.marginLeft = `${-100*index}%`;
		   
		}
	
		slider.style.pointerEvents = slider.style.height = '';
	
	    window.addEventListener('keyup', sliderKeyboard);
	    mouseEvents(slider_wrap);
	    var timeNow = new Date().getTime();
		last_slide_time = timeNow;

		if (slider.children[index].id) {

				var focused = document.activeElement;
				window.location.hash = slider.children[index].id;
				focused.focus();
			
		} else {
			
			if (!!old_index && location.hash === '#' + slider.children[old_index].id) {
				
				removeHash();
				
			}
			
		}

	}
	
	function slide(el, method, index_number) {
	
// 2 directions: horizontal/vertical
// 3 animations: slide/fade/fade overlap
	
		var slider_wrap = el.closest('.n-slider--wrap');
	
	    var slider = slider_wrap.querySelector('.n-slider');
	
	    if (slider.children.length < 2) {
	
			endSlide(slider, 0);
	        return slider;
	
	    }
	    
	    slider.style.pointerEvents = 'none'; // Speed up animation
	    mouseEvents(slider_wrap, 'off');
	    window.removeEventListener('keyup', sliderKeyboard);
	
		clearTimeout(slider.getAttribute('data-timeout'));
		
		var index;
		var old_index;
		var slider_nav = getSliderNav(slider_wrap);
		var active_nav_item = slider_nav.querySelector('[data-active]');
		if (!active_nav_item) {
	
			return;
	
		}
		index = old_index = thisIndex(active_nav_item);
	
	    if (method === 'index') {
	
			if (typeof index_number === 'undefined' || index_number === index || !slider.querySelector('[data-active]')) { /* Don't slide to current slide */
				
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

	    var offset_sign = -1; // Slider offset depending on direction. -1 for LTR or 1 for RTL. Vertical is always '-'
	
		var computed_height;
		var computed_height_old;
	
		var target_slide = slider.children[index];
	
		var height_change = '';
		var height_current = '';
		
		if (hasClass(slider, 'n-slider--auto-height')) {
			
			height_change =	`height: ${target_slide.scrollHeight}px`;
			height_current = `height: ${slider.scrollHeight}px`;
			
		}
		
		var original_slider_height = slider.scrollHeight;
		target_slide.dataset.active = true;

		var next_slide_image = target_slide.querySelector('img');
		if (hasClass(slider, 'n-slider--vertical') || (hasClass(slider, 'n-slider--auto-height') && hasClass(slider, 'n-lightbox--inline'))) {
			
			if (hasClass(slider, 'n-lightbox--inline') && !hasClass(slider, 'n-slider--overlay') && next_slide_image && !hasClass(slider_wrap.parentNode, 'n-aspect')) { // Inline lightbox only. To do: integrate n-aspect with n-slider--wrap
			
				let next_image_width = next_slide_image.getAttribute('width') ? next_slide_image.getAttribute('width') * 1 : next_slide_image.naturalWidth; // To do: set data-width, data-height from the anochor link
				let next_image_height = next_slide_image.getAttribute('height') ? next_slide_image.getAttribute('height') * 1 : next_slide_image.naturalHeight;
				
				var height_change_number = slider.clientWidth * next_image_height / next_image_width;
				if (slider.clientWidth >= next_image_width) {
					
					height_change_number = next_image_height;
					
				}
				if (hasClass(next_slide_image.parentNode, 'n-aspect')) {
					
					height_change_number = next_slide_image.parentNode.offsetHeight;
					
				}
				height_change =	`height: ${height_change_number}px`;
	
			} else { // Vertical, not a lightbox, non-img content (video, iframe)
				
				if (hasClass(slider, 'n-slider--auto-height')) {

					target_slide.style.position = 'absolute';
	
				}
				height_change =	`height: ${target_slide.clientHeight}px`;
				target_slide.style.cssText = '';

			}
		
			height_current = `height: ${original_slider_height}px`;
			
			target_slide.style.display = 'block'; // Temporarily display the target slide to get its height
			computed_height = getComputedStyle(target_slide).height;
			target_slide.setAttribute('style', target_slide.getAttribute('style').replace('display: block;', '')); // Keep any other inline styles
			computed_height_old = getComputedStyle(slider.children[old_index]).height;
	
		} else {
		
			computed_height = getComputedStyle(slider).height;
			if (slider.getAttribute('dir') === 'rtl') {
				
				offset_sign = 1;
		
			}
			
		}
	
		slider.style.height = computed_height;
	
		slider_wrap.dataset.active = true; // The correct position, after the above calculations
	
		if (slider_nav.querySelector('[data-active]')) {
	
		    slider_nav.querySelector('[data-active]').removeAttribute('data-active');
	
	    }
	
		var duration = slider.getAttribute('data-duration') || slide_duration;
	
		var translate_from, translate_to;
		
	    if (hasClass(slider, 'n-slider--vertical')) {
			
			computed_height = parseInt(computed_height, 10);
			computed_height_old = parseInt(computed_height_old, 10);

			var next_height =  (!hasClass(slider, 'n-slider--overlay') && next_slide_image && !hasClass(slider_wrap.parentNode, 'n-aspect')) ? (`-${height_change_number}px`) : '-100%';
		    translate_from = `translate3d(0,${index<old_index ? ('-' + computed_height + 'px') : 0},0)`;
		    if (hasClass(slider, 'n-tabs') && computed_height < original_slider_height && index < old_index) {
				
				slider.style.overflow = 'hidden';

		    }
			
/*
		    var difference = Math.abs(computed_height - computed_height_old);

		    if (computed_height > computed_height_old) {
			    
			    difference = Math.max(computed_height, computed_height_old) - difference;
			    
		    } else {
			    
			    difference = Math.min(computed_height, computed_height_old) + difference;
			    
		    }

		    if (computed_height === computed_height_old) {
			    
			    difference = 0;
			    
			}
*/

		    translate_to = `translate3d(0,${index<old_index ? '0' : ('-' + original_slider_height + 'px')},0)`;
/*
		    slider.children[old_index].style.transition = `opacity ${duration/2}s linear`; // On Safari, this delays the sliding, making the slider jump
		    slider.children[old_index].style.opacity = 0;
*/
		
		} else {
			
			if (slider.getAttribute('data-peek')) {
			
			    translate_from = 'translate3d(0,0,0)';
			    translate_to = `translate3d(${offset_sign * (index - old_index)}00%,0,0)`;
		    
		    } else {
	
				slider.style.margin = 0;
			    translate_from = `translate3d(${offset_sign * ((index<old_index) ? 1 : 0)}00%,0,0)`;
			    translate_to = `translate3d(${offset_sign * ((index<old_index) ? 0 : 1)}00%,0,0)`;
			    
		    }
			
		}
	
		function slideEndHandler(e) { // On slide end
		
// 			slider.children[index].style.cssText = slider.children[old_index].style.cssText = '';

			delete slider_wrap.dataset.active;
			delete slider.children[old_index].dataset.active;
			slider.style.overflow = '';

			[slider.children[index], slider.children[old_index]].forEach((el) => {
				
				el.style.transition = el.style.opacity = el.style.height = el.style.margin = '';
				
			});

			current_slider = slider;
			endSlide(slider, index, old_index);
	
	    }
		    
		if (hasClass(slider, 'n-slider--fade-overlap')) { // fade slides in/out directly. Overlap new and old slides.
			
		    slider.children[index].style.opacity = 0;
			slider.children[index > old_index ? index : old_index].style.marginLeft = '-100%';
		    slider.children[old_index].style.opacity = 1;

			// Animate both simultaneously

			animate(slider, `0% { ${height_current}; } 100% { ${height_change}; }`, duration);
			animate(slider.children[index], '0% { opacity: 0; } 100% { opacity: 1; }', duration, slideEndHandler);
			animate(slider.children[old_index], '0% { opacity: 1; } 100% { opacity: 0; }', duration);
			
		} else {
			
			var animation_code;
	
			if (hasClass(slider, 'n-slider--fade')) { // fade out to a color and fade in to the new slide
		
				animation_code = `0% { opacity: 1; transform: ${translate_from}; ${height_current}} 49% { transform: ${translate_from} } 51% { opacity: 0; transform: ${translate_to} } 100% { ${height_change}; opacity: 1; transform: ${translate_to} }`;
			
			} else {

				if (hasClass(slider, 'n-slider--vertical') && !hasClass(slider, 'n-lightbox') && old_index > index && computed_height < original_slider_height) {
					
					animation_code = `0% { margin-top: -${computed_height}px; height: ${computed_height + computed_height_old}px; } 100% { margin-top: 0; ${height_change}; }`;

				} else {

					animation_code = `0% { transform: ${translate_from}; ${height_current}; } 100% { ${height_change}; transform: ${translate_to}; }`;
				
				}

			}
			
			animate(slider, animation_code, duration, slideEndHandler);
			
		}
	
	}
	
	function shouldNotSlideVertically(el) {
		
		if (q('.n-ovrl')) { 
			
			return false; 
		
		}
		return !hasClass(el, 'n-slider--vertical') || window.innerHeight < bodyElement.scrollHeight;
		
	}
	
	function sliderKeyboard(e) { // e.target can be either body or a slider, choose accordingly

	    if (!e || 

	    	q('.n-slider--wrap[data-active]') || 
	    	(q('.n-ovrl') && !q('.n-ovrl .n-slider--wrap')) // There is an overlay open and it doesn't have a slider in it
			) {
	
	        return;
	
	    }
	
		var el = e.target;

		if (!el.closest('.n-slider--wrap') && q('.n-slider--wrap')) { // Focused element is outside of any slider
			
		} else {
			
			current_slider = el.closest('.n-slider--wrap') ? el.closest('.n-slider--wrap').querySelector('.n-slider') : null;
	
		}
	
		if (focusWithin('.n-slider')) {
			
			current_slider = focusWithin('.n-slider');
			
		}
	
		if 	(el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA' && 
			(el = q('.n-ovrl .n-slider') || current_slider || q('.n-slider'))
			) { // Priority: full window slider, active slider, first slider
				
				if (hasClass(document.activeElement, 'n-slider')) {
					
					el = document.activeElement;
					
				}
				
				if (e.key !== 'Escape') {
				
					e.stopPropagation();
				
				}
				
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
		                break;
		            default:
		                return;
		
		    }
			
		}
	
	}
	
	function cancelTouchEvent(el) {
		
		el.addEventListener('touchstart', (e) => {
			
			e.stopPropagation(); return false; 
		
		});
		
	}
	
	function makeSlider(el, current_slide) {
	
		if (el.getAttribute('data-ready')) { // Already created
			
			return;
			
		}
	
		observerOff();
		
	    addClass(el, 'n-slider');
		el.setAttribute('tabindex', 0); // For keyboard events
	    makeReady(el);
	
		if (hasClass(el, 'n-full-window')) {
			
		    addClass(el, 'n-slider--overlay');
			componentModal.openFullWindow(el.outerHTML);
			
		}
	
		var container = el.parentNode;
	
		if (!container || !hasClass(container, 'n-slider--wrap')) {
	
		    container = wrap(el);
			addClass(container, 'n-slider--wrap');
			
		
		}

		if (hasClass(container, 'n-pad')) {
			
			addClass(wrap(el), 'n-pad');
			removeClass(container, 'n-pad');

		}
		
        ['n-slider--vertical', 'n-wrap', 'n-slider--top', 'n-slider--right', 'n-slider--overlay'].forEach(item => transferClass(el, container, item));

		var peek = el.getAttribute('data-peek');
		if (peek) {
			
			addClass(container, 'n-slider--peek');
			
        	container.style.padding = hasClass(el, 'n-slider--vertical') ? (peek + ' 0') : ('0 ' + peek);

		}
		
	    // Generate controls if needed
		
		var slider_nav = false;

		if (el.id && (slider_nav = q(`.n-slider--nav[data-for=${el.id}]`))) { // Detached nav
			
			addClass(container, 'n-slider--detached-nav');
			addClass(el, 'n-slider--detached-nav');
			transferClass(container, slider_nav, 'n-slider--vertical');
	
		} else {
			
			container.childNodes.forEach(el => {
				
				slider_nav = (el.nodeName === 'DIV' && el.matches('.n-slider--nav')) ? el : slider_nav; 
			
			});
			
			if (!slider_nav) {
				
			    container.insertAdjacentHTML(hasClass(container, 'n-slider--top') ? 'afterbegin' : 'beforeend', '<div class=n-slider--nav></div>');
	            slider_nav = hasClass(container, 'n-slider--top') ? container.firstChild : container.lastChild;

			}
		
		}
		
		// Populate controls
		
        if (hasClass(el, 'n-tabs')) {

            addClass(container, 'n-tabs');
            addClass(slider_nav, 'n-row');
            addClass(slider_nav, 'n-tabs');
            transferClass(container, slider_nav, 'n-wrap');
            transferClass(el, container, 'n-slider--vertical');

		}

		if (slider_nav.children.length !== el.children.length) { // Nav doesn't already exist
			
			slider_nav.innerHTML = '';
		    for (var i = 0; i < el.children.length; i++) {
		
		        if (hasClass(el, 'n-tabs')) {
		
		            var tab_title = el.children[i].getAttribute('data-tab_title') || (el.children[i].querySelector('.n-tab-title') ? el.children[i].querySelector('.n-tab-title').innerHTML : i+1);
		            slider_nav.insertAdjacentHTML('beforeend', `<button>${tab_title}</button>`);
	
		        } else {
		
		            slider_nav.insertAdjacentHTML('beforeend', `<button>${i+1}</button>`);
		
		        }
		        
		    }
		
		}

		let slideKeyboardHandler = (e) => {
			
			var scrollable = e.target; // Don't slide when current element is scrollable
			if (e.key === 'Escape' || hasClass(scrollable.parentNode, '.n-slider--overlay')) {
				
				return;
				
			}
			if (scrollable.scrollWidth > scrollable.clientWidth || scrollable.scrollHeight > scrollable.clientHeight) { 
				
				e.stopPropagation();
				return;
		
			}

        };
		
		Array.from(el.children).forEach((el, i) => {
			
			let nav_item = slider_nav.children[i];
			nav_item.onclick = (e) => {
				
	            slide( // Select slider either through id or as a parent
		            slider_nav.getAttribute('data-for') ? q('.n-slider#' + slider_nav.getAttribute('data-for')) : e.target,
					'index', thisIndex(e.target)
				);
				
				return false;
	
	        };
	        
	        cancelTouchEvent(nav_item);
	        
	        el.setAttribute('tabindex', 0);
	        el.addEventListener('keyup', slideKeyboardHandler);
			
		});
	
		    
	    // Generate arrows
	
	    container.insertAdjacentHTML('beforeend', '<button class="n-slider--arrow n-slider--left"></button><button class="n-slider--arrow n-slider--right"></button>');
	    
	    let setArrowEvents = (selector, direction) => {
		    
		    let arrow = container.querySelector('.n-slider--arrow' + selector);
		    arrow.onclick = arrow.onkeyup = (e) => {
		
				if (e.type === 'keyup' && e.keyCode !== 13) { // Slide on Enter key
					
					return;
	
				}
	
		        slide(e.target, direction);
		
		    };
		    
			cancelTouchEvent(arrow);

	    };
	    
	    setArrowEvents('', 'left');
	    setArrowEvents('.n-slider--right', 'right');
	
	    // Set mouse and touch events
	
	    mouseEvents(container);
	
	    swipeEvents(container);
	
	    container.addEventListener('swipeLeft', (e) => {
	
	        slide(e.target, 'right');
	
	    });
	
	    container.addEventListener('swipeRight', (e) => {
	
	        slide(e.target, 'left');
	
	    });
	    
	    container.addEventListener('mouseover', (e) => {

		    clearTimeout(el.getAttribute('data-timeout'));
		   
		});
	    
	    // Don't slide when using a range input in a form in a slider
	   	el.querySelectorAll('input[type=range]').forEach((el) => {
        
	        el.ontouchmove = (e) => {
	
				e.stopPropagation();
		        
	        };
	        
	    });
	
	    if (el.getAttribute('data-autoslide') !== null) { // auto slide
	
			var delay = el.getAttribute('data-autoslide');
			delay = delay.length > 0 ? (1000 * delay) : 4000;
	        var autoSlide = () => {
	
	            slide(el, 'right');
	            el.setAttribute('data-timeout', setTimeout(autoSlide, delay));
	
	        };
	
	        setTimeout(autoSlide, delay);
	
	    }
		
		var _current_slide = current_slide;
		
		// If URI #id matches a slide #id, go to that slide and scroll the page to the slider.
		if (!current_slide && window.location.hash && el.querySelector(window.location.hash)) {
			
			_current_slide = thisIndex(el.querySelector(window.location.hash));
			current_slider = container;
			
		} 

		endSlide(el, _current_slide || 0); // Start from (other than) the first slide
	
		// Detect text direction
		el.setAttribute('dir', getComputedStyle(el, null).getPropertyValue('direction'));
		    
	    el.addEventListener('keyup', sliderKeyboard);
		
	    if (hasClass(el, 'n-lightbox--inline')) { // It's an inline lightbox and needs to become full window/screen when clicked. If it's not a dynamically generated lightbox for full-window lightbox
		    
		    el.onclick = e => {
			    
			    if (e.target.tagName === 'IMG') {
				    
				    componentLightbox.openLightbox(e);
	
			    }
			    
		    };
		    
	    }

		observerOn();
	
	    return container;
	
	}

	let init = host => {
		
		host.querySelectorAll('.n-slider:not([data-ready])').forEach((el) => {
		
		    makeSlider(el);
		
		});
		
	    window.addEventListener('keyup', sliderKeyboard);

	};
	registerComponent('slider', init);
	
	window.addEventListener('hashchange', () => {
		
		let new_hash_slide = q('.n-slider > :target, .n-slider > .n-target');
		if (new_hash_slide) {
			
			slide(new_hash_slide.parentNode, 'index', thisIndex(new_hash_slide));		
			
		}
		
	}, false);
	
	return { makeSlider, getSliderNav, slide, mouseEvents };

})();

// Component Fold – end
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
;// Component Tooltip – start

(function (){

	let setTipPosition = tip => { // Take up the most area available on top/right/bottom/left of the tool. Relative to body.

		let tool = document.querySelector('[data-n-tool="' + tip.getAttribute('for') + '"]');
		let rect = tool.getBoundingClientRect();

		let top = 		rect.top;
		let left = 		rect.left;
		let right = 	window.innerWidth - 	left - 	rect.width;
		let bottom = 	window.innerHeight - 	top - 	rect.height; // To do: check when body is shorter than viewport
		
		let area_top = top * window.innerWidth;
		let area_right = right * window.innerHeight;
		let area_bottom = bottom * window.innerWidth;
		let area_left = left * window.innerHeight;
		
		let body_rect = document.body.getBoundingClientRect();
		
		tip.removeAttribute('style');
		tip.removeAttribute('data-n-position');
		
		let positionTop = () => {

			tip.style.bottom = (20 + body_rect.height + body_rect.y - top) + 'px';
			tip.style.maxHeight = (top - 40) + 'px';
			tip.style.left = `${rect.x + rect.width/2 - tip.scrollWidth/2}px`;
			tip.setAttribute('data-n-position', 'top');
			
		}
		
		let positionBottom = () => {

			tip.style.top = (20 - body_rect.y + top + rect.height) + 'px';
			tip.style.maxHeight = (bottom - 40) + 'px';
			tip.style.left = `${rect.x + rect.width/2 - tip.scrollWidth/2}px`;
			tip.setAttribute('data-n-position', 'bottom');
			
		}
		
		let positionLeft = () => {
			
			tip.style.left = 'auto';
			tip.style.right = (20 + body_rect.width + body_rect.x - window.innerWidth + right + rect.width) + 'px';
			tip.style.maxWidth = (left - 40) + 'px';
			tip.style.top = `${-1*body_rect.y + rect.top + rect.height/2 - tip.scrollHeight/2}px`;
			tip.setAttribute('data-n-position', 'left');
			
		}

		let positionRight = () => {

			tip.style.left = (rect.x - body_rect.x + rect.width + 20) + 'px';
			tip.style.maxWidth = (right - 40) + 'px';
			tip.style.top = `${-1*body_rect.y + rect.top + rect.height/2 - tip.scrollHeight/2}px`;
			tip.setAttribute('data-n-position', 'right');

		}
		
		if (area_left > area_right) {
			
			if (area_top > area_bottom) {
				
				if (area_top > area_left) { // Top
					
					positionTop();
					
				} else { // Left
					
					positionLeft();
					
				}
				
			} else {
				
				if (area_bottom > area_left) { // Bottom
					
					positionBottom();
					
				} else { // Left
					
					positionLeft();
					
				}

			}
			
		} else {
			
			if (area_top > area_bottom) {
				
				if (area_top > area_right) { // Top
					
					positionTop();
					
				} else { // Right
					
					positionRight();
					
				}
				
			} else {
				
				if (area_bottom > area_right) { // Bottom
					
					positionBottom();					
					
				} else { // Right
					
					positionRight();
					
				}
				
			}
			
		}
		
		let rect_tip = tip.getBoundingClientRect();
		
		let offset_y = 0;
		
		if (rect_tip.y < 0) {
			
			offset_y = Math.abs(rect_tip.y) + 10;
			
		} else {
			
			if (rect_tip.bottom > window.innerHeight) {
				
				offset_y = window.innerHeight - rect_tip.bottom - 10;
				
			}
			
		}
		
		tip.style.setProperty('--offset_y', offset_y + 'px');
		
		let offset_x = 0;
		
		if (rect_tip.x < 0) {
			
			offset_x = Math.abs(rect_tip.x) + 10;
			
		} else {
			
			if (rect_tip.right > window.outerWidth) {
				
				offset_x = window.outerWidth - rect_tip.right - 10;
				
			}
			
		}
		
		tip.style.setProperty('--offset_x', offset_x + 'px');
		
	}
	
	function getToolTip(e) {
		
		return document.querySelector('.n-tool--tip[for="' + e.target.closest('.n-tool').getAttribute('data-n-tool') + '"]');
		
	}
	
	let hideTip = e => {
		
		let tip = getToolTip(e);
		tip.removeAttribute('aria-expanded');
		tip.removeAttribute('style');
		tip.removeAttribute('data-n-position');
		
	}
	
	let showTip = e => {
		
		let tip = getToolTip(e);
		tip.setAttribute('aria-expanded', true);
	    setTipPosition(tip);
		
	}
    
	var init = host => {
		
		/* Tooltip */
		
		let tooltips = host.querySelectorAll('.n-tool').length;
		
		host.querySelectorAll('.n-tool:not([data-ready])').forEach(el => {
			
		    let tip = el.querySelector('.n-tool--tip');
		    if (!tip) return;
		    
			let content = tip.innerHTML;
			tip.innerHTML = '';
			tip.insertAdjacentHTML('afterbegin', '<span>' + content + '</span>');

		    tip.setAttribute('for', tooltips);
		    el.setAttribute('data-n-tool', tooltips++);
		    document.body.appendChild(tip);
		    
			el.setAttribute('tabindex', 0);

			el.ontouchend = el.onmouseover = el.onfocus = showTip;
			el.onblur = el.onmouseout = hideTip;

			makeReady(el);
		
		});
		
	};
	registerComponent('tooltip', init);

})();

// Component Tooltip – end
;// Component Typography – start

(function (){

	let init = host => {
		
		/* Typography */
		
		if (typeof ResizeObserver === 'function') { // Compensate element height according to line height
	
			let ro = new ResizeObserver(entries => {
				
				entries.forEach(el => {
					
					let a = el.target;
					a.style.removeProperty('--adjust-height');
					let style = getComputedStyle(a);
					let line_height = parseFloat(style.lineHeight);
					let adjust = line_height - parseFloat(style.height) % line_height;
					if (adjust !== line_height) {

						a.style.setProperty('--adjust-height', adjust);
					
					}
					
				});
			
			});
			
			document.querySelectorAll('.n-adjust-height:not([data-ready])').forEach(el => {
				
				ro.observe(el);
				el.setAttribute('data-ready', true);
				
			});
		
		}
		
	};
	registerComponent('typography', init);

})();

// Component Typography – end
initComponents(); return { initComponents, animate, copyButton, componentModal, addComponent, componentSlider, componentNotify } })();