/*	
 *	jQuery carouFredSel 2.1.3
 *	Demo's and documentation:
 *	caroufredsel.frebsite.nl
 *	
 *	Copyright (c) 2010 Fred Heusschen
 *	www.frebsite.nl
 *
 *	Licensed under the MIT license.
 *	http://www.opensource.org/licenses/mit-license.php
 */

(function($) {
	$.fn.carouFredSel = function(options) {
		return this.each(function() {
			var opts 			= $.extend(true, {}, $.fn.carouFredSel.defaults, options),
				$ul 			= $(this),
				$wr				= $ul.wrap('<div class="caroufredsel_wrapper" />').parent(),
				$it 			= $('> *', $ul),
				totalItems		= $it.length,
				firstItem		= 0,
				autoInterval	= null,
				direction		= (opts.direction == 'up' || opts.direction == 'left') ? 'next' : 'prev';

			if ( typeof( opts.items ) != 'object')	opts.items			= { visible: opts.items };
			if (		!opts.items.width)			opts.items.width	= $it.outerWidth(true);
			if (		!opts.items.height)			opts.items.height	= $it.outerHeight(true);

/* TEMP */	if (opts.visibleItems) opts.items.visible = opts.visibleItems;

			if (typeof(	opts.scroll.duration) != 'number') 	opts.scroll.duration 	= 500;
			if (		opts.scroll.items == null) 			opts.scroll.items 		= opts.items.visible;

			opts.auto		= $.fn.carouFredSel.getNaviObject(opts.auto, false, true);
			opts.prev		= $.fn.carouFredSel.getNaviObject(opts.prev);
			opts.next		= $.fn.carouFredSel.getNaviObject(opts.next);
			opts.pagination	= $.fn.carouFredSel.getNaviObject(opts.pagination, true);

			opts.auto 		= $.extend({}, 	opts.scroll,	opts.auto);
			opts.prev 		= $.extend({}, 	opts.scroll,	opts.prev);
			opts.next 		= $.extend({}, 	opts.scroll,	opts.next);
			opts.pagination	= $.extend({}, 	opts.scroll,	opts.pagination);

			if (typeof(	opts.pagination.anchorBuilder)	!= 'function')			opts.pagination.anchorBuilder 	= $.fn.carouFredSel.pageAnchorBuilder;
			if (typeof(	opts.pagination.keys) 			!= 'boolean')			opts.pagination.keys 			= false;
			if (typeof(	opts.auto.play) 				!= 'boolean')			opts.auto.play 					= true;
			if (typeof(	opts.auto.nap)		 			!= 'boolean')			opts.auto.nap 					= true;
			if (typeof(	opts.auto.delay)				!= 'number')			opts.auto.delay					= 0;
			if (typeof(	opts.auto.pauseDuration)		!= 'number')			opts.auto.pauseDuration			= opts.auto.duration * 6;
			if (		opts.auto.pauseDuration 		== 	opts.auto.duration) opts.auto.duration -= 10;

			opts.prev.name 			= 'prev';
			opts.next.name 			= 'next';
			opts.pagination.name	= 'pagination';

			$ul.css({
				position	: 'absolute'
			});
			$wr.css({ 
				position	: 'relative',
				overflow	: 'hidden'
			});
			var sizes = $.fn.carouFredSel.getSizes(opts, $it.filter(':lt('+opts.items.visible+')'), true);
			$wr.css(sizes[0], sizes[1])
				.css(sizes[2], sizes[3]);
			
			var sizes = $.fn.carouFredSel.getSizes(opts, $it);
			$ul.css(sizes[0], sizes[1] * 2)
				.css(sizes[2], sizes[3]);

			$ul.bind('pause', function() {
					if (autoInterval != null) {
						clearTimeout(autoInterval);
					}
				})
				.bind('play', function(e, d, f) {
					if (opts.auto.play) {
						if (typeof(d) == 'undefined') 	d = direction;
						if (typeof(f) == 'undefined') 	f = 0;

						autoInterval = setTimeout(function() {
							if ($ul.is(':animated')) 	$ul.trigger('pause').trigger('play', d);	//	still animating, wait
							else 						$ul.trigger(d, opts.auto);					//	scroll
						}, opts.auto.pauseDuration + f);
					}
				})
				.bind('prev', function(e, sliderObj, numItems) {
					if ($ul.is(':animated')) return;
					if (opts.items.visible >= totalItems) {
						$.fn.carouFredSel.log('Not enough items: not scrolling');
						return;
					}

					if (typeof(sliderObj) == 'number')	numItems  	= sliderObj;
					if (typeof(sliderObj) != 'object')	sliderObj 	= opts.prev;
					if (typeof(numItems)  != 'number')	numItems 	= sliderObj.items;

					if (typeof(numItems)  != 'number') {
						$.fn.carouFredSel.log('Not a valid number.');
						return;
					}

					$ul.find('> *:gt('+(totalItems-numItems-1)+')').prependTo($ul);

					if (totalItems < opts.items.visible + numItems) {
						$ul.find('> *:lt('+((opts.items.visible + numItems)-totalItems)+')').clone(true).appendTo($ul);
					}

						firstItem -= numItems;
					if (firstItem < 0) firstItem += totalItems;

					var items = $.fn.carouFredSel.getCurrentItems($ul, opts, numItems),
						sizes = $.fn.carouFredSel.getSizes(opts, items[0].filter(':lt('+numItems+')')),
						wrsiz = $.fn.carouFredSel.getSizes(opts, items[0], true);

					var ani = {},
						wra = {},
						dur = (sliderObj.duration == 'auto') ? opts.scroll.duration / opts.scroll.items * numItems : sliderObj.duration;

					ani[sizes[4]] = 0;
					wra[sizes[0]] =  wrsiz[1];
					wra[sizes[2]] =  wrsiz[3];

					if (sliderObj.onBefore) {
						sliderObj.onBefore(items[1], items[0], sliderObj.name);
					}
					
					$wr.animate(wra, {
						duration: dur,
						easing	: sliderObj.easing
					});
					$ul
						.data('numItems', 	numItems)
						.data('sliderObj', 	sliderObj)
						.data('oldItems', 	items[1])
						.data('newItems', 	items[0])
						.css(sizes[4], -sizes[1])
						.animate(ani, { 
							duration: dur,
							easing	: sliderObj.easing,
							complete: function() {
								if (totalItems < opts.items.visible + $ul.data('numItems')) {
									$ul.find('> *:gt('+(totalItems-1)+')').remove();
								}
								if ($ul.data('sliderObj').onAfter) {
									$ul.data('sliderObj').onAfter($ul.data('oldItems'), $ul.data('newItems'), $ul.data('sliderObj').name);
								}
							}
						});

					//	auto-play
					$ul.trigger('updatePageStatus')
						.trigger('pause').trigger('play', 'prev');					
				})
				.bind('next', function(e, sliderObj, numItems) {
					if ($ul.is(':animated')) return;
					if (opts.items.visible >= totalItems) {
						$.fn.carouFredSel.log('Not enough items: not scrolling');
						return;
					}

					if (typeof(sliderObj) == 'number')	numItems  	= sliderObj;
					if (typeof(sliderObj) != 'object')	sliderObj 	= opts.next;
					if (typeof(numItems)  != 'number')	numItems 	= sliderObj.items;

					if (typeof(numItems) != 'number') {
						$.fn.carouFredSel.log('Not a valid number.');
						return;
					}
					if (totalItems < opts.items.visible + numItems) {
						$ul.find('> *:lt('+((opts.items.visible + numItems)-totalItems)+')').clone(true).appendTo($ul);
					}

						firstItem += numItems;
					if (firstItem >= totalItems) firstItem -= totalItems;

					var items = $.fn.carouFredSel.getCurrentItems($ul, opts, numItems),
						sizes = $.fn.carouFredSel.getSizes(opts, items[0].filter(':lt('+numItems+')')),
						wrsiz = $.fn.carouFredSel.getSizes(opts, items[1], true);

					var ani = {},
						wra = {},
						dur = (sliderObj.duration == 'auto') ? opts.scroll.duration / opts.scroll.items * numItems : sliderObj.duration;

					ani[sizes[4]] = -sizes[1];
					wra[sizes[0]] =  wrsiz[1];
					wra[sizes[2]] =  wrsiz[3];

					if (sliderObj.onBefore) {
						sliderObj.onBefore(items[0], items[1], sliderObj.name);
					}

					$wr.animate(wra, {
						duration: dur,
						easing	: sliderObj.easing
					});
					$ul
						.data('numItems', 	numItems)
						.data('sliderObj', 	sliderObj)
						.data('oldItems', 	items[0])
						.data('newItems', 	items[1])
						.animate(ani, { 
							duration: dur,
							easing	: sliderObj.easing,
							complete: function() {
								if ($ul.data('sliderObj').onAfter) {
									$ul.data('sliderObj').onAfter($ul.data('oldItems'), $ul.data('newItems'), $ul.data('sliderObj').name);
								}
								if (totalItems < opts.items.visible + $ul.data('numItems')) {
									$ul.find('> *:gt('+(totalItems-1)+')').remove();
								}
								$ul.css(sizes[4], 0).find('> *:lt('+$ul.data('numItems')+')').appendTo($ul);
							}
						});

					//	auto-play
					$ul.trigger('updatePageStatus')
						.trigger('pause').trigger('play', 'next');
				})
				.bind('scrollTo', function(e, n, d, o) {
					if ($ul.is(':animated')) return;

						 if (typeof(n) == 'string') n = parseInt(n);
						 if (typeof(n) == 'object') n = $ul.find('> *').index(n);
					else if (typeof(n) == 'number') {
						n += -firstItem + totalItems;
						if (n >= totalItems) n -= totalItems;
					}
					
					if (typeof(n) != 'number' || n == -1) {
						$.fn.carouFredSel.log('Not a valid number.');
						return;
					}

					if (typeof(d) == 'string') d = parseInt(d);
					if (typeof(d) != 'number') d = 0;

					if (typeof(o) != 'object') o = false;

					n += d;
					if (n < 0) 				n += totalItems;
					if (n >= totalItems)	n -= totalItems;
					if (n == 0) return;

					if (n < totalItems / 2) $ul.trigger('next', [o, n]);
					else					$ul.trigger('prev', [o, totalItems-n]);
				})
				.bind('slideTo', function(e, n, d, o) {
					$ul.trigger('scrollTo', [n, d, o]);
				})
				.bind('insertItem', function(e, i, n) {
					if (typeof(i) == 'string') i = $(i);
					if (typeof(i) != 'object' ||
						typeof(i.jquery) == 'undefined' ||
						i.length == 0
					) {
						$.fn.carouFredSel.log('Not a valid object.');
						return;
					}

					if (typeof(n) == 'undefined')	n = 'after';
					if (typeof(n) == 'number') 		n = n-1;
					if (typeof(n) == 'string')	{
							 if (n == 'before') 	n = totalItems-1;
						else if (n == 'after')		n = opts.items.visible - 1;
						else if (n == 'end') 		n = totalItems-firstItem-1;
						else 						n = $(n);
					}
					if (typeof(n) == 'object')		n = $ul.find('> *').index(n)-1;
					if (typeof(n) != 'number') {
						$.fn.carouFredSel.log('Not a valid number.');
						return;
					}

					var nulItem = totalItems - firstItem;
					if (nulItem >= totalItems) nulItem -= totalItems;
					if (n >= nulItem && nulItem > 0) {
						firstItem += i.length;
					}

					var $itms = $ul.find('> *');
					if ($itms.length < 2) {
						if (n == -1)	$ul.prepend(i);
						else			$ul.append(i);
					} else {
						if (n == -1) 	$itms.filter(':nth(0)').before(i);
						else			$itms.filter(':nth('+n+')').after(i);
					}

					$it 		= $ul.find('> *');
					totalItems 	= $it.length;

					var sizes = $.fn.carouFredSel.getSizes(opts, $it);
					$ul.css(sizes[0], sizes[1] * 2)
						.css(sizes[2], sizes[3])
						.trigger('updatePageStatus', true);
				})
				.bind('removeItem', function(e, i) {
					if (typeof(i) == 'object' &&
						typeof(i.jquery) == 'undefined') 	i = $(i);
					if (typeof(i) == 'string')				i = $(i);
					if (typeof(i) == 'number')				i = $ul.find('> *:nth('+i+')');
					
					if (typeof(i) != 'object' ||
						typeof(i.jquery) == 'undefined' ||
						i.length == 0
					) {
						$.fn.carouFredSel.log('Not a valid object.');
						return;
					}

					var n = $ul.find('> *').index(i);
					var nulItem = totalItems - firstItem;
					if (nulItem >= totalItems) nulItem -= totalItems;
					if (n >= nulItem && nulItem > 0)	firstItem -= i.length;
					else if (nulItem - i.length == 0)	firstItem = 0;

					i.remove();

					$it 		= $ul.find('> *');
					totalItems 	= $it.length;

					var sizes = $.fn.carouFredSel.getSizes(opts, $it);
					$ul.css(sizes[0], sizes[1] * 2)
						.css(sizes[2], sizes[3])
						.trigger('updatePageStatus', true);
				})
				.bind('updatePageStatus', function(e, bpa) {
					if (opts.pagination.container == null ||
						opts.pagination.container.length == 0) return false;

					if (typeof(bpa) == 'boolean' && bpa) {
						opts.pagination.container.find('> *').remove();
						for (var a = 0; a < Math.ceil(totalItems/opts.items.visible); a++) {
							opts.pagination.container.append(opts.pagination.anchorBuilder(a+1));
						}
						opts.pagination.container.find('> *').each(function(a) {
							$(this).unbind('click').click(function() {
								$ul.trigger('scrollTo', [a * opts.items.visible, 0, opts.pagination]);;
								return false;
							});
						});
					}

					var nr = Math.round(firstItem / opts.items.visible);
					opts.pagination.container.find('> *')
						.removeClass('selected')
						.filter(':nth('+nr+')').addClass('selected');
				});

			if (opts.auto.pauseOnHover && opts.auto.play) {
				$ul.hover(
					function() { $ul.trigger('pause'); },
					function() { $ul.trigger('play', direction); }
				);
			}

			//	via prev-button
			if (opts.prev.button != null && opts.prev.button.length) {
				opts.prev.button.click(function() {
					$ul.trigger('prev');
					return false;
				});
				if (opts.prev.pauseOnHover && opts.auto.play) {
					opts.prev.button.hover(
						function() { $ul.trigger('pause'); },
						function() { $ul.trigger('play', direction); }
					);
				}
			}

			//	via next-button
			if (opts.next.button != null && opts.next.button.length) {
				opts.next.button.click(function() {
					$ul.trigger('next');
					return false;
				});
				if (opts.next.pauseOnHover && opts.auto.play) {
					opts.next.button.hover(
						function() { $ul.trigger('pause'); },
						function() { $ul.trigger('play', direction); }
					);
				}
			}

			//	via pagination
			if (opts.pagination.container != null && opts.pagination.container.length) {
				$ul.trigger('updatePageStatus', true);
				if (opts.pagination.pauseOnHover && opts.auto.play) {
					opts.pagination.container.hover(
						function() { $ul.trigger('pause'); },
						function() { $ul.trigger('play', direction); }
					);
				}
			}

			//	via keyboard
			if (opts.next.key || opts.prev.key) {
				$(document).keyup(function(e) {
					var k = e.keyCode;
					if (k == opts.next.key)	$ul.trigger('next');
					if (k == opts.prev.key)	$ul.trigger('prev');
				});
			}
			if (opts.pagination.keys) {
				$(document).keyup(function(e) {
					var k = e.keyCode;
					if (k >= 49 && k < 58) {
						k = (k - 49) * opts.items.visible;
						if (k <= totalItems) {
							$ul.trigger('scrollTo', [k, 0, opts.pagination]);
						}
					}
				});
			}

			//	via auto-play
			if (opts.auto.play) {
				$ul.trigger('play', [direction, opts.auto.delay]);
				if ($.fn.nap && opts.auto.nap) {
					$ul.nap('pause', 'play');
				}
			}
		});
	}

	$.fn.carouFredSel.defaults = {
		width				: null,
		height				: null,
		items : {
			visible			: 7
		},
		direction			: 'left',
		scroll : {
			items				: null,
			easing				: 'swing',
			duration			: null,
			pauseOnHover		: false,
			onBefore			: null,
			onAfter				: null
		}
	};
	$.fn.carouFredSel.getKeyCode = function(string) {
		if (string == 'right')	return 39;
		if (string == 'left') 	return 37;
		if (string == 'up')		return 38;
		if (string == 'down')	return 40;
		return -1;
	};
	$.fn.carouFredSel.getNaviObject = function(obj, pagi, auto) {
		if (typeof(pagi) != 'boolean')	pagi = false;
		if (typeof(auto) != 'boolean')	auto = false;

		if (typeof(obj) == 'undefined') 			obj  = {};
		if (typeof(obj) == 'string') {
			var temp = $.fn.carouFredSel.getKeyCode(obj);
			if (temp == -1)							obj = $(obj);
			else									obj = temp;
		}

		if (pagi) {
			if (typeof(obj.jquery) != 'undefined')	obj = { container: obj };
			if (typeof(obj) == 'boolean')			obj = { keys: obj };
			if (typeof(obj.container) == 'string')	obj.container = $(obj.container);

		} else if (auto) {
			if (typeof(obj) == 'boolean')			obj = { play: obj };
			if (typeof(obj) == 'number')			obj = { pauseDuration: obj };

		} else {
			if (typeof(obj.jquery) != 'undefined')	obj = { button: obj };
			if (typeof(obj) == 'number')			obj = { key: obj };
			if (typeof(obj.button) == 'string')		obj.button = $(obj.button);
			if (typeof(obj.key) == 'string')		obj.key = $.fn.carouFredSel.getKeyCode(obj.key);
		}
		return obj;
	};
	$.fn.carouFredSel.getCurrentItems = function($u, o, n) {
		var oi = $u.find('> *:lt('+o.items.visible+')'),
			ni = $u.find('> *:lt('+(o.items.visible + n)+'):gt('+(n-1)+')');

		return [oi, ni];
	};
	$.fn.carouFredSel.log = function(msg) {
		try { console.log('carouFredSel: '+msg); } catch(err) {}
	};
	$.fn.carouFredSel.pageAnchorBuilder = function(nr) {
		return '<a href="#"><span>'+nr+'</span></a>';
	};

	$.fn.carouFredSel.getSizes = function(o, $i, wrap) {
		if (typeof(wrap) != 'boolean') wrap = false;
		var SZ = (o.direction == 'right' || o.direction == 'left') 
			? ['width', 'outerWidth', 'height', 'outerHeight', 'left']
			: ['height', 'outerHeight', 'width', 'outerWidth', 'top'];

		var s1 = 0,
			s2 = 0;
		
			 if (wrap && typeof(o[SZ[0]]) 		== 'number') 	s1 = o[SZ[0]];
		else if (		 typeof(o.items[SZ[0]]) == 'number')	s1 = o.items[SZ[0]] * $i.length;
		else 													s1 = $.fn.carouFredSel.getSizeTotal($i, SZ[1]);
		
			 if (wrap && typeof(o[SZ[2]]) 		== 'number') 	s2 = o[SZ[2]];
		else if (		 typeof(o.items[SZ[2]]) == 'number') 	s2 = o.items[SZ[2]];
		else 													s2 = $.fn.carouFredSel.getSizeMax($i, SZ[3]);
		return [SZ[0], s1, SZ[2], s2, SZ[4]];
	};
	$.fn.carouFredSel.getSizeTotal = function($i, sz) {
		var s = 0;
		$i.each(function() {
			s += $(this)[sz](true);
		});
		return s;
	}
	$.fn.carouFredSel.getSizeMax = function($i, sz) {
		var s = 0,
			m = 0;
		$i.each(function() {
			m = $(this)[sz](true);
			if (s < m) s = m;
		});
		return s;
	}

	
})(jQuery);
/*	
 *	jQuery carouFredSel 2.1.3
	Funtion2
 */

