<?php
error_reporting(E_ERROR | E_PARSE);

add_action( 'wp_enqueue_scripts', 'remove_global_styles' );
function remove_global_styles(){
  wp_dequeue_style( 'global-styles' );
}

add_filter('max_srcset_image_width', function($max_srcset_image_width, $size_array){
    return 7680;
}, 10, 2);

/*
 *  Author: Todd Motto | @toddmotto
 *  URL: html5blank.com | @html5blank
 *  Custom functions, support, custom post types and more.
 */

/*------------------------------------*\
	External Modules/Files
\*------------------------------------*/

// Load any external files you have here

/*------------------------------------*\
	Theme Support
\*------------------------------------*/

if (!isset($content_width))
{
    $content_width = 900;
}

if (function_exists('add_theme_support'))
{
    // Add Menu Support
    add_theme_support('menus');

    // Add Thumbnail Theme Support
    add_theme_support('post-thumbnails');
    add_image_size('large', 700, '', true); // Large Thumbnail
    add_image_size('medium', 250, '', true); // Medium Thumbnail
    add_image_size('small', 120, '', true); // Small Thumbnail
    add_image_size('custom-size', 700, 200, true); // Custom Thumbnail Size call using the_post_thumbnail('custom-size');
    add_image_size('2560px', 2560, 2560); // Custom Thumbnail Size call using the_post_thumbnail('custom-size');
    add_image_size('3840px', 3840, 3840); // Custom Thumbnail Size call using the_post_thumbnail('custom-size');

    // Add Support for Custom Backgrounds - Uncomment below if you're going to use
    /*add_theme_support('custom-background', array(
	'default-color' => 'FFF',
	'default-image' => get_template_directory_uri() . '/img/bg.jpg'
    ));*/

    // Add Support for Custom Header - Uncomment below if you're going to use
    /*add_theme_support('custom-header', array(
	'default-image'			=> get_template_directory_uri() . '/img/headers/default.jpg',
	'header-text'			=> false,
	'default-text-color'		=> '000',
	'width'				=> 1000,
	'height'			=> 198,
	'random-default'		=> false,
	'wp-head-callback'		=> $wphead_cb,
	'admin-head-callback'		=> $adminhead_cb,
	'admin-preview-callback'	=> $adminpreview_cb
    ));*/

    // Enables post and comment RSS feed links to head
    add_theme_support('automatic-feed-links');

    // Localisation Support
    load_theme_textdomain('html5blank', get_template_directory() . '/languages');
}

/*------------------------------------*\
	Functions
\*------------------------------------*/

// HTML5 Blank navigation
function html5blank_nav()
{
/*
	wp_nav_menu(
	array(
		'theme_location'  => 'header-menu',
		'menu'            => '',
		'container'       => '',
		'container_class' => 'menu-{menu slug}-container',
		'container_id'    => '',
		'menu_class'      => '',
		'menu_id'         => '',
		'echo'            => true,
		'fallback_cb'     => 'wp_page_menu',
		'before'          => '',
		'after'           => '',
		'link_before'     => '',
		'link_after'      => '',
		'items_wrap'      => '',
		'depth'           => 0,
		'walker'          => ''
		)
	);
*/
	wp_list_pages( array( 'title_li' => '' ) );

}

// Load HTML5 Blank scripts (header.php)
function html5blank_header_scripts()
{
    if ($GLOBALS['pagenow'] != 'wp-login.php' && !is_admin()) {

/*
    	wp_register_script('conditionizr', get_template_directory_uri() . '/js/lib/conditionizr-4.3.0.min.js', array(), '4.3.0'); // Conditionizr
        wp_enqueue_script('conditionizr'); // Enqueue it!

        wp_register_script('modernizr', get_template_directory_uri() . '/js/lib/modernizr-2.7.1.min.js', array(), '2.7.1'); // Modernizr
        wp_enqueue_script('modernizr'); // Enqueue it!
*/
        wp_register_script('html5blankscripts1', str_replace( 'http://', '//', get_template_directory_uri() ) . '/niui.min.js', '', '1.0.0', 'true'); // Custom scripts
//         wp_register_script('html5blankscripts', get_template_directory_uri() . '/niui.js', '', '1.0.0', 'true'); // Custom scripts
//         wp_register_script('html5blankscripts2', get_template_directory_uri() . '/niui-slider.js', '', '1.0.0', 'true'); // Custom scripts
//         wp_enqueue_script('html5blankscripts'); // Enqueue it!
        wp_enqueue_script('html5blankscripts1'); // Enqueue it!
//         wp_enqueue_script('html5blankscripts2'); // Enqueue it!

		// To do: enqueue IE9- if detected
    }
}

