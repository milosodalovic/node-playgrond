const expect = require('expect');

const {Users} = require('./users');


describe('Users', () => {
    let users = new Users();
    beforeEach(() => {

        users.users = [
            {
                id:1,
                name: "Milos",
                room: "Node Course"
            },
            {
                id:2,
                name: "Marko",
                room: "Max Course"
            },
            {
                id: 3,
                name: "Paka",
                room: "Node Course"
            }
        ];
    });

    it('should add a new user', () => {
        const users = new Users();
        const user = {
            id: 123,
            name: 'Oddo',
            room: 'Room #1'
        };
        const userRes = users.addUser(user.id,user.name,user.room);
        expect(users.users).toEqual([userRes]);
        expect(userRes).toMatchObject(user);
    });

    it('should remove user ', () => {
        const targetUser = users.users[0];
        const user = users.removeUser(1);
        expect(user).toMatchObject(targetUser);
        expect(users.users.length).toBe(2);
    });

    it('should not remove user', () => {
        const user = users.removeUser(111);
        expect(users.users.length).toBe(3);
        expect(user).toBeFalsy();
    });

    it('should find user', () => {
        const user = users.getUser(2);
        expect(user.id).toBe(2);
    });

    it('should not find user', () => {
        const user = users.getUser(222);
        expect(user).toEqual(undefined);
    });

    it('should return list of user names', () => {
        expect(users.getUserList('Node Course')).toEqual(['Milos', 'Paka']);
        expect(users.getUserList('Max Course')).toEqual(['Marko']);
    });


});