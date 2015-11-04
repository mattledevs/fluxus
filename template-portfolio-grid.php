<?php
/*
Template Name: Grid Portfolio
*/

fluxus_add_html_class( 'horizontal-page' );

get_header();

fluxus_query_portfolio();

$data = fluxus_portfolio_get_grid_data( get_the_ID() );
$size = explode( ' ', $data['grid_size'] );

if ( have_posts() ) : ?>

    <div id="main" class="site">

        <div class="portfolio-grid" data-columns="<?php echo $size[0]; ?>" data-rows="<?php echo $size[1]; ?>"><?php

            while ( have_posts() ) :

                the_post();

                $thumbnail = fluxus_get_portfolio_thumbnail( get_the_ID(), 'fluxus-thumbnail' );

                $project_data = fluxus_portfolio_project_get_data( get_the_ID() ); ?>

                <article class="grid-project">
                    <a href="<?php the_permalink(); ?>" class="preview" style="background-image: url(<?php echo esc_url( $thumbnail[0] ); ?>);">
                        <span class="hover-box">
                            <span class="inner"><?php
                                if ( ! empty( $project_data['subtitle'] ) ) : ?>
                                    <i><?php echo $project_data['subtitle']; ?></i><?php
                                endif; ?>
                                <b><?php the_title(); ?></b>
                            </span>
                        </span>
                    </a>
                </article><?php

            endwhile; ?>

        </div>

    </div>

<?php

endif;

get_footer();