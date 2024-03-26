'use strict'

import jwt from 'jsonwebtoken';
import { config } from '../config.js'
import bcrypt from 'bcrypt'
import userService from '../servicios/usersService.js';

const removeExtensionFilename = filename => filename.split('.').shift()

export { removeExtensionFilename }

export const generateToken = (user) => {
    const token = jwt.sign({ user }, config.PRIVATE_KEY, { expiresIn: '24h' })
    return token;
}
export const verifyToken = (token) => {
    const secretKey = config.PRIVATE_KEY; // Replace with your secret key

    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const generateMailToken = (email) => {
    const secretKey = config.PRIVATE_KEY; // Replace with your secret key
    const expiresIn = 3600; // 1 hour in seconds

    const token = jwt.sign({ data: email }, secretKey, { expiresIn });

    return token;
};

export const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) { // si existe la cookie
        token = req.cookies['currentToken'];
    }

    return token;
};

export const checkUser = async (email, password) => {
    const userCheck = await userService.getUser(email)
    return userCheck

}
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10)) // register


export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password) //  login 

export function generateUniqueCode(prefix = 'ORD') {
    const randomNumber = Math.floor(Math.random() * 10000); // Número aleatorio entre 0 y 9999
    const timestamp = new Date().getTime(); // Marca de tiempo en milisegundos

    // Concatenar el prefijo, el número aleatorio y la marca de tiempo para formar el código
    const code = `${prefix}-${randomNumber}-${timestamp}`;

    return code;
}

export function  generateTicketHTML(ticket) {
    return `
    
        Código: ${ticket.code}
        Creado en: ${ticket.createdAt.toLocaleString()}
        Monto: ${ticket.amount.toFixed(2)}
        Comprador:${ticket.purchaser}
        Productos:
        
        ${ticket.products.map(product => `<li>${product.name} x ${product.quantity}</li>`).join('')}
        <
    
    `;
}