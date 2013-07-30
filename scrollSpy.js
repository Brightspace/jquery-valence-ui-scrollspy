( function( $ ) { 

	$.widget( "vui.vui_scrollSpy", { 

		_create: function() {

			var me = this;

			var defaultSpyTime = 1000;
			var defaultSpyOffset = 100;

			var $spy = $( this.element );

			var getSpyPosition = function() {

				var spyTop = $spy.scrollTop();
				var spyBottom = spyTop + $spy.height();

				return {
					top : spyTop,
					bottom : spyBottom
				};

			};

			var doSpy = function() {

				var scrollPoints = $spy.data( 'scrollPoints' );

				var body = document.body;

				var spyPosition = getSpyPosition();

				var doDelayedSpy = function( $scrollPoint, isVisible ) {
					setTimeout( function() {

						var newSpyPosition = getSpyPosition();

						if ( me._isScrollPointBottomVisible( newSpyPosition, $scrollPoint ) !== isVisible ) {
							return;
						}

						if ( isVisible ) {
							$scrollPoint.addClass( 'vui-scroll-point-visible' );
						} else {
							$scrollPoint.removeClass( 'vui-scroll-point-visible' );
						}

					}, $scrollPoint.data( 'spy-time' ) );
				};

				for( var i=scrollPoints.length-1; i>=0; --i ) {

					// check to make sure registered node is still attached to DOM
					if ( !$.contains( body, scrollPoints[i].get( 0 ) ) ) {

						$spy.data( 'scrollPoints' ).splice( i, 1 );

					} else {

						doDelayedSpy( 
							scrollPoints[i], 
							me._isScrollPointBottomVisible( spyPosition, scrollPoints[i] ) 
						);

					}

				}

			};

			$spy.on( 'scroll', function( e ) {
				doSpy();
			} );

			$spy.on( 'resize', function( e ) {
				doSpy();
			} );

			$( document )
				.on( 'vui-viewrender', function( e ) {
					doSpy();
				} );

			setTimeout( function() {
				doSpy();
			}, 0 );

		},

		_isScrollPointBottomVisible: function( spyPosition, $scrollPoint ) {

			var pointOffsetBottom = $scrollPoint.offset().top + $scrollPoint.height();
			return ( pointOffsetBottom >= spyPosition.top && pointOffsetBottom <= spyPosition.bottom );

		},

		registerScrollPoint: function( node ) {

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
						'spy-offset', 
						$node.attr( 'data-spy-offset' ) !== undefined ? $node.attr( 'data-spy-offset' ) : 0 
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