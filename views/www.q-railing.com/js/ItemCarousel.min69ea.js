(function($,window,document)
{$.fn.ItemCarousel=function(options)
{var carousels=[];this.each(function()
{var carousel=new Carousel(options,this);carousels.push(carousel);});return carousels;}
function Carousel(options,carousel)
{var defaults={index:0,items:[[1280,4],[1024,3],[768,2],[0,1]],itemsEqualizeHeight:'group',itemsEqualizeWidth:true,itemsMaxWidth:false,lastGroupNewPage:false,dynamicViewportWidth:false,loop:false,arrows:false,paging:false,autoplay:false,autoplayInterval:4000,pauzeOnHover:false,stopAfterNav:false,draggable:false,markup:('<div class="viewport_wrapper">'+'<div class="arrow left" is="arrow-left"><span class="icon"></span></div>'+'<div class="viewport" is="viewport"></div>'+'<div class="arrow right" is="arrow-right"><span class="icon"></span></div>'+'</div>'+'<div class="paging" is="paging"></div>')};this.options=$.extend(defaults,options);this.elements={carousel:$(carousel),viewport:$(),groups_wrapper:$(),groups:$(),groups_inner:$(),items:$()};this.controls={arrow_left:$(),arrow_right:$(),paging:$(),paging_items:$()};this.data={items_per_group:0,group_amount:0,active_index:this.options.index};this.autoplay={timer:null,stop:false}
this.setMarkup();}
Carousel.prototype={setMarkup:function()
{var _this=this;_this.elements.items=_this.elements.carousel.find('> *');_this.elements.carousel.append($(_this.options.markup));_this.elements.viewport=_this.elements.carousel.find('[is="viewport"]').removeAttr('is');if(_this.elements.viewport.length)
{_this.elements.groups_wrapper=$('<div class="groups">');_this.elements.groups_wrapper.append(_this.elements.items);_this.elements.viewport.append(_this.elements.groups_wrapper);_this.controls.arrow_left=_this.elements.carousel.find('[is="arrow-left"]').removeAttr('is');_this.controls.arrow_right=_this.elements.carousel.find('[is="arrow-right"]').removeAttr('is');_this.controls.paging=_this.elements.carousel.find('[is="paging"]').removeAttr('is');if(!_this.options.arrows)
{_this.controls.arrow_left.remove();_this.controls.arrow_right.remove();_this.controls.arrow_left=$();_this.controls.arrow_right=$();}
if(!_this.options.paging)
{_this.controls.paging.remove();_this.controls.paging=$();}
this.start();}},start:function()
{var _this=this;_this.arrangeGroups();_this.elements.carousel.addClass('start');_this.setWidths();if(_this.options.itemsEqualizeHeight||_this.options.itemsEqualizeWidth)
{_this.equalize();}
if(_this.options.arrows)
{_this.setArrows();}
_this.setActiveGroup(false);if(_this.options.autoplay)
{_this.autoPlay();if(_this.options.pauzeOnHover)
{_this.elements.carousel.hover(function()
{if(!_this.autoplay.stop)clearInterval(_this.autoplay.timer);},function()
{if(!_this.autoplay.stop)_this.autoPlay();});}}
else
{_this.autoplay.stop=true;}
if(_this.options.draggable)
{_this.setDragEvents();}
$(window).resize();$(window).resize(function()
{_this.elements.viewport.addClass('dragging');if(_this.options.autoplay&&!_this.autoplay.stop)
{clearInterval(_this.autoplay.timer);}
_this.arrangeGroups();_this.setWidths();if(_this.options.itemsEqualizeHeight||_this.options.itemsEqualizeWidth)
{_this.equalize();}
_this.setActiveGroup(false);});$(window).resize(_this.debouncer(function(e)
{_this.elements.viewport.removeClass('dragging');if(_this.options.autoplay&&!_this.autoplay.stop)
{_this.autoPlay();}}));},arrangeGroups:function(element)
{var _this=this;var items_per_group;for(var i=0;i<_this.options.items.length;i++)
{var items_window_width=_this.options.items[i][0];var items_item_amount=_this.options.items[i][1];if($(window).width()>=items_window_width)
{items_per_group=items_item_amount;break;}}
if(_this.data.items_per_group!=items_per_group||element)
{_this.data.items_per_group=items_per_group;if(_this.elements.groups.length)
{_this.elements.items.unwrap();_this.elements.items.unwrap();}
if(element)
{_this.elements.groups_wrapper.append(element);_this.elements.items=_this.elements.items.add(element);}
_this.data.group_amount=Math.ceil(_this.elements.items.length / _this.data.items_per_group);var group_arr=[];var counter=0;for(i=0;i<_this.data.group_amount;i++)
{var items=$(_this.elements.items);var group=$(items.splice(counter,_this.data.items_per_group));group_arr.push(group);counter+=_this.data.items_per_group;}
for(i=0;i<group_arr.length;i++)
{var group=$('<div class="group">');group_arr[i].wrapAll(group);}
_this.elements.groups=_this.elements.groups_wrapper.find('.group');_this.elements.groups.each(function()
{var inner=$('<div class="inner">');$(this).children().wrapAll(inner);});_this.elements.groups_inner=_this.elements.groups_wrapper.find('.inner');if(_this.options.paging)
{_this.setPaging();}}
if(element)
{_this.setActiveGroup();}},setWidths:function()
{var _this=this;if(_this.options.itemsMaxWidth)
{var carousel_width=_this.elements.carousel[0].getBoundingClientRect().width;var arrow_correction=116;var max_width=carousel_width-arrow_correction;_this.elements.groups.each(function()
{var group_width=this.getBoundingClientRect().width;var tabs=$(this).find('.tab');tabs.find('> span').css('max-width',((max_width / tabs.length)-80).toString()+'px');});}
if(_this.options.dynamicViewportWidth)
{var wrapper_width=0;_this.elements.groups.each(function()
{wrapper_width+=this.getBoundingClientRect().width;});_this.elements.groups_wrapper.css('width',wrapper_width);}
else
{_this.elements.groups.css('width',_this.elements.viewport[0].getBoundingClientRect().width+'px');_this.elements.groups_wrapper.css('width',(_this.data.group_amount*_this.elements.viewport[0].getBoundingClientRect().width));}},equalize:function()
{var _this=this;if(_this.options.itemsEqualizeWidth&&!_this.options.dynamicViewportWidth)
{_this.elements.items.css('width',(100 /_this.data.items_per_group)+'%');}
if(_this.options.itemsEqualizeHeight=='group')
{_this.elements.groups_inner.each(function()
{var group_items=$(this).children();group_items.css('height','auto');var heights=[];for(i=0;i<group_items.length;i++)
{heights.push($(group_items[i]).outerHeight());}
var max_height=Math.max.apply(Math,heights);group_items.css('height',max_height);});}
if(_this.options.itemsEqualizeHeight=='all')
{_this.elements.items.css('height','auto');var heights=[];for(i=0;i<_this.elements.items.length;i++)
{heights.push($(_this.elements.items[i]).outerHeight());}
var max_height=Math.max.apply(Math,heights);_this.elements.items.css('height',max_height);}},setActiveGroup:function(nav)
{var _this=this;if(_this.data.active_index<0)
{_this.data.active_index=(_this.data.group_amount-1);}
else if(_this.data.active_index>(_this.data.group_amount-1))
{_this.data.active_index=0;}
var active_group=_this.elements.groups.eq(_this.data.active_index);var active_group_left=(active_group.position().left==0)?0:-(active_group.position().left);var left_correction=0;if(_this.data.group_amount>1&&_this.data.active_index>=(_this.data.group_amount-1)&&!_this.options.dynamicViewportWidth&&!_this.options.lastGroupNewPage)
{var left_correction=_this.elements.viewport.outerWidth();active_group.children().children().each(function()
{if($(this).position().top==0)
{left_correction=left_correction-$(this).outerWidth();}});}
if(left_correction>0)
{var heights=[active_group.prev().outerHeight(),active_group.outerHeight()];var max_height=Math.max.apply(Math,heights);_this.elements.viewport.css('height',max_height);}
else
{_this.elements.viewport.css('height',active_group.outerHeight());}
if(_this.options.dynamicViewportWidth)
{_this.elements.viewport.css('width',active_group[0].getBoundingClientRect().width);}
_this.elements.groups_wrapper.css('left',active_group_left+left_correction);if(this.options.paging&&_this.controls.paging_items.length)
{_this.controls.paging_items.removeClass('active');_this.controls.paging_items.eq(_this.data.active_index).addClass('active');}
if(this.options.arrows&&!this.options.loop&&_this.controls.arrow_left.length&&_this.controls.arrow_right.length)
{_this.controls.arrow_left.removeClass('disabled');_this.controls.arrow_right.removeClass('disabled');if(_this.data.active_index<=0)
{_this.controls.arrow_left.addClass('disabled');}
if(_this.data.active_index>=(_this.data.group_amount-1))
{_this.controls.arrow_right.addClass('disabled');}}
if(this.options.stopAfterNav&&!_this.autoplay.stop&&nav)
{clearInterval(_this.autoplay.timer);_this.autoplay.stop=true;}
if(!_this.autoplay.stop&&!_this.elements.carousel.is(':hover')&&nav)
{_this.autoPlay();}},setArrows:function()
{var _this=this;if(_this.controls.arrow_left.length)
{_this.controls.arrow_left.bind('click',function()
{if(!$(this).hasClass('disabled'))
{_this.data.active_index=_this.data.active_index-1;_this.setActiveGroup(true);}});}
if(_this.controls.arrow_right.length)
{_this.controls.arrow_right.bind('click',function()
{if(!$(this).hasClass('disabled'))
{_this.data.active_index=_this.data.active_index+1;_this.setActiveGroup(true);}});}},setPaging:function()
{var _this=this;if(_this.controls.paging.length)
{if(_this.controls.paging_items.length)
{_this.controls.paging_items.remove();}
if(_this.data.group_amount)
{var page_arr=[];for(var i=0;i<_this.data.group_amount;i++)
{var page=$('<div class="page"></div>');var page_inner=$('<span></span>');if(_this.options.paging=='bullets')
{page.addClass('bullet');}
if(_this.options.paging=='numbers')
{page_inner.text((i+1).toString());page.addClass('number');}
if(_this.options.paging=='thumbnails')
{var img=_this.elements.groups.eq(i).find('img').first();if(img.length)
{src=(!img.attr('src'))?'':img.attr('src');if(src)
{page.css('background-image','url('+src+')');}}
page.addClass('thumbnail');}
page.append(page_inner);if(i==_this.data.active_index)page.addClass('active');page.on('click',function()
{_this.data.active_index=$(this).index();_this.setActiveGroup(true);});_this.controls.paging.append(page);}
_this.controls.paging_items=_this.controls.paging.find('> *');}}},autoPlay:function()
{var _this=this;clearInterval(_this.autoplay.timer);_this.autoplay.timer=setInterval(function()
{_this.data.active_index=_this.data.active_index+1;_this.setActiveGroup(false);},_this.options.autoplayInterval);},setDragEvents:function()
{var _this=this;_this.elements.viewport.addClass('draggable');_this.elements.viewport.bind('mousedown',function(e)
{$('html').addClass('dragging');_this.elements.viewport.addClass('dragging');if(_this.options.autoplay&&!_this.autoplay.stop)
{clearInterval(_this.autoplay.timer);}
var wrapper_init_position=parseInt(_this.elements.groups_wrapper.css('left'));var mouse_wrapper_mouse_x=e.pageX-_this.elements.groups_wrapper.offset().left;var boundries=[];var left_position;var direction;$('html').bind('mousemove',function(e)
{boundries=[];var mouse_viewport_mouse_x=(e.pageX-_this.elements.viewport.offset().left);var left_correction=0;if(_this.data.group_amount>1&&!_this.options.dynamicViewportWidth&&!_this.options.lastGroupNewPage)
{left_correction=_this.elements.viewport.outerWidth();_this.elements.groups.last().children().children().each(function()
{if($(this).position().top==0)
{left_correction=left_correction-$(this).outerWidth();}});}
left_position=mouse_viewport_mouse_x-mouse_wrapper_mouse_x;var max_left=(-_this.elements.groups_wrapper.outerWidth()+_this.elements.viewport.outerWidth())+left_correction;if(left_position>0)
{left_position=left_position / 10;}
if(left_position<max_left)
{var difference=Math.abs(left_position)-Math.abs(max_left);left_position=left_position+(difference*0.9);}
direction=((wrapper_init_position-left_position)>0)?'right':((wrapper_init_position-left_position)<0)?'left':'neutral';for(i=0;i<_this.data.group_amount;i++)
{var group=_this.elements.groups.eq(i);if(direction=='right')
{var left_boundry=group.position().left-(group.outerWidth()*0.4);boundries.push(left_boundry);}
if(direction=='left')
{var left_boundry=group.position().left+(group.outerWidth()*0.4);boundries.push(left_boundry);}}
_this.elements.groups_wrapper.css('left',parseInt(left_position));});$('html').bind('mouseup',function()
{$('html').unbind('mousemove');$('html').unbind('mouseup');$('html').removeClass('dragging');_this.elements.viewport.removeClass('dragging');if(boundries.length&&!_this.options.dynamicViewportWidth)
{var goal=Math.abs(left_position);var closest=boundries.reduce(function(prev,curr)
{return(Math.abs(curr-goal)<Math.abs(prev-goal)?curr:prev);});var new_index=boundries.indexOf(closest);_this.data.active_index=new_index;}
else if(_this.data.group_amount>1)
{var new_index;if(direction=='right')
{new_index=_this.data.active_index+1;}
else if(direction=='left')
{new_index=_this.data.active_index-1;}
if(new_index!==undefined)
{if(new_index>(_this.data.group_amount-1))
{new_index=(_this.data.group_amount-1);}
else if(new_index<0)
{new_index=0;}
_this.data.active_index=new_index;}}
if(_this.options.autoplay&&!_this.autoplay.stop&&!_this.elements.carousel.is(':hover'))
{_this.autoPlay();}
_this.setActiveGroup(true);});});},debouncer:function(func,timeout)
{var timeoutID;var timeout=timeout||200;return function()
{var scope=this;var args=arguments;clearTimeout(timeoutID);timeoutID=setTimeout(function()
{func.apply(scope,Array.prototype.slice.call(args));},timeout);}},reset:function()
{var _this=this;var items=_this.elements.items.clone();_this.elements.carousel.children().remove();_this.elements.carousel.append(items);_this.elements={carousel:_this.elements.carousel,viewport:$(),groups_wrapper:$(),groups:$(),items:$()};_this.controls={arrow_left:$(),arrow_right:$(),paging:$(),paging_items:$()};_this.data={items_per_group:0,group_amount:0,active_index:_this.options.index};_this.autoplay={timer:null,stop:false}
_this.setMarkup();},goto:function(index)
{var _this=this;if(index=='last')
{index=(_this.data.group_amount-1);}
_this.data.active_index=index;_this.setActiveGroup(false);},addItems:function(elements)
{var _this=this;$(elements).each(function()
{_this.arrangeGroups($(this));_this.setWidths();_this.equalize();});}}}(jQuery,window,document));