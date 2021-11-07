import {getValues, getLogin, getPassword} from './mypwd.js';

let login, password; 

[login, password] = getValues('comet-mongo-dev', ['login', 'password']);

console.log(login);
console.log(password);

console.log(getLogin('comet-mongo-dev'));

console.log(getPassword('comet-mongo-dev'));
