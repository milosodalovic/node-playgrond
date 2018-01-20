const expect = require('expect')
const rewire = require('rewire')

const app = rewire('./app')

describe('App', (   ) => {

    const db = {
        saveUser: expect.createSpy()
    };

    app.__set__('db',db);

    it( 'should call spy correctly', () => {
        const spy = expect.createSpy();
        spy('Milos', 30);
        expect(spy).toHaveBeenCalledWith('Milos',30)
    } );

    it( 'should call saveUser with user object', () => {
        const email = 'milos@ma.il';
        const password = '123abc';

        app.handleSignup(email,password);
        expect(db.saveUser).toHaveBeenCalledWith({email, password})

    } );
})