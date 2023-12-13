'use strict'

import express, { json } from 'express'
import session from 'express-session'
import { join } from 'node:path'
import { engine } from 'express-handlebars'
import { router } from './routes/index.js'
import { routerPrueba } from './routerPrueba/routerPrueba.js'
import { db } from './database.js'
import cookieParser from 'cookie-parser'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import cors from 'cors'
import MongoStorage from "connect-mongo"
import { config } from './config.js'
import passport from 'passport'
import initializedPassport from './controller/passportController.js';
const server = express()

//mill 
const swaggerDocument = YAML.load('./openapi.yml')
server.use(json())
server.use(cors())
server.use(cookieParser('CookieSecret'))
server.use(session({
    secret: 'SECRETCODE',
    resave: true,
    saveUninitialized:true
    //Puede guardar seccion  o guardar cualquier dato  garatiza el dato  
}))
const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

server.use(session({
    store: MongoStorage.create({
        mongoUrl: config.MONGODB_URI,
        mongoOptions: mongooseOptions
    }),
    secret:'CODER_SECRET',
    resave:false,
    saveUninitialized:false
}))
;
server.engine(
    '.hbs',
    engine({
        extname: '.hbs',
        defaultLayout: 'main',
    })
)

server.set("view engine", ".hbs");
server.set('views', join(process.cwd(), 'src', 'views'));
server.use(express.static(join(process.cwd(), '/public')));
console.log(db)

server.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
server.use('/api', router)
server.use('/feli',routerPrueba)

function shutdown(message, code) {
    console.log(`Server ${code ? `${message}: ${code}` : 'stopped'}`)
}

process.on('exit', code => shutdown('About to exit with', code))

initializedPassport()
server.use(passport.initialize())
// server.use(passport.session())

export default server
