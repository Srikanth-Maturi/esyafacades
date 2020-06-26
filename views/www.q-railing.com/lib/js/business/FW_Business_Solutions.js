/**
 * Business Solutions
 * @author    V. Naumenko
 */
var FW_Business_Solutions = function () {
    this.init();
};

$(document).ready(function () {
    var solutions = new FW_Business_Solutions();
});

FW_Business_Solutions.prototype =
{
    init: function () {
        this.page = 2; //next page
        this.loadMoreEvent();
        this.template = $('#js-load-more-template');
        this.content = $('#listHolder');

        // replace data attributes
        var self = this;
        $.each(['href', 'src'], function(index, attr)
        {
            var data_attr = 'data-tpl-' + attr;
            var item      = self.template.find('[' + data_attr + ']');
            item.attr(attr, item.attr(data_attr));
            item.attr(data_attr, '');
        });

        this.appendContent(solutions_data); //global var, defined in #PROJECT-INIT#
    },

    loadMoreEvent: function () {
        var self = this;
        $("#js-load-more-button").on('click', function (event) {
            event.preventDefault();
            //solution_id, defined in #PROJECT-INIT#
            $.post('/solution/load_more/', {page: self.page, solution_id: solution_id}, function (res) {
                if (res['items'])
                {
                    self.appendContent(res['items']);
                    self.page++;
                }

                //hide load more button
                if (res['hide_load_more'])
                {
                    $('div.js-load-more-button-wrap').hide();
                }
            }, "json");
        });
    },

    /**
     *
     * @param items
     */
    appendContent: function (items) {
        if (items)
        {
            var items_placeholders = [[1,4], [3,3]];
            var $block = $('#js-load-more-template').clone();
            var $template = '';

            var total = items.count;
            var index = 0;
            var block_count = 0;

            items_placeholders.forEach(function (block) {
                var mosaik = ''; //contains 2 blocks, after it will be appended to the template and wrapped with "mozaic clearfix" class

                block_count++;
                if (block_count == 1 && total-index<4)
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

            this.content.append($template); //mosaikRendering is defined in functions.js
            this.content.mosaikRendering();
            //defined in functions.js
            screenSizeCalc();
        }
    }
}
