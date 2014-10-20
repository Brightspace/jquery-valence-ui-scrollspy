( function() {
	'use strict';

	describe( 'vui.scrollSpy', function() {

		var node, $spy, noPt, pt1, pt2, pt3, pt4, pt40Top, pt60Top, pt25Bottom, ptBottom;

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
			if ( options.top ) {
				pt.style.top = options.top;
			}
			if ( options.bottom ) {
				pt.style.marginBottom = options.bottom;
			}
			if ( options.position ) {
				pt.style.position = options.position;
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

		beforeEach( function () {

			jasmine.addMatchers( d2l.jasmine.matchers );

			node = document.body.appendChild( document.createElement( 'div' ) );
			node.style.position = 'absolute';
			node.style.top = 0;
			node.style.left = 0;
			node.style.height = $( window ).height() + 'px';

			$spy = $( window ).vui_scrollSpy();

			noPt = node.appendChild( document.createElement( 'div' ) );
			noPt.id = 'noPt';

			pt1 = node.appendChild( createPoint( 'pt1', { spyTime: 5 } ) );
			pt2 = node.appendChild( createPoint( 'pt2', { spyTime: 5, spyKey: 'key1' } ) );
			pt40Top = node.appendChild( createPoint( 'pt40Top', { spyTime: 5, top: '40%', position: 'absolute' } ) );
			pt60Top = node.appendChild( createPoint( 'pt60Top', { spyTime: 5, top: '60%', position: 'absolute' } ) );

			var spacer = document.createElement( 'div' );
			spacer.style.height = '5000px';
			node.appendChild( spacer );

			pt3 = node.appendChild( createPoint( 'pt3', { spyTime: 5 } ) );
			pt4 = node.appendChild( createPoint( 'pt4', { spyTime: 5 } ) );
			pt25Bottom = node.appendChild( createPoint( 'pt25Bottom', { spyTime: 5, bottom: '25%' } ) );
			ptBottom = node.appendChild( createPoint( 'ptBottom', { spyTime: 5 } ) );

		} );

		afterEach( function() {
			$( window ).off( 'vui-spy' );
			$( window ).off( 'vui-skim-spy' );
			if ( $spy && $spy.data( 'vui-vui_scrollSpy' ) !== undefined ) {
				$( window ).vui_scrollSpy( 'destroy' );
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

				$( window ).on( 'vui-spy', function( sender, args ) {
					if ( args.node.id !== 'pt1' ) {
						return;
					}
					expect( args.isVisible ).toBeTruthy();
					done();
				} );

			} );

			it( 'is triggered with key1 being initially visible', function( done ) {

				$spy.vui_scrollSpy( 'registerScrollPoint', pt2 );

				$( window ).on( 'vui-spy', function( sender, args ) {
					if ( args.key !== 'key1' ) {
						return;
					}
					expect( args.isVisible ).toBeTruthy();
					done();
				} );

			} );

		} );

	} );

} )();
