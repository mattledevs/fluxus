<?php
remove_action( 'wp_head', 'wp_generator' ) ; 
remove_action( 'wp_head', 'wlwmanifest_link' ) ; 
remove_action( 'wp_head', 'rsd_link' ) ;

/**
 * fluxus functions and definitions
 *
 * @package fluxus
 * @since fluxus 1.0
 */


/**
 * Define common constants.
 */
define( 'FLUXUS_IMAGES_URI',  get_template_directory_uri() . '/images' );
define( 'FLUXUS_LIB_DIR', 	  dirname(__FILE__) . '/lib' );
define( 'FLUXUS_INC_DIR', 	  dirname(__FILE__) . '/inc' );
define( 'FLUXUS_WIDGETS_DIR', FLUXUS_INC_DIR . '/widgets' );


/**
 * Require various files.
 */
require_once FLUXUS_LIB_DIR . '/intheme-utils.php';	// File contains useful functions for general tasks.
require_once FLUXUS_LIB_DIR . '/appreciate.php';	// Appreciate Post functionality.
require_once FLUXUS_INC_DIR . '/slider.php';		// Full page slider functionality.
require_once FLUXUS_INC_DIR . '/portfolio.php';		// Portfolio functionality.
require_once FLUXUS_INC_DIR . '/contacts.php';		// Contacts page functionality.
require_once FLUXUS_INC_DIR . '/background.php';	// Page with background image functionality.
require_once FLUXUS_INC_DIR . '/template-tags.php';	// Custom template tags for this theme.
require_once FLUXUS_INC_DIR . '/tweaks.php';		// Various functionality tweaks.
require_once FLUXUS_INC_DIR . '/shortcodes.php';	// Shortcodes.
require_once FLUXUS_INC_DIR . '/post-formats.php';	// Post formats.
require_once FLUXUS_INC_DIR . '/widgets.php';		// Widgets.


/**
 * Initialize Fluxus Theme.
 */
function fluxus_init() {

	/**
	 * Add custom image sizes.
	 */
	add_image_size( 'fluxus-thumbnail', 583, 328, true ); 			// used in blog index page
	add_image_size( 'fluxus-gallery-thumbnail', 500, 500, true );	// used in content gallery

	/**
	 * Maximum image size displayed on site.
	 * Used on: full page slider, portfolio, etc.
	 */
	add_image_size( 'fluxus-max', 1920, 1280, false );				// another good option 1500x1000

	/**
	 * Note, if you are changing the existing size dimensions,
	 * then Wordpress will not automatically regenerate all the images.
	 *
	 * To do so, you could try using it_regenerate_wp_images() function.
	 * Put it inside your admin_init hook, and visit admin section.
	 * After waiting for usually a long time, all the images will be
	 * available in a newly specified size.
	 */

	/**
	 * Remove admin bar for everyone
	 */
	add_filter( 'show_admin_bar' , '__return_false');

}
add_action( 'init', 'fluxus_init', 1 );


/**
 * Initialize admin side.
 */
function fluxus_admin_init() {

	/**
	 * General scripts and styles for admin area.
	 */
    wp_enqueue_script( 'fluxus-wp-admin', get_template_directory_uri() . '/js/wp-admin/admin.js' );
    wp_enqueue_style( 'fluxus-wp-admin', get_template_directory_uri() . '/css/wp-admin/admin.css' );

    add_editor_style( 'css/wp-admin/editor-styles.css' );

}
add_action( 'admin_init', 'fluxus_admin_init', 1 );


/**
 * Specify the maximum content width.
 * This is based on CSS, when screen becomes big enough the content
 * area becomes fixed, so there is no need to have bigger images.
 */
if ( ! isset( $content_width ) ) {
	$content_width = 1021;
}


/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which runs
 * before the init hook. The init hook is too late for some features, such as indicating
 * support post thumbnails.
 *
 * @since fluxus 1.0
 */
function fluxus_setup() {

	/**
	 * Make theme available for translation
	 * Translations can be filed in the /languages/ directory
	 */
	load_theme_textdomain( 'fluxus', get_template_directory() . '/languages' );

	/**
	 * Enable theme support for standard features.
	 */
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'automatic-feed-links' );

	/**
	 * Register menus.
	 */
	register_nav_menus( array(
		'header_primary' 	=> __( 'Header Primary Menu', 'fluxus' ),
		'header_secondary' 	=> __( 'Header Secondary Menu', 'fluxus' ),
		'footer_primary' 	=> __( 'Footer Primary Menu', 'fluxus' )
	) );


	/**
	 * Enable shortcodes for widgets.
	 */
	add_filter( 'widget_text', 'do_shortcode' );


	/**
	 * Initialize theme options.
	 */
	require_once FLUXUS_INC_DIR . '/options.php';

	if ( !function_exists( 'optionsframework_init' ) ) {
		define( 'OPTIONS_FRAMEWORK_DIRECTORY', get_template_directory_uri() . '/options-framework/' );
		require_once dirname(__FILE__) . '/options-framework/options-framework.php';
	}

	if ( ! is_admin() ) {
		require_once FLUXUS_INC_DIR . '/options-functions.php';
	}

}
add_action( 'after_setup_theme', 'fluxus_setup' );