function html5blank_nojquery()
{
    if ($GLOBALS['pagenow'] != 'wp-login.php' && !is_admin()) {

/*
    	wp_register_script('conditionizr', get_template_directory_uri() . '/js/lib/conditionizr-4.3.0.min.js', array(), '4.3.0'); // Conditionizr
        wp_enqueue_script('conditionizr'); // Enqueue it!

        wp_register_script('modernizr', get_template_directory_uri() . '/js/lib/modernizr-2.7.1.min.js', array(), '2.7.1'); // Modernizr
        wp_enqueue_script('modernizr'); // Enqueue it!
*/
		wp_deregister_script('jquery');
    }
}

// Load HTML5 Blank conditional scripts
/*
function html5blank_conditional_scripts()
{
    if (is_page('pagenamehere')) {
        wp_register_script('scriptname', get_template_directory_uri() . '/js/scriptname.js', array('jquery'), '1.0.0'); // Conditional script(s)
        wp_enqueue_script('scriptname'); // Enqueue it!
    }
}
*/

// Load HTML5 Blank styles
function html5blank_styles()
{
/*
    wp_register_style('normalize', get_template_directory_uri() . '/normalize.css', array(), '1.0', 'all');
    wp_enqueue_style('normalize'); // Enqueue it!
*/

//     wp_register_style('html5blank', get_template_directory_uri() . '/style.css', array(), '1.0', 'all');
//     wp_register_style('html5blank', get_template_directory_uri() . '/niui.min.css', array(), '1.0', 'all');
//     wp_register_style('html5blank3', get_template_directory_uri() . '/niui-wordpress.min.css', array(), '1.0', 'all');
//     wp_register_style('html5blank3', get_template_directory_uri() . '/theme.css', array(), '1.0', 'all');
    // wp_register_style('html5blank4_css', str_replace( 'http://', '//', get_template_directory_uri() ) . '/niui.min.css', array(), filemtime( get_stylesheet_directory() . '/niui.min.css' ), 'all');
    wp_register_style('html5blank4_css_wp', str_replace( 'http://', '//', get_template_directory_uri() ) . '/niui-wp.min.css', array(), filemtime( get_stylesheet_directory() . '/niui-wp.min.css' ), 'all');
//     wp_enqueue_style('html5blank'); // Enqueue it!
//     wp_enqueue_style('html5blank2'); // Enqueue it!
//     wp_enqueue_style('html5blank3'); // Enqueue it!
    wp_enqueue_style('html5blank4_css'); // Enqueue it!
    wp_enqueue_style('html5blank4_css_wp'); // Enqueue it!

	wp_dequeue_style('wp-block-library'); // Gutenberg CSS file removal

}

remove_action( 'wp_enqueue_scripts', 'wp_enqueue_classic_theme_styles' );

// function hints() {  
//   header("link: </wp-content/themes/phpied2/style.css>; rel=preload, </wp-includes/css/dist/block-library/style.min.css?ver=5.4.1>; rel=preload");
// }
// add_action('send_headers', 'hints');

// Register HTML5 Blank Navigation
function register_html5_menu()
{
    register_nav_menus(array( // Using array to specify more menus if needed
        'header-menu' => __('Header Menu', 'html5blank'), // Main Navigation
        'sidebar-menu' => __('Sidebar Menu', 'html5blank'), // Sidebar Navigation
        'extra-menu' => __('Extra Menu', 'html5blank') // Extra Navigation if needed (duplicate as many as you need!)
    ));
}

// Remove the <div> surrounding the dynamic navigation to cleanup markup
function my_wp_nav_menu_args($args = '')
{
    $args['container'] = false;
    return $args;
}

// Remove Injected classes, ID's and Page ID's from Navigation <li> items
function my_css_attributes_filter($var)
{
    return is_array($var) ? array() : '';
}

// Remove invalid rel attribute values in the categorylist
function remove_category_rel_from_category_list($thelist)
{
    return str_replace('rel="category tag"', 'rel="tag"', $thelist);
}

