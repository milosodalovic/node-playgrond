require( './config/config' )

const _          = require( 'lodash' );
const express    = require( 'express' );
const bodyParser = require( 'body-parser' );
const {ObjectID} = require( 'mongodb' );
const bcrypt    = require( 'bcryptjs');


const {mongoose} = require( './db/mongoose' );
const {Todo}     = require( './model/todo' );
const {User}     = require( './model/user' );
const {authenticate } = require ('./middleware/authenticate')

var app    = express();
const port = process.env.PORT;

app.use( bodyParser.json() );

app.post( '/todos', authenticate, ( req, res ) => {
    const todo = new Todo( {
        text: req.body.text,
        _creator: req.user._id
    } );

    todo.save().then( ( doc ) => {
        res.send( doc );
    }, e => {
        res.status( 400 ).send( e )
    } );
} );

app.get( '/todos', authenticate, ( req, res ) => {
    Todo.find({
        _creator:req.user._id
    }).then( ( todos ) => {
        res.send( {todos} )
    }, e => res.status( 400 ).send( e ) )
} );

app.get( '/todos/:id', authenticate, ( req, res ) => {
    const id = req.params.id;

    if ( !ObjectID.isValid( id ) ) {
        return res.status( 404 ).send();
    }

    Todo.findOne({
        _id:id,
        _creator:req.user._id
    } ).then( ( todo ) => {
        if ( !todo ) {
            return res.status( 404 ).send();
        }
        res.send( {todo} );
    } ).catch( e => res.status( 400 ).send( e ) )
} );

app.delete( '/todos/:id', authenticate, ( req, res ) => {
    const id = req.params.id;
    if ( !ObjectID.isValid( id ) ) {
        return res.status( 404 ).send();
    }

    Todo.findOneAndRemove({
        _id:id,
        _creator:req.user._id
    } ).then( ( todo ) => {
        if ( !todo ) {
            return res.status( 404 ).send();
        }
        res.status( 200 ).send( {todo} );
    } ).catch( e => res.status( 400 ).send() )
} );

app.patch( '/todos/:id', authenticate, ( req, res ) => {
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

    Todo.findOneAndUpdate( {
        _id:id,
        _creator: req.user._id
    }, {$set: body}, {new: true} ).then( todo => {
        if ( !todo ) {
            return res.status( 404 ).send()
        }
        res.send( {
            todo
        } )
    } ).catch( e => res.status( 400 ).send() )

} );

app.post( '/users', ( req, res ) => {
    const body = _.pick( req.body, [ 'email', 'password' ] );
    const user = new User( body );

    user.save().then( () => {
        return user.generateAuthToken();
    } ).then( ( token ) => {
        res.header( 'x-auth', token ).send( user );
    } ).catch( e => {
        res.status( 400 ).send( e )
    } );
} );

app.post( '/users/login', ( req, res ) => {
    const body = _.pick( req.body, [ 'email', 'password' ] );

    User.findByCredentials(body.email, body.password).then( (user) => {
        return user.generateAuthToken().then(token=>{
            res.header( 'x-auth', token ).send( user );
        })
    } ).catch( e => {
        res.status(400).send();
    } );
} );

app.get('/users/me', authenticate , (req, res) => {
    res.send(req.user);
});

app.delete('/users/me/delete', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    })
});


app.listen( port, () => {
    console.log( `Server is started and listens on port ${port}` );
} );

module.exports = {app};

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