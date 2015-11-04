<?php
/**
 * A widget that displays available project types.
 * If this widget is used on a project page,
 * then it will only show the types that are assigned
 * to current project.
 * Otherwise it will show all available types that
 * are assigned to at least one project.
 *
 * @since fluxus 1.0
 */


class Fluxus_Widget_Project_Types extends WP_Widget {

    function Fluxus_Widget_Project_Types() {
        $widget_ops = array(
                'classname' => 'fluxus-project-types',
                'description' => __('A widget that displays project types.', 'fluxus' )
            );

        $control_ops = array(
                'width' => 300,
                'height' => 350,
                'id_base' => 'fluxus-project-types-widget'
            );

        $this->WP_Widget( 'fluxus-project-types-widget', __( 'Project Types', 'fluxus' ), $widget_ops, $control_ops );
    }

    function widget( $args, $instance ) {

        /**
         * If widget was not called using default parameters,
         * then do class and id substitution manually.
         */
        if ( strpos( $args['before_widget'], '%2$s' ) ) {
            $args['before_widget'] = sprintf( $args['before_widget'], $this->id_base, $this->widget_options['classname'] );
        }

        if ( is_single() ) :

            /**
             * We are on the project page.
             * So we show tags that belong to the active project.
             */

            $tags = wp_get_post_terms( get_the_ID(), 'fluxus-project-type' );
            if ( $tags ) : $index = 0;

                //$before_widget = sprintf( $args['before_widget'], $id, $classname_);

                echo $args['before_widget'];
                echo $args['before_title'] . __( 'Project Type', 'fluxus' ) . $args['after_title']; ?>

                <ul><?php
                    foreach ( $tags as $tag ) : $index++; ?>
                        <li><a href="<?php echo get_term_link( $tag, 'fluxus-project-type' ); ?>"><b class="hash">#</b><?php echo $tag->name; ?></a></li><?php
                    endforeach; ?>
                </ul><?php

                echo $args['after_widget'];

            endif;

        else :

            /**
             * Show all tags.
             */

            $project_types = get_terms( 'fluxus-project-type', array(
                    'hide_empty' => true
                ) );

            if ( $project_types ) :

                echo $args['before_widget'];
                echo $args['before_title'] . __( 'Project Types', 'fluxus' ) . $args['after_title']; ?>
                <ul><?php
                        $active_type = get_query_var( 'fluxus-project-type' );
                    ?>
                    <li><a<?php echo !$active_type ? ' class="active"' : ''; ?> href="<?php echo get_permalink( fluxus_portfolio_base_id() ); ?>"><?php _e( 'All', 'fluxus' ); ?></a></li>
                    <?php


                    foreach ( $project_types as $type ) :
                        $active_css = $active_type == $type->slug ? ' class="active"' : ''; ?>
                        <li><a<?php echo $active_css; ?> data-slug="<?php echo $type->slug; ?>" href="<?php echo get_term_link( $type, 'fluxus-project-type' ); ?>"><b class="hash">#</b><?php echo $type->name; ?></a></li><?php
                    endforeach; ?>
                </ul><?php

                echo $args['after_widget'];

            endif;

        endif;

    }

    function update( $new_instance, $old_instance ) {

        return $instance;
    }


    function form( $instance ) {

        _e( 'This widget has no options.', 'fluxus' );

    }

}


function fluxus_widget_project_types() {
    register_widget( 'Fluxus_Widget_Project_Types' );
}
add_action( 'widgets_init', 'fluxus_widget_project_types' );