// Add page slug to body class, love this - Credit: Starkers Wordpress Theme
function add_slug_to_body_class($classes)
{
    global $post;
    if (is_home()) {
        $key = array_search('blog', $classes);
        if ($key > -1) {
            unset($classes[$key]);
        }
    } elseif (is_page()) {
        $classes[] = sanitize_html_class($post->post_name);
    } elseif (is_singular()) {
        $classes[] = sanitize_html_class($post->post_name);
    }

    return $classes;
}

// If Dynamic Sidebar Exists
if (function_exists('register_sidebar'))
{
    // Define Sidebar Widget Area 1
    register_sidebar(array(
        'name' => __('Widget Area 1', 'html5blank'),
        'description' => __('Description for this widget-area...', 'html5blank'),
        'id' => 'widget-area-1',
        'before_widget' => '<div id="%1$s" class="%2$s">',
        'after_widget' => '</div>',
        'before_title' => '<h3>',
        'after_title' => '</h3>'
    ));

    // Define Sidebar Widget Area 2
    register_sidebar(array(
        'name' => __('Widget Area 2', 'html5blank'),
        'description' => __('Description for this widget-area...', 'html5blank'),
        'id' => 'widget-area-2',
        'before_widget' => '<div id="%1$s" class="%2$s">',
        'after_widget' => '</div>',
        'before_title' => '<h3>',
        'after_title' => '</h3>'
    ));
}

// Remove wp_head() injected Recent Comment styles
function my_remove_recent_comments_style()
{
    global $wp_widget_factory;
    remove_action('wp_head', array(
        $wp_widget_factory->widgets['WP_Widget_Recent_Comments'],
        'recent_comments_style'
    ));
}

// Pagination for paged posts, Page 1, Page 2, Page 3, with Next and Previous Links, No plugin
function html5wp_pagination()
{
    global $wp_query;
    $big = 999999999;
    echo paginate_links(array(
        'base' => str_replace($big, '%#%', get_pagenum_link($big)),
        'format' => '?paged=%#%',
        'current' => max(1, get_query_var('paged')),
        'total' => $wp_query->max_num_pages
    ));
}

// Custom Excerpts
function html5wp_index($length) // Create 20 Word Callback for Index page Excerpts, call using html5wp_excerpt('html5wp_index');
{
    return 20;
}

// Create 40 Word Callback for Custom Post Excerpts, call using html5wp_excerpt('html5wp_custom_post');
function html5wp_custom_post($length)
{
    return 40;
}

// Create the Custom Excerpts callback
function html5wp_excerpt($length_callback = '', $more_callback = '')
{
    global $post;
    if (function_exists($length_callback)) {
        add_filter('excerpt_length', $length_callback);
    }
    if (function_exists($more_callback)) {
        add_filter('excerpt_more', $more_callback);
    }
    $output = get_the_excerpt();
    $output = apply_filters('wptexturize', $output);
    $output = apply_filters('convert_chars', $output);
    $output = '<p>' . $output . '</p>';
    echo $output;
}

// Custom View Article link to Post
function html5_blank_view_article($more)
{
    global $post;
    return '... <a class="view-article" href="' . get_permalink($post->ID) . '">' . __('View Article', 'html5blank') . '</a>';
}

/*
// Remove Admin bar
function remove_admin_bar()
{
    return false;
}
*/

// Remove 'text/css' from our enqueued stylesheet
function html5_style_remove($tag)
{
    return preg_replace('~\s+type=["\'][^"\']++["\']~', '', $tag);
}

// Remove thumbnail width and height dimensions that prevent fluid images in the_thumbnail
function remove_thumbnail_dimensions( $html )
{
    $html = preg_replace('/(width|height)=\"\d*\"\s/', "", $html);
    return $html;
}

// Custom Gravatar in Settings > Discussion
function html5blankgravatar ($avatar_defaults)
{
    $myavatar = get_template_directory_uri() . '/img/gravatar.jpg';
    $avatar_defaults[$myavatar] = "Custom Gravatar";
    return $avatar_defaults;
}

// Threaded Comments
function enable_threaded_comments()
{
    if (!is_admin()) {
        if (is_singular() AND comments_open() AND (get_option('thread_comments') == 1)) {
            wp_enqueue_script('comment-reply');
        }
    }
}

