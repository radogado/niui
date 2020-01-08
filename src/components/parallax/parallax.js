// Component Parallax – start

(function (){
    
// Thanks Dave Rupert

	let parallaxSpeed = 0.2;
	
	let updateParallax = () => {
	
		qa('.n-parallax').forEach(el => {
			
			let parent = el.parentElement;
			let scroll_offset = parent.scrollHeight > parent.offsetHeight ? Math.abs(parent.getBoundingClientRect().y) : (bodyElement.scrollTop || document.documentElement.scrollTop);
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
