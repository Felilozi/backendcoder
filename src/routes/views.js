'use strict'

import { Router } from "express";
import { verifyTokenMiddleware } from "../middleware/restoreLinkAuth.js";

const router = Router()

router.get('/register', (req, res) => {
    console.log('pase1')
    res.render('register')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/sendrestore', (req, res) => {
    res.render('sendrestore')
})

router.get('/restore', verifyTokenMiddleware, (req, res) => {

    res.render('restore')
})
router.get('/', (req, res) => {
    res.render('profile', {
        user: req.session.user
    })
})

// router.get('/restorePassword', (req, res) => {
//     console.log('pase1')
//     res.render('restorePassword')
// })

export { router };