// Custom Comments Callback
function html5blankcomments($comment, $args, $depth)
{
	$GLOBALS['comment'] = $comment;
	extract($args, EXTR_SKIP);

	if ( 'div' == $args['style'] ) {
		$tag = 'div';
		$add_below = 'comment';
	} else {
		$tag = 'li';
		$add_below = 'div-comment';
	}
?>
    <!-- heads up: starting < for the html tag (li or div) in the next line: -->
    <<?php echo $tag ?> <?php comment_class(empty( $args['has_children'] ) ? '' : 'parent') ?> id="comment-<?php comment_ID() ?>">
	<?php if ( 'div' != $args['style'] ) : ?>
	<div id="div-comment-<?php comment_ID() ?>" class="comment-body">
	<?php endif; ?>
	<div class="comment-author vcard">
	<?php if ($args['avatar_size'] != 0) echo get_avatar( $comment, $args['180'] ); ?>
	<?php printf(__('<cite class="fn">%s</cite> <span class="says">says:</span>'), get_comment_author_link()) ?>
	</div>
<?php if ($comment->comment_approved == '0') : ?>
	<em class="comment-awaiting-moderation"><?php _e('Your comment is awaiting moderation.') ?></em>
	<br />
<?php endif; ?>

	<div class="comment-meta commentmetadata"><a href="<?php echo htmlspecialchars( get_comment_link( $comment->comment_ID ) ) ?>">
		<?php
			printf( __('%1$s at %2$s'), get_comment_date(),  get_comment_time()) ?></a><?php edit_comment_link(__('(Edit)'),'  ','' );
		?>
	</div>

	<?php comment_text() ?>

	<div class="reply">
	<?php comment_reply_link(array_merge( $args, array('add_below' => $add_below, 'depth' => $depth, 'max_depth' => $args['max_depth']))) ?>
	</div>
	<?php if ( 'div' != $args['style'] ) : ?>
	</div>
	<?php endif; ?>
<?php }

/*------------------------------------*\
	Actions + Filters + ShortCodes
\*------------------------------------*/

// Add Actions
add_action('init', 'html5blank_header_scripts'); // Add Custom Scripts to wp_head
add_action('init', 'html5blank_nojquery'); // Add Custom Scripts to wp_head
// add_action('wp_print_scripts', 'html5blank_conditional_scripts'); // Add Conditional Page Scripts
add_action('get_header', 'enable_threaded_comments'); // Enable Threaded Comments
add_action('wp_enqueue_scripts', 'html5blank_styles'); // Add Theme Stylesheet
add_action('init', 'register_html5_menu'); // Add HTML5 Blank Menu
// add_action('init', 'create_post_type_html5'); // Add our HTML5 Blank Custom Post Type
add_action('widgets_init', 'my_remove_recent_comments_style'); // Remove inline Recent Comment Styles from wp_head()
add_action('init', 'html5wp_pagination'); // Add our HTML5 Pagination

// Remove Actions
remove_action('wp_head', 'feed_links_extra', 3); // Display the links to the extra feeds such as category feeds
remove_action('wp_head', 'feed_links', 2); // Display the links to the general feeds: Post and Comment Feed
remove_action('wp_head', 'rsd_link'); // Display the link to the Really Simple Discovery service endpoint, EditURI link
remove_action('wp_head', 'wlwmanifest_link'); // Display the link to the Windows Live Writer manifest file.
remove_action('wp_head', 'index_rel_link'); // Index link
remove_action('wp_head', 'parent_post_rel_link', 10, 0); // Prev link
remove_action('wp_head', 'start_post_rel_link', 10, 0); // Start link
remove_action('wp_head', 'adjacent_posts_rel_link', 10, 0); // Display relational links for the posts adjacent to the current post.
remove_action('wp_head', 'wp_generator'); // Display the XHTML generator that is generated on the wp_head hook, WP version
remove_action('wp_head', 'adjacent_posts_rel_link_wp_head', 10, 0);
remove_action('wp_head', 'rel_canonical');
remove_action('wp_head', 'wp_shortlink_wp_head', 10, 0);
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
remove_action( 'wp_print_styles', 'print_emoji_styles' );

