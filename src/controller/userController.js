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
                user = await UserService.getId(uid);
                if (!user) {
                    return res.status(404).json({ error: ERROR.USER_NOT_FOUND });
                }

            }
    
            if (user.role === 'USER') {
                if (!user.documents || user.documents.length === 0) {
                    return res.status(404).json({ error: ERROR.USER_DOCUMENTS_NOT_FOUND });
                }
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

        export const uploadFiles = async (req, res) => {
            try {
                // Extract user ID from request parameters
                const userId = req.params.uid;
        
                // Extract uploaded files from req.files
                const { ID, Address, Account_state } = req.files;
        
                // Update user's documents array based on uploaded files
                const user = await UserService.getUser(userId);
        
                if (!user) {
                    return res.status(404).send('User not found');
                }
        
                // Update user's documents array
                if (ID) {
                    user.documents.push({ name: 'ID', reference: ID[0].filename });
                }
                if (Address) {
                    user.documents.push({ name: 'Address', reference: Address[0].filename });
                }
                if (Account_state) {
                    user.documents.push({ name: 'Account_state', reference: Account_state[0].filename });
                }
        
                // Save updated user document to the database
                const result = await UserService.updateUser(userId, user);
        
                // Send a success response
                if (result) {
                    res.send('Files uploaded successfully and user documents updated!');
                }
                
            } catch (error) {
                console.error('Error:', error);
                res.status(500).send('Internal Server Error');
            }
        }