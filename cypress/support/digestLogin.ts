/**
 * Function(s) to facilitate "behind the scenes" login functionality for testing etc
 */

import * as  http from 'http';
import * as  crypto from 'crypto';

const md5 = (data: any): string => {
    const md5 = crypto.createHash('md5');
    return md5.update(data).digest('hex');
};

async function digestRequest(options: any, data: any, user: string, pass: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const req = http.request(options, async (res) => {
            // We want/expect a 401 if we are not logged in
            if (res.statusCode === 401) {
                const cnonce = md5(String(new Date().getTime()));
                const auth = res.headers['www-authenticate'];
                let realm = '';
                let nonce = ''; 
                let qop = '';
                let opaque = '';
                const authSplit = auth ? auth.split(',') : [];

                const extract = (what: string, from: string): string => {
                    const whatTrim = what.trim();
                    const fromTrim = from.trim();
                    let ret = '';
                    if (fromTrim.indexOf(whatTrim) >= 0) {
                        ret = fromTrim.replace(whatTrim, '').replace(RegExp('"', 'g'), '');
                    }
                    return ret;
                };

                const addToHeader = (current: string, header: string, value: string): string => {
                    if (current) {
                        current = current + ', ';
                    } else {
                        current = '';
                    }
                    current = current + `${header}="${value}"`;
                    return current;
                };

                for (let auth of authSplit) {
                    auth = auth.trim();
                    if (auth.indexOf('realm=') >= 0) {
                        realm = extract('Digest realm=', auth);
                    }

                    if (auth.indexOf('nonce=') >= 0) {
                        nonce = extract('nonce=', auth);
                    }

                    if (auth.indexOf('qop=') >= 0) {
                        qop = extract('qop=', auth);
                    }

                    if (auth.indexOf('opaque=') >= 0) {
                        opaque = extract('opaque=', auth);
                    }
                }

                const HA1 = md5(`${user}:${realm}:${pass}`);
                const HA2 = md5(`${options.method}:${options.path}`);
                const responseHdr = md5(`${HA1}:${nonce}:00000001:${cnonce}:${qop}:${HA2}`);
                options.headers.Authorization = addToHeader(options.headers.Authorization, 'Digest username', user);
                options.headers.Authorization = addToHeader(options.headers.Authorization, 'nonce', nonce);
                options.headers.Authorization = addToHeader(options.headers.Authorization, 'uri', options.path);
                options.headers.Authorization = addToHeader(options.headers.Authorization, 'opaque', opaque);
                options.headers.Authorization = addToHeader(options.headers.Authorization, 'cnonce', cnonce);
                options.headers.Authorization = addToHeader(options.headers.Authorization, 'response', responseHdr);
                options.headers.Authorization = addToHeader(options.headers.Authorization, 'qop', qop);
                options.headers.Authorization = `${options.headers.Authorization}, nc=00000001, algorithm=MD5`;
                const response = await request(options, data);
                return resolve(response);
            } else {
                console.error('Unexpected response', res);
                return reject();
            }

        });

        req.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
        });

        if (data) {
            req.write(data);
        }

        req.end();
    });
}

async function request(options: any, data: any): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const req = http.request(options, (res) => {
            let resData: string;
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                resData += chunk;
            });
            res.on('end', () => {
                resolve(resData);
            });
        });

        req.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
            reject();
        });

        if (data) {
            req.write(data);
        }

        req.end();
    });
}

export async function digestLogin(baseUrl: string, endpoint: string, username: string, password: string): Promise<boolean> {
    let hostname = baseUrl.replace('http://', '').replace('https://', '');
    if (hostname.substr(hostname.length - 1, 1) === '/') {
        hostname = hostname.substr(0, hostname.length - 2);
    }
    console.log(hostname);
    const options = {
        hostname,
        port: 80,
        path: endpoint,
        method: 'GET',
        headers: {
            'Connection': 'Keep-Alive',
            'Content-Type': 'text/plain',
            'Content-Length': 0,
            'Host': hostname
        }
    };
    try {
        await digestRequest(options, null, username, password);
        return true;
    } catch (err) {
        return false;
    }
}
