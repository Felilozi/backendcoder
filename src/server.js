'use strict'

import express, { json } from 'express'
// import { createServer } from 'node:http'
import { join } from 'node:path'
// import { Server } from 'socket.io';
import { engine } from 'express-handlebars'
import { router } from './routes/index.js'
import { db } from './database.js'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import cors from 'cors'

const server = express()
// const serverIo = createServer(server)
// const io = new Server(serverIo)
const swaggerDocument = YAML.load('./openapi.yml')
server.use(json())
server.use(cors())

server.engine(
    '.hbs',
    engine({
        extname: '.hbs',
        defaultLayout: 'main',
    })
)

server.set('view engine', '.hbs')
server.set('views', join(process.cwd(), 'src', 'views'))
server.use(express.static(join(process.cwd(), '/public')))
console.log(db)

// server.use('/api/products', productsRoutes);

// server.use('/api/carts', cartRoutes);

// server.use('/realtimeproducts', RealtimeProductsRoutes(io))

server.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
server.use('/api', router)

// io.on('connection', (socket) => {
//     console.log('Socket conectado')
//     socket.on('message', data => {
//         console.log(`Mensaje recibido ${data}`)
//     }
//     )

//     socket.on('productAdded', (productData) => {
//         // Broadcast the product data to all connected clients
//         io.emit('productAdded', productData);
//     });

// })

function shutdown(message, code) {
    console.log(`Server ${code ? `${message}: ${code}` : 'stopped'}`)
}

process.on('exit', code => shutdown('About to exit with', code))

export default server
