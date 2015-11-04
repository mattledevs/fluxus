<?php
/**
 * File contains implementation of every Theme Option.
 *
 * @since fluxus 1.0
 */


/**
 * Tracking code.
 */
function fluxus_tracking_code() {
    $option = of_get_option( 'fluxus_tracking_code' );
    if ( ! empty( $option ) ) {
        echo '<script>' . $option . '</script>';
    }
}

if ( ! is_admin() && ! is_preview() ) {
    add_action( 'wp_footer', 'fluxus_tracking_code', 1000 );
}


/**
 * Custom CSS.
 */
function fluxus_custom_css() {
    $option = of_get_option( 'fluxus_custom_css' );
    if ( ! empty( $option ) ) {
        echo "<style>\n" . $option . "\n</style>\n";
    }
}

if ( ! is_admin() ) {
    add_action( 'wp_head', 'fluxus_custom_css' );
}


/**
 * Favicon.
 */
function fluxus_favicon() {
    $option = of_get_option( 'fluxus_favicon' );
    if ( ! empty( $option ) ) {
        echo '<link rel="shortcut icon" href="' . esc_url( $option ) . '" />' . "\n";
    }
}

if ( ! is_admin() ) {
    add_action( 'wp_head', 'fluxus_favicon' );
}


/**
 * Facebook Image.
 */
function fluxus_facebook_image() {
    $option = of_get_option( 'fluxus_facebook_image' );
    if ( ! empty( $option ) ) {
        echo '<meta property="og:image" content="' . esc_url( $option ) . '" />' . "\n";
    }
}

if ( ! is_admin() && ! is_single() ) {
    add_action( 'wp_head', 'fluxus_facebook_image' );
}


/**
 * Social share.
 */
function fluxus_get_social_share( $args = array() ) {

    if ( is_404() ) {
        return false;
    }

    $option = of_get_option( 'fluxus_share_enabled' );

    if ( $option && $option == '1' ) {

        $share_services = of_get_option( 'fluxus_share_services' );
        $data_services = array();

        if ( is_array( $share_services ) ) {

            foreach ( $share_services as $key => $service ) {
                if ( $service ) {
                    $key = $key == 'googleplus' ? 'googlePlus' : $key;
                    $data_services[] = $key;
                }
            }

        }

        $defaults = array(
                'data-url' => array(
                        esc_url( get_permalink() )
                    ),
                'data-curl' => array(
                        esc_url( get_template_directory_uri() . '/lib/sharrre.php' )
                    ),
                'data-services' => array(
                        join( ',', $data_services )
                    ),
                'data-title' => array(
                        __( 'Share', 'fluxus' )
                    ),
                'class' => array(
                        'sharrre'
                    )
            );

        $args = array_merge( $defaults, $args );

        $html = '<div' . it_array_to_attributes( $args ) . '></div>';

        return $html;

    } else {

        return false;

    }

}

function fluxus_footer_social_share() {
    $args = array(
            'class' => array(
                    'sharrre-footer'
                )
        );
    $html = fluxus_get_social_share( $args );
    if ( $html ) {
        echo $html;
    }
}

if ( !is_admin() && !is_404() ) {

    add_action( 'footer_social', 'fluxus_footer_social_share' );
}


/**
 * Social networks.
 */
function fluxus_social_networks() {
    $option = of_get_option( 'fluxus_social_enabled' );
    if ( $option && $option == '1' ) {

        $html = '';

        foreach ( fluxus_get_social_networks() as $network) {

            $option = of_get_option( 'fluxus_' . $network . '_url' );
            $title = esc_attr( sprintf( __( 'Connect on %s', 'fluxus' ), ucfirst( $network ) ) );

            if ( !empty( $option ) ) {
                $html .= '<a class="icon-social icon-' . $network . '-circled" href="' . esc_url ( $option ) . '" target="_blank" title="' . $title . '" rel="nofollow"></a>';
            }

        }

        if ( !empty( $html ) ) : ?>
            <div class="social-networks"><?php echo $html; ?></div><?php
        endif;

    }
}

if ( ! is_admin() ) {
    add_action( 'footer_social', 'fluxus_social_networks' );
}


/**
 * CSS Stylesheet.
 */
function fluxus_css_stylesheet() {

    $color_css = of_get_option( 'fluxus_stylesheet' );
    if ( $color_css ) {
        wp_enqueue_style( 'fluxus-color', get_template_directory_uri() . '/css/color/' . (string) $color_css );
    }

}

if ( ! is_admin() ) {
    add_action( 'wp_enqueue_scripts', 'fluxus_css_stylesheet', 1000 );
}

