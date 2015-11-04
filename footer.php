<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the id=main div and all content after
 *
 * @package fluxus
 * @since fluxus 1.0
 */
?>

    <div id="footer-push"></div>
</div><!-- #page-wrapper -->

<footer id="footer">
    <div class="footer-inner clearfix">
        <?php do_action( 'footer_social' ); ?>
        <div class="footer-links"><?php

            // Show menu, if it has been assigned.
            if ( has_nav_menu( 'footer_primary' ) ): ?>
                <nav class="footer-navigation"><?php
                    @wp_nav_menu( array( 'theme_location' => 'footer_primary', 'walker' => new Intheme_Menu_Walker() ) ); ?>
                </nav><?php
            endif;

            $copyright = of_get_option( 'fluxus_copyright_text' );
            if ( !empty( $copyright ) ) : ?>
                <div class="credits"><?php echo $copyright; ?></div><?php
            endif;

            ?>
        </div>
        <div class="nav-tip">
            <?php printf( __( 'Use arrows %s for navigation', 'fluxus' ), '<a href="#" class="button-minimal icon-left-open-mini" id="key-left"></a><a href="#" class="button-minimal icon-right-open-mini" id="key-right"></a>' ); ?>
        </div>
        <?php do_action( 'footer_links' ); ?>
	<a href="http://instagram.com/mattlephoto" target="_blank" title="Connect on Instagram" rel="nofollow"><img style="width: 21px;
padding: 2px 0 0 5px;" src="/images/instagram-icon.png"></a>
    </div>
</footer>

<?php

wp_footer();

?>

<script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-38053927-1']);
  _gaq.push(['_setDomainName', 'mattlephotography.com']);
  _gaq.push(['_setAllowLinker', true]);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

</script>

</body>
</html>