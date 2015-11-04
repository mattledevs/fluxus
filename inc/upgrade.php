<?php

class FluxusUpgrade {

    const VERSION = '1.2.6';
    const VERSION_OPTION_NAME = 'fluxus_version';
    const UPGRADES_COMPLETED_OPTION_NAME = 'fluxus_upgrades_completed';

    protected $version_in_db = '';

    function __construct() {

        $this->version_in_db = get_option( self::VERSION_OPTION_NAME );

    }

    function upgrade() {

        $upgraded = false;

        if ( ! $this->version_in_db ) {

            /**
             * Version not found in database, this means it's either:
             *   1. Clean install
             *   2. Upgrade over 1.0.X
             */

            $this->upgrade_v1_to_v1_1();
            $upgraded = true;

        }

        // If there is a version change or version is blank then let's do upgrades one-by-one.
        if ( ! $this->version_in_db || ( $this->version_in_db != self::VERSION ) ) {

            $upgrades_completed = get_option( self::UPGRADES_COMPLETED_OPTION_NAME, array() );

            /**
             * In versions up to 1.2.3 Project Types widget was hard-coded into a sidebar.
             * Instead we should import it automatically into Portfolio and Project sidebars.
             */
            if ( ! it_key_is_truthey( $upgrades_completed, 'add_project_types_widget_to_sidebars' ) ) {

                $this->add_project_types_widget_to_sidebars();
                $upgrades_completed['add_project_types_widget_to_sidebars'] = true;

            }

            /**
             * 1.2.5 allows comments on pages using standard Wordpress functionality. By default they should
             * be turned off.
             */
            if ( ! it_key_is_truthey( $upgrades_completed, 'disable_comments_on_existing_pages' ) ) {

                $this->disable_comments_on_existing_pages();
                $upgrades_completed['disable_comments_on_existing_pages'] = true;

            }

            $upgraded = true;
            update_option( self::UPGRADES_COMPLETED_OPTION_NAME, $upgrades_completed );

        }

        if ( $upgraded ) {
            $this->upgrade_finish();
        }

    }

    function upgrade_finish() {

        // Update theme version in db
        update_option( self::VERSION_OPTION_NAME, self::VERSION );

        // Sets the default values for any possibly new theme options.
        $optionsframework_settings = get_option( 'optionsframework' );
        $option_name = $optionsframework_settings['id'];

        $options_in_db = get_option( $option_name );
        $default_values = of_get_default_values();

        foreach ( $default_values as $option_id => $default_value ) {
            if ( ! isset( $options_in_db[$option_id] ) ) {
                $options_in_db[$option_id] = $default_value;
            }
        }

        update_option( $option_name, $options_in_db );

    }

    function add_project_types_widget_to_sidebars() {

        intheme_add_widget_to_sidebar( 'fluxus-project-types-widget', array(), 'sidebar-portfolio' );
        intheme_add_widget_to_sidebar( 'fluxus-project-types-widget', array(), 'sidebar-portfolio-single' );

    }

    function disable_comments_on_existing_pages() {

        global $wpdb;

        // Disable comments on existing pages
        $sql = "UPDATE {$wpdb->posts} SET `comment_status` = 'closed' WHERE `post_type` = 'page'";
        $wpdb->query( $sql );

        // Disable trackbacks on existing pages
        $sql = "UPDATE {$wpdb->posts} SET `ping_status` = 'closed' WHERE `post_type` = 'page'";
        $wpdb->query( $sql );

    }

    function upgrade_v1_to_v1_1( $force = false ) {

        /**
         * Upgrade Projects
         */

        $projects = PortfolioProject::all();

        if ( $projects ) {

            $args = array(
                'post_type'      => 'attachment',
                'post_mime_type' => 'image',
                'post_status'    => 'any',
                'posts_per_page' => -1,
                'orderby'        => 'menu_order',
                'order'          => 'ASC'
            );

            foreach ( $projects as $project ) {

                $args['post_parent'] = $project->post->ID;

                $media = $project->get_media();

                if ( count( $media ) ) {

                    if ( ! $force ) {
                        break; // Let's not update if we have some media already
                    } else {
                        // Delete existing assigned media
                        foreach ( $media as $m ) {
                            $m->delete();
                        }
                    }

                }

                /**
                 * Make sure featured image is added.
                 */
                $featured_id = get_post_thumbnail_id( $project->post->ID );
                $featured_image_added = false;

                $attachments = get_children( $args );

                if ( $attachments ) {

                    $max_order = 0;
                    foreach ( $attachments as $attachment ) {
                        $max_order = $attachment->menu_order > $max_order ? $attachment->menu_order : $max_order;
                    }

                    foreach ( $attachments as $attachment ) {

                        $media_item = PortfolioMedia::create( $project->post->ID );
                        $media_item->meta_type          = 'image';
                        $media_item->meta_attachment_id = $attachment->ID;
                        $media_item->post->menu_order   = $max_order - $attachment->menu_order;

                        // This is featured image
                        if ( $featured_id == $attachment->ID ) {
                            $media_item->meta_featured = 1;
                            $featured_image_added = true;
                        }

                        // If there was no featured image, then make the first one featured
                        if ( ! $featured_id && ! $featured_image_added ) {
                            $media_item->meta_featured = 1;
                            $featured_image_added = true;
                        }

                        $saved = $media_item->save();

                    }

                }

                /**
                 * Featured image was not added, let's add it in the first position.
                 */
                if ( ! $featured_image_added && $featured_id ) {

                    $media_item = PortfolioMedia::create( $project->post->ID );
                    $media_item->meta_type          = 'image';
                    $media_item->meta_attachment_id = $featured_id;
                    $media_item->meta_featured      = 1;
                    $media_item->post->menu_order   = $max_order + 1;

                    $media_item->save();

                }

            }

        }

    }

}

function fluxus_theme_upgrade() {
     if ( current_user_can( 'edit_theme_options' ) ) {
        $upgrade = new FluxusUpgrade();
        $upgrade->upgrade();
    }
}

add_action( 'admin_init', 'fluxus_theme_upgrade' );
