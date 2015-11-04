<?php
/**
 * File contains available Theme Option.
 *
 * @since fluxus 1.0
 */

if ( ! function_exists( 'fluxus_get_social_networks' ) ) {

    function fluxus_get_social_networks() {

        $networks = array(
                'dribbble',
                'facebook',
                'flickr',
                'pinterest',
                'twitter',
                'tumblr',
                'vimeo'
            );

        return $networks;

    }

}

/**
 * Defines an array of options that will be used to generate the settings page and be saved in the database.
 * When creating the 'id' fields, make sure to use all lowercase and no spaces.
 */
if ( ! function_exists( 'optionsframework_options' ) ) {

    function optionsframework_options() {

        /**
         * Options page: General Settings
         */

        $options = array();

        $options[] = array(
                'name' => __( 'General Settings', 'fluxus' ),
                'type' => 'heading'
            );

        $options[] = array(
                'name' => __( 'Custom logo', 'fluxus' ),
                'id' => 'fluxus_logo',
                'type' => 'upload'
            );

        $options[] = array(
                'name' => __( 'Custom logo (retina)', 'fluxus' ),
                'id' => 'fluxus_logo_retina',
                'type' => 'upload',
                'desc' => __( 'Here you should upload two times bigger version of your logo. It will be displayed on high resolution devices (such as new iPads and iPhones). This will make logo look crisp.', 'fluxus' )
            );

        $options[] = array(
                'name' => __( 'Footer Copyright', 'fluxus' ),
                'desc' => __( 'Copyright displayed in the bottom.' , 'fluxus' ),
                'id' => 'fluxus_copyright_text',
                'std' => '&copy; Fluxus Wordpress Theme',
                'type' => 'text'
            );

        $options[] = array(
                'name' => __( 'Favicon', 'fluxus' ),
                'desc' => __( 'Upload a 16x16 sized png/gif image that will be used as a favicon.' , 'fluxus' ),
                'id' => 'fluxus_favicon',
                'type' => 'upload'
            );

        $options[] = array(
                'name' => __( 'Facebook Image', 'fluxus' ),
                'desc' => __( 'Image used on Facebook timeline when someone likes the website. If visitor likes a content page (blog post / gallery) then image will be taken automatically from content. Should be at least 200x200 in size.' , 'fluxus' ),
                'id' => 'fluxus_facebook_image',
                'type' => 'upload'
            );

        $options[] = array(
                'name' => __( 'Tracking code', 'fluxus' ),
                'id' => 'fluxus_tracking_code',
                'desc' => __( 'Paste your Google Analytics or any other tracking code. Important: do not include &lt;script&gt;&lt;/script&gt; tags.' , 'fluxus' ),
                'type' => 'textarea'
            );


        /**
         * Options page: Social
         */

        $options[] = array(
                'name' => __( 'Social', 'fluxus' ),
                'type' => 'heading'
            );

        $options[] = array(
                'name' => __( 'Enable share buttons', 'fluxus' ),
                'desc' => __( 'Show social sharing buttons in the footer.' , 'fluxus' ),
                'id' => 'fluxus_share_enabled',
                'std' => '1',
                'type' => 'checkbox'
            );

        $social_networks = array(
                'facebook' => 'Facebook',
                'twitter' => 'Twitter',
                'googleplus' => 'Google+',
                'pinterest' => 'Pinterest',
                'linkedin' => 'LinkedIn',
                'digg' => 'Digg',
                'delicious' => 'Delicious',
                'stumbleupon' => 'StumbleUpon',
            );

        $social_networks_defaults = array(
                'facebook' => 1,
                'twitter' => 1,
                'googleplus' => 1
            );

        $options[] = array(
                'name' => __( 'Sharing Networks', 'fluxus' ),
                'desc' => __( 'Select social networks on which you want to share your website.' , 'fluxus' ),
                'id' => 'fluxus_share_services',
                'std' => false,
                'type' => 'multicheck',
                'options' => $social_networks,
                'str' => $social_networks_defaults
            );

        $options[] = array(
                'name' => __( 'Enable social networks', 'fluxus' ),
                'desc' => __( 'Show social network links in the footer.' , 'fluxus' ),
                'id' => 'fluxus_social_enabled',
                'std' => '0',
                'type' => 'checkbox'
            );

        foreach ( fluxus_get_social_networks() as $network) {

            $options[] = array(
                    'name' => ucfirst( $network ) . ' ' . __( 'URL', 'fluxus' ),
                    'id'   => 'fluxus_' . $network . '_url',
                    'type' => 'text'
                );

        }


        /**
         * Options page: Style
         */

        $options[] = array(
                'name' => __( 'Style', 'fluxus' ),
                'type' => 'heading'
            );

        $css_color_dir = get_template_directory() . '/css/skins/';
        $css_select = array();

        if ( is_dir( $css_color_dir ) ) {
            if ( $dh = opendir( $css_color_dir ) ) {
                while ( ( $file = readdir( $dh ) ) !== false ) {
                    if ( pathinfo( $file, PATHINFO_EXTENSION ) == 'css' ) {
                        $css_select[ $file ] = $file;
                    }
                }
                closedir($dh);
            }
        }

        $options[] = array(
                'name' => __( 'Stylesheet', 'fluxus' ),
                'id' => 'fluxus_stylesheet',
                'type' => 'select',
                'class' => 'mini',
                'options' => $css_select,
                'std' => 'light.css'
            );

        $options[] = array(
                'name' => __( 'Custom CSS', 'fluxus' ),
                'id' => 'fluxus_custom_css',
                'desc' => __( 'Add your custom CSS rules here. Note: it is better to use user.css file (located in your theme\'s css directory) to add custom rules.' , 'fluxus' ),
                'type' => 'textarea'
            );

        return $options;
    }

}

/**
 * A unique identifier is defined to store the options in the database and reference them from the theme.
 * By default it uses the theme name, in lowercase and without spaces, but this can be changed if needed.
 * If the identifier changes, it'll appear as if the options have been reset.
 */
if ( ! function_exists( 'optionsframework_option_name' ) ) {

    function optionsframework_option_name() {

        // This gets the theme name from the stylesheet
        $themename = get_option( 'stylesheet' );
        $themename = preg_replace("/\W/", "_", strtolower($themename) );

        $optionsframework_settings = get_option( 'optionsframework' );
        $optionsframework_settings['id'] = $themename;
        update_option( 'optionsframework', $optionsframework_settings );
    }

}

