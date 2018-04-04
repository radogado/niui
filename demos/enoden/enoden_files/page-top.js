(function($){

	$(function(){

		// スライド
		$('.mainvisual-list').slick({
			dots: true,
			centerMode: true,
			variableWidth: true,
			autoplay: true,
			autoplaySpeed: 3000,
			arrows: false,
			speed: 1200,
			cssEase: 'cubic-bezier(.73,0,.2,.98)',
			responsive: [
				{
					breakpoint: 640,
					settings: {
						centerMode: false,
						slidesToShow: 1,
						variableWidth: false
					}
				}
			]
		});

		$('.banner-mini-list').slick({
			slidesToShow: 2,
			responsive: [
				{
					breakpoint: 768,
					settings: {
						centerMode: true,
						slidesToShow: 1,
						variableWidth: false
					}
				}
			]
		});

		// 高さ揃え
		$('.top-menu-inner').matchHeight();

	});
	
	$(window).load(function(){});

})(jQuery);