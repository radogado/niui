// Component Parallax – start

(function (){
    
// Thanks Dave Rupert

	let parallaxSpeed = 0.2;
	
	let updateParallax = () => {
	
		qa('.n-parallax').forEach(el => {
		
			el.style.setProperty("--scrollparallax", (document.body.scrollTop || document.documentElement.scrollTop) * parallaxSpeed);
		
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
