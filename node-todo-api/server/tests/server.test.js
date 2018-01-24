const expect     = require( 'expect' )
const request    = require( 'supertest' )
const {ObjectID} = require( 'mongodb' )

const {app}  = require( '../server' )
const {Todo} = require( '../model/todo' )

const todos = [
    {
        _id: new ObjectID(),
        text: "First test todo"
    },
    {
        _id: new ObjectID(),
        text: "Second test todo",
        completed: true,
        completedAt: 333
    }
];

beforeEach( ( done ) => {

    Todo.remove( {} ).then( () => {
        return Todo.insertMany( todos );
    } ).then( () => done() )
} );

describe( 'POST /todos', () => {

    it( 'should create a new todo', ( done ) => {
        const text = "Test todo text"

        request( app ).post( '/todos' ).send( {text} ).expect( 200 ).expect( ( res ) => {
            expect( res.body.text ).toBe( text );
        } ).end( ( err, res ) => {
            if ( err ) {
                return done( err )
            }
            Todo.find( {text} ).then( ( todos ) => {
                expect( todos.length ).toBe( 1 );
                expect( todos[ 0 ].text ).toBe( text )
                done();
            }, e => done( e ) )
        } )
    } );

    it( 'should not create todo with invalid body data ', ( done ) => {
        request( app ).post( '/todos' ).send( {} ).expect( 400 ).end( ( err, res ) => {
            if ( err ) {
                return done( err )
            }
            Todo.find().then( ( todos ) => {
                expect( todos.length ).toBe( 2 );
                done();
            }, e => done( e ) )
        } )
    } );
} );

describe( 'GET /todos', () => {

    it( 'should return all todos', ( done ) => {
        request( app ).get( '/todos' ).expect( 200 ).expect( ( res ) => {
            expect( res.body.todos.length ).toBe( 2 );
        } ).end( done )
    } );
} );

describe( 'GET /todos/:id', () => {

    it( 'should return todo by id', ( done ) => {

        request( app ).get( `/todos/${todos[ 0 ]._id.toHexString()}` ).expect( 200 ).expect( res => {
            expect( res.body.todo.text ).toBe( todos[ 0 ].text )
        } ).end( done )
    } );

    it( 'should return 404 todo is not found', ( done ) => {
        const hexId = new ObjectID().toHexString()
        request( app ).get( `/todos/${hexId}` ).expect( 404 ).end( done )

    } );

    it( 'should return 404 when id is not valid', ( done ) => {
        request( app ).get( '/todos/123' ).expect( 404 ).end( done )
    } );

} )

describe( 'DELETE /todos/:id', () => {

    it( 'should delete todo by id', ( done ) => {
        const hexId = todos[ 1 ]._id.toHexString();

        request( app ).delete( `/todos/${hexId}` ).expect( 200 ).expect( res => {
            expect( res.body.todo._id ).toBe( hexId )
        } ).end( ( err, res ) => {
            if ( err ) {
                return done( err )
            }

            Todo.findById( hexId ).then( ( todo ) => {
                expect( todo ).toBe( null );
                done();
            } ).catch( e => done( e ) )
        } )
    } );

    it( 'should return 404 if todo is not found', ( done ) => {
        const hexId = new ObjectID().toHexString()
        request( app ).delete( `/todos/${hexId}` ).expect( 404 ).end( done )
    } );

    it( 'should return 404 if object id is invalid', ( done ) => {
        request( app ).delete( '/todos/123' ).expect( 404 ).end( done )
    } );
} );

describe( 'PATCH /todos/:id', () => {
    it( 'should update todo', ( done ) => {
        const hexId = todos[ 0 ]._id.toHexString();

        request( app ).patch( `/todos/${hexId}` ).send( {
            text: 'new text', completed: true
        } ).expect( 200 ).expect( res => {
            expect( res.body.todo.text ).toBe( 'new text' )
            expect( res.body.todo.completed ).toBe( true )
            expect( res.body.todo.completed ).toBe( true )
        } )
        .end(done)
    } );

    it( 'should clear compltedAt when todo is not completed', ( done ) => {
        const hexId = todos[ 1 ]._id.toHexString();

        request( app ).patch( `/todos/${hexId}` ).send( {
            completed: false
        } ).expect( 200 ).expect( res => {
            expect( res.body.todo.text ).toBe( todos[ 1 ].text )
            expect( res.body.todo.completed ).toBe( false )
            expect( res.body.todo.completedAt ).toBe(null);
        } )
        .end(done)
    } );
} );