<?php
/**
 * File contains funcionality used for Portfolio.
 *
 * @since fluxus 1.0
 */


/**
 * Returns portfolio projects featured image.
 * If none is set, then returns the placeholder image.
 */
function fluxus_get_portfolio_thumbnail( $post_id, $size = 'fluxus-max' ) {

    $image = wp_get_attachment_image_src( get_post_thumbnail_id( $post_id ), $size );

    if ( ! is_array( $image ) ) {

        // placeholder image
        $image = array(
                FLUXUS_IMAGES_URI . '/no-portfolio-thumbnail.png',
                1920,
                1280
            );

    }

    if ( is_numeric( $image[1]) && ( $image[2]) && ( $image[2] != 0 ) ) {
        $ratio = round( $image[1] / $image[2] * 100 ) / 100;
    } else {
        $ratio = 1.5;
    }

    return $image;

}


/**
 * Returns all database meta data that is related to project.
 */
function fluxus_portfolio_project_get_data( $post_id ) {

    $subtitle       = get_post_meta( $post_id, 'fluxus_project_subtitle', true );
    $link           = get_post_meta( $post_id, 'fluxus_project_link', true );
    $project_info   = get_post_meta( $post_id, 'fluxus_project_info', true );

    return array(
            'subtitle'          => $subtitle,
            'link'              => $link,
            'project_info'      => $project_info
        );

}


function fluxus_portfolio_meta_options_content() {
    global $post;

    if ( ! $post) {
        return;
    }

    $data = fluxus_portfolio_project_get_data( $post->ID );
    extract( $data );

    ?>
    <div class="fluxus-meta-field">
        <label for="fluxus_project_subtitle"><?php _e( 'Project Subtitle', 'fluxus' ); ?></label>
        <div class="field">
            <input type="text" name="fluxus_project_subtitle" value="<?php echo esc_attr( $subtitle ); ?>" />
        </div>
    </div>
    <div class="fluxus-meta-field">
        <label for="fluxus_project_link"><?php _e( 'Project External Link', 'fluxus' ); ?></label>
        <div class="field">
            <input type="text" name="fluxus_project_link" value="<?php echo esc_attr( $link ); ?>" class="url" />
        </div>
    </div>
    <div class="fluxus-meta-group">
        <h2><?php _e( 'Project information', 'fluxus' ); ?></h2>
        <table class="fluxus-table fluxus-project-information">
            <thead>
                <tr>
                    <td><?php _e( 'Title', 'fluxus' ); ?></td>
                    <td><?php _e( 'Content', 'fluxus' ); ?></td>
                </tr>
            </thead>
            <tbody><?php
                if ( $project_info && is_array($project_info) ) :
                    foreach ( $project_info as $info ) : ?>
                        <tr>
                            <td>
                                <input type="text" name="fluxus_project_info_title[]" value="<?php echo esc_attr( $info['title'] ); ?>" />
                            </td>
                            <td>
                                <textarea name="fluxus_project_info_content[]"><?php echo $info['content']; ?></textarea>
                            </td>
                        </tr><?php
                    endforeach;
                endif; ?>
                <tr class="add-element">
                    <td colspan="2">
                        <?php _e( 'To add project information enter the title and content fields below.', 'fluxus' ); ?>
                    </td>
                </tr>
                <tr>
                    <td><input type="text" name="fluxus_project_info_add_title" value="" /></td>
                    <td><textarea name="fluxus_project_info_add_content"></textarea></td>
                </tr>
                <tr>
                    <td colspan="2">
                        <a href="#" id="fluxus-add-project-info" class="button-secondary"><?php _e( 'Add project information', 'fluxus' ); ?></a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div><?php

}

function fluxus_portfolio_meta_grid_content() {
    global $post;

    if ( ! $post) {
        return;
    }

    $data = fluxus_portfolio_get_grid_data( $post->ID );
    extract( $data );

    ?>
    <div class="fluxus-meta-field">
        <label for="fluxus_portfolio_grid_size"><?php _e( 'Grid size', 'fluxus' ); ?></label>
        <div class="field"><?php

            $size_options = array(
                    '5 4' => '5 columns, 4 rows',
                    '5 3' => '5 columns, 3 rows',
                    '4 3' => '4 columns, 3 rows',
                    '3 3' => '3 columns, 3 rows',
                    '3 2' => '3 columns, 2 rows'
                );

            ?>
            <select name="fluxus_portfolio_grid_size">
                <?php echo it_array_to_select_options( $size_options, $grid_size ); ?>
            </select>
        </div>
    </div>

    <?php

}