// Add Filters
add_filter('avatar_defaults', 'html5blankgravatar'); // Custom Gravatar in Settings > Discussion
add_filter('body_class', 'add_slug_to_body_class'); // Add slug to body class (Starkers build)
add_filter('widget_text', 'do_shortcode'); // Allow shortcodes in Dynamic Sidebar
add_filter('widget_text', 'shortcode_unautop'); // Remove <p> tags in Dynamic Sidebars (better!)
add_filter('wp_nav_menu_args', 'my_wp_nav_menu_args'); // Remove surrounding <div> from WP Navigation
// add_filter('nav_menu_css_class', 'my_css_attributes_filter', 100, 1); // Remove Navigation <li> injected classes (Commented out by default)
// add_filter('nav_menu_item_id', 'my_css_attributes_filter', 100, 1); // Remove Navigation <li> injected ID (Commented out by default)
// add_filter('page_css_class', 'my_css_attributes_filter', 100, 1); // Remove Navigation <li> Page ID's (Commented out by default)
add_filter('the_category', 'remove_category_rel_from_category_list'); // Remove invalid rel attribute
add_filter('the_excerpt', 'shortcode_unautop'); // Remove auto <p> tags in Excerpt (Manual Excerpts only)
add_filter('the_excerpt', 'do_shortcode'); // Allows Shortcodes to be executed in Excerpt (Manual Excerpts only)
add_filter('excerpt_more', 'html5_blank_view_article'); // Add 'View Article' button instead of [...] for Excerpts
// add_filter('show_admin_bar', 'remove_admin_bar'); // Remove Admin bar
add_filter('style_loader_tag', 'html5_style_remove'); // Remove 'text/css' from enqueued stylesheet
add_filter('post_thumbnail_html', 'remove_thumbnail_dimensions', 10); // Remove width and height dynamic attributes to thumbnails
add_filter('image_send_to_editor', 'remove_thumbnail_dimensions', 10); // Remove width and height dynamic attributes to post images

// Remove Filters
remove_filter('the_excerpt', 'wpautop'); // Remove <p> tags from Excerpt altogether

// Shortcodes
add_shortcode('html5_shortcode_demo', 'html5_shortcode_demo'); // You can place [html5_shortcode_demo] in Pages, Posts now.
add_shortcode('html5_shortcode_demo_2', 'html5_shortcode_demo_2'); // Place [html5_shortcode_demo_2] in Pages, Posts now.

// Disable image scaling to 2560px by WP 5.3
add_filter( 'big_image_size_threshold', '__return_false' );

// Shortcodes above would be nested like this -
// [html5_shortcode_demo] [html5_shortcode_demo_2] Here's the page title! [/html5_shortcode_demo_2] [/html5_shortcode_demo]

/*------------------------------------*\
	Custom Post Types
\*------------------------------------*/

/*
// Create 1 Custom Post type for a Demo, called HTML5-Blank
function create_post_type_html5()
{
    register_taxonomy_for_object_type('category', 'html5-blank'); // Register Taxonomies for Category
    register_taxonomy_for_object_type('post_tag', 'html5-blank');
    register_post_type('html5-blank', // Register Custom Post Type
        array(
        'labels' => array(
            'name' => __('HTML5 Blank Custom Post', 'html5blank'), // Rename these to suit
            'singular_name' => __('HTML5 Blank Custom Post', 'html5blank'),
            'add_new' => __('Add New', 'html5blank'),
            'add_new_item' => __('Add New HTML5 Blank Custom Post', 'html5blank'),
            'edit' => __('Edit', 'html5blank'),
            'edit_item' => __('Edit HTML5 Blank Custom Post', 'html5blank'),
            'new_item' => __('New HTML5 Blank Custom Post', 'html5blank'),
            'view' => __('View HTML5 Blank Custom Post', 'html5blank'),
            'view_item' => __('View HTML5 Blank Custom Post', 'html5blank'),
            'search_items' => __('Search HTML5 Blank Custom Post', 'html5blank'),
            'not_found' => __('No HTML5 Blank Custom Posts found', 'html5blank'),
            'not_found_in_trash' => __('No HTML5 Blank Custom Posts found in Trash', 'html5blank')
        ),
        'public' => true,
        'hierarchical' => true, // Allows your posts to behave like Hierarchy Pages
        'has_archive' => true,
        'supports' => array(
            'title',
            'editor',
            'excerpt',
            'thumbnail'
        ), // Go to Dashboard Custom HTML5 Blank post for supports
        'can_export' => true, // Allows export in Tools > Export
        'taxonomies' => array(
            'post_tag',
            'category'
        ) // Add Category and Post Tags support
    ));
}
*/

/*------------------------------------*\
	ShortCode Functions
\*------------------------------------*/

