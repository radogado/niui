<!doctype html>
<html <?php language_attributes(); ?> class="n-type n-wp">
	<head>
		<meta charset="<?php bloginfo('charset'); ?>">
		<title><?php wp_title(''); ?><?php if(wp_title('', false)) { echo ':'; } ?> <?php bloginfo('name'); ?></title>

<!--
        <link href="<?php echo get_template_directory_uri(); ?>/img/icons/favicon.ico" rel="shortcut icon">
        <link href="<?php echo get_template_directory_uri(); ?>/img/icons/touch.png" rel="apple-touch-icon-precomposed">
-->

		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5, user-scalable=yes, viewport-fit=cover"/>
		<meta name="description" content="<?php bloginfo('description'); ?>">

		<?php wp_head(); ?>

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

					    <div class='logo'>
					        <a class="n-aspect" style='--width: <?php echo $themelogo_width/2; ?>; --height: <?php echo $themelogo_height/2; ?>;' href='<?php echo esc_url( home_url( '/' ) ); ?>' title='<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>' rel='home'>
						        
								<img src='<?php echo str_replace( 'http://', '//', esc_url( get_theme_mod( 'themeslug_logo' ) ) ); ?>' alt='<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?> Logo' class="img-responsive full">
						        
						    </a>
						    
						    <div>

							    <a href="<?php echo get_home_url(); ?>">
								    
								    <h2><?php echo get_bloginfo( 'name', 'display' );?></h2>
								    <h3><?php printf( esc_html__( '%s', 'textdomain' ), get_bloginfo ( 'description' ) ); ?></h3>
							    
							    </a>
						    
						    </div>

					    </div>
					<?php else : ?>
					<div class="logo">

					        <a class="n-aspect default-logo" style='display: none; --width: 441px; --height: 56;' href='<?php echo esc_url( home_url( '/' ) ); ?>' title='<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>' rel='home'>
						        
								<img src="<?php echo get_template_directory_uri(); ?>/img/logo.svg" alt="niui WordPress" class="logo-img">
						        
						    </a>
						    
						    <div>
							    
							    <h2><?php echo get_bloginfo( 'name', 'display' );?></h2>
							    <h3><?php printf( esc_html__( '%s', 'textdomain' ), get_bloginfo ( 'description' ) ); ?></h3>
						    
						    </div>

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
