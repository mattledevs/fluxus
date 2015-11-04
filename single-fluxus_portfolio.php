<?php
/**
 * Portfolio single project template.
 */

fluxus_add_html_class( 'horizontal-page' );

get_header();

the_post();

?>
<div id="main" class="site site-with-sidebar">
    <div id="content" class="site-content"><?php

        $project_data = fluxus_portfolio_project_get_data( get_the_ID() );

        $args = array(
            'orderby'        => 'menu_order',
            'order'          => 'ASC',
            'post_type'      => 'attachment',
            'numberposts'    => -1,
            'post_mime_type' => 'image',
            'post_status'    => null,
            'post_parent'    => get_the_ID()
        );

        $attachments = get_posts( $args );

        if ( $attachments ) : ?>

            <article class="portfolio-single horizontal-content" data-loading="<?php echo esc_attr( __( 'Please wait...', 'fluxus' ) ); ?>"><?php

                foreach ( $attachments as $attachment ) :

                    $image = wp_get_attachment_image_src( $attachment->ID, 'fluxus-max' );
                    if ( ! is_array( $image ) ) {
                        continue;
                    }

                    if ( is_numeric( $image[1] ) && is_numeric( $image[2] ) && ( $image[2] != 0 ) ) {
                        $image_ratio = $image[1] / $image[2];
                    } else {
                        $image_ratio = 1.5;
                    }

                    ?>
                    <a href="<?php echo esc_url( $image[0] ); ?>" class="wrap-image horizontal-item">
                        <img class="image" src="<?php echo esc_url( $image[0] ); ?>" width="<?php echo $image[1]; ?>" height="<?php echo $image[2]; ?>" alt="" />
                    </a><?php

                endforeach;


                /**
                 * Portfolio navigation & sharing.
                 */
                ?>
                <nav class="portfolio-navigation">
                    <header>
                        <h3><?php _e( 'Like this project?', 'fluxus' ); ?></h3>
                        <div class="feedback-buttons"><?php

                            $args = array(
                                    'class' => 'btn-appreciate',
                                    'title' => __( 'Appreciate', 'fluxus' ),
                                    'title_after' => __( 'Appreciated', 'fluxus' )
                                );
                            fluxus_appreciate( $post->ID, $args );

                            $args = array(
                                    'class' => array(
                                            'sharrre-project'
                                        ),
                                    'data-buttons-title' => array(
                                            __( 'Share this project', 'fluxus' )
                                        )
                                );

                            $sharrre = fluxus_get_social_share( $args );

                            if ( $sharrre ) : ?>
                                <span class="choice"><span><?php _e( 'Or', 'fluxus' ); ?></span></span><?php
                                echo $sharrre;
                            endif;

                        ?>
                        </div>
                    </header>
                    <div class="navigation">
                        <h3><?php _e( 'Other projects', 'fluxus' ); ?></h3>
                        <div class="other-projects"><?php

                            $projects = fluxus_get_other_projects( $post, 8 );
                            $index = 0;

                            foreach ( $projects as $project ) : $index++;

                                $current = $project->ID == $post->ID;
                                $image = it_get_post_thumbnail( $project->ID, 'fluxus-portfolio-thumbnail' );

                                $attr = array(
                                        'style' => array(
                                                'background-image: url(' . $image . ')'
                                            ),
                                        'href' => array(
                                                esc_url( get_permalink( $project->ID ) )
                                            ),
                                        'class' => array(
                                                'item-' . $index,
                                                $current ? 'active' : ''
                                            )
                                    );

                                ?>
                                <a<?php echo it_array_to_attributes( $attr ); ?>>
                                    <?php echo $project->post_title; ?>
                                    <span class="hover">
                                        <?php
                                            if ( $current ) {
                                                _e( 'Current', 'fluxus' );
                                            } else {
                                                _e( 'View', 'fluxus' );
                                            }
                                        ?>
                                    </span>
                                </a><?php

                            endforeach; ?>
                        </div><?php

                        /**
                         * Next / Previous / Back to portfolio buttons.
                         */

                        $next_project = fluxus_portfolio_get_next_project( $post );
                        $prev_project = fluxus_portfolio_get_previous_project( $post );

                        if ( $prev_project ) : ?>
                            <a href="<?php echo esc_url( get_permalink( $prev_project->ID ) ); ?>" class="button-minimal prev-project button-icon-left icon-left-open-big"><?php _e( 'Previous', 'fluxus' ); ?></a><?php
                        endif;

                        if ( $next_project ) : ?>
                            <a href="<?php echo esc_url( get_permalink( $next_project->ID ) ); ?>" class="button-minimal next-project button-icon-right icon-right-open-big"><?php _e( 'Next', 'fluxus' ); ?></a><?php
                        endif;

                        ?>
                        <a href="<?php echo esc_url( get_permalink( fluxus_portfolio_base_id() ) ); ?>" class="button-minimal back-portfolio"><?php _e( 'Back to portfolio', 'fluxus' ); ?></a>
                    </div>
                </nav>

            </article>

            <?php

        endif; ?>

    </div>

    <?php get_sidebar( 'portfolio-single' ); ?>
</div><?php // end of #main

get_footer();