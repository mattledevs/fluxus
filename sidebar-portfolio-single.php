<?php
/**
 * Portfolio Single Sidebar.
 *
 * @package fluxus
 * @since fluxus 1.0
 */

$project_data = fluxus_portfolio_project_get_data( get_the_ID() );

?>
<div class="sidebar sidebar-portfolio-single widget-area">

    <?php do_action( 'before_sidebar' ); ?>

    <div class="scroll-container">
        <div class="scrollbar"><div class="track"><div class="thumb"><div class="end"></div></div></div></div>
        <div class="viewport">
            <div class="overview">
                <hgroup>
                    <?php
                        if ( ! empty($project_data['subtitle']) ) : ?>
                            <h2 class="subtitle"><?php echo $project_data['subtitle']; ?></h2><?php
                        endif;
                    ?>
                    <h1 class="title"><?php the_title(); ?></h1>
                </hgroup><?php

                $content = trim( strip_tags( $post->post_content ) );
                if ( ! empty( $content ) ) : ?>
                    <div class="widget">
                        <div class="textwidget">
                            <?php the_content(); ?>
                        </div>
                    </div><?php
                endif;

                if ( !empty($project_data['link']) ) : ?>
                    <aside class="widget widget-project-info">
                        <div class="decoration"></div>
                        <h3 class="widget-title"><?php _e( 'Project Info', 'fluxus' ); ?></h3>
                        <div><?php

                            if ( !empty( $project_data['link'] ) ) : ?>
                                <a class="external-link" href="<?php echo esc_url($project_data['link']); ?>"><?php _e( 'Visit website', 'fluxus' ); ?></a><?php
                            endif;

                            ?>
                        </div>
                    </aside><?php
                endif;

                $project_info = $project_data['project_info'];

                if ( is_array( $project_info ) && isset( $project_info[0] ) && !empty( $project_info[0] ) ) :

                    foreach ( $project_info as $info ) : ?>
                        <aside class="widget widget-project-custom-info">
                            <div class="decoration"></div>
                            <h3 class="widget-title"><?php echo $info['title']; ?></h3>
                            <div class="widget-content"><?php
                                echo $info['content']; ?>
                            </div>
                        </aside><?php
                    endforeach;

                endif;

                if ( ! dynamic_sidebar( 'sidebar-portfolio-single' ) ) :

                    the_widget( 'Fluxus_Widget_Project_Types', null, fluxus_get_default_widget_params() );

                endif; ?>

            </div>

        </div>

    </div>

</div>