// Shortcode Demo with Nested Capability
function html5_shortcode_demo($atts, $content = null)
{
    return '<div class="shortcode-demo">' . do_shortcode($content) . '</div>'; // do_shortcode allows for nested Shortcodes
}

// Shortcode Demo with simple <h2> tag
function html5_shortcode_demo_2($atts, $content = null) // Demo Heading H2 shortcode, allows for nesting within above element. Fully expandable.
{
    return '<h2>' . $content . '</h2>';
}

function themeslug_theme_customizer( $wp_customize ) {
    // Fun code will go here
$wp_customize->add_section( 'themeslug_logo_section' , array(
    'title'       => __( 'Logo', 'themeslug' ),
    'priority'    => 30,
    'description' => 'Upload a logo to replace the default site name and description in the header',
) );

$wp_customize->add_setting( 'themeslug_logo' );

$wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, 'themeslug_logo', array(
    'label'    => __( 'Logo', 'themeslug' ),
    'section'  => 'themeslug_logo_section',
    'settings' => 'themeslug_logo',
) ) );

}
add_action( 'customize_register', 'themeslug_theme_customizer' );


require_once( "gallery.php" );


add_filter('upload_mimes', 'custom_upload_mimes');

function custom_upload_mimes ( $existing_mimes=array() ) {

	// add the file extension to the array

	$existing_mimes['svg'] = 'mime/type';

        // call the modified list of extensions

	return $existing_mimes;

}

add_filter( 'wp_list_pages', 'new_nav_menu' );
// Filter wp_nav_menu() to add additional links and other output
function new_nav_menu($items) {

	if (strlen($items) == 0) return;

	libxml_use_internal_errors(true);
	$DOM = new DOMDocument();
	$DOM->loadHTML('<?xml encoding="utf-8" ?>' . $items);
	$DOM->preserveWhiteSpace = false;

	foreach ($DOM->getElementsByTagName('ul') as $ul) {

		if ($ul->parentNode->firstChild->tagName == 'a' && $ul->parentNode->lastChild->tagName == 'ul') { // Move <a> after <ul class="n-list"> for CSS-only nav

			$ul->parentNode->appendChild($ul->parentNode->firstChild);
			
		}
		
	    $input = $DOM->createElement('input');
	    $input->setAttribute('type', 'checkbox');
	    $ul->parentNode->insertBefore($input, $ul);

	}
	
	$DOM->formatOutput = true;
	$items = $DOM->saveHTML();

    return '<div class="n-accordion n-accordion--mobile"> 
          <input type="checkbox">
          <div class="n-accordion__label" role="heading" aria-level="1">
    			  <button aria-label="Menu"> 
    				  <span class="n-burger"></span> 
    			  </button> 
          </div>

				<div class="n-accordion__content">
    				<nav class="n-nav n-nav--drop"> 
    					<ul class="n-list n-list--no-bullet">' . str_replace('</body></html>', '', str_replace('<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/REC-html40/loose.dtd">
<?xml encoding="utf-8" ?><html><body>', '', $items)) . '</ul>
    				</nav>
    			</div>
    		</div>';

}

// Remove the extra 10px around captioned images

add_filter('shortcode_atts_caption', 'fixExtraCaptionPadding');

function fixExtraCaptionPadding($attrs)
{
    if (!empty($attrs['width'])) {
        $attrs['width'] -= 10;
    }
    return $attrs;
}

// Wrap all captionless content images in a span with aspect ratio

