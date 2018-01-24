require('./config/config')

const _          = require( 'lodash' );
const express    = require( 'express' );
const bodyParser = require( 'body-parser' );
const {ObjectID} = require( 'mongodb' )

const {mongoose} = require( './db/mongoose' );
const {Todo}     = require( './model/todo' );
const {User}     = require( './model/user' );

var app    = express();
const port = process.env.PORT;

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

app.delete( '/todos/:id', ( req, res ) => {
    const id = req.params.id;
    if ( !ObjectID.isValid( id ) ) {
        return res.status( 404 ).send();
    }

    Todo.findByIdAndRemove( id ).then( ( todo ) => {
        if ( !todo ) {
            return res.status( 404 ).send();
        }
        res.status( 200 ).send( {todo} );
    } ).catch( e => res.status( 400 ).send() )
} )

app.patch( '/todos/:id', ( req, res ) => {
    const id   = req.params.id;
    const body = _.pick( req.body, [ 'text', 'completed' ] );

    if ( !ObjectID.isValid( id ) ) {
        return res.status( 404 ).send();
    }

    if ( _.isBoolean( body.completed ) && body.completed ) {
        body.completedAt = new Date().getTime();
    }
    else {
        body.completed   = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate( id, {$set: body}, {new: true} ).then( todo => {
        if ( !todo ) {
            return res.status( 404 ).send()
        }
        res.send( {
            todo
        } )
    } ).catch( e => res.status( 400 ).send() )

} )

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