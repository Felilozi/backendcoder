'use strict'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { config } from '../config.js'


const removeExtensionFilename = filename => filename.split('.').shift()

export { removeExtensionFilename }

export const generateToken = (user) => {
    const token = jwt.sign({ user }, config.PRIVATE_KEY, { expires: '24h' })
    res.cookie('currentToken', token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true
    });
    return token;
}

export const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) { // si existe la cookie
        token = req.cookies['currentToken'];
    }
    return token;
};


export const createHash = password => bcrypt.hashSync(password,bcrypt.genSaltSync(10)) // register

export const isValidPassword = ( user, password) => bcrypt.compareSync(password,user.password) //  login 

