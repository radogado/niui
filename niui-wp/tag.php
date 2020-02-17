<?php get_header(); ?>

	<main role="main" class="_3/4">
		<!-- section -->
		<section class="n-section">

			<h1><?php _e( 'Tag Archive: ', 'html5blank' ); echo single_tag_title('', false); ?></h1>

			<?php get_template_part('loop'); ?>

			<?php get_template_part('pagination'); ?>

		</section>
		<!-- /section -->
	</main>

<div class="_1/4"> <?php get_sidebar(); ?> </div>

<?php get_footer(); ?>
