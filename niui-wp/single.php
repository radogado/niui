<?php get_header(); ?>

	<main role="main" class="_3/4">
	<!-- section -->
	<section class="n-section">

	<?php if (have_posts()): while (have_posts()) : the_post(); ?>

		<!-- article -->
		<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

			<!-- post thumbnail -->
			<?php if ( has_post_thumbnail()) : // Check if Thumbnail exists ?>
<!--
				<a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>">
					<?php the_post_thumbnail(); // Fullsize image for the single post ?>
				</a>
-->
			<?php $image_data = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), "original" ); ?>
			<?php $thumbnail_placeholder = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), "medium" )[0]; ?>
			<div class="featured-image">
				<span class="n-aspect n-middle" style="--height: <?php echo ($image_data[2]); ?>; --width: <?php echo ($image_data[1]) ?>; --placeholder: url(<?php echo $thumbnail_placeholder ?>)">
					<?php the_post_thumbnail(); // Fullsize image for the single post ?>
				</span>
			</div>
			<?php endif; ?>
			
			<!-- /post thumbnail -->

			<!-- post title -->
			<h1>
				<?php the_title(); ?>
			</h1>
			<!-- /post title -->

			<!-- post details -->
			<small><span class="date"><?php the_time('F j, Y'); ?> <?php the_time('g:i a'); ?></span></small>
			<small><span class="author"><?php _e( 'Published by', 'html5blank' ); ?> <?php the_author_posts_link(); ?></span></small>
			<small><span class="comments"><?php if (comments_open( get_the_ID() ) ) comments_popup_link( __( 'Leave your thoughts', 'html5blank' ), __( '1 Comment', 'html5blank' ), __( '% Comments', 'html5blank' )); ?></span></small>
			<!-- /post details -->

			<?php the_content(); // Dynamic Content ?>

			<?php the_tags( __( 'Tags: ', 'html5blank' ), ', ', '<br>'); // Separated by commas with a line break at the end ?>

			<small><p><?php _e( 'Categorised in: ', 'html5blank' ); the_category(', '); // Separated by commas ?></p></small>

			<small><p><?php _e( 'This post was written by ', 'html5blank' ); the_author(); ?></p></small>

			<small><?php edit_post_link(); // Always handy to have Edit Post Links available ?></small>

			<?php comments_template(); ?>

		</article>
		<!-- /article -->

	<?php endwhile; ?>

	<?php else: ?>

		<!-- article -->
		<article>

			<h1><?php _e( 'Sorry, nothing to display.', 'html5blank' ); ?></h1>

		</article>
		<!-- /article -->

	<?php endif; ?>

	</section>
	<!-- /section -->
	</main>

<div class="_1/4"> <?php get_sidebar(); ?> </div>

<?php get_footer(); ?>
