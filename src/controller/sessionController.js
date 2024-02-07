'use strict'
import UserService from '../servicios/userServicios.js';
import { config } from '../config.js';
import { createHash, isValidPassword , generateMailToken} from '../utils/helpers.js';
import { Users } from '../models/Models/usersModel.js';
import MailingService from "../servicios/mailing.js";
import { ERROR, SUCCESS } from '../dictionaryError.js';
export const sendRestorePassword = async (req, res) => {

    const token = generateMailToken(req.body.email)
    const mailer = new MailingService()
    const sendMailer = await mailer.sendMailUser({

        from: 'felicialozinski97@gmail.com',
        to: req.body.email,
        subject: 'Restaurar Contraseña',
        html: `<div>Click en el siguiente link para restaurar su contraseña: http://localhost:3000/api/views/restore/verify?token=${token}`

    })

    res.send({ status: 'success', message: SUCCESS.USER_REGISTERED });


}

export const restorePassword = async (req, res) => {
    const { email, password } = req.body
    const existe = await Users.findOne({ email })
    if (!existe) return res.status(404).send({ status: 'error', error: ERROR.USER_NOT_FOUND })
    if (isValidPassword(existingUser, password)) {
        return res.status(400).send({ status: 'error', error: ERROR.SAME_PASSWORD });
    }
    const hashedPassword = createHash(password)
    const user = await Users.findOneAndUpdate(
        { email: email },
        { $set: { 'password': hashedPassword } },
        { new: true } // Return the modified document
    )

    res.send({ status: "success", message: SUCCESS.PASSWORD_RESTORED });
}


export const registerUser = async (req, res) => {

    const { first_name, last_name, email, age, password } = req.body
    // console.log('Si pase por aqui')
    const existe = UserService.getUser(email)

    
    if (!role) {
        let defaultRole;
        if (email === config.ADMINEMAIL && password === config.ADMINPASS) {
            defaultRole = 'ADMIN'
        } else {
            defaultRole = 'USER'
        }
        role = defaultRole;
    }
    const hashedPassword = createHash(password)
    if (existe) return res.status(400).send({ status: 'error', error: ERROR.USER_ALREADY_EXISTS })
    const user = {
        first_name,
        last_name,
        email,
        age,
        hashedPassword,
        role
    }
    let result = await Users.create(user)
    res.send({ status: 'success', message: SUCCESS.USER_REGISTERED })
    // res.redirect('api/session/login')
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body
   
    const user = UserService.getUser(email)

    if (!user) return res.status(400).send({ status: 'error', error:ERROR.ERROR_CREDENTIALS  })

    if (!isValidPassword(user, password)) if (!user) return res.status(403).send({ status: "error", error: ERROR.INCORRECT_PASSWORD });

    req.session.user = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        role: user.role
    }
    res.send({ status: 'success', payload: req.session.user, message:SUCCESS.FIRST_LOGIN })
    // res.redirect('api/product/')
}

export const logoutUser = async (req, res) => {

    req.session.destroy(err => {
        if (err) {
            console.error(ERROR.SESSION_ERROR, err);
            res.status(500).send({ status: 'error', error: ERROR.SESSION_ERROR });
        } else {
            res.status(200).send({ status: 'success', message: SUCCESS.LOGOUT_SUCCESSFUL })
        }

        // res.redirect('api/product/')
    })}
    export const changeRole = async (req, res) => {

        const uid = req.params.uid;
    
        try {
            let user;
    
            user = await UserService.getUser(uid);
    
            if (!user) {
                user = await UserService.getID(uid);
                if (!user) {
                    return res.status(404).json({ error: ERROR.USER_NOT_FOUND });
                }
            }
    
            if (user.role === 'USER') {
            user.role = 'PREMIUM';
            }else{
                user.role = 'USER';
            }
    
            await UserService.updateUser(user.email, user);
    
            return res.json({ message: SUCCESS.USER_UPDATED, user });
        } catch (error) {
            console.error(ERROR.USER_NOT_UPDATED, error);
            return res.status(500).json({ error: ERROR.SERVER_ERROR });
        }}