// Component Parallax – start

(function (){
    
// Thanks Dave Rupert

	let parallaxSpeed = 0.2;
	
	let updateParallax = () => {
	
		document.querySelectorAll('.n-parallax-content').forEach(el => {
		
			el.style.setProperty("--scrollparallax", (document.body.scrollTop || document.documentElement.scrollTop) * parallaxSpeed);
		
		});
			
	};
	
	window.addEventListener('scroll', updateParallax);

	let init = host => {
		
	
	};
	registerComponent('parallax', init);

})();

// Component Parallax – end
