<!doctype html>
<html <?php language_attributes(); ?> class="no-js">
	<head>
		<meta charset="<?php bloginfo('charset'); ?>">
		<title><?php wp_title(''); ?><?php if(wp_title('', false)) { echo ' :'; } ?> <?php bloginfo('name'); ?></title>

		<link href="//www.google-analytics.com" rel="dns-prefetch">
        <link href="<?php echo get_template_directory_uri(); ?>/img/icons/favicon.ico" rel="shortcut icon">
        <link href="<?php echo get_template_directory_uri(); ?>/img/icons/touch.png" rel="apple-touch-icon-precomposed">

		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="description" content="<?php bloginfo('description'); ?>">

		<?php wp_head(); ?>

        <!--[if lte IE 9]> 
        	<link rel=styleSheet href=<?php echo get_template_directory_uri(); ?>/ie9-.css type=text/css media=screen>
        	<script src=<?php echo get_template_directory_uri(); ?>/html5shiv.min.js></script> 
        <![endif]-->

	</head>
	<body <?php body_class(); ?>>

			<!-- header -->
			<header id="head" class="header clear" role="banner">
				
				<div class="row contain">
					<div>
					<!-- logo -->
					
					<?php if ( get_theme_mod( 'themeslug_logo' ) ) : ?>
					    <div class='logo'>
					        <a href='<?php echo esc_url( home_url( '/' ) ); ?>' title='<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>' rel='home'><img src='<?php echo esc_url( get_theme_mod( 'themeslug_logo' ) ); ?>' alt='<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>'></a>
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
					<nav class="nav" role="navigation">
						<?php html5blank_nav(); ?>
					</nav>
					<!-- /nav -->
					</div>
				</div>
			</header>
			<!-- /header -->
			<div id="content" class="row contain">
			