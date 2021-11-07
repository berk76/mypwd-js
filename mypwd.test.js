const mypwd = require('./mypwd.js');


test('test getValues', () => {
    mypwd.setFilename('test.json');
    let login, password, note; 
    [login, password, note] = mypwd.getValues('postgres', ['login', 'password', 'note']);
    expect(login).toBe('john');
    expect(password).toBe('myPa$$w0rd');
    expect(note).toBe('Valid until end of month');
})


test('test getLogin', () => {
    mypwd.setFilename('test.json');
    expect(mypwd.getLogin('postgres')).toBe('john');
})


test('test getPassword', () => {
    mypwd.setFilename('test.json');
    expect(mypwd.getPassword('postgres')).toBe('myPa$$w0rd');
})
