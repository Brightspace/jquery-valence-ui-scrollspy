( function() {
	'use strict';

	describe( 'vui.scrollSpy', function() {

		var node, $spy, noPt, pt1, pt2, pt3, pt4;

		var createPoint = function( id, options ) {
			var pt = document.createElement( 'div' );
			pt.id = id;
			pt.className = 'vui-scroll-point';
			if ( options.spyTime ) {
				pt.setAttribute( 'data-spy-time', options.spyTime );
			}
			if ( options.spyKey ) {
				pt.setAttribute( 'data-spy-key', options.spyKey );
			}
			pt.innerHTML = pt.id;
			return pt;
		};

		var isPointRegistered = function( id ) {
			return $spy.vui_scrollSpy(
				'isScrollPointRegistered',
				document.getElementById( id )
			);
		};

		var onReady = function( doStuff ) {
			setTimeout( function() {
				doStuff();
			}, 0 );
		};

		beforeEach( function () {

			jasmine.addMatchers( vui.jasmine.dom.matchers );

			node = document.body.appendChild( document.createElement( 'div' ) );
			node.style.height = '300px';
			node.style.overflow = 'scroll';

			$spy = $( node ).vui_scrollSpy();

			noPt = node.appendChild( document.createElement( 'div' ) );
			noPt.id = 'noPt';

			pt1 = node.appendChild( createPoint( 'pt1', { spyTime: 5 } ) );
			pt2 = node.appendChild( createPoint( 'pt2', { spyTime: 5, spyKey: 'key2' } ) );

			var spacer = document.createElement( 'div' );
			spacer.style.height = '5000px';
			node.appendChild( spacer );

			pt3 = node.appendChild( createPoint( 'pt3', { spyTime: 5 } ) );
			pt4 = node.appendChild( createPoint( 'pt4', { spyTime: 50 } ) );

		} );

		afterEach( function() {
			$( node ).off( 'vui-spy' );
			$( node ).off( 'vui-skim-spy' );
			if ( $spy && $spy.data( 'vui-vui_scrollSpy' ) !== undefined ) {
				$( node ).vui_scrollSpy( 'destroy' );
			}
			document.body.removeChild( node );
		} );

		describe( 'initialization', function() {

			it( 'initializes scroll-spy as jquery widget', function() {
				expect( $spy.data( 'vui-vui_scrollSpy' ) ).toBeDefined();
			} );

		} );

		describe( 'registerScrollPoint', function() {

			it( 'does not register scroll points when class name is not specified', function() {
				$spy.vui_scrollSpy( 'registerScrollPoint', noPt );
				expect( isPointRegistered( 'npPt' ) ).toBeFalsy();
			} );

			it( 'does not fail when called more than once for the same scroll point', function() {
				$spy.vui_scrollSpy( 'registerScrollPoint', pt1 );
				$spy.vui_scrollSpy( 'registerScrollPoint', pt1 );
				expect( isPointRegistered( 'pt1' ) ).toBeTruthy();
			} );

			it( 'registers scroll points when class name is specified', function() {
				$spy.vui_scrollSpy( 'registerScrollPoint', pt1 );
				expect( isPointRegistered( 'pt1' ) ).toBeTruthy();
				$spy.vui_scrollSpy( 'registerScrollPoint', pt2 );
				expect( isPointRegistered( 'pt2' ) ).toBeTruthy();
			} );

		} );

		describe( 'spy event', function() {

			it( 'is triggered with pt1 being initially visible', function( done ) {

				$spy.vui_scrollSpy( 'registerScrollPoint', pt1 );

				$( node ).on( 'vui-spy', function( sender, args ) {
					expect( args.node.id ).toBe( 'pt1' );
					expect( args.isVisible ).toBeTruthy();
					done();
				} );

			} );

			it( 'is triggered with key1 being initially visible', function( done ) {

				$spy.vui_scrollSpy( 'registerScrollPoint', pt2 );

				$( node ).on( 'vui-spy', function( sender, args ) {
					expect( args.key ).toBe( 'key2' );
					expect( args.isVisible ).toBeTruthy();
					done();
				} );

			} );

			it( 'is not triggered with pt3 not being initially visible', function( done ) {

				$spy.vui_scrollSpy( 'registerScrollPoint', pt3 );

				var isSpied = false;

				$( node ).on( 'vui-spy', function( sender, args ) {
					if ( args.node.id === 'pt3' ) {
						isSpied = true;
					}
				} );

				setTimeout( function() {
					expect( isSpied ).toBeFalsy();
					done();
				}, 100 );

			} );

			it( 'is triggered with pt3 being visible as a result of scroll event', function( done ) {

				$spy.vui_scrollSpy( 'registerScrollPoint', pt3 );

				$( node ).on( 'vui-spy', function( sender, args ) {
					expect( args.node.id ).toBe( 'pt3' );
					expect( args.isVisible ).toBeTruthy();
					done();
				} );

				onReady( function() {
					node.style.height = '8000px';
					$( node ).trigger( 'scroll' );
				} );

			} );

			it( 'is triggered with pt3 being visible as a result of resize event', function( done ) {

				$spy.vui_scrollSpy( 'registerScrollPoint', pt3 );

				$( node ).on( 'vui-spy', function( sender, args ) {
					expect( args.node.id ).toBe( 'pt3' );
					expect( args.isVisible ).toBeTruthy();
					done();
				} );

				onReady( function() {
					node.style.height = '8000px';
					$( node ).trigger( 'resize' );
				} );

			} );

			it( 'is triggered with pt3 being visible as a result of touchmove event', function( done ) {

				$spy.vui_scrollSpy( 'registerScrollPoint', pt3 );

				$( node ).on( 'vui-spy', function( sender, args ) {
					expect( args.node.id ).toBe( 'pt3' );
					expect( args.isVisible ).toBeTruthy();
					done();
				} );

				onReady( function() {
					node.style.height = '8000px';
					$( node ).trigger( 'touchmove' );
				} );

			} );

			it( 'is triggered with pt3 being visible as a result of MSPointerMove event', function( done ) {

				$spy.vui_scrollSpy( 'registerScrollPoint', pt3 );

				$( node ).on( 'vui-spy', function( sender, args ) {
					expect( args.node.id ).toBe( 'pt3' );
					expect( args.isVisible ).toBeTruthy();
					done();
				} );

				onReady( function() {
					node.style.height = '8000px';
					$( node ).trigger( 'MSPointerMove' );
				} );

			} );

			it( 'is triggered with pt3 being visible as a result of manually calling spy', function( done ) {

				$spy.vui_scrollSpy( 'registerScrollPoint', pt3 );

				$( node ).on( 'vui-spy', function( sender, args ) {
					expect( args.node.id ).toBe( 'pt3' );
					expect( args.isVisible ).toBeTruthy();
					done();
				} );

				onReady( function() {
					node.style.height = '8000px';
					$spy.vui_scrollSpy( 'spy' );
				} );

			} );

			it( 'is not triggered with pt3 being removed from the DOM', function( done ) {

				$spy.vui_scrollSpy( 'registerScrollPoint', pt3 );

				var isSpied = false;

				$( node ).on( 'vui-spy', function( sender, args ) {
					if ( args.node.id === 'pt3' ) {
						isSpied = true;
					}
				} );

				onReady( function() {

					node.removeChild( pt3 );
					node.style.height = '8000px';
					$spy.vui_scrollSpy( 'spy' );

					setTimeout( function() {
						expect( isSpied ).toBeFalsy();
						done();
					}, 100 );

				} );

			} );

			it( 'is only triggered once for pt1 when its visibility does not change', function( done ) {

				$spy.vui_scrollSpy( 'registerScrollPoint', pt1 );

				var triggerCount = 0;

				$( node ).on( 'vui-spy', function( sender, args ) {
					if ( args.node.id === 'pt1' ) {
						triggerCount += 1;
					}
					node.style.height = '300px';
				} );

				onReady( function() {

					node.style.height = '8000px';
					$spy.vui_scrollSpy( 'spy' );

					setTimeout( function() {
						expect( triggerCount ).toBe( 1 );
						done();
					}, 100 );

				} );

			} );

			it( 'is triggered for pt1 each time its visibility changes', function( done ) {

				$spy.vui_scrollSpy( 'registerScrollPoint', pt1 );

				var triggerCount = 0;

				$( node ).on( 'vui-spy', function( sender, args ) {
					if ( args.node.id === 'pt1' ) {
						triggerCount += 1;
						if ( triggerCount === 1 ) {
							expect( args.isVisible ).toBeTruthy();
							node.style.height = '0px';
							$spy.vui_scrollSpy( 'spy' );
						} else {
							expect( args.isVisible ).toBeFalsy();
							done();
						}
					}
				} );

			} );

			it( 'is only triggered once for pt1 when attempt is made to register scroll point multiple times', function( done ) {

				$spy.vui_scrollSpy( 'registerScrollPoint', pt1 );
				$spy.vui_scrollSpy( 'registerScrollPoint', pt1 );

				var triggerCount = 0;

				$( node ).on( 'vui-spy', function( sender, args ) {
					if ( args.node.id === 'pt1' ) {
						triggerCount += 1;
					}
				} );

				setTimeout( function() {
					expect( triggerCount ).toBe( 1 );
					done();
				}, 100 );

			} );

		} );

		describe( 'isVisible', function() {

			it( 'returns true when scroll point has been spied and is visible', function() {

				$spy.vui_scrollSpy( 'registerScrollPoint', pt1 );

				expect( $spy.vui_scrollSpy( 'isVisible', pt1 ) ).toBeFalsy();

				$( node ).on( 'vui-spy', function( sender, args ) {
					expect( args.node.id ).toBe( 'pt1' );
					expect( $spy.vui_scrollSpy( 'isVisible', pt1 ) ).toBeTruthy();
					done();
				} );

			} );

			it( 'returns false until the specified spy-time has elapsed', function( done ) {

				$spy.vui_scrollSpy( 'registerScrollPoint', pt4 );

				onReady( function() {

					node.style.height = '8000px';

					expect( $spy.vui_scrollSpy( 'isVisible', pt4 ) ).toBeFalsy();

					$spy.vui_scrollSpy( 'spy' );

					setTimeout( function() {
						expect( $spy.vui_scrollSpy( 'isVisible', pt4 ) ).toBeTruthy();
						done();
					}, 51 );

				} );

			} );

		} );

		describe( 'disabled', function() {

			it( 'is not triggered when scroll spy is disabled while spying', function( done ) {

				$spy.vui_scrollSpy( 'registerScrollPoint', pt3 );

				var isSpied = false;

				$( node ).on( 'vui-spy', function( sender, args ) {
					if ( args.node.id === 'pt3' ) {
						isSpied = true;
					}
				} );

				onReady( function() {

					node.style.height = '8000px';
					$spy.vui_scrollSpy( 'spy' );
					$spy.vui_scrollSpy( 'option', 'disabled', true );

					setTimeout( function() {
						expect( isSpied ).toBeFalsy();
						done();
					}, 100 );

				} );

			} );

			it( 'is triggered when scroll spy is re-enabled', function( done ) {

				$spy.vui_scrollSpy( 'registerScrollPoint', pt3 );

				$( node ).on( 'vui-spy', function( sender, args ) {
					expect( args.node.id ).toBe( 'pt3' );
					expect( args.isVisible ).toBeTruthy();
					done();
				} );

				$spy.vui_scrollSpy( 'option', 'disabled', true );

				setTimeout( function() {
					node.style.height = '8000px';
					$spy.vui_scrollSpy( 'option', 'disabled', false );
				}, 100 );

			} );

		} );

		describe( 'destroy', function() {

			it( 'does not crash when destroyed while spying', function() {

				$spy.vui_scrollSpy( 'spy' );
				$spy.vui_scrollSpy( 'destroy' );

			} );

		} );

	} );

} )();
