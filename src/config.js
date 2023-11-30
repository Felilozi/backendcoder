'use strict'

import dotenv from 'dotenv'

if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
}

const config = {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost/test',
    ADMINEMAIL: process.env.ADMINEMAIL,
    ADMINPASS: process.env.ADMINPASS,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    GITHUB_AUTH_ID: process.env.GITHUB_AUTH_ID,
    GITHUB_SECRET: process.env.GITHUB_SECRET,
}


export { config }
