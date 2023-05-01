<?php get_header(); ?>

	<main role="main" class="_3/4">

		<?php
		if( !is_paged() ) {		
	    $args=array(
	      'tag' => 'featured',
	      'showposts'=>5,
	      'caller_get_posts'=>1
	    );
	    $my_query = new WP_Query($args);
	    if( $my_query->have_posts() ) {
			echo '<div class="n-carousel n-carousel--auto-slide" data-interval="4"><div class="n-carousel__content featured">';
	      	while ($my_query->have_posts()) : $my_query->the_post(); ?>
	        	<div><h2><a href="<?php the_permalink() ?>" rel="bookmark" title="Permanent Link to <?php the_title_attribute(); ?>"></a><?php the_title(); ?> </h2><br> <?php the_post_thumbnail(); //the_content(); ?></div>
	       	<?php
	      	endwhile;
			echo '</div></div>';

	    } //if ($my_query)
		wp_reset_query();  // Restore global post data stomped by the_post().
		}
	  ?>
		
		<!-- section -->
		<section class="n-section">

<!-- 			<h1><?php _e( 'Latest Posts', 'html5blank' ); ?></h1> -->

			<?php get_template_part('loop'); ?>

			<?php get_template_part('pagination'); ?>

		</section>
		<!-- /section -->
	</main>

<div class="_1/4"> <?php get_sidebar(); ?> </div>

<?php get_footer(); ?>
