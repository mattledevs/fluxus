
( function ( $, window, undefined ) {

    $( function () {

        var $btnAdd = $( '#fluxus-add-project-info' );
        var $container = $( '.fluxus-project-information tbody' );

        $btnAdd.click( function () {

            var $title = $( 'input[name="fluxus_project_info_add_title"]' );
            var $content = $( 'textarea[name="fluxus_project_info_add_content"]' );

            var $newElement = $( '<tr class="fluxus-project" />' );

            $( '<input type="text" name="fluxus_project_info_title[]" />' ).val( $title.val() )
                                                                           .appendTo( $newElement )
                                                                           .wrap( '<td />' );

            $( '<textarea name="fluxus_project_info_content[]" />' ).val( $content.val() )
                                                                    .appendTo( $newElement )
                                                                    .wrap( '<td />' );

            $newElement.insertBefore( $container.find( '.add-element' ) );

            $title.val( '' );
            $content.val( '' );

            return false;

        });

    });

})( jQuery, window );