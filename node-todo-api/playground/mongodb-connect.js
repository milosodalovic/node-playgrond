// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err){
       return console.log('Unable to connected to Mongo');
    }
    console.log('Connected to MongoDB');
    const myDB=db.db('TodoApp');

    // myDB.collection('Todos').insertOne({
    //     text:'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if(err){
    //         return console.log('Unable to insert todo', err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // })
    
    // myDB.collection('Users').insertOne({
    //     name: 'Milos',
    //     age: 30,
    //     location: 'MNE'
    // }, (err,result) => {
    //     if(err){
    //         return console.log('Unable to insert user', err);
    //     }
    //     console.log(result.ops[0]._id.getTimestamp());
    // })
    
    db.close();
});