'use strict'

import express from 'express'
import { registerUser, loginUser, uploadFiles,deleteInactiveUsers,logoutUser, restorePassword,sendRestorePassword,changeRole,getAllUsers } from "../controller/usersController.js";

import { generateToken } from '../utils/helpers.js';
import passport from 'passport';
import passportControl from '../middleware/passportControl.js';
import { ERROR } from '../commons/dictionaryError.js';
import MulterConfig from '../middleware/multer.js';

const router = express.Router();
const multerConfig = new MulterConfig();

router.use(express.json())
router.use(express.urlencoded({ extended: true }))


router.get('/github', passport.authenticate('github', { scope: ['user: email'] }),
    async (req, res) => {
        console.log('Existe usuario')
    })

router.get('/githubCallback', passport.authenticate('github', { failureRedirect: '/failLogin' }), async (req, res, next) => {
    req.session.user = req.user
    res.redirect('/api/product')
})

router.post('/register', passport.authenticate('register', {
    failureRedirect: '/failregister'
}), async (req, res) => {

    res.send({ status: "success", message: "User registered" });
})

router.get('/failregister', async (req, res) => {
    res.send({ error: ERROR.USER_NOT_REGISTERED })
})

router.post('/login', passportControl('current',
    {
        failureRedirect: '/failLogin'
    })
    , async (req, res) => {

        // const { email, password } = req.body
        if (!req.user) return res.status(400).send({ status: "error", error: "Incomplete Values" });

        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            role: req.user.role
        }

        res.send({ status: "success", payload: req.user });
    })

router.get('/failLogin', async (req, res) => {
    res.send({ error: ERROR.USER_NOT_LOGGED_IN })
})

router.delete('/logout', logoutUser)

router.delete('/', deleteInactiveUsers)
router.post('/restore', restorePassword)

router.post('/sendrestore', sendRestorePassword)


router.get('/current', passportControl('current'), (req, res) => {
    res.json({ payload: req.user });
});

router.get('/', getAllUsers)

router.put('/premium/:uid', changeRole);

router.post('/:uid/documents', multerConfig.uploadFiles(), uploadFiles);


export { router };