/**
 * Enqueue scripts and styles.
 */
function fluxus_scripts_and_styles() {

	/**
	 * CSS
	 */
	wp_enqueue_style( 'global', 	 	   get_template_directory_uri() . '/css/global.css' );		// global CSS, should consist of tags only
    wp_enqueue_style( 'fluxus-grid', 	   get_template_directory_uri() . '/css/grid.css' );		// fluid grid used in content columns
    wp_enqueue_style( 'fontello-icons',    get_template_directory_uri() . '/css/fontello.css' );	// font icon containing Entypo collection, add more icons at fontello.com
	wp_enqueue_style( 'style', 		 	   get_stylesheet_uri() );									// main stylesheet
    wp_enqueue_style( 'fluxus-responsive', get_template_directory_uri() . '/css/responsive.css' );  // responsive rules
    wp_enqueue_style( 'user', 			   get_template_directory_uri() . '/css/user.css' );  		// user custom rules

	/**
	 * JS
	 */
	wp_enqueue_script( 'tinyscrollbar', 	get_template_directory_uri() . '/js/jquery.tinyscrollbar.js',    array( 'jquery' ), false, true );	// scrollbar plugin
	wp_enqueue_script( 'sharrre', 			get_template_directory_uri() . '/js/jquery.sharrre-1.3.4.js',    array( 'jquery' ), false, true );	// share count plugin
	wp_enqueue_script( 'jquery-transit',	get_template_directory_uri() . '/js/jquery.transit.js', 	     array( 'jquery' ), false, true );	// css3 transition plugin
	wp_enqueue_script( 'fluxus-utils', 		get_template_directory_uri() . '/js/utils.js', 				     array( 'jquery' ), false, true ); // other tiny plugins
	wp_enqueue_script( 'fluxus-size', 		get_template_directory_uri() . '/js/size.js', 				     array( 'jquery', 'fluxus-utils' ), false, true );	// file containing size adjustmens for DOM elements on window.resize event
	wp_enqueue_script( 'fluxus-grid', 		get_template_directory_uri() . '/js/jquery.fluxus-grid.js',      array( 'jquery' ), false, true );	// grid portfolio layout plugin
	wp_enqueue_script( 'jquery-reveal',		get_template_directory_uri() . '/js/jquery.reveal.js', 		     array( 'jquery' ), false, true ); // modal box plugin
	wp_enqueue_script( 'fluxus-lightbox',	get_template_directory_uri() . '/js/jquery.fluxus-lightbox.js',  array( 'jquery', 'jquery-transit' ), false, true ); // lightbox plugin
	wp_enqueue_script( 'fluxus-slider',  	get_template_directory_uri() . '/js/jquery.fluxus-slider.js', 	 array( 'jquery', 'jquery-transit' ), false, true ); // full page slider plugin
	wp_enqueue_script( 'fluxus', 			get_template_directory_uri() . '/js/main.js', 					 array( 'jquery', 'fluxus-utils' ), false, true ); // main script
	wp_enqueue_script( 'fluxus-user',		get_template_directory_uri() . '/js/user.js', 					 array( 'jquery', 'fluxus-utils' ), false, true ); // user custom javascript

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );	// WP standard comment reply script
	}

}
add_action( 'wp_enqueue_scripts', 'fluxus_scripts_and_styles' );


/**
 * Modify native menu walker class with some extra functionality.
 */
class Intheme_Menu_Walker extends Walker_Nav_Menu {

	function display_element( $element, &$children_elements, $max_depth, $depth=0, $args, &$output ) {

		if ( !$element ) {
			return;
		}

		global $post;

		/**
		 * Adjust menu if we are our current page is fluxus_portfolio project.
		 */
		if ( $post && $post->post_type == 'fluxus_portfolio' ) {

			/**
			 * Remove current_page_parent class from our blog post homepage page,
			 * because it is not our parent.
			 */
			$home_page_id = (int) get_option( 'page_for_posts' );

			if ( $home_page_id == $element->object_id ) {

				$key = array_search( 'current_page_parent', $element->classes );
				if ( $key !== false ) {
					unset( $element->classes[ $key ] );
				}

			}

			/**
			 * If our current menu item has the template "template-portfolio.php" or
			 * "template-portfolio-grid.php" then make it an active menu item.
			 */
			if ( it_is_template( $element->object_id, 'template-portfolio.php' ) ) {
				array_push( $element->classes, 'current-menu-item' );
			}

		}

		$id_field = $this->db_fields['id'];

		/**
		 * Adds the "has-children" class to the current item if it has children.
		 */
		if ( ! empty( $children_elements[$element->$id_field] ) ) {
			array_push( $element->classes, 'has-children' );
		}

		/**
		 * That's it, now call the default function to do the rest.
		 */
		return parent::display_element( $element, $children_elements, $max_depth, $depth, $args, $output );
	}

}

include_once FLUXUS_INC_DIR . '/user.php';		// User modifications.