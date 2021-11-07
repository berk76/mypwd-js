import * as fs from 'fs';
import * as os from 'os';
import * as child_process from 'child_process';

const filename = 'mypwd.json';
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


export function getValues(entry, keys) {
    let result = [];
    let d = getEntryFromDict(entry)
    keys.forEach(e => {
        result.push(d[e])
    });
    return result;
}


export function getLogin(entry) {
    return getValues(entry, [loginKey])[0];
}


export function getPassword(entry) {
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