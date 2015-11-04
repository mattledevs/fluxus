<?php
/*
Template Name: Horizontal Portfolio
*/

fluxus_add_html_class( 'horizontal-page' );

get_header();

?>
<div id="main" class="site site-with-sidebar">
    <div id="content" class="site-content">
        <div class="portfolio-list horizontal-content"><?php

            if ( is_page() ) {

                /**
                 * We are on index page.
                 * Let's modify main loop to fluxus_portfolio post type.
                 *
                 * If is_page() is false, then we are on taxonomy-fluxus-project-type.php
                 * template, so our loop is already correct.
                 */

                fluxus_query_portfolio();

            }

            if ( have_posts() ) :

                while ( have_posts() ) : the_post();

                    $post_id = get_the_ID();

                    $project_data = fluxus_portfolio_project_get_data( $post_id );

                    $tags = wp_get_post_terms( $post_id, 'fluxus-project-type' );

                    ?>
                    <article class="horizontal-item project">

                        <div class="preview"><?php

                            $thumbnail = fluxus_get_portfolio_thumbnail( $post_id );

                            ?>
                            <img class="featured-image" src="<?php echo esc_url( $thumbnail[0] ); ?>" width="<?php echo esc_attr( $thumbnail[1] ); ?>" height="<?php echo esc_attr( $thumbnail[2] ); ?>" data-ratio="<?php echo esc_attr( $thumbnail[3] ); ?>" alt="">
                            <div class="hover-box">
                                <div class="hover-box-contents"><?php
                                    if ( ! empty( $project_data['subtitle'] ) ) : ?>
                                        <h3 class="subtitle"><?php echo $project_data['subtitle']; ?></h3><?php
                                    endif; ?>
                                    <h2><?php the_title(); ?></h2>
                                    <div class="decoration"></div>
                                    <?php if ( ! empty($post->post_excerpt) ) : ?>
                                        <div class="excerpt"><?php the_excerpt(); ?></div>
                                    <?php endif; ?>
                                    <div class="wrap-button">
                                        <a href="<?php echo get_permalink( $post_id ); ?>" class="button"><?php _e( 'View Work', 'fluxus' ); ?></a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <section class="info">
                            <h2 class="entry-title"><a href="<?php echo get_permalink( $post_id ); ?>"><?php the_title(); ?></a></h2><?php
                            if ( $tags ) : ?>
                                <div class="entry-tags"><?php
                                    foreach ( $tags as $tag ) : ?>
                                        <a href="<?php echo esc_url( get_term_link( $tag ) ); ?>"><b class="hash">#</b><?php echo $tag->name; ?></a><?php
                                    endforeach; ?>
                                </div><?php
                            endif; ?>
                        </section>
                    </article><?php

                endwhile;

            endif; ?>

        </div>
    </div>

    <?php get_sidebar( 'portfolio' ); ?>
</div>

<?php

get_footer();