(function($) {
	$.fn.carouFredSel5 = function(options) {
		return this.each(function() {
			var opts 			= $.extend(true, {}, $.fn.carouFredSel5.defaults, options),
				$ul 			= $(this),
				$wr				= $ul.wrap('<div class="carouFredSel5_wrapper" />').parent(),
				$it 			= $('> *', $ul),
				totalItems		= $it.length,
				firstItem		= 0,
				autoInterval	= null,
				direction		= (opts.direction == 'up' || opts.direction == 'left') ? 'next' : 'prev';

			if ( typeof( opts.items ) != 'object')	opts.items			= { visible: opts.items };
			if (		!opts.items.width)			opts.items.width	= $it.outerWidth(true);
			if (		!opts.items.height)			opts.items.height	= $it.outerHeight(true);

/* TEMP */	if (opts.visibleItems) opts.items.visible = opts.visibleItems;

			if (typeof(	opts.scroll.duration) != 'number') 	opts.scroll.duration 	= 500;
			if (		opts.scroll.items == null) 			opts.scroll.items 		= opts.items.visible;

			opts.auto		= $.fn.carouFredSel5.getNaviObject(opts.auto, false, true);
			opts.prev		= $.fn.carouFredSel5.getNaviObject(opts.prev);
			opts.next		= $.fn.carouFredSel5.getNaviObject(opts.next);
			opts.pagination	= $.fn.carouFredSel5.getNaviObject(opts.pagination, true);

			opts.auto 		= $.extend({}, 	opts.scroll,	opts.auto);
			opts.prev 		= $.extend({}, 	opts.scroll,	opts.prev);
			opts.next 		= $.extend({}, 	opts.scroll,	opts.next);
			opts.pagination	= $.extend({}, 	opts.scroll,	opts.pagination);

			if (typeof(	opts.pagination.anchorBuilder)	!= 'function')			opts.pagination.anchorBuilder 	= $.fn.carouFredSel5.pageAnchorBuilder;
			if (typeof(	opts.pagination.keys) 			!= 'boolean')			opts.pagination.keys 			= false;
			if (typeof(	opts.auto.play) 				!= 'boolean')			opts.auto.play 					= true;
			if (typeof(	opts.auto.nap)		 			!= 'boolean')			opts.auto.nap 					= true;
			if (typeof(	opts.auto.delay)				!= 'number')			opts.auto.delay					= 0;
			if (typeof(	opts.auto.pauseDuration)		!= 'number')			opts.auto.pauseDuration			= opts.auto.duration * 6;
			if (		opts.auto.pauseDuration 		== 	opts.auto.duration) opts.auto.duration -= 10;

			opts.prev.name 			= 'prev';
			opts.next.name 			= 'next';
			opts.pagination.name	= 'pagination';

			$ul.css({
				position	: 'absolute'
			});
			$wr.css({ 
				position	: 'relative',
				overflow	: 'hidden'
			});
			var sizes = $.fn.carouFredSel5.getSizes(opts, $it.filter(':lt('+opts.items.visible+')'), true);
			$wr.css(sizes[0], sizes[1])
				.css(sizes[2], sizes[3]);
			
			var sizes = $.fn.carouFredSel5.getSizes(opts, $it);
			$ul.css(sizes[0], sizes[1] * 2)
				.css(sizes[2], sizes[3]);

			$ul.bind('pause', function() {
					if (autoInterval != null) {
						clearTimeout(autoInterval);
					}
				})
				.bind('play', function(e, d, f) {
					if (opts.auto.play) {
						if (typeof(d) == 'undefined') 	d = direction;
						if (typeof(f) == 'undefined') 	f = 0;

						autoInterval = setTimeout(function() {
							if ($ul.is(':animated')) 	$ul.trigger('pause').trigger('play', d);	//	still animating, wait
							else 						$ul.trigger(d, opts.auto);					//	scroll
						}, opts.auto.pauseDuration + f);
					}
				})
				.bind('prev', function(e, sliderObj, numItems) {
					if ($ul.is(':animated')) return;
					if (opts.items.visible >= totalItems) {
						$.fn.carouFredSel5.log('Not enough items: not scrolling');
						return;
					}

					if (typeof(sliderObj) == 'number')	numItems  	= sliderObj;
					if (typeof(sliderObj) != 'object')	sliderObj 	= opts.prev;
					if (typeof(numItems)  != 'number')	numItems 	= sliderObj.items;

					if (typeof(numItems)  != 'number') {
						$.fn.carouFredSel5.log('Not a valid number.');
						return;
					}

					$ul.find('> *:gt('+(totalItems-numItems-1)+')').prependTo($ul);

					if (totalItems < opts.items.visible + numItems) {
						$ul.find('> *:lt('+((opts.items.visible + numItems)-totalItems)+')').clone(true).appendTo($ul);
					}

						firstItem -= numItems;
					if (firstItem < 0) firstItem += totalItems;

					var items = $.fn.carouFredSel5.getCurrentItems($ul, opts, numItems),
						sizes = $.fn.carouFredSel5.getSizes(opts, items[0].filter(':lt('+numItems+')')),
						wrsiz = $.fn.carouFredSel5.getSizes(opts, items[0], true);

					var ani = {},
						wra = {},
						dur = (sliderObj.duration == 'auto') ? opts.scroll.duration / opts.scroll.items * numItems : sliderObj.duration;

					ani[sizes[4]] = 0;
					wra[sizes[0]] =  wrsiz[1];
					wra[sizes[2]] =  wrsiz[3];

					if (sliderObj.onBefore) {
						sliderObj.onBefore(items[1], items[0], sliderObj.name);
					}
					
					$wr.animate(wra, {
						duration: dur,
						easing	: sliderObj.easing
					});
					$ul
						.data('numItems', 	numItems)
						.data('sliderObj', 	sliderObj)
						.data('oldItems', 	items[1])
						.data('newItems', 	items[0])
						.css(sizes[4], -sizes[1])
						.animate(ani, { 
							duration: dur,
							easing	: sliderObj.easing,
							complete: function() {
								if (totalItems < opts.items.visible + $ul.data('numItems')) {
									$ul.find('> *:gt('+(totalItems-1)+')').remove();
								}
								if ($ul.data('sliderObj').onAfter) {
									$ul.data('sliderObj').onAfter($ul.data('oldItems'), $ul.data('newItems'), $ul.data('sliderObj').name);
								}
							}
						});

					//	auto-play
					$ul.trigger('updatePageStatus')
						.trigger('pause').trigger('play', 'prev');					
				})
				.bind('next', function(e, sliderObj, numItems) {
					if ($ul.is(':animated')) return;
					if (opts.items.visible >= totalItems) {
						$.fn.carouFredSel5.log('Not enough items: not scrolling');
						return;
					}

					if (typeof(sliderObj) == 'number')	numItems  	= sliderObj;
					if (typeof(sliderObj) != 'object')	sliderObj 	= opts.next;
					if (typeof(numItems)  != 'number')	numItems 	= sliderObj.items;

					if (typeof(numItems) != 'number') {
						$.fn.carouFredSel5.log('Not a valid number.');
						return;
					}
					if (totalItems < opts.items.visible + numItems) {
						$ul.find('> *:lt('+((opts.items.visible + numItems)-totalItems)+')').clone(true).appendTo($ul);
					}

						firstItem += numItems;
					if (firstItem >= totalItems) firstItem -= totalItems;

					var items = $.fn.carouFredSel5.getCurrentItems($ul, opts, numItems),
						sizes = $.fn.carouFredSel5.getSizes(opts, items[0].filter(':lt('+numItems+')')),
						wrsiz = $.fn.carouFredSel5.getSizes(opts, items[1], true);

					var ani = {},
						wra = {},
						dur = (sliderObj.duration == 'auto') ? opts.scroll.duration / opts.scroll.items * numItems : sliderObj.duration;

					ani[sizes[4]] = -sizes[1];
					wra[sizes[0]] =  wrsiz[1];
					wra[sizes[2]] =  wrsiz[3];

					if (sliderObj.onBefore) {
						sliderObj.onBefore(items[0], items[1], sliderObj.name);
					}

					$wr.animate(wra, {
						duration: dur,
						easing	: sliderObj.easing
					});
					$ul
						.data('numItems', 	numItems)
						.data('sliderObj', 	sliderObj)
						.data('oldItems', 	items[0])
						.data('newItems', 	items[1])
						.animate(ani, { 
							duration: dur,
							easing	: sliderObj.easing,
							complete: function() {
								if ($ul.data('sliderObj').onAfter) {
									$ul.data('sliderObj').onAfter($ul.data('oldItems'), $ul.data('newItems'), $ul.data('sliderObj').name);
								}
								if (totalItems < opts.items.visible + $ul.data('numItems')) {
									$ul.find('> *:gt('+(totalItems-1)+')').remove();
								}
								$ul.css(sizes[4], 0).find('> *:lt('+$ul.data('numItems')+')').appendTo($ul);
							}
						});

					//	auto-play
					$ul.trigger('updatePageStatus')
						.trigger('pause').trigger('play', 'next');
				})
				.bind('scrollTo', function(e, n, d, o) {
					if ($ul.is(':animated')) return;

						 if (typeof(n) == 'string') n = parseInt(n);
						 if (typeof(n) == 'object') n = $ul.find('> *').index(n);
					else if (typeof(n) == 'number') {
						n += -firstItem + totalItems;
						if (n >= totalItems) n -= totalItems;
					}
					
					if (typeof(n) != 'number' || n == -1) {
						$.fn.carouFredSel5.log('Not a valid number.');
						return;
					}

					if (typeof(d) == 'string') d = parseInt(d);
					if (typeof(d) != 'number') d = 0;

					if (typeof(o) != 'object') o = false;

					n += d;
					if (n < 0) 				n += totalItems;
					if (n >= totalItems)	n -= totalItems;
					if (n == 0) return;

					if (n < totalItems / 2) $ul.trigger('next', [o, n]);
					else					$ul.trigger('prev', [o, totalItems-n]);
				})
				.bind('slideTo', function(e, n, d, o) {
					$ul.trigger('scrollTo', [n, d, o]);
				})
				.bind('insertItem', function(e, i, n) {
					if (typeof(i) == 'string') i = $(i);
					if (typeof(i) != 'object' ||
						typeof(i.jquery) == 'undefined' ||
						i.length == 0
					) {
						$.fn.carouFredSel5.log('Not a valid object.');
						return;
					}

					if (typeof(n) == 'undefined')	n = 'after';
					if (typeof(n) == 'number') 		n = n-1;
					if (typeof(n) == 'string')	{
							 if (n == 'before') 	n = totalItems-1;
						else if (n == 'after')		n = opts.items.visible - 1;
						else if (n == 'end') 		n = totalItems-firstItem-1;
						else 						n = $(n);
					}
					if (typeof(n) == 'object')		n = $ul.find('> *').index(n)-1;
					if (typeof(n) != 'number') {
						$.fn.carouFredSel5.log('Not a valid number.');
						return;
					}

					var nulItem = totalItems - firstItem;
					if (nulItem >= totalItems) nulItem -= totalItems;
					if (n >= nulItem && nulItem > 0) {
						firstItem += i.length;
					}

					var $itms = $ul.find('> *');
					if ($itms.length < 2) {
						if (n == -1)	$ul.prepend(i);
						else			$ul.append(i);
					} else {
						if (n == -1) 	$itms.filter(':nth(0)').before(i);
						else			$itms.filter(':nth('+n+')').after(i);
					}

					$it 		= $ul.find('> *');
					totalItems 	= $it.length;

					var sizes = $.fn.carouFredSel5.getSizes(opts, $it);
					$ul.css(sizes[0], sizes[1] * 2)
						.css(sizes[2], sizes[3])
						.trigger('updatePageStatus', true);
				})
				.bind('removeItem', function(e, i) {
					if (typeof(i) == 'object' &&
						typeof(i.jquery) == 'undefined') 	i = $(i);
					if (typeof(i) == 'string')				i = $(i);
					if (typeof(i) == 'number')				i = $ul.find('> *:nth('+i+')');
					
					if (typeof(i) != 'object' ||
						typeof(i.jquery) == 'undefined' ||
						i.length == 0
					) {
						$.fn.carouFredSel5.log('Not a valid object.');
						return;
					}

					var n = $ul.find('> *').index(i);
					var nulItem = totalItems - firstItem;
					if (nulItem >= totalItems) nulItem -= totalItems;
					if (n >= nulItem && nulItem > 0)	firstItem -= i.length;
					else if (nulItem - i.length == 0)	firstItem = 0;

					i.remove();

					$it 		= $ul.find('> *');
					totalItems 	= $it.length;

					var sizes = $.fn.carouFredSel5.getSizes(opts, $it);
					$ul.css(sizes[0], sizes[1] * 2)
						.css(sizes[2], sizes[3])
						.trigger('updatePageStatus', true);
				})
				.bind('updatePageStatus', function(e, bpa) {
					if (opts.pagination.container == null ||
						opts.pagination.container.length == 0) return false;

					if (typeof(bpa) == 'boolean' && bpa) {
						opts.pagination.container.find('> *').remove();
						for (var a = 0; a < Math.ceil(totalItems/opts.items.visible); a++) {
							opts.pagination.container.append(opts.pagination.anchorBuilder(a+1));
						}
						opts.pagination.container.find('> *').each(function(a) {
							$(this).unbind('click').click(function() {
								$ul.trigger('scrollTo', [a * opts.items.visible, 0, opts.pagination]);;
								return false;
							});
						});
					}

					var nr = Math.round(firstItem / opts.items.visible);
					opts.pagination.container.find('> *')
						.removeClass('selected')
						.filter(':nth('+nr+')').addClass('selected');
				});

			if (opts.auto.pauseOnHover && opts.auto.play) {
				$ul.hover(
					function() { $ul.trigger('pause'); },
					function() { $ul.trigger('play', direction); }
				);
			}

			//	via prev-button
			if (opts.prev.button != null && opts.prev.button.length) {
				opts.prev.button.click(function() {
					$ul.trigger('prev');
					return false;
				});
				if (opts.prev.pauseOnHover && opts.auto.play) {
					opts.prev.button.hover(
						function() { $ul.trigger('pause'); },
						function() { $ul.trigger('play', direction); }
					);
				}
			}

			//	via next-button
			if (opts.next.button != null && opts.next.button.length) {
				opts.next.button.click(function() {
					$ul.trigger('next');
					return false;
				});
				if (opts.next.pauseOnHover && opts.auto.play) {
					opts.next.button.hover(
						function() { $ul.trigger('pause'); },
						function() { $ul.trigger('play', direction); }
					);
				}
			}

			//	via pagination
			if (opts.pagination.container != null && opts.pagination.container.length) {
				$ul.trigger('updatePageStatus', true);
				if (opts.pagination.pauseOnHover && opts.auto.play) {
					opts.pagination.container.hover(
						function() { $ul.trigger('pause'); },
						function() { $ul.trigger('play', direction); }
					);
				}
			}

			//	via keyboard
			if (opts.next.key || opts.prev.key) {
				$(document).keyup(function(e) {
					var k = e.keyCode;
					if (k == opts.next.key)	$ul.trigger('next');
					if (k == opts.prev.key)	$ul.trigger('prev');
				});
			}
			if (opts.pagination.keys) {
				$(document).keyup(function(e) {
					var k = e.keyCode;
					if (k >= 49 && k < 58) {
						k = (k - 49) * opts.items.visible;
						if (k <= totalItems) {
							$ul.trigger('scrollTo', [k, 0, opts.pagination]);
						}
					}
				});
			}

			//	via auto-play
			if (opts.auto.play) {
				$ul.trigger('play', [direction, opts.auto.delay]);
				if ($.fn.nap && opts.auto.nap) {
					$ul.nap('pause', 'play');
				}
			}
		});
	}

	$.fn.carouFredSel5.defaults = {
		width				: null,
		height				: null,
		items : {
			visible			: 7
		},
		direction			: 'left',
		scroll : {
			items				: null,
			easing				: 'swing',
			duration			: null,
			pauseOnHover		: false,
			onBefore			: null,
			onAfter				: null
		}
	};
	$.fn.carouFredSel5.getKeyCode = function(string) {
		if (string == 'right')	return 39;
		if (string == 'left') 	return 37;
		if (string == 'up')		return 38;
		if (string == 'down')	return 40;
		return -1;
	};
	$.fn.carouFredSel5.getNaviObject = function(obj, pagi, auto) {
		if (typeof(pagi) != 'boolean')	pagi = false;
		if (typeof(auto) != 'boolean')	auto = false;

		if (typeof(obj) == 'undefined') 			obj  = {};
		if (typeof(obj) == 'string') {
			var temp = $.fn.carouFredSel5.getKeyCode(obj);
			if (temp == -1)							obj = $(obj);
			else									obj = temp;
		}

		if (pagi) {
			if (typeof(obj.jquery) != 'undefined')	obj = { container: obj };
			if (typeof(obj) == 'boolean')			obj = { keys: obj };
			if (typeof(obj.container) == 'string')	obj.container = $(obj.container);

		} else if (auto) {
			if (typeof(obj) == 'boolean')			obj = { play: obj };
			if (typeof(obj) == 'number')			obj = { pauseDuration: obj };

		} else {
			if (typeof(obj.jquery) != 'undefined')	obj = { button: obj };
			if (typeof(obj) == 'number')			obj = { key: obj };
			if (typeof(obj.button) == 'string')		obj.button = $(obj.button);
			if (typeof(obj.key) == 'string')		obj.key = $.fn.carouFredSel5.getKeyCode(obj.key);
		}
		return obj;
	};
	$.fn.carouFredSel5.getCurrentItems = function($u, o, n) {
		var oi = $u.find('> *:lt('+o.items.visible+')'),
			ni = $u.find('> *:lt('+(o.items.visible + n)+'):gt('+(n-1)+')');

		return [oi, ni];
	};
	$.fn.carouFredSel5.log = function(msg) {
		try { console.log('carouFredSel5: '+msg); } catch(err) {}
	};
	$.fn.carouFredSel5.pageAnchorBuilder = function(nr) {
		return '<a href="#"><span>'+nr+'</span></a>';
	};

	$.fn.carouFredSel5.getSizes = function(o, $i, wrap) {
		if (typeof(wrap) != 'boolean') wrap = false;
		var SZ = (o.direction == 'right' || o.direction == 'left') 
			? ['width', 'outerWidth', 'height', 'outerHeight', 'left']
			: ['height', 'outerHeight', 'width', 'outerWidth', 'top'];

		var s1 = 0,
			s2 = 0;
		
			 if (wrap && typeof(o[SZ[0]]) 		== 'number') 	s1 = o[SZ[0]];
		else if (		 typeof(o.items[SZ[0]]) == 'number')	s1 = o.items[SZ[0]] * $i.length;
		else 													s1 = $.fn.carouFredSel5.getSizeTotal($i, SZ[1]);
		
			 if (wrap && typeof(o[SZ[2]]) 		== 'number') 	s2 = o[SZ[2]];
		else if (		 typeof(o.items[SZ[2]]) == 'number') 	s2 = o.items[SZ[2]];
		else 													s2 = $.fn.carouFredSel5.getSizeMax($i, SZ[3]);
		return [SZ[0], s1, SZ[2], s2, SZ[4]];
	};
	$.fn.carouFredSel5.getSizeTotal = function($i, sz) {
		var s = 0;
		$i.each(function() {
			s += $(this)[sz](true);
		});
		return s;
	}
	$.fn.carouFredSel5.getSizeMax = function($i, sz) {
		var s = 0,
			m = 0;
		$i.each(function() {
			m = $(this)[sz](true);
			if (s < m) s = m;
		});
		return s;
	}

	
})(jQuery);

