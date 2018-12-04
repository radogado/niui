<?php if (have_posts()): while (have_posts()) : the_post(); ?>

	<!-- article -->
	<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

		<!-- post thumbnail -->
		<?php if ( has_post_thumbnail()) : // Check if thumbnail exists 

			$post_thumbnail_id = get_post_thumbnail_id($post->ID);
			$post_thumbnail_url = wp_get_attachment_url( $post_thumbnail_id );
			
		?>
		
		<div class="headline">
			
			<a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>" class="img-crop">
				
				<img src="<?php echo $post_thumbnail_url ?>" alt="Background">

				<h2><?php the_title(); ?> &rarr;</h2>
				
			</a>
			
		</div>
		<!-- /post thumbnail -->

		<?php else: ?>

		<!-- post title -->
		<div class="headline">
			<h2>
				<a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>"><?php the_title(); ?></a>
			</h2>
		</div>

		<?php endif; ?>
		<!-- /post title -->

		<?php the_content(); //html5wp_excerpt('html5wp_index'); // Build your custom callback length in functions.php ?>

		<!-- post details -->
		<small><span class="date"><?php the_time('F j, Y'); ?> <?php //the_time('g:i a'); ?></span></small>
<!-- 		<small><span class="author"><?php _e( 'Published by', 'html5blank' ); ?> <?php the_author_posts_link(); ?></span></small> -->
		<small> &nbsp;<span class="comments"><?php if (comments_open( get_the_ID() ) ) comments_popup_link( __( 'Leave your thoughts', 'html5blank' ), __( '1', 'html5blank' ), __( '%', 'html5blank' )); ?></span></small>
		<!-- /post details -->

		<?php //edit_post_link(); ?>

	</article>
	<!-- /article -->

<?php endwhile; ?>

<?php else: ?>

	<!-- article -->
	<article>
		<h2><?php _e( 'Sorry, nothing to display.', 'html5blank' ); ?></h2>
	</article>
	<!-- /article -->

<?php endif; ?>
