var componentLightbox = (function (){

/* Lightbox – start */

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
	
	function openLightbox(e) { // To do: create all content in an unattached element and call openFullWindow(el), which will take over
	
	// 	observerOff();
	
	    if (typeof componentSlider.makeSlider !== 'function') { // slider JS not present
		    
		    return;
	
		}
	
		var el = e.target;
		if (el.length === 0) {
			
			el = e;
	
		}
		
	    var lightbox = closest(el, '.lightbox');
	    var animation = lightbox.getAttribute('data-anim');
		var lightbox_target = document.createElement('div');
		var inline_static = lightbox.matches('.inline:not(.slider)');
	
	
		addClass(lightbox_target, 'slider');
		addClass(lightbox_target, 'lightbox');
		addClass(lightbox_target, 'inline');
	
		if (inline_static) { // If it's inline, it must become a slider/lightbox to replace the original lightbox element
			// Replace the lightbox by a slider lightbox. Generate the new slider/lightbox in place of the original one
	// 		lightbox_target.classList = 'slider lightbox inline'; // Not working in Edge
			lightbox_target.id = lightbox.id ? lightbox.id : '';
			var parent = lightbox.parentNode;
			var next_sibling = lightbox.nextElementSibling;
			lightbox.outerHTML = ''; // Remove from DOM, but still existing as a variable
			
		} else { // else it's an existing lightbox and the new one should be separate and full screen
			
	//		openFullWindow('<div class="slider lightbox full-window' + (hasClass(lightbox, 'full-screen') ? ' full-screen' : '') + '"></div>', animation); // openFullWindow to be moved at the end
	// 		lightbox_target.classList = 'slider lightbox inline' + (hasClass(lightbox, 'full-screen') ? ' full-screen' : ''); // Not working in Edge
			if (hasClass(lightbox, 'full-screen')) {
		
				addClass(lightbox_target, 'full-screen');
				
				
			}
	
		}
	
		transferClass(lightbox, lightbox_target, 'vertical');
		transferClass(lightbox, lightbox_target, 'right');
	
		if (lightbox.getAttribute('data-peek')) {
					
			lightbox_target.setAttribute('data-peek', lightbox.getAttribute('data-peek'));
	
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
	
				slide_link = document.location.href.split('#')[0].split('?')[0] + '?image=' + el.href.split('/').pop() + '#' + lightbox.getAttribute('id');
				
			}
	
		    var link_element = (hasClass(lightbox, 'inline') || !lightbox.getAttribute('id')) ? '' : '<a class="button copy" href=' + slide_link + '></a>';
	
		    var url = hasClass(lightbox, 'slider') ? (el.querySelector('img') ? el.querySelector('img').getAttribute('data-src') : '') : el.href;
		    
		    images += '<div><img data-src="' + url + '" alt="' + el.title + '" data-link="' + slide_link + '">' + (el.title ? ('<p>' + el.title + '</p>') : '') + link_element + '</div>';
	
	        // Attach onload event to each image to display it only when fully loaded and avoid top-to-bottom reveal?
	
	    });
	
	    lightbox_target.innerHTML = images;
	    
	    if (inline_static) { // It's an inline lightbox and needs to become full window/screen when clicked
		    
		    lightbox_target.onclick = function(e) {
			    
			    if (e.target.tagName === 'IMG') {
				    
				    openLightbox(e);
	
			    }
			    
		    };
		    
	    }
	
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
	
		if (hasClass(lightbox, 'inline')) { // Secondary lightbox
	
	    	this_index = Array.prototype.indexOf.call(lightbox.children, anchor.parentNode); // Ignore non-anchor children of the lightbox container
			
		} else {
	
	        this_index = Array.prototype.indexOf.call(lightbox.querySelectorAll('[href]'), closest(anchor, '[href]')); // Ignore non-anchor children of the lightbox container
	
		}
	
	    if (location.href.indexOf('#' + lightbox.id) > -1 && hasClass(lightbox, 'uri-target')) {
	        
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
	
	    populateLightbox(lightbox_target, this_index);
	
		var slider = componentSlider.makeSlider(lightbox_target, this_index); // To do: Replace by init() and Observer, but this_index needs to be specified, by an .active nav item
	// attach lightbox_target to the DOM
		if (inline_static) {
	
			if (!next_sibling) {
	
				parent.appendChild(slider);
			
			} else {
	
				next_sibling.insertBefore(slider);
			
			}
	
	
		} else { // OpenFullWindow() and attach the slider to it
			
			addClass(slider, 'overlay');
			addClass(slider.querySelector('.slider'), 'overlay');
			openFullWindow(slider); // To do: fix layout, add .overlay
	
		}
	
	    transferClass(anchor.parentNode, lightbox_target.parentNode, 'outside');
	    
	    if (hasClass(anchor.parentNode, 'thumbnails')) {
	    
		    transferClass(anchor.parentNode, lightbox_target.parentNode, 'thumbnails');
	        var i = 0;
	// 	        var nav = closest(lightbox_target, '.n-sldr').querySelector('.slider-nav');
	        var nav = componentSlider.getSliderNav(closest(lightbox_target, '.n-sldr'));
	
	        if (nav) { // Multiple slides?
	
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
	    
	// 	observerOn();
	
	    return false;
	
	}
	
	// Automatically open a lightbox specified in the URI
	
	setTimeout( function () {
		
		if (q('.lightbox:target:not(.inline)')) {
			
			addClass(q('.lightbox:target'), 'uri-target');
			openLightbox(q('.lightbox:target > a[href]'));
			
		}
		
		if (q('.modal:target')) {
			
			q('.modal:target').click();
			
		}
		
	}, 1);
	
	var selector = '.lightbox';
	var init = function (host){
		
		forEach(host.querySelectorAll('.lightbox:not([data-ready])'), function(el) {
		
			// Abort on IE, because of IE bug on dynamic img.src change
			if (navigator.userAgent.indexOf('MSIE') != -1 || navigator.userAgent.indexOf('Trident') != -1 || hasClass(el.parentNode, 'n-sldr')) {
				
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
			
			makeReady(el);
		
		});
		
	};
	registerComponent('lightbox', selector, init);

/* Lightbox – end */

	return { populateLightbox: populateLightbox };	

})();
