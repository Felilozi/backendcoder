'use strict'

import jwt from 'jsonwebtoken';
import { config } from '../config.js'
import bcrypt from 'bcrypt'
import { Users } from '../models/Models/usersModel.js';

const removeExtensionFilename = filename => filename.split('.').shift()

export { removeExtensionFilename }

export const generateToken = (user) => {
    const token = jwt.sign({ user }, config.PRIVATE_KEY, { expiresIn: '24h' })
    return token;
}

export const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) { // si existe la cookie
        token = req.cookies['currentToken'];
    }

    return token;
};

export const checkUser = async (email, password) => {
    const userCheck = await Users.findOne({
        email
    }).exec();
    return userCheck

}
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10)) // register
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user) //  login

//Lo nuevo
export function generateUniqueCode(prefix = 'ORD') {
    const randomNumber = Math.floor(Math.random() * 10000); // Número aleatorio entre 0 y 9999
    const timestamp = new Date().getTime(); // Marca de tiempo en milisegundos

    // Concatenar el prefijo, el número aleatorio y la marca de tiempo para formar el código
    const code = `${prefix}-${randomNumber}-${timestamp}`;

    return code;
}