const fs = require('fs');
const os = require('os');
const child_process = require('child_process');

let filename = 'mypwd.json';
const loginKey = 'login';
const passwordKey = 'password';
const pwdTemplate = {
                    'postgres': {
                        'login': 'john',
                        'password': 'myPa$$w0rd',
                        'note': 'Valid until end of month'
                    },
                    'mongo': {
                        'login': 'admin',
                        'password': 'myPa$$w0rd2'
                    }
                };


function MyPwdException(message) {
    this.message = message;
    this.name = 'MyPwdException';
}


function setFilename(f) {
    filename = f;
}


function getValues(entry, keys) {
    const p = os.homedir + '/' + filename;
    let result = [];
    let d = getEntryFromDict(entry)

    if (d == undefined) {
        throw new MyPwdException('Entry "' + entry + '" is missing in "' + p + '".');
    }

    keys.forEach(e => {
        if (d[e] == undefined) {
            throw new MyPwdException('Key "' + e + '" is missing in "' + entry + '" entry.');
        }
        result.push(d[e])
    });
    return result;
}


function getLogin(entry) {
    return getValues(entry, [loginKey])[0];
}


function getPassword(entry) {
    return getValues(entry, [passwordKey])[0];
}


function getEntryFromDict(entry) {
    const p = os.homedir + '/' + filename;

    if (fs.existsSync(p)) {
        const cred = JSON.parse(fs.readFileSync(p, 'utf-8'));
        return cred[entry]; 
    }

    const gpg = p + '.gpg';
    if (fs.existsSync(gpg)) {
        const stdout = child_process.execSync('gpg --decrypt ' + gpg, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
        const cred = JSON.parse(stdout);
        return cred[entry]; 
    }

    fs.writeFileSync(p, JSON.stringify(pwdTemplate, null, 2))
    const cred = JSON.parse(fs.readFileSync(p, 'utf-8'));
    return cred[entry];
}

module.exports.setFilename = setFilename;
module.exports.getValues = getValues;
module.exports.getLogin = getLogin;
module.exports.getPassword = getPassword;
