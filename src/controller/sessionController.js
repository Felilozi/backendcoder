'use strict'
import UserService from '../servicios/userServicios.js';
import { config } from '../config.js';
import { createHash ,isValidPassword } from '../utils/helpers.js';
import { Users } from '../models/Models/usersModel.js';

export const restorePassword = async (req, res) =>{
    const { email, password } = req.body
    const existe = await Users.findOne({ email })
    if (!existe) return res.status(404).send({ status: 'error', error: 'El usuario no existe' })
    
    const hashedPassword = createHash(password)
    const user = await Users.findOneAndUpdate(
            { email: email },
            { $set: { 'password': hashedPassword } },
            { new: true } // Return the modified document
        )

        res.send({status:"success",message:"Contraseña restaurada"});
}


export const registerUser = async (req, res) => {

    const { first_name, last_name, email, age, password } = req.body
    // console.log('Si pase por aqui')
    const existe = UserService.getUser(email)

    let role;
    if (email === config.ADMINEMAIL && password === config.ADMINPASS) {
        role = 'ADMIN'
    } else {
        role = 'USER'
    }
    const hashedPassword = createHash(password)
    if (existe) return res.status(400).send({ status: 'error', error: 'El usuario ya existe' })
    const user = {
        first_name,
        last_name,
        email,
        age,
        hashedPassword,
        role
    }
    let result = await Users.create(user)

    res.send({ status: 'success', message: 'usuario registrado' })
    // res.redirect('api/session/login')
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body
    // console.log('Si pase por aqui /////')
    const user = UserService.getUser(email)

    if (!user) return res.status(400).send({ status: 'error', error: 'Error Credentials' })

    if (!isValidPassword(user, password)) if (!user) return res.status(403).send({ status: "error", error: "Incorrect password" });
    
    req.session.user = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age
    }
    res.send({ status: 'success', payload: req.session.user, message: 'Primer Logueo' })
    // res.redirect('api/product/')
}

export const logoutUser = async (req, res) => {

    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Error clearing session');
        } else {
            res.status(200).send({ status: 'success', message: 'Deslogeo exitoso' })
        }

        // res.redirect('api/product/')
    }
    )
}