/**
 * @author Vasyl Naumenko
 */
"use strict";
(function () {
	$(function () {
		var $content = $("#content");
		var $shaded  = $("#shaded_back");
		$shaded.height($content.height());

		//show only once per session
		var shown = localStorage.getItem('filters_helper_shown');
		if (!shown)
		{
			$shaded.show();
			localStorage.setItem('filters_helper_shown', 1);

			$shaded.find(".button").click(
				function (e) {
					e.preventDefault();
					$shaded.hide();
				}
			);
		}
	});
})();
 
