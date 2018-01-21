const express    = require( 'express' );
const bodyParser = require( 'body-parser' );
const {ObjectID} = require( 'mongodb' )

const {mongoose} = require( './db/mongoose' );
const {Todo}     = require( './model/todo' );
const {User}     = require( './model/user' );

var app = express();
const port = process.env.PORT || 3000;

app.use( bodyParser.json() );

app.post( '/todos', ( req, res ) => {
    const todo = new Todo( {
        text: req.body.text
    } );

    todo.save().then( ( doc ) => {
        res.send( doc );
    }, e => {
        res.status( 400 ).send( e )
    } );
} );

app.get( '/todos', ( req, res ) => {
    Todo.find().then( ( todos ) => {
        res.send( {todos} )
    }, e => res.status( 400 ).send( e ) )
} );

app.get( '/todos/:id', ( req, res ) => {
    const id = req.params.id;

    if ( !ObjectID.isValid( id ) ) {
        return res.status( 404 ).send();
    }

    Todo.findById( id ).then( ( todo ) => {
        if ( !todo ) {
            return res.status( 404 ).send();
        }
        res.send( {todo} );
    } ).catch( e => res.status( 400 ).send( e ) )
} );


app.listen( port, () => {
    console.log( `Server is started and listens on port ${port}` );
} )

module.exports = {app}

// const newTodo = new Todo({
//     text: 'Go to snow',
// });
//
// newTodo.save().then((doc) => {
//     console.log('Saved doc: ', doc);
// }, e => {
//     console.log('Unable to save Todo', e);
// })

//
//
//
// const newUser = new User({
//     email: 'oddomir@hotmail.com'
// })
//
// newUser.save().then((doc) => {
//     console.log('Saved doc:', doc);
// }, e=> {
//     console.log('Unable to save User', e);
// })