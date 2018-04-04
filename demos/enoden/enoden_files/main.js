
var RNCN = RNCN || {};

RNCN = {

	$win: $(window),
	$body: $('body'),

	breakPointSp: 640,
	breakPointTab: 800,
	breakPointPC: 1200,
	scrollTop: 0,
	scrollLeft: 0,

	init: function(){
		var me = this;
		me.$win = $(window);
		me.$body = $('body');
		me.winW = me.$win.width();
		me.winH = me.$win.height();
		me.bodyH = me.$body.height();
		me.isMini = me.$win.width() <= me.breakPointSp;
		me.isTab = me.breakPointSp <= me.$win.width() && me.$win.width() <= me.breakPointTab;
		me.isPC = me.breakPointTab <= me.$win.width() && me.$win.width() <= me.breakPointPC;

		_resize();
		me.$win.on('resize', function(){
			_resize();
		});

		_scroll();
		me.$win.on('scroll', function(){
			_scroll();
		});

		function _resize(){
			me.winW = me.$win.width();
			me.winH = me.$win.height();
			me.isMini = me.$win.width() <= me.breakPointSp;
			me.isTab = me.breakPointSp <= me.$win.width() && me.$win.width() <= me.breakPointTab;
			me.isPC = me.breakPointTab <= me.$win.width() && me.$win.width() <= me.breakPointPC;
			me.resizeHdl();
		}

		function _scroll(){
			me.scrollTop = me.$win.scrollTop();
			me.scrollLeft = me.$win.scrollLeft();
		}
	},

	/*  resize
	--------------------------------------------------*/
	resizeHdl: function() {
		var me = this;
	},

	smoothscroll: function(speed,easing){
		$('.smooth, .sub-navigation a, .pagetop a').on('click',function(e){
            e.preventDefault();
            var href= $(this).attr("href");
            var target = $(href == "#" || href == "" ? 'html' : href);
            var position = target.offset().top;
            $('body,html').animate({scrollTop:position}, speed, easing);
		});
	},

	afade: function(speed,easing){
		$('.afade, .afadeArea a').hover(function(){
			$(this).stop().fadeTo(speed,0.6,easing);
		}, function(){
			$(this).stop().fadeTo(speed,1,easing);
		});
	},

	aimgfade: function(speed,easing){
		$('a.aimgfade').each(function(){
			var $this = $(this);
			var $img = $this.find('img');
			var w = $img.width();
			var h = $img.height();
			var imgsrc = $img.attr('src');
			//
			// var pattern = /(?:.+\/)?(.*)(\..+)/;
			var pattern = /(.*)(\..+)/;
			//
			var imgfilename = imgsrc.match(pattern)[1];
			var ext = imgsrc.match(pattern)[2];

			$this.css({ 'position':'relative', 'display':'inline-block', width:w, height:h });
			$this.prepend('<img src="'+imgfilename+'_ov'+ext+'" style="position:absolute;top:0;left:0;display:none;" class="aimgfadeov">');
			var $imgov = $this.find('.aimgfadeov');
			$this.hover(function(){
				// $img.stop(false,true).animate({opacity:0},speed,easing);
				$imgov.stop(false,true).fadeIn(speed,easing);
			}, function(){
				$img.stop(false,true).animate({opacity:1},speed,easing);
				$imgov.stop(false,true).fadeOut(speed,easing);
			});
		});
	},

	// IE8
	bugfixIE8: function(){
		if(navigator.userAgent.indexOf("MSIE 8") != -1) {
			// png opacity
			jQuery('img').each(function() {
				if(jQuery(this).attr('src').indexOf('.png') != -1) {
					jQuery(this).css({
							'filter': 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + jQuery(this).attr('src') + '", sizingMethod="scale");'
					});
				}
			});
		}
	}
};


(function($){

	var util = RNCN;

	$(function(){

		$('body').addClass('ready');

		util.init();
		util.smoothscroll(400,'easeInOutQuart');

		$('.commonPop').on('click', function(e){
			e.preventDefault();

			var width = 700;
			var height = 800;

			var size = $(this).attr('rel');
			width = size.split(',')[0];
			height = size.split(',')[1];
			var href = $(this).attr('href');

			window.open(href, 'popup', 'width='+width+',height='+height+', scrollbars=yes ');

		});

		// header search
		var isSearchShow = false;
		$('.site-header-navigation .search-btn').on('click', function(e){
			e.preventDefault();
			if( !isSearchShow ) {
				$('.site-header-navigation li.search').addClass('show');
				isSearchShow = true;
			}
			else {
				$('.site-header-navigation li.search').removeClass('show');
				isSearchShow = false;
			}
		});

		// sp
		var isSiteNavOpen = false;
		var $spNav = $('.sp-site-side-navigation');
		$('.sp-site-side-navigation-btn, .sp-site-side-navigation-close').on('click', function(e){
			e.preventDefault();
			if( !isSiteNavOpen ) {
				$spNav.css('top', util.scrollTop);
				$('body').addClass('nav-open');
				isSiteNavOpen = true;
			}
			else {
				$('body').removeClass('nav-open');
				$('.gsc-results-wrapper-overlay').removeClass('gsc-results-wrapper-visible');
				$('.gsc-modal-background-image-visible').removeClass('gsc-modal-background-image-visible');
				isSiteNavOpen = false;
			}
		});

		var isLocalNavOpen = false;
		$('.sp-global-header-navigation-menu-btn, .global-header-navigation-menu .close').on('click', function(e){
			e.preventDefault();
			if( !isLocalNavOpen ) {
				$('body').addClass('lnav-open');
				isLocalNavOpen = true;
			}
			else {
				$('body').removeClass('lnav-open');
				isLocalNavOpen = false;
			}
		});

		// ニュース
		$('.information-tab ul li a').on('click', function(e){
			e.preventDefault();

			var target = $(this).attr('href').split('#')[1];

			$('.information-tab ul li a').removeClass('current');
			$(this).addClass('current');

			$('.information-list').hide();
			$('.information-list-'+target).show();
		});

		//var isSpSearchOpen = false;
		//$('.sp-site-side-navigation-search-btn').on('click', function(e){
		//	e.preventDefault();
		//
		//	if( !isSpSearchOpen ) {
		//		$('body').addClass('is-sp-search-open');
		//		isSpSearchOpen = true;
		//	}
		//	else {
		//		$('body').removeClass('is-sp-search-open');
		//		isSpSearchOpen = false;
		//	}
		//})

	});

	$(window).load(function(){
		$('body').addClass('load');
	});

})(jQuery);
