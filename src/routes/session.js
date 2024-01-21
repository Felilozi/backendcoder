'use strict'

import express from 'express'
import { logoutUser, restorePassword } from "../controller/sessionController.js";
import passport from 'passport';
// import { generateToken } from '../utils/helpers.js';
import passportControl from '../middleware/passportControl.js';
import { ERROR } from '../dictionaryError.js';


const router = express.Router()
router.use(express.json())
router.use(express.urlencoded({ extended: true }))

router.post('/restorePassword', restorePassword)


// router.post('/register', registerUser)

// router.post('/login', loginUser)

router.delete('/logout', logoutUser)
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
    res.send({ error: ERROR.ERRORREGISTER })
})

router.post('/login', passportControl('current', {
    failureRedirect: '/failLogin'
}), async (req, res) => {
    console.log("aca pase")

    if (!req.user) return res.status(400).send({ status: "error", error: "Incomplete Values" });

    req.session.user = {

        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age
    }

    res.send({ status: "success", payload: req.user });
})

router.get('/failLogin', async (req, res) => {
    res.send({ error: ERROR.ERRORLOGIN})
})

export { router };


