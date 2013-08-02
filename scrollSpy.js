( function( $ ) { 

	$.widget( "vui.vui_scrollSpy", { 

		destroy: function() {

			$( this.element )
				.off( 'vui-spy' )
				.data( 'scrollPoints', [] );

		},

		_create: function() {

			var me = this;

			var defaultSpyTime = 1000;
			var defaultSpyOffset = 100;

			var $spy = $( this.element );

			var getSpyBoundaries = function() {

				var spyTop = $spy.scrollTop();
				var spyBottom = spyTop + $spy.height();

				return {
					top : spyTop,
					bottom : spyBottom
				};

			};

			var doSpy = function( e ) {

				var scrollPoints = $spy.data( 'scrollPoints' );
				if ( scrollPoints === undefined ) {
					return;
				}

				var body = document.body;

				var spyBoundaries = getSpyBoundaries();

				var doDelayedSpy = function( $scrollPoint, isVisible ) {

					setTimeout( function() {

						var newSpyBoundaries = getSpyBoundaries();

						if ( me._isScrollPointBottomVisible( newSpyBoundaries, $scrollPoint ) !== isVisible ) {
							return;
						}

						var args = {
							'isVisible' : isVisible,
							'event': e,
							'key': $scrollPoint.attr( 'data-spy-key' ),
							'node': $scrollPoint.get( 0 )
						};

						if ( isVisible ) {
							$scrollPoint.addClass( 'vui-scroll-point-visible' );
						} else {
							$scrollPoint.removeClass( 'vui-scroll-point-visible' );
						}

						$spy.trigger( 'vui-spy', args );

					}, $scrollPoint.data( 'spy-time' ) );
				};

				for( var i=scrollPoints.length-1; i>=0; --i ) {

					// check to make sure registered node is still attached to DOM
					if ( !scrollPoints[i].closest( 'body' ) ) {

						$spy.data( 'scrollPoints' ).splice( i, 1 );

					} else {

						doDelayedSpy( 
							scrollPoints[i], 
							me._isScrollPointBottomVisible( spyBoundaries, scrollPoints[i] ) 
						);

					}

				}

			};

			$spy.on( 'scroll', function( e ) {
				doSpy( e );
			} );

			$spy.on( 'resize', function( e ) {
				doSpy( e );
			} );

			$( document )
				.on( 'vui-viewrender', function( e ) {
					doSpy( e );
				} )
				.on( 'vui-finish', function( e ) {
					doSpy( e );
				} );

		},

		_isScrollPointBottomVisible: function( spyBoundaries, $scrollPoint ) {

			var isVisible,
				spyBoundaryBottom,
				spyBoundaryBottomAdjustment,
				spyLimitY = 1.0,
				pointOffsetBottom = $scrollPoint.offset().top + $scrollPoint.height(),
				$window = $( window ),
				$body = $(document.body),
				bodyScrollHeight = Math.max( $body.get(0).scrollHeight, document.documentElement.scrollHeight ),
				bodyScrollTop = Math.max( $body.scrollTop(), document.documentElement.scrollTop ),
				offScreenBottom = bodyScrollHeight - bodyScrollTop - $window.height();

			spyLimitY = $scrollPoint.data( 'spy-limit-y' ) !== undefined ? $scrollPoint.data( 'spy-limit-y' ) : 1;
			

			if ( spyLimitY < 1 && ( offScreenBottom <= ( ( $window.height() * spyLimitY ) / 2 ) ) ) {

				spyBoundaryBottomAdjustment = spyBoundaries.bottom - spyBoundaries.top ;

			} else {
				spyBoundaryBottomAdjustment = ( spyBoundaries.bottom - spyBoundaries.top ) * spyLimitY;
			}
			 
			spyBoundaryBottom = spyBoundaries.top + spyBoundaryBottomAdjustment;

			isVisible = ( pointOffsetBottom >= spyBoundaries.top && pointOffsetBottom <= spyBoundaryBottom );

			return isVisible;
		},

		isScrollPointRegistered: function( node ) {
			
			var $spy = $( this.element );

			var scrollPoints = $spy.data( 'scrollPoints' );
			if ( scrollPoints === undefined || scrollPoints.length === 0 ) {
				return false;
			}

			for( var i=0; scrollPoints[i]; i++ ) {
				if ( scrollPoints[i].get(0) === node ) {
					return true;
				}
			}

			return false;
		},

		registerScrollPoint: function( node ) {

			if ( this.isScrollPointRegistered( node ) ) {
				return;
			}

			var $spy = $( this.element );

			var scrollPoints = $spy.data( 'scrollPoints' );

			if ( scrollPoints === undefined ) {
				scrollPoints = [];
				$spy.data( 'scrollPoints', scrollPoints );
			}

			var $node = $( node );

			scrollPoints.push( 
				$node
					.data( 
						'spy-time', 
						$node.attr( 'data-spy-time' ) !== undefined ? $node.attr( 'data-spy-time' ) : 1000 
					)
					.data( 
						'spy-limit-y', 
						$node.attr('data-spy-limit-y') !== undefined ? parseFloat($node.attr('data-spy-limit-y')) : 1
					)
			);

		}

	} );

	vui.addClassInitializer(
			'vui-scroll-point',
			function( node ) {
				$( window )
					.vui_scrollSpy()
					.vui_scrollSpy( 
						'registerScrollPoint', 
						node 
					);
			}
		);

	$( document )
		.on( 'vui-viewrender', function( e ) {
			//console.log('on view render');
		}).on( 'vui-finish', function() {
			//console.log('on view finish');
		});

} )( window.jQuery );