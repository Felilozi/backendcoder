'use strict'

import express from 'express'
import { registerUser, loginUser, logoutUser } from "../controller/sessionController.js";

const router = express.Router()
router.use(express.json())
router.use(express.urlencoded({ extended: true }))


router.post('/register', registerUser)

router.post('/login', loginUser)

router.delete('/logout', logoutUser)

export { router };


