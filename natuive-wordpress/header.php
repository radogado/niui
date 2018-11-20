<!doctype html>
<html <?php language_attributes(); ?> class="no-js n-type">
	<head>
		<meta charset="<?php bloginfo('charset'); ?>">
		<title><?php wp_title(''); ?><?php if(wp_title('', false)) { echo ':'; } ?> <?php bloginfo('name'); ?></title>

		<link href="//www.google-analytics.com" rel="dns-prefetch">
        <link href="<?php echo get_template_directory_uri(); ?>/img/icons/favicon.ico" rel="shortcut icon">
        <link href="<?php echo get_template_directory_uri(); ?>/img/icons/touch.png" rel="apple-touch-icon-precomposed">

		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="description" content="<?php bloginfo('description'); ?>">

		<?php wp_head(); ?>

        <!--[if lte IE 9]> 
        	<link rel=styleSheet href=<?php echo get_template_directory_uri(); ?>/ie.css type=text/css media=screen>
        	<script src=<?php echo get_template_directory_uri(); ?>/html5shiv.min.js></script> 
        <![endif]-->

	</head>
	<body <?php body_class(); ?>>

			<!-- header -->
			<header id="head" class="n-type n-header" role="banner">
				
				<div class="n-row n-contain">
					<div>
					<!-- logo -->
					
					<?php if ( get_theme_mod( 'themeslug_logo' ) ) : ?>

					<?php
					    $themelogo = get_theme_mod( 'themeslug_logo' );
					    $themelogo_size = getimagesize($themelogo);
					    $themelogo_width = $themelogo_size[0];
					    $themelogo_height = $themelogo_size[1];
					?>

					    <div class='logo' style='min-height: <?php echo $themelogo_height; ?>px; margin: 1em 0 1.5em 0;'>
					        <a style="position: absolute;" href='<?php echo esc_url( home_url( '/' ) ); ?>' title='<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>' rel='home'>
						        
<!-- 						        <img src='<?php echo esc_url( get_theme_mod( 'themeslug_logo' ) ); ?>' alt='<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>'> -->

<img src='<?php echo str_replace( 'http://', '//', esc_url( get_theme_mod( 'themeslug_logo' ) ) ); ?>' alt='<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?> Logo' class="img-responsive full" height="<?php echo($themelogo_height);?>" width="<?php echo($themelogo_width);?>">
						        
						        </a>
					    </div>
					<?php else : ?>
					<div class="logo">
						<a href="<?php echo home_url(); ?>">
							<!-- svg logo - toddmotto.com/mastering-svg-use-for-a-retina-web-fallbacks-with-png-script -->
							<img src="<?php echo get_template_directory_uri(); ?>/img/logo.svg" alt="natUIve WordPress" class="logo-img">
						</a>
					</div>
					<?php endif; ?>
					
					<!-- /logo -->

					<!-- nav -->
					<?php html5blank_nav(); ?>
					<!-- /nav -->
					</div>
				</div>
			</header>
			<!-- /header -->
			<div id="content" class="n-row n-contain n-type">
