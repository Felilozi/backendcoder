'use strict'
import bcrypt from 'bcrypt'

const removeExtensionFilename = filename => filename.split('.').shift()

export { removeExtensionFilename }


export const createHash = password => bcrypt.hashSync(password,bcrypt.genSaltSync(10)) // register

export const isValidPassword = ( user, password) => bcrypt.compareSync(password,user.password) //  login 