/**
 * Get grid portfolio data.
 */
function fluxus_portfolio_get_grid_data( $post_id ) {

    $grid_size = get_post_meta( $post_id, 'fluxus_portfolio_grid_size', true );

    if ( !$grid_size ) {
        $grid_size = '4 3';
    }

    return array(
            'grid_size' => $grid_size
        );

}


/**
 * Saves grid portfolio meta data.
 */
function fluxus_portfolio_meta_grid_save( $post_id ) {

    if ( ! it_check_save_action( $post_id, 'page' ) ) {
        return $post_id;
    }

    if ( isset( $_POST['fluxus_portfolio_grid_size'] ) ) {
        update_post_meta( $post_id, 'fluxus_portfolio_grid_size', $_POST['fluxus_portfolio_grid_size'] );
    }

}
add_action( 'save_post', 'fluxus_portfolio_meta_grid_save' );


/**
 * Grid portfolio meta box.
 */
function fluxus_portfolio_meta_box() {

    if ( it_get_post_id() ) {

        add_meta_box( 'fluxus-project-info-meta', __( 'Project Options', 'fluxus' ), 'fluxus_portfolio_meta_options_content', 'fluxus_portfolio', 'normal', 'low' );

        if ( it_is_template( it_get_post_id(), 'template-portfolio-grid.php' ) ) {

           add_meta_box( 'fluxus-portfolio-grid-meta', __( 'Grid Options', 'fluxus' ), 'fluxus_portfolio_meta_grid_content', 'page', 'normal', 'low' );

        }

        wp_enqueue_style( 'fluxus-wp-admin-portfolio', get_template_directory_uri() . '/css/wp-admin/portfolio.css' );
        wp_enqueue_script( 'fluxus-wp-admin-portfolio', get_template_directory_uri() . '/js/wp-admin/portfolio.js' );

    }


}
add_action( 'admin_init', 'fluxus_portfolio_meta_box' );


/**
 * Saves project meta data.
 */
function fluxus_portfolio_meta_box_save( $post_id ) {

    if ( ! it_check_save_action( $post_id, 'fluxus_portfolio' ) ) {
        return $post_id;
    }

    $keys = array(
            'fluxus_project_subtitle',
            'fluxus_project_link'
        );

    foreach ( $keys as $key ) {
        $value = isset( $_POST[$key] ) ? $_POST[$key] : '';
        update_post_meta( $post_id, $key, $value );
    }

    if ( isset($_POST['fluxus_project_info_title']) && is_array($_POST['fluxus_project_info_title']) ) {

        $titles = $_POST['fluxus_project_info_title'];
        $contents = $_POST['fluxus_project_info_content'];

        $data = array();

        foreach ( $titles as $index => $title ) {

            if ( !empty( $title ) && !empty( $contents[$index] ) ) {

                $data[] = array(
                        'title' => $title,
                        'content' => $contents[$index]
                    );

            }

        }

        update_post_meta( $post_id, 'fluxus_project_info', $data );
    } else {
        update_post_meta( $post_id, 'fluxus_project_info', array() );
    }

}
add_action( 'save_post', 'fluxus_portfolio_meta_box_save' );


/**
 * WP admin project list custom columns.
 */
function fluxus_project_edit_columns($columns) {

    $columns = array(
        'cb' => '<input type="checkbox" />',
        'title' => 'Project',
        'description' => 'Description',
        'link' => 'Link',
        'type' => 'Type of Project',
    );

    return $columns;

}
add_filter( 'manage_edit-fluxus_portfolio_columns', 'fluxus_project_edit_columns' );


function fluxus_project_custom_columns( $column ) {
    global $post;

    switch ( $column ) {

        case 'description':
            the_excerpt();
        break;

        case 'link':
            $data = fluxus_portfolio_project_get_data( $post->ID );
            echo $data['link'];
        break;

        case 'type':
            echo get_the_term_list( $post->ID, 'fluxus-project-type', '', ', ', '' );
        break;

    }

}
add_action( 'manage_posts_custom_column',  'fluxus_project_custom_columns' );


/**
 * Get projects to be used in portfolio navigation.
 */
