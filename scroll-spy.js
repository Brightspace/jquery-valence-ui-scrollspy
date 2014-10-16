/*jslint browser: true*/

( function( vui ) {

	'use strict';

	// Check if the provided vui global is defined, otherwise try to require it if
	// we're in a CommonJS environment; otherwise we'll just fail out
	if( vui === undefined ) {
		if( typeof require === 'function' ) {
			vui = require('../../core');
		} else {
			throw new Error('load vui first');
		}
	}

	// Export the vui object if we're in a CommonJS environment.
	// It will already be on the window otherwise
	if( typeof module === 'object' && typeof module.exports === 'object' ) {
		module.exports = vui;
	}

	var $ = vui.$;

	$.widget( "vui.vui_scrollSpy", {

		options: {
			disabled: false
		},

		_create: function() {

			var me = this;

			var $spy = $( this.element );

			$spy.on( 'scroll', function( e ) {
				me._doSpy( $spy, e );
			} );

			$spy.on( 'resize', function( e ) {
				me._doSpy( $spy, e );
			} );
			$( document ).on( 'touchmove', function( e ) {
				me._doSpy( $spy, e );
			} );
			$( document ).on( 'MSPointerMove', function( e ) {
				me._doSpy( $spy, e );
			} );
			$( document )
				.on( 'vui-init', function( e ) {
					me._doSpy( $spy, e );
				} );

			setTimeout( function() {
				me._doSpy( $spy );
			}, 0 );

		},

		_destroy: function() {
			$( this.element ).find( '.vui-scroll-point-visible' )
				.removeClass( 'vui-scroll-point-visible' );
		},

		spy: function() {
			this._doSpy( $( this.element ) );
		},

		_doSpy: function( $spy, e ) {

			var me = this;

			var getSpyBoundaries = function() {

				var spyTop = $spy.scrollTop();
				var spyBottom = spyTop + $spy.height();

				return {
					top : spyTop,
					bottom : spyBottom
				};

			};

			if ( $spy.vui_scrollSpy( 'option', 'disabled' ) ) {
				return;
			}

			var scrollPoints = $spy.data( 'scrollPoints' );
			if ( !scrollPoints ) {
				return;
			}

			var spyBoundaries = getSpyBoundaries();

			var doDelayedSpy = function( $scrollPoint, isVisible ) {

				if ( $spy.vui_scrollSpy( 'option', 'disabled' ) ) {
					return;
				}

				setTimeout( function () {

					var newSpyBoundaries = getSpyBoundaries();

					if ( $spy.vui_scrollSpy( 'option', 'disabled' ) ) {
						return;
					}

					var args = {
						'isVisible': isVisible,
						'event': e,
						'key': $scrollPoint.attr('data-spy-key'),
						'node': $scrollPoint.get(0)
					};


					if ( !$scrollPoint.data( 'spy-isSpied' ) ) {
						$scrollPoint.data( 'spy-isSpied', true );
						$spy.trigger('vui-skim-spy', args);
						$scrollPoint.addClass( 'vui-scroll-point-skim-visible' );
					}

					if ( me._isScrollPointBottomVisible( newSpyBoundaries, $scrollPoint ) !== isVisible ) {
						return;
					}

					if ( isVisible && $scrollPoint.hasClass( 'vui-scroll-point-visible' ) ) {
						return;
					} else if ( !isVisible && !$scrollPoint.hasClass( 'vui-scroll-point-visible' ) ) {
						return;
					}

					args.isVisible = isVisible;

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
				if ( scrollPoints[i].closest( 'body' ).length === 0 ) {

					$spy.data( 'scrollPoints' ).splice( i, 1 );

				} else {

					var isBottomVisible = me._isScrollPointBottomVisible( spyBoundaries, scrollPoints[i] ) ;

					if ( isBottomVisible && !scrollPoints[i].hasClass( 'vui-scroll-point-visible' ) ) {
						doDelayedSpy(
							scrollPoints[i],
							true
						);
					} else if ( !isBottomVisible && scrollPoints[i].hasClass( 'vui-scroll-point-visible' ) ) {
						doDelayedSpy(
							scrollPoints[i],
							false
						);
					}

				}

			}

		},

		isVisible: function( node ) {
			return $( node ).hasClass( 'vui-scroll-point-visible' );
		},

		_isScrollPointBottomVisible: function( spyBoundaries, $scrollPoint ) {

			var isVisible,
				spyBoundaryBottom,
				spyBoundaryBottomAdjustment,
				pointOffsetBottom = $scrollPoint.offset().top + $scrollPoint.height();


			spyBoundaryBottomAdjustment = ( spyBoundaries.bottom - spyBoundaries.top );
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
						$node.attr( 'data-spy-time' ) !== undefined ? parseInt( $node.attr( 'data-spy-time' ), 10 ) : 3000
					)
			);

		},

		_setOption: function( key, value ) {
			
			$.Widget.prototype._setOption.apply( this, arguments );

			if ( key === 'disabled') {

				this.options.disabled = value;
				if ( value !== true ) {
					this._doSpy( $( this.element ) );
				}

			}

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

} )( window.vui );