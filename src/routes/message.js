'use strict'

import express from 'express';
import { getMessage, createMessage } from '../controller/messageController.js';

const router = express.Router();

// Middleware to parse JSON request bodies
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

//lee el mensaje
router.get('/', getMessage)


// Create a new message
router.post('/', createMessage)


export { router };