/*Funtion 2*/

(function($) {
	$.fn.carouFredSel5 = function(options) {
		return this.each(function() {
			var opts 			= $.extend(true, {}, $.fn.carouFredSel5.defaults, options),
				$ul 			= $(this),
				$wr				= $ul.wrap('<div class="carouFredSel5_wrapper" />').parent(),
				$it 			= $('> *', $ul),
				totalItems		= $it.length,
				firstItem		= 0,
				autoInterval	= null,
				direction		= (opts.direction == 'up' || opts.direction == 'left') ? 'next' : 'prev';

			if ( typeof( opts.items ) != 'object')	opts.items			= { visible: opts.items };
			if (		!opts.items.width)			opts.items.width	= $it.outerWidth(true);
			if (		!opts.items.height)			opts.items.height	= $it.outerHeight(true);

/* TEMP */	if (opts.visibleItems) opts.items.visible = opts.visibleItems;

			if (typeof(	opts.scroll.duration) != 'number') 	opts.scroll.duration 	= 500;
			if (		opts.scroll.items == null) 			opts.scroll.items 		= opts.items.visible;

			opts.auto		= $.fn.carouFredSel5.getNaviObject(opts.auto, false, true);
			opts.prev		= $.fn.carouFredSel5.getNaviObject(opts.prev);
			opts.next		= $.fn.carouFredSel5.getNaviObject(opts.next);
			opts.pagination	= $.fn.carouFredSel5.getNaviObject(opts.pagination, true);

			opts.auto 		= $.extend({}, 	opts.scroll,	opts.auto);
			opts.prev 		= $.extend({}, 	opts.scroll,	opts.prev);
			opts.next 		= $.extend({}, 	opts.scroll,	opts.next);
			opts.pagination	= $.extend({}, 	opts.scroll,	opts.pagination);

			if (typeof(	opts.pagination.anchorBuilder)	!= 'function')			opts.pagination.anchorBuilder 	= $.fn.carouFredSel5.pageAnchorBuilder;
			if (typeof(	opts.pagination.keys) 			!= 'boolean')			opts.pagination.keys 			= false;
			if (typeof(	opts.auto.play) 				!= 'boolean')			opts.auto.play 					= true;
			if (typeof(	opts.auto.nap)		 			!= 'boolean')			opts.auto.nap 					= true;
			if (typeof(	opts.auto.delay)				!= 'number')			opts.auto.delay					= 0;
			if (typeof(	opts.auto.pauseDuration)		!= 'number')			opts.auto.pauseDuration			= opts.auto.duration * 6;
			if (		opts.auto.pauseDuration 		== 	opts.auto.duration) opts.auto.duration -= 10;

			opts.prev.name 			= 'prev';
			opts.next.name 			= 'next';
			opts.pagination.name	= 'pagination';

			$ul.css({
				position	: 'absolute'
			});
			$wr.css({ 
				position	: 'relative',
				overflow	: 'hidden'
			});
			var sizes = $.fn.carouFredSel5.getSizes(opts, $it.filter(':lt('+opts.items.visible+')'), true);
			$wr.css(sizes[0], sizes[1])
				.css(sizes[2], sizes[3]);
			
			var sizes = $.fn.carouFredSel5.getSizes(opts, $it);
			$ul.css(sizes[0], sizes[1] * 2)
				.css(sizes[2], sizes[3]);

			$ul.bind('pause', function() {
					if (autoInterval != null) {
						clearTimeout(autoInterval);
					}
				})
				.bind('play', function(e, d, f) {
					if (opts.auto.play) {
						if (typeof(d) == 'undefined') 	d = direction;
						if (typeof(f) == 'undefined') 	f = 0;

						autoInterval = setTimeout(function() {
							if ($ul.is(':animated')) 	$ul.trigger('pause').trigger('play', d);	//	still animating, wait
							else 						$ul.trigger(d, opts.auto);					//	scroll
						}, opts.auto.pauseDuration + f);
					}
				})
				.bind('prev', function(e, sliderObj, numItems) {
					if ($ul.is(':animated')) return;
					if (opts.items.visible >= totalItems) {
						$.fn.carouFredSel5.log('Not enough items: not scrolling');
						return;
					}

					if (typeof(sliderObj) == 'number')	numItems  	= sliderObj;
					if (typeof(sliderObj) != 'object')	sliderObj 	= opts.prev;
					if (typeof(numItems)  != 'number')	numItems 	= sliderObj.items;

					if (typeof(numItems)  != 'number') {
						$.fn.carouFredSel5.log('Not a valid number.');
						return;
					}

					$ul.find('> *:gt('+(totalItems-numItems-1)+')').prependTo($ul);

					if (totalItems < opts.items.visible + numItems) {
						$ul.find('> *:lt('+((opts.items.visible + numItems)-totalItems)+')').clone(true).appendTo($ul);
					}

						firstItem -= numItems;
					if (firstItem < 0) firstItem += totalItems;

					var items = $.fn.carouFredSel5.getCurrentItems($ul, opts, numItems),
						sizes = $.fn.carouFredSel5.getSizes(opts, items[0].filter(':lt('+numItems+')')),
						wrsiz = $.fn.carouFredSel5.getSizes(opts, items[0], true);

					var ani = {},
						wra = {},
						dur = (sliderObj.duration == 'auto') ? opts.scroll.duration / opts.scroll.items * numItems : sliderObj.duration;

					ani[sizes[4]] = 0;
					wra[sizes[0]] =  wrsiz[1];
					wra[sizes[2]] =  wrsiz[3];

					if (sliderObj.onBefore) {
						sliderObj.onBefore(items[1], items[0], sliderObj.name);
					}
					
					$wr.animate(wra, {
						duration: dur,
						easing	: sliderObj.easing
					});
					$ul
						.data('numItems', 	numItems)
						.data('sliderObj', 	sliderObj)
						.data('oldItems', 	items[1])
						.data('newItems', 	items[0])
						.css(sizes[4], -sizes[1])
						.animate(ani, { 
							duration: dur,
							easing	: sliderObj.easing,
							complete: function() {
								if (totalItems < opts.items.visible + $ul.data('numItems')) {
									$ul.find('> *:gt('+(totalItems-1)+')').remove();
								}
								if ($ul.data('sliderObj').onAfter) {
									$ul.data('sliderObj').onAfter($ul.data('oldItems'), $ul.data('newItems'), $ul.data('sliderObj').name);
								}
							}
						});

					//	auto-play
					$ul.trigger('updatePageStatus')
						.trigger('pause').trigger('play', 'prev');					
				})
				.bind('next', function(e, sliderObj, numItems) {
					if ($ul.is(':animated')) return;
					if (opts.items.visible >= totalItems) {
						$.fn.carouFredSel5.log('Not enough items: not scrolling');
						return;
					}

					if (typeof(sliderObj) == 'number')	numItems  	= sliderObj;
					if (typeof(sliderObj) != 'object')	sliderObj 	= opts.next;
					if (typeof(numItems)  != 'number')	numItems 	= sliderObj.items;

					if (typeof(numItems) != 'number') {
						$.fn.carouFredSel5.log('Not a valid number.');
						return;
					}
					if (totalItems < opts.items.visible + numItems) {
						$ul.find('> *:lt('+((opts.items.visible + numItems)-totalItems)+')').clone(true).appendTo($ul);
					}

						firstItem += numItems;
					if (firstItem >= totalItems) firstItem -= totalItems;

					var items = $.fn.carouFredSel5.getCurrentItems($ul, opts, numItems),
						sizes = $.fn.carouFredSel5.getSizes(opts, items[0].filter(':lt('+numItems+')')),
						wrsiz = $.fn.carouFredSel5.getSizes(opts, items[1], true);

					var ani = {},
						wra = {},
						dur = (sliderObj.duration == 'auto') ? opts.scroll.duration / opts.scroll.items * numItems : sliderObj.duration;

					ani[sizes[4]] = -sizes[1];
					wra[sizes[0]] =  wrsiz[1];
					wra[sizes[2]] =  wrsiz[3];

					if (sliderObj.onBefore) {
						sliderObj.onBefore(items[0], items[1], sliderObj.name);
					}

					$wr.animate(wra, {
						duration: dur,
						easing	: sliderObj.easing
					});
					$ul
						.data('numItems', 	numItems)
						.data('sliderObj', 	sliderObj)
						.data('oldItems', 	items[0])
						.data('newItems', 	items[1])
						.animate(ani, { 
							duration: dur,
							easing	: sliderObj.easing,
							complete: function() {
								if ($ul.data('sliderObj').onAfter) {
									$ul.data('sliderObj').onAfter($ul.data('oldItems'), $ul.data('newItems'), $ul.data('sliderObj').name);
								}
								if (totalItems < opts.items.visible + $ul.data('numItems')) {
									$ul.find('> *:gt('+(totalItems-1)+')').remove();
								}
								$ul.css(sizes[4], 0).find('> *:lt('+$ul.data('numItems')+')').appendTo($ul);
							}
						});

					//	auto-play
					$ul.trigger('updatePageStatus')
						.trigger('pause').trigger('play', 'next');
				})
				.bind('scrollTo', function(e, n, d, o) {
					if ($ul.is(':animated')) return;

						 if (typeof(n) == 'string') n = parseInt(n);
						 if (typeof(n) == 'object') n = $ul.find('> *').index(n);
					else if (typeof(n) == 'number') {
						n += -firstItem + totalItems;
						if (n >= totalItems) n -= totalItems;
					}
					
					if (typeof(n) != 'number' || n == -1) {
						$.fn.carouFredSel5.log('Not a valid number.');
						return;
					}

					if (typeof(d) == 'string') d = parseInt(d);
					if (typeof(d) != 'number') d = 0;

					if (typeof(o) != 'object') o = false;

					n += d;
					if (n < 0) 				n += totalItems;
					if (n >= totalItems)	n -= totalItems;
					if (n == 0) return;

					if (n < totalItems / 2) $ul.trigger('next', [o, n]);
					else					$ul.trigger('prev', [o, totalItems-n]);
				})
				.bind('slideTo', function(e, n, d, o) {
					$ul.trigger('scrollTo', [n, d, o]);
				})
				.bind('insertItem', function(e, i, n) {
					if (typeof(i) == 'string') i = $(i);
					if (typeof(i) != 'object' ||
						typeof(i.jquery) == 'undefined' ||
						i.length == 0
					) {
						$.fn.carouFredSel5.log('Not a valid object.');
						return;
					}

					if (typeof(n) == 'undefined')	n = 'after';
					if (typeof(n) == 'number') 		n = n-1;
					if (typeof(n) == 'string')	{
							 if (n == 'before') 	n = totalItems-1;
						else if (n == 'after')		n = opts.items.visible - 1;
						else if (n == 'end') 		n = totalItems-firstItem-1;
						else 						n = $(n);
					}
					if (typeof(n) == 'object')		n = $ul.find('> *').index(n)-1;
					if (typeof(n) != 'number') {
						$.fn.carouFredSel5.log('Not a valid number.');
						return;
					}

					var nulItem = totalItems - firstItem;
					if (nulItem >= totalItems) nulItem -= totalItems;
					if (n >= nulItem && nulItem > 0) {
						firstItem += i.length;
					}

					var $itms = $ul.find('> *');
					if ($itms.length < 2) {
						if (n == -1)	$ul.prepend(i);
						else			$ul.append(i);
					} else {
						if (n == -1) 	$itms.filter(':nth(0)').before(i);
						else			$itms.filter(':nth('+n+')').after(i);
					}

					$it 		= $ul.find('> *');
					totalItems 	= $it.length;

					var sizes = $.fn.carouFredSel5.getSizes(opts, $it);
					$ul.css(sizes[0], sizes[1] * 2)
						.css(sizes[2], sizes[3])
						.trigger('updatePageStatus', true);
				})
				.bind('removeItem', function(e, i) {
					if (typeof(i) == 'object' &&
						typeof(i.jquery) == 'undefined') 	i = $(i);
					if (typeof(i) == 'string')				i = $(i);
					if (typeof(i) == 'number')				i = $ul.find('> *:nth('+i+')');
					
					if (typeof(i) != 'object' ||
						typeof(i.jquery) == 'undefined' ||
						i.length == 0
					) {
						$.fn.carouFredSel5.log('Not a valid object.');
						return;
					}

					var n = $ul.find('> *').index(i);
					var nulItem = totalItems - firstItem;
					if (nulItem >= totalItems) nulItem -= totalItems;
					if (n >= nulItem && nulItem > 0)	firstItem -= i.length;
					else if (nulItem - i.length == 0)	firstItem = 0;

					i.remove();

					$it 		= $ul.find('> *');
					totalItems 	= $it.length;

					var sizes = $.fn.carouFredSel5.getSizes(opts, $it);
					$ul.css(sizes[0], sizes[1] * 2)
						.css(sizes[2], sizes[3])
						.trigger('updatePageStatus', true);
				})
				.bind('updatePageStatus', function(e, bpa) {
					if (opts.pagination.container == null ||
						opts.pagination.container.length == 0) return false;

					if (typeof(bpa) == 'boolean' && bpa) {
						opts.pagination.container.find('> *').remove();
						for (var a = 0; a < Math.ceil(totalItems/opts.items.visible); a++) {
							opts.pagination.container.append(opts.pagination.anchorBuilder(a+1));
						}
						opts.pagination.container.find('> *').each(function(a) {
							$(this).unbind('click').click(function() {
								$ul.trigger('scrollTo', [a * opts.items.visible, 0, opts.pagination]);;
								return false;
							});
						});
					}

					var nr = Math.round(firstItem / opts.items.visible);
					opts.pagination.container.find('> *')
						.removeClass('selected')
						.filter(':nth('+nr+')').addClass('selected');
				});

			if (opts.auto.pauseOnHover && opts.auto.play) {
				$ul.hover(
					function() { $ul.trigger('pause'); },
					function() { $ul.trigger('play', direction); }
				);
			}

			//	via prev-button
			if (opts.prev.button != null && opts.prev.button.length) {
				opts.prev.button.click(function() {
					$ul.trigger('prev');
					return false;
				});
				if (opts.prev.pauseOnHover && opts.auto.play) {
					opts.prev.button.hover(
						function() { $ul.trigger('pause'); },
						function() { $ul.trigger('play', direction); }
					);
				}
			}

			//	via next-button
			if (opts.next.button != null && opts.next.button.length) {
				opts.next.button.click(function() {
					$ul.trigger('next');
					return false;
				});
				if (opts.next.pauseOnHover && opts.auto.play) {
					opts.next.button.hover(
						function() { $ul.trigger('pause'); },
						function() { $ul.trigger('play', direction); }
					);
				}
			}

			//	via pagination
			if (opts.pagination.container != null && opts.pagination.container.length) {
				$ul.trigger('updatePageStatus', true);
				if (opts.pagination.pauseOnHover && opts.auto.play) {
					opts.pagination.container.hover(
						function() { $ul.trigger('pause'); },
						function() { $ul.trigger('play', direction); }
					);
				}
			}

			//	via keyboard
			if (opts.next.key || opts.prev.key) {
				$(document).keyup(function(e) {
					var k = e.keyCode;
					if (k == opts.next.key)	$ul.trigger('next');
					if (k == opts.prev.key)	$ul.trigger('prev');
				});
			}
			if (opts.pagination.keys) {
				$(document).keyup(function(e) {
					var k = e.keyCode;
					if (k >= 49 && k < 58) {
						k = (k - 49) * opts.items.visible;
						if (k <= totalItems) {
							$ul.trigger('scrollTo', [k, 0, opts.pagination]);
						}
					}
				});
			}

			//	via auto-play
			if (opts.auto.play) {
				$ul.trigger('play', [direction, opts.auto.delay]);
				if ($.fn.nap && opts.auto.nap) {
					$ul.nap('pause', 'play');
				}
			}
		});
	}

	$.fn.carouFredSel5.defaults = {
		width				: null,
		height				: null,
		items : {
			visible			: 5
		},
		direction			: 'left',
		scroll : {
			items				: null,
			easing				: 'swing',
			duration			: null,
			pauseOnHover		: false,
			onBefore			: null,
			onAfter				: null
		}
	};
	$.fn.carouFredSel5.getKeyCode = function(string) {
		if (string == 'right')	return 39;
		if (string == 'left') 	return 37;
		if (string == 'up')		return 38;
		if (string == 'down')	return 40;
		return -1;
	};
	$.fn.carouFredSel5.getNaviObject = function(obj, pagi, auto) {
		if (typeof(pagi) != 'boolean')	pagi = false;
		if (typeof(auto) != 'boolean')	auto = false;

		if (typeof(obj) == 'undefined') 			obj  = {};
		if (typeof(obj) == 'string') {
			var temp = $.fn.carouFredSel5.getKeyCode(obj);
			if (temp == -1)							obj = $(obj);
			else									obj = temp;
		}

		if (pagi) {
			if (typeof(obj.jquery) != 'undefined')	obj = { container: obj };
			if (typeof(obj) == 'boolean')			obj = { keys: obj };
			if (typeof(obj.container) == 'string')	obj.container = $(obj.container);

		} else if (auto) {
			if (typeof(obj) == 'boolean')			obj = { play: obj };
			if (typeof(obj) == 'number')			obj = { pauseDuration: obj };

		} else {
			if (typeof(obj.jquery) != 'undefined')	obj = { button: obj };
			if (typeof(obj) == 'number')			obj = { key: obj };
			if (typeof(obj.button) == 'string')		obj.button = $(obj.button);
			if (typeof(obj.key) == 'string')		obj.key = $.fn.carouFredSel5.getKeyCode(obj.key);
		}
		return obj;
	};
	$.fn.carouFredSel5.getCurrentItems = function($u, o, n) {
		var oi = $u.find('> *:lt('+o.items.visible+')'),
			ni = $u.find('> *:lt('+(o.items.visible + n)+'):gt('+(n-1)+')');

		return [oi, ni];
	};
	$.fn.carouFredSel5.log = function(msg) {
		try { console.log('carouFredSel5: '+msg); } catch(err) {}
	};
	$.fn.carouFredSel5.pageAnchorBuilder = function(nr) {
		return '<a href="#"><span>'+nr+'</span></a>';
	};

	$.fn.carouFredSel5.getSizes = function(o, $i, wrap) {
		if (typeof(wrap) != 'boolean') wrap = false;
		var SZ = (o.direction == 'right' || o.direction == 'left') 
			? ['width', 'outerWidth', 'height', 'outerHeight', 'left']
			: ['height', 'outerHeight', 'width', 'outerWidth', 'top'];

		var s1 = 0,
			s2 = 0;
		
			 if (wrap && typeof(o[SZ[0]]) 		== 'number') 	s1 = o[SZ[0]];
		else if (		 typeof(o.items[SZ[0]]) == 'number')	s1 = o.items[SZ[0]] * $i.length;
		else 													s1 = $.fn.carouFredSel5.getSizeTotal($i, SZ[1]);
		
			 if (wrap && typeof(o[SZ[2]]) 		== 'number') 	s2 = o[SZ[2]];
		else if (		 typeof(o.items[SZ[2]]) == 'number') 	s2 = o.items[SZ[2]];
		else 													s2 = $.fn.carouFredSel5.getSizeMax($i, SZ[3]);
		return [SZ[0], s1, SZ[2], s2, SZ[4]];
	};
	$.fn.carouFredSel5.getSizeTotal = function($i, sz) {
		var s = 0;
		$i.each(function() {
			s += $(this)[sz](true);
		});
		return s;
	}
	$.fn.carouFredSel5.getSizeMax = function($i, sz) {
		var s = 0,
			m = 0;
		$i.each(function() {
			m = $(this)[sz](true);
			if (s < m) s = m;
		});
		return s;
	}

	
})(jQuery);