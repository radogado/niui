<?php get_header(); ?>

	<main role="main" class="col34">
		<!-- section -->
		<section>

			<h1><?php _e( 'Tag Archive: ', 'html5blank' ); echo single_tag_title('', false); ?></h1>

			<?php get_template_part('loop'); ?>

			<?php get_template_part('pagination'); ?>

		</section>
		<!-- /section -->
	</main>

<div class="col4"> <?php get_sidebar(); ?> </div>

<?php get_footer(); ?>
