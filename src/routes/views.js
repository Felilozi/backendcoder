'use strict'

import express from "express";
import { verifyTokenMiddleware } from "../middleware/restoreLinkAuth.js";
import { getUser, displayCart, updateUserRole, deleteUser } from '../controller/userAdm.js'

const router = express.Router();

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

router.get('/register', (req, res) => {
    res.render('register')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/sendrestore', (req, res) => {
    res.render('sendrestore')
})

router.get('/crearProducto', (req, res) => {
    res.render('realTimeProducts')
})

router.get('/cart', displayCart)

router.get('/restore/verify', verifyTokenMiddleware, (req, res) => {

    const token = req.query.token;

    res.render('restore')
})

router.get('/', (req, res) => {
    res.render('profile', {
        user: req.session.user
    })
})

router.get('/', (req, res) => {
    res.render('documents', {
        user: req.session.user
    })
})

router.get('/userAdmin', (req, res) => {
    if (req.session.user.role === 'ADMIN') {
        res.render('userAdmin');
    } else {
        res.status(500).send('Only admin');
    }

});

router.post('/user', getUser);

router.post('/user/update-role', updateUserRole);

router.post('/delete-user', deleteUser);

export { router };