			</div> 
			<!-- /content -->
			<!-- footer -->
			<footer id="footer" class="n-footer n-type" role="contentinfo">
				<div class="n-row n-contain">
					
				<!-- copyright -->
					<div class="n-center">
						<p class="copyright">
							&copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. <?php _e('Powered by', 'html5blank'); ?>
							<a href="//wordpress.org" title="WordPress">WordPress</a>, <a href="//github.com/html5blank/" title="HTML5 Blank">HTML5 Blank</a> & <a href="//niui.dev">niui</a>.
						</p>
						<a href=# class="backtotop">🔝</a>
					</div>
				<!-- /copyright -->
				</div>

			</footer>
			<!-- /footer -->

		<?php wp_footer(); ?>

		<script>

			document.querySelectorAll('iframe[data-src]:not([src])').forEach(el => { el.loading = "lazy"; el.src = el.dataset.src; })

			let loaded = img => {
			  	img.closest('picture').dataset.loaded = true;
				};
			content.querySelectorAll(".headline picture img").forEach(el => {
			  if (el.complete) {
				loaded(el);
			  } else {
				el.addEventListener("load", e => {
				  loaded(e.target);
				});
			  }
			});

		</script>

	</body>
</html>
