// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require( 'mongodb' );

MongoClient.connect( 'mongodb://localhost:27017/TodoApp', ( err, db ) => {
    if ( err ) {
        return console.log( 'Unable to connected to Mongo' );
    }
    console.log( 'Connected to MongoDB' );
    const myDB = db.db( 'TodoApp' );

    // myDB.collection( 'Todos' ).find( {
    //     _id:  new ObjectID('5a63173bbdab8d377b0846a1')
    // } ).toArray().then( ( result ) => {
    //     console.log( 'Todos' );
    //     console.log( JSON.stringify( result, undefined, 2 ) );
    // }, error => {
    //     console.log( 'Unable to fetch todos', error );
    // } )

    myDB.collection( 'Todos' ).find().count().then( ( count ) => {
        console.log( `Todos count: ${count}` );
    }, error => {
        console.log( 'Unable to count todos', error );
    } )

    // db.close();
} );