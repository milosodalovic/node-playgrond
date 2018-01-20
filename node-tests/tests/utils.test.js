const expect = require( 'expect' )
const utils  = require( '../utils/utils' )

describe('Utils', () => {
    describe( '#add',  () => {
        it( 'should add two numbers', () => {
            const res = utils.add( 33, 11 )
            expect( res ).toBe( 44 ).toBeA( 'number' )
        } );
    } );

    it( 'should async add two numbers', ( done ) => {
        utils.asyncAdd( 3, 4, ( sum ) => {
            expect( sum ).toBe( 7 ).toBeA( 'number' )
            done();
        } )
    } );

    it( 'should square a number', () => {
        const res = utils.square( 5 )
        expect( res ).toBe( 25 ).toBeA( 'number' )
    } );

    it( 'should async square a number', ( done ) => {
        utils.asyncSquare( 5, ( square ) => {
            expect( square ).toBe( 25 ).toBeA( 'number' )
            done();
        } )
    } );
})

describe( 'Playground',  () => {
    it( 'should set firstName and lastName', () => {
        const user = {
            age: 30,
            location: "MNE"
        }
        const res  = utils.setName( user, "Milos Odalovic" )

        expect( res ).toBeAn( 'object' ).toInclude( {firstName: "Milos", lastName: "Odalovic"} )
    } );

    // it( 'should assert something', () => {
    //     // expect(12).toNotBe(12)
    //     // expect({name: "Milos"}).toNotEqual({name:"Milos"})
    //     // expect([2,3,4]).toExclude(1)
    //     expect( {
    //         name: "Milos",
    //         age: 30,
    //         location: "MNE"
    //     } ).toExclude( {age: 25} )
    // } );
} );
