'use strict'

import { Users } from "../models/usersmodel.js";
import { config } from '../config.js';
import { createHash ,isValidPassword } from '../utils/helpers.js';

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


// export const registerUser = async (req, res) => {

//     const { first_name, last_name, email, age, password } = req.body
//     const existe = await Users.findOne({ email })
//     const hashedPassword = createHash(password)

//     let role;
//     if (email === config.ADMINEMAIL && password === config.ADMINPASS) {
//         role = 'ADMIN'
//     } else {
//         role = 'USER'
//     }

//     if (existe) return res.status(400).send({ status: 'error', error: 'El usuario ya existe' })
//     const user = {
//         first_name,
//         last_name,
//         email,
//         age,
//         password: hashedPassword ,
//         role
//     }
//     let result = await Users.create(user)

//     res.send({ status: 'success', message: 'usuario registrado' })

// }

// export const loginUser = async (req, res) => {
//     const { email, password } = req.body

//     const hashedPassword = createHash(password)
//     const user = await Users.findOne({ email })

//     if (!user) return res.status(400).send({ status: 'error', error: 'Error Credentials' })

//     if(!isValidPassword(user,password)) if(!user) return res.status(403).send({status:"error",error:"Incorrect password"});
//     req.session.user = {
//         first_name: user.first_name,
//         last_name: user.last_name,
//         email: user.email,
//         age: user.age
//     }
//     res.send({ status: 'success', payload: req.session.user, message: 'Primer Logueo' })
//     // res.redirect('api/product/')
// }

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