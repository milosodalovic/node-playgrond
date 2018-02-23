const {ObjectID} = require( 'mongodb' )
const jwt        = require( 'jsonwebtoken' )
const {Todo}     = require( './../../model/todo' )
const {User}     = require( './../../model/user' )

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [
    {
        _id: userOneId,
        email: 'milos@example.com',
        password: 'userOnePassword',
        tokens: [
            {
                access: 'auth',
                token: jwt.sign( {_id: userOneId, access: 'auth'}, process.env.JWT_SECRET ).toString(),
            }
        ]
    },
    {
        _id: userTwoId,
        email: 'maja@example.com',
        password: 'UserTwoPassword',
        tokens: [
            {
                access: 'auth',
                token: jwt.sign( {_id: userTwoId, access: 'auth'},  process.env.JWT_SECRET ).toString(),
            }
        ]
    }
];

const todos = [
    {
        _id: new ObjectID(),
        text: "First test todo",
        _creator: userOneId
    },
    {
        _id: new ObjectID(),
        text: "Second test todo",
        completed: true,
        completedAt: 333,
        _creator: userTwoId
    }
];

const populateTodos = ( done ) => {

    Todo.remove( {} ).then( () => {
        return Todo.insertMany( todos );
    } ).then( () => done() )
};

const populateUsers = ( done ) => {
    User.remove( {} ).then( () => {
        const user1 = new User( users[ 0 ] ).save();
        const user2 = new User( users[ 1 ] ).save();

        return Promise.all( [ user1, user2 ] );
    } ).then( () => done() );
};

module.exports = {todos, users, populateTodos, populateUsers};