var componentLightbox = (function (){

/* Lightbox – start */

	function adjustZoom(e) { // Event is click on image
		
		var width = q('.n-ovrl:last-of-type .n-slider--wrap').offsetWidth;
		var height = q('.n-ovrl:last-of-type .n-slider--wrap').offsetHeight;
		
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

		addClass(img.parentNode, 'n-lightbox--loaded');
		
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
		
		var img = slider.children[(typeof i === 'undefined') ? 0 : i].querySelector('img');
	
		if (img && !img.src) {
			
			img.src = img.getAttribute('data-src');
			if (img.complete) {
				
				imageLoaded(img);
				
			}
			img.onload = img.onerror = (e) => {
				
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
		
	    if (typeof componentSlider.makeSlider !== 'function') { // slider JS not present
		    
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
	
	
		addClass(lightbox_target, 'n-slider');
		addClass(lightbox_target, 'n-lightbox');
		addClass(lightbox_target, 'n-lightbox--inline');
		transferClass(lightbox, lightbox_target, 'n-lightbox--thumbnails');
		transferClass(lightbox, lightbox_target, 'n-slider--top');
		transferClass(lightbox, lightbox_target, 'n-slider--fade');
		
		if (lightbox.getAttribute('data-duration')) {
			
			lightbox_target.setAttribute('data-duration', lightbox.getAttribute('data-duration'));

		}

		if (lightbox.getAttribute('data-autoslide') !== null) {
			
			lightbox_target.setAttribute('data-autoslide', lightbox.getAttribute('data-autoslide'));

		}
	
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
			if (hasClass(lightbox, 'n-full-screen')) {
		
				addClass(lightbox_target, 'n-full-screen');
				
				
			}
	
		}
	
		transferClass(lightbox, lightbox_target, 'n-slider--vertical');
		transferClass(lightbox, lightbox_target, 'n-slider--right');
	
		if (lightbox.getAttribute('data-peek')) {
					
			lightbox_target.setAttribute('data-peek', lightbox.getAttribute('data-peek'));
	
		}	
		
	    /* Add any <a><img> siblings with description to a .n-slider and initialise its controls */
	    var images = '';
		var thumbnails = [];
	    lightbox.childNodes.forEach((el) => { // To do: facilitate a[href] extraction also from within div slides, if lightbox is existing and needs to be recreated for full screen. Get them in an array item[i].link, item[i].img
		    
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
	
			var slide_link;
			
			if (hasClass(lightbox, 'n-slider') || !el.href ) {
				
				slide_link = '';
	
			} else {
	
				slide_link = document.location.href.split('#')[0].split('?')[0] + '?image=' + el.href.split('/').pop() + '#' + lightbox.getAttribute('id');
				
			}
	
		    var link_element = (hasClass(lightbox, 'n-lightbox--inline') || !lightbox.getAttribute('id')) ? '' : `<a class="n-btn n-lightbox--copy" href=${slide_link}></a>`;
	
		    var url = hasClass(lightbox, 'n-slider') ? (el.querySelector('img') ? el.querySelector('img').getAttribute('data-src') : '') : el.href;
		    
			var caption = el.title ? el.title : (el.querySelector('img') ? el.querySelector('img').title : '');
			var caption_attribute = el.querySelector('img') ? el.querySelector('img').getAttribute('data-caption') : false;
			
			if (typeof caption_attribute === 'string') { // When an inline lightbox opens a full window one
				
				caption = caption_attribute;
				
			}
					    
		    images += `<div><img data-src="${url}" title="" data-link="${slide_link}" data-caption="${caption}">${(caption ? ('<p class=n-lightbox--caption>' + caption + '</p>') : '') + link_element}</div>`;
	
	        // Attach onload event to each image to display it only when fully loaded and avoid top-to-bottom reveal?
	
	    });
	
	    lightbox_target.innerHTML = images;
	    
	    if (inline_static) { // It's an inline lightbox and needs to become full window/screen when clicked
		    
		    lightbox_target.onclick = (e) => {
			    
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
	
		if (hasClass(lightbox, 'n-lightbox--inline')) { // Secondary lightbox
	
	    	this_index = Array.prototype.indexOf.call(lightbox.children, anchor.parentNode); // Ignore non-anchor children of the lightbox container
			
		} else {
	
	        this_index = Array.prototype.indexOf.call(lightbox.querySelectorAll('[href]'), anchor.closest('[href]')); // Ignore non-anchor children of the lightbox container
	
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
			componentModal.openFullWindow(slider); // To do: fix layout, add .overlay
	
		}
	
	    transferClass(anchor.parentNode, lightbox_target.parentNode, 'n-slider--outside');
	    
	    if (hasClass(lightbox, 'n-lightbox--thumbnails')) {
	    
		    transferClass(lightbox, lightbox_target.parentNode, 'n-lightbox--thumbnails');
	        var i = 0;
	// 	        var nav = closestElement(lightbox_target, '.n-slider--wrap').querySelector('.n-slider--nav');
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
		
		if (q('.n-lightbox:target:not(.n-lightbox--inline)')) {
			
			addClass(q('.n-lightbox:target'), 'uri-target');
			openLightbox(q('.n-lightbox:target > a[href]'));
			
		}
		
		if (q('.n-modal:target')) {
			
			q('.n-modal:target').click();
			
		}
		
	}, 1);
	
	var init = (host) => {
		
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

	return { populateLightbox: populateLightbox };	

})();
