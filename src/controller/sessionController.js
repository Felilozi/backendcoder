'use strict'

import { Users } from "../models/usersmodel.js";
import { config } from '../config.js'


export const registerUser = async (req, res) => {

    const { first_name, last_name, email, age, password } = req.body
    // console.log('Si pase por aqui')
    const existe = await Users.findOne({ email })

    let role;
    if (email === config.ADMINEMAIL && password === config.ADMINPASS) {
        role = 'ADMIN'
    } else {
        role = 'USER'
    }

    if (existe) return res.status(400).send({ status: 'error', error: 'El usuario ya existe' })
    const user = {
        first_name,
        last_name,
        email,
        age,
        password,
        role
    }
    let result = await Users.create(user)

    res.send({ status: 'success', message: 'usuario registrado' })
    // res.redirect('api/session/login')
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body
    // console.log('Si pase por aqui /////')
    const user = await Users.findOne({ email, password })

    if (!user) return res.status(400).send({ status: 'error', error: 'Error Credentials' })

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
            // Session cleared successfully
            res.status(200).send({ status: 'success', message: 'Deslogeo exitoso' })
        }

        // res.redirect('api/product/')
    }
    )
}