add_action('the_content', function ($content) {

	$dom = new DOMdocument();
	@$dom->loadHTML('<?xml version="1.0" encoding="UTF-8"?>' . "\n" . $content);

	$iframes = $dom->getElementsByTagName('iframe');

	foreach ($iframes as $iframe) {

		if($iframe->parentNode->tagName == 'p') {
			
			$iframe->parentNode->setAttribute('class', 'has-iframe');
			
		}

	}

	$imgs = $dom->getElementsByTagName('img');

	foreach ($imgs as $img) {

		if($img->parentNode->tagName == 'p') { // A paragraph with image should be full width
			
			$img->parentNode->setAttribute('class', 'has-image');
			$caption = $img->parentNode->textContent; // Display caption properly on legacy images, currently hidden by CSS
			
		}

		if($img->parentNode->tagName == 'a' && $img->parentNode->parentNode->tagName == 'p') {
			

			$img->parentNode->parentNode->setAttribute('class', 'has-image');
			$img->parentNode->setAttribute('class', $img->getAttribute('class'));
			$caption = $img->parentNode->parentNode->textContent;  // Display caption properly on legacy images, currently hidden by CSS
			
		}

		$width = 0;
		$height = 0;

		$size = explode(' ', explode('size-', $img->getAttribute('class'))[1])[0]; // full, large etc

		$img->setAttribute('src', str_replace( 'http://', '//', $img->getAttribute('src'))); // Fix HTTPS

		$id = (int) str_replace('-', '', filter_var($img->getAttribute('class'), FILTER_SANITIZE_NUMBER_INT));

		if ($id == 0) { // It's a gallery thumbnail or a bare img with width/height
			
			if ($img->getAttribute('width') && $img->getAttribute('height')) {
				
				$width = $img->getAttribute('width');
				$height = $img->getAttribute('height');
				
			} else {
				
				break;

			}
			
		}

		if ($img->getAttribute('sizes') && !strstr($img->parentNode->parentNode->getAttribute('class'), 'gallery')) {

			$attachment = wp_get_attachment_metadata($id);

			if ($size && $size !== 'full') {

				$width = $attachment['sizes'][$size]['width'];
				$height = $attachment['sizes'][$size]['height'];
// echo(gettype($attachment['sizes']));
			} else {
				
				$width = preg_replace('/[^0-9]/', '', $attachment['width']);
				$height = preg_replace('/[^0-9]/', '', $attachment['height']);

				$actual_width = explode('px', explode(', ', $img->getAttribute('sizes'))[1])[0]; // Get the real width from the 'sizes' attribute
				$height = $actual_width / ($width/$height);				
				$width = $actual_width;

			}
			
		} else { // Legacy image format
			
			$width = preg_replace('/[^0-9]/', '', $img->getAttribute('width'));
			$height = preg_replace('/[^0-9]/', '', $img->getAttribute('height'));
			
		}
		
		$wrapper = $dom->createElement('span');
    $image_id = preg_replace('/[^0-9]/', '', $img->getAttribute('class'));
		$wrapper->setAttribute('class', 'n-aspect ' . $img->getAttribute('class'));
    $wrapper->setAttribute('style', '--width: ' . $img->getAttribute('width') . '; --height: ' . $img->getAttribute('height') . '; --placeholder: url(' . wp_get_attachment_image_url($image_id, 'medium') . ');');
		
		$img->parentNode->replaceChild($wrapper, $img);

		$wrapper->appendChild($img);
	
	}

	return str_replace('</body></html>', '', str_replace('<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/REC-html40/loose.dtd">
<?xml version="1.0" encoding="UTF-8"?><html><body>', '', $dom->saveHTML()));

}, 99);


/**
 * Set up the new field in the media module.
 *
 * @return void
 */
/*
function additional_gallery_settings() {
  ?>

    <script type="text/html" id="tmpl-custom-gallery-setting">
        <span>niui gallery options:</span><br>
        <select data-setting="style">
            <option value="default-style">Default Style</option>
            <option value="custom-style">Custom Style</option>
            <option value="ie7-style">IE7 Style</option>
        </select>
    </script>

    <script type="text/javascript">
        jQuery( document ).ready( function() {
            _.extend( wp.media.gallery.defaults, {
                style: 'default-style'
            } );

            wp.media.view.Settings.Gallery = wp.media.view.Settings.Gallery.extend( {
                template: function( view ) {
                    return wp.media.template( 'gallery-settings' )( view )
                         + wp.media.template( 'custom-gallery-setting' )( view );
                }
            } );
        } );
    </script>

  <?php
}
add_action( 'print_media_templates', 'additional_gallery_settings' );
*/

/**
 * HTML Wrapper - Support for a custom class attribute in the native gallery shortcode
 *
 * @param string $html
 * @param array $attr
 * @param int $instance
 *
 * @return $html
 */
/*
function customize_gallery_abit( $html, $attr, $instance ) {

    if( isset( $attr['style'] ) && $style = $attr['style'] ) {
        // Unset attribute to avoid infinite recursive loops
        unset( $attr['style'] ); 

        // Our custom HTML wrapper
        $html = sprintf( 
            '<div class="wpse-gallery-wrapper-%s">%s</div>',
            esc_attr( $style ),
            gallery_shortcode( $attr )
        );
    }

    return $html;
}
add_filter( 'post_gallery', 'customize_gallery_abit', 10, 3 );
*/
