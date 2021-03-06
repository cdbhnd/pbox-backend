import * as config from 'config';
import * as bcrypt from 'bcryptjs';

const saltRounds: number = Number(config.get('password.saltRounds'));

export async function generateHash(password: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        bcrypt.hash(password, saltRounds, (error: Error, hash: string) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(hash);
        });
    });
}

export async function comparePassword(plainPassword: string, hash: string): Promise<Boolean> {
    return new Promise<Boolean>((resolve, reject) => {
        bcrypt.compare(plainPassword, hash, (error: Error, response: Boolean) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(response);
        });
    });
}