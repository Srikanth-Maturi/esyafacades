var Moodboards = {
	$popup: {}, 
	isCreating : false,
	isAddingItem: false,
	isRemoving: false,

	// init
	init: function()
	{
		Moodboards.list.init();
		Moodboards.view.init();
		Moodboards.addTo.init();
	},

	// list
	list: {
		init: function()
		{
			Moodboards.list.remove();
		},
		remove: function()
		{
			var sel = '#js-m-delete-popup';
			$(document).on('click', '.js-m-delete', function(event)
			{
				event.preventDefault();

				// set moodboard id
				var id = $(this).data('id');
				$(sel+' #js-m-delete-id').val(id);

				$.magnificPopup.open({
					items: {
						src: sel
					},
				}, 0);
			});

			$(document).on('click', sel+' .js-no', function(event)
			{
				event.preventDefault();
				$.magnificPopup.close({
					items: {
						src: sel
					},
				}, 0);
			});

			$(document).on('click', sel+' .js-submit', function(event)
			{
				event.preventDefault();

				// show country block
				$(this).closest('form').submit();
			});
		}
	},

	// view
	view: {
		init: function()
		{
			Moodboards.view.share();
			Moodboards.view.editContent();
			Moodboards.view.editLogo();
		},
		share: function()
		{
			if ($('.js-share-block').length)
			{
				$('.js-share-block').each(function()
				{
					var $t = $(this);

					$t.buttons = $t.children('div.share_buttons');

					$t.children('a').click(function(event)
					{
						event.preventDefault();
						$t.toggleClass('active').buttons.stop().fadeToggle(200);
					});
				});
			}
		},
		editContent: function ()
		{
			if ($('.js-m-edit-content').length)
			{
				var $text = $('.moodboard_description .text');
				if ($.trim($('.editarea', $text).text()) == '') {
					$text.addClass('empty').find('.editarea').html($text.data('wm'));
				}

				$('.moodboard_description .editable').click(function(e) {
					var $parent = $(e.target).closest('.editable'),
						$editBlock = $('.editarea', $parent),
						type = $parent.find('[data-field-name]').data('field-name'),
						cnt = $editBlock.html();

					$parent.addClass('edit');

					if (type == 'description') {
						var wm = $parent.data('wm');
						if ($parent.hasClass('empty')) {
							$editBlock.html('&nbsp;');
							$parent.removeClass('empty');
						}
					}

					$editBlock[0].contentEditable = true;
					$editBlock[0].focus();
					document.execCommand('selectAll',false,null)

					$editBlock
						.unbind('paste')
						.bind('paste', function() {
							setTimeout(function() {
								var cnt = $.trim($editBlock.text()).replace(/(\r\n|\n\r|\r|\n)/g, "<br />");
								$editBlock.html(cnt);
							}, 20);
						})

						.one('blur', function(e) {
							$parent.removeClass('edit');
							
						 	/*
							 $editBlock.html(cnt);
							if (type == 'description' && cnt == '') {
								$editBlock.html(wm);
								$parent.addClass('empty');
							}*/
						});

					$('.btn-save', $parent).unbind('mousedown').one('mousedown', function(e) {
						e.stopImmediatePropagation();
						$editBlock[0].contentEditable = false;
						cnt = $editBlock.html();
						if (type == 'description') {
							if (cnt == wm || $.trim($editBlock.text()) == '') {
								cnt = '';
							}
						} else {
							if ($.trim($editBlock.text()) == '') {
								alert('This field is required');
								$editBlock.blur();
								return;
							}
						}

						var reqUrl = moodboardUrl+'edit/';
						var send = {};
						send[type] = cnt;
						send.id = moodboardId;

						$.ajax({
							url: reqUrl,
							type: 'POST',
							data: send,
							success: function (data) {
								if (data.success) {
									$editBlock.blur();
								} else {
									alert(data.message);
								}
							}
						});
					});

				});
			}

		},

		editLogo: function() {
			
			if ($('.js-m-logo'))
			{
				var isUploading	= false;
				var $input		= $('#js-m-logo-file');
				var $form		= $('#js-m-logo-form');

				$input.change(uploadLogo);

				function uploadLogo() {
					if (isUploading) { return; }
					isUploading = true;
					var $iframe = $('<iframe id="moodLogoResponse" name="moodLogoResponse" src="" style="display:none;"></iframe>');
					var checkTime;

					$('body').append($iframe);
					$form[0].target = 'moodLogoResponse';
					$form.submit();

					var $respForm = $('#moodLogoResponse');

					checkTime = setInterval(function(){
						if ($respForm.contents().find('body').text().length){
							var response = JSON.parse($respForm.contents().find('body pre').text());
							if (response.success){
								var $section = $('.js-m-logo');
								$section.css({ 'height': $section.height() });
								$('img', $section).fadeOut(200, function() {
									$(this).remove();
								});
								var $img = $('<img src="' + response.data.url+'&nocache='+Math.random() + '" alt="">');
								$img.hide().load(function() {
									$section.animate({
										'height': $img.height()
									}, {
										duration: 200,
										complete: function() {
											$img.fadeIn(200);
										}
									});
								});
								$('.js-m-logo-wrapper', $section).prepend($img);
							} else {
								alert(response.Message);
							}
							$iframe.remove();
							clearInterval(checkTime);
							isUploading = false;
						}
					}, 300);
				}
			}
			
		},
	},

	addTo: {
		init: function()
		{
			Moodboards.addTo.add();
			Moodboards.addTo.create();
			Moodboards.addTo.popup.init();
			Moodboards.addTo.popupMessage.init();
		},
		add: function()
		{
			$(document).on('click', '.js-add-to-existing', function (event)
			{
				event.preventDefault();

				var $popup					= $(Moodboards.addTo.popup.sel), 
					data					= {};
					
				data.moodboard_id	= $(this).data('moodboard-id');
				data.entity_id		= $popup.find('#js-m-entity-id').val();
				data.entity_type_id	= $popup.find('#js-m-entity-type-id').val();

				$.ajax({
					method: 'POST',
					data: data,
					url: '/moodboard/entity/add/',
					success: function (response) {
						if (response.success)
						{
							Moodboards.addTo.popup.close();
						}
						else
						{
							Moodboards.addTo.popupMessage.setMessage(response.message);
							Moodboards.addTo.popupMessage.open();
						}
					}
				});
			});
		},
		create: function()
		{
			$(document).on('click', '.js-add-to-new-m', function (event)
			{
				event.preventDefault();

				var data	= {},
					$name	= $('#js-add-to-new-m-name');


				data.name = $name.val();

				if (!data.name)
				{
					$name.addClass('error');
					return;
				}
				else
				{
					$name.removeClass('error');
				}


				$.ajax({
					method: 'POST',
					data: data,
					url: '/moodboard/create/',
					success: function (response) {
						if (response.success)
						{
							var $item = $('.js-add-to-existing-item.tpl').clone();

							$item.find('.js-name').html(data.name);
							$item.find('.js-add-to-existing').data('moodboard-id', response.data.id);
							$item.show();

							$('.js-add-to-existing-items').append($item);
							$item.removeClass('tpl');
							$item.closest('.js-add-to-existing-wrap').show();

							$name.val('');
						}
						else
						{
							Moodboards.addTo.popupMessage.setMessage(response.message);
							Moodboards.addTo.popupMessage.open();
						}
					}
				});
			});
		},
		popup: {
			sel: '#js-m-add-to-popup',
			init: function()
			{
				$(document).on('click', '.js-m-add-to', function(event)
				{
					event.preventDefault();

					var sel		= Moodboards.addTo.popup.sel,
						id		= $(this).data('entity-id'),
						type_id	= $(this).data('entity-type-id');

					$(sel+' #js-m-entity-id').val(id);
					$(sel+' #js-m-entity-type-id').val(type_id);

					Moodboards.addTo.popup.open();
				});
			},
			open: function()
			{
				$.magnificPopup.open({
					items: {
						src: Moodboards.addTo.popup.sel
					},
					mainClass: 'm-add-to-popup'
				}, 0);
			},
			close: function()
			{
				$.magnificPopup.close({
					items: {
						src: Moodboards.addTo.popup.sel
					},
				}, 0);
			}
		},
		popupMessage: {
			sel: '#js-m-add-to-popup-message',
			init: function()
			{
				$(document).on('click', Moodboards.addTo.popupMessage.sel+' .js-no', function(event)
				{
					event.preventDefault();
					Moodboards.addTo.popupMessage.close();
				});
			},

			open: function()
			{
				$.magnificPopup.open({
					items: {
						src: Moodboards.addTo.popupMessage.sel
					},
					mainClass: 'm-add-to-popup'
				}, 0);
			},
			close: function()
			{
				$.magnificPopup.close({
					items: {
						src: Moodboards.addTo.popupMessage.sel
					},
				}, 0);

				Moodboards.addTo.popup.open();
			},
			setMessage: function(message)
			{
				$(Moodboards.addTo.popupMessage.sel).find('.js-message').html(message);
			}
		},
	}
};

$(document).ready(function()
{
	Moodboards.init();
});