function fluxus_get_other_projects( $current_project, $number_to_display = 8 ) {

    $all = fluxus_query_portfolio();
    wp_reset_query();

    $count = count ( $all );

    // if we don't have enough projects, return all
    if ( $count <= $number_to_display ) {
        return $all;
    }

    $current_project_index = false;
    foreach ( $all as $index => $project ) {
        if ( $current_project->ID == $project->ID ) {
            $current_project_index = $index;
            break;
        }
    }

    // if we can't find current project, return all
    if ( $current_project_index === false ) {
        return $all;
    }

    if ( $current_project_index + $number_to_display > $count ) {
        /**
         * Means that our current project is in the last N.
         * Let's return last N.
         */
        return array_slice( $all, $count - $number_to_display );
    }

    $slice_offset = $current_project_index - 3;

    if ( $slice_offset < 0 ) {
        $slice_offset = 0;
    }

    return array_slice( $all, $slice_offset, $number_to_display );

}


/**
 * Returns portfolio items.
 */
function fluxus_query_portfolio( $args = array() ) {

    add_filter( 'posts_orderby_request', 'fluxus_portfolio_orderby_filter' );

    $defaults = array(
            'post_type'      => 'fluxus_portfolio',
            'posts_per_page' => -1,
            'orderby'        => 'menu_order ID',
            'post_status'    => 'publish',
            'order'          => 'ASC DESC'
        );

    $args = array_merge( $defaults, $args );

    $result = query_posts( $args );

    remove_filter( 'posts_orderby_request', 'fluxus_portfolio_orderby_filter' );

    return $result;

}


function fluxus_portfolio_orderby_filter( $orderby ) {

    /**
     * Limit the use for a very specific case.
     */
    if ( 'wp_posts.menu_order,wp_posts.ID DESC' == $orderby ) {
        return 'wp_posts.menu_order ASC, wp_posts.ID DESC';
    }

    return $orderby;

}


/**
 * Returns next project according to the specified order.
 */
function fluxus_portfolio_get_next_project( $current_project ) {

    return fluxus_portfolio_get_adjacent_project( $current_project, 'next' );

}


/**
 * Returns previous project according to the specified order.
 */

function fluxus_portfolio_get_previous_project( $current_project ) {

    return fluxus_portfolio_get_adjacent_project( $current_project, 'previous' );

}


/**
 * Get next/previous project while ordering by menu_order DESC and id DESC.
 * That is newer items with same menu_order goes first.
 */
function fluxus_portfolio_get_adjacent_project( $current_project, $sibling = 'next' ) {
    global $wpdb;

    if ( !is_object($current_project) ) {
        return false;
    }

    $compare_id = 'next' === $sibling ? '<' : '>';

    /**
     * Select next post with the same menu_order but lower ID.
     */
    $where = $wpdb->prepare("WHERE
                                p.id $compare_id %d AND
                                p.menu_order = %d AND
                                p.post_type = 'fluxus_portfolio' AND
                                p.post_status = 'publish'",
                            $current_project->ID, $current_project->menu_order );

    if ( 'next' === $sibling ) {
        $sort  = "ORDER BY p.id DESC LIMIT 1";
    } else {
        $sort  = "ORDER BY p.id ASC LIMIT 1";
    }

    $query = "SELECT p.* FROM $wpdb->posts AS p $where $sort";

    $result = $wpdb->get_row( $query );

    if ( null === $result ) {

        /**
         * No project with the same menu order found. Now select
         * a project with a lower menu order.
         */

        if ( 'next' === $sibling ) {
            $sort  = "ORDER BY p.menu_order ASC, p.id DESC LIMIT 1";
            $compare_menu_order = '>';
        } else {
            $sort  = "ORDER BY p.menu_order DESC, p.id ASC LIMIT 1";
            $compare_menu_order = '<';
        }

        $where = $wpdb->prepare("WHERE
                                p.menu_order $compare_menu_order %d AND
                                p.post_type = 'fluxus_portfolio' AND
                                p.post_status = 'publish'",
                            $current_project->menu_order );

        $query = "SELECT p.* FROM $wpdb->posts AS p $where $sort";

        $result = $wpdb->get_row( $query );

    }

    return $result;

}


/**
 * Looks for template-portfolio.php or template-portfolio-grid.php page id.
 */
function fluxus_portfolio_base_id() {

    $portfolio_page = it_find_page_by_template( 'template-portfolio.php' );
    if ( $portfolio_page ) {
        return $portfolio_page[0]->ID;
    } else {
        $portfolio_page = it_find_page_by_template( 'template-portfolio-grid.php' );
        if ( $portfolio_page ) {
            return $portfolio_page[0]->ID;
        } else {
            return 0;
        }
    }

}


