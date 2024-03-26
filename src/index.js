'use strict'

import server from './server.js'
import { config } from './config.js'

server.listen(config.PORT, () => {
    console.log(`Server is running on port http://localhost:${config.PORT}/api/views/login`)
})
