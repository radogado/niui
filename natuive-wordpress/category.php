<?php get_header(); ?>

	<main role="main" class="col34">
		<!-- section -->
		<section>

			<h1><?php _e( 'Categories for ', 'html5blank' ); single_cat_title(); ?></h1>

			<?php get_template_part('loop'); ?>

			<?php get_template_part('pagination'); ?>

		</section>
		<!-- /section -->
	</main>

<div class="col4"> <?php get_sidebar(); ?> </div>

<?php get_footer(); ?>