/**
 * Return template-portfolio.php or template-portfolio-grid.php slug to be used
 * in portfolio project URL.
 */
function fluxus_portfolio_base_slug() {

    $portfolio_page = it_find_page_by_template( 'template-portfolio.php' );
    if ( $portfolio_page ) {
        return $portfolio_page[0]->post_name;
    } else {
        return 'portfolio';
    }

}


/**
 * Initialize Portolio.
 */
function fluxus_portfolio_init() {

    add_image_size( 'fluxus-portfolio-thumbnail', 90, 90, true );

    $portfolio_base = fluxus_portfolio_base_slug();

    /**
     * Cache $portfolio_base, if it has changed, then we need to flush rules.
     */
    $flush = false;
    $cached_portfolio_base = get_transient( 'fluxus_portfolio_slug' );

    if ( $cached_portfolio_base ) {
        if ( $portfolio_base != $cached_portfolio_base ) {
            $flush = true;
        }
    } else {
        $flush = true;
    }

    /**
     * First we register taxonomy, then custom post type.
     * The order is important, because of rewrite rules.
     */
    $args = array(
                'label' => 'Project Types',
                'singular_label' => 'Project Type',
                'query_var' => true,
                'show_in_nav_menus' => true,
                'show_ui' => true,
                'show_tagcloud' => false,
                'hierarchical' => true,
                'rewrite' => array(
                        'slug' => $portfolio_base
                    )
                );
    register_taxonomy( 'fluxus-project-type', 'fluxus_portfolio',  $args );

    /**
     * Register custom post type.
     */
    $args = array(
        'label' => __(' Portfolio', 'fluxus' ),
        'singular_label' => __( 'Project', 'fluxus' ),
        'public' => true,
        'show_ui' => true,
        'capability_type' => 'page',
        'hierarchical' => false,
        'rewrite' => false,
        'query_var' => true,
        'taxonomy' => 'fluxus-project-type',
        'has_archive' => true,
        'menu_icon' => get_template_directory_uri() . '/images/wp-admin/portfolio.png',
        'supports' => array( 'title', 'editor', 'thumbnail', 'excerpt', 'page-attributes' )
       );
    register_post_type( 'fluxus_portfolio' , $args );


    $portfolio_structure = '/' . $portfolio_base . '/%projecttype%/%fluxus_portfolio%';
    add_rewrite_tag( '%projecttype%', '([^&/]+)', 'fluxus-project-type=' );
    add_rewrite_tag( '%fluxus_portfolio%', '([^&/]+)', 'fluxus_portfolio=' );
    add_permastruct( 'fluxus_portfolio', $portfolio_structure, false );

    if ( $flush ) {
        it_flush_rewrite_rules();
        set_transient( 'fluxus_portfolio_slug', $portfolio_base, 60 * 60 * 24 );
    }

}
add_action( 'init', 'fluxus_portfolio_init', 1 );


/**
 * Generate correct links using fluxus_portfolio_base_slug().
 */
function fluxus_portfolio_permalink( $permalink, $post_id, $leavename ) {

    $post = get_post( $post_id );

    /**
     * If there's an error with post, or this is not fluxus_portfolio
     * or we are not using fancy links.
     */
    if ( is_wp_error( $post ) || 'fluxus_portfolio' != $post->post_type || empty( $permalink ) ) {
        return $permalink;
    }

    /**
     * Find out project type.
     */
    $project_type = '';

    if ( strpos( $permalink, '%projecttype%') !== false ) {

        $terms = get_the_terms( $post->ID, 'fluxus-project-type' );

        if ( $terms ) {
            // sort terms by ID.
            usort( $terms, '_usort_terms_by_ID' );
            $project_type = $terms[0]->slug;
        } else {
            $project_type = 'uncategorised';
        }

    }

    $rewrite_codes = array(
            '%projecttype%',
            $leavename ? '' : '%fluxus_portfolio%'
        );

    $rewrite_replace = array(
            $project_type,
            $post->post_name
        );

    $permalink = str_replace( $rewrite_codes, $rewrite_replace, $permalink );

    return $permalink;

}
add_filter( 'post_type_link', 'fluxus_portfolio_permalink' , 10, 3 );

