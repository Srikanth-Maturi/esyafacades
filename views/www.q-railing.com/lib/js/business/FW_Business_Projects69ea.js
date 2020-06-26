/**
 * Business Projects
 * @author V. Naumenko
 */
var FW_BusinessProjects = function () {
	this.init();
};

FW_BusinessProjects.prototype =
{
	init: function () {
		this.page     = 2; //next page
		this.template = $('#js-load-more-template');
		this.content  = $('#listHolder');

		// replace data attributes
		var self = this;
		$.each(['href', 'src'], function(index, attr)
		{
			var data_attr = 'data-tpl-' + attr;
			var item      = self.template.find('[' + data_attr + ']');
			item.attr(attr, item.attr(data_attr));
			item.attr(data_attr, '');
		});

		/*
		 $("#js-load-more-button").on('click', function (e) {
		 e.preventDefault();
		 self.loadMoreEvent()
		 });
		 */

		this.appendContent(projects_data); //global var, defined in #PROJECT-INIT#
	},

	loadMoreEvent: function (selectFilters, callback, custom_page) {
		var self = this;
		var data = {page: self.page};

		if (selectFilters)
		{
			if (custom_page)
			{
				this.page = custom_page;
			}

			console.log(self.page);
			data      = {page: self.page, filters: selectFilters};
		}

		// set limit
		data['amount'] = $('#js-project-list-amount').val();

		$.post('/project/load_more/', data, function (res) {

			if (res['items'])
			{
				self.appendContent(res['items']);
				self.page++;
			}

			if (res['filters'])
			{
				$('.popup_box .fw_error').remove();
				self.setActiveFilters(res['filters']);
				if (callback) {
					callback();
				}
			}
			else
			{
				// no_result_msg - defined in Component_Project_Overview
				if($('.popup_box .fw_error').length < 1)
				{
					$('.popup_box .form_button').before('<div class="fw_error">'+no_result_msg+'</div>');
				}
			}

			//hide load more button
			if (res['hide_load_more'])
			{
				$('div.js-load-more-button-wrap').hide();
			}
			else
			{
				$('div.js-load-more-button-wrap').show();
			}
		}, "json");
	},

	/**
	 * @param selected_filters
	 */
	setActiveFilters: function(selected_filters){
		if (!selected_filters) return false;

		var $filters = $('#activeFilters');
		$filters.html('');

		var template = '<div class="option pie">{{name}} <a class="remove" href="#" data-id="{{data_id}}"><span class="img_txt txt_remove">&times;</span></a></div>';
		var content  = '';
		selected_filters.forEach(function (filter) {
			content += Mustache.render(template, filter);
		});

		$filters.append(content);
	},

	/**
	 * @param items
	 */
	appendContent: function (items) {
		if (items)
		{
			var items_placeholders = [[1, 4], [3, 3]];
			var $block             = $('#js-load-more-template').clone();
			var $template          = '';
			var total              = items.count;
			var index              = 0;
			var block_count        = 0;

			items_placeholders.forEach(function (block) {
				var mosaik = ''; //contains 2 blocks, after it will be appended to the template and wrapped with "mozaic clearfix" class

				block_count++;
				if (block_count == 1 && total - index < 4)
				{
					block = [1,2];
				}

				block.forEach(function (num) {
					var block_items = {'ITEMS':[]};
					while (num)
					{
						if (items[index])
						{
							block_items['ITEMS'].push(items[index]);
							index++;
						}
						num--;

					}

					block_items.block_total = block_items['ITEMS'].length;
					mosaik += Mustache.render($block.clone().html(), block_items);
				});

				$template += "<div class='mosaik clearfix'>" + mosaik + "</div>";
				mosaik = '';
			});

			if (this.page == 1)
			{
				//clear content for page 1
				this.content.html('');
			}

			this.content.append($template);
			this.content.mosaikRendering(); //mosaikRendering is defined in functions.js
			screenSizeCalc(); //defined in functions.js
		}
	}
};