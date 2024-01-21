'use strict'

import passport from 'passport';
import passportJwt from 'passport-jwt';
import { cookieExtractor } from '../utils/helpers.js';
import github from 'passport-github2';
import local from 'passport-local';
import UserService from '../servicios/userServicios.js';
import { config } from '../config.js';
import { createHash, isValidPassword } from '../utils/helpers.js';

const LocalStrategy = local.Strategy;
const GitHubStrategy = github.Strategy;
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const initializedPassport = () => {

    passport.use('current', new JwtStrategy(
        
        {
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            secretOrKey: config.PRIVATE_KEY,
        },
        async (jwt_payload, done) => {
            try {
                console.log("Hola aca llego a current")
                // const user = await Users.findOne({ email: jwt_payload.email });
                const user = await UserService.getUser( jwt_payload.email )
                if (!user) {
                    return done(null, false, { messsages: 'User not found' });
                }

                return done(null, user);
            }
            catch (error) {
                return done(error);
            }
        }
    ))





    passport.use('github', new GitHubStrategy({
        clientID: config.GITHUB_AUTH_ID,
        clientSecret: config.GITHUB_SECRET,
        callbackURL: 'http://localhost:3000/api/session/githubCallback'
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await UserService.getUser(profile._json.email)
                // const user = await Users.findOne({ email: profile._json.email });
                console.log('github strategy')
                if (user) {
                    return done(null, user)
                }
                const newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    email: profile._json.email,
                    age: '',
                    password: '',
                    cart: []
                }
                let result = await UserService.createUser(newUser);
                return done(null, result)
            } catch (error) {
                done(error)
            }
        }
    ))

    passport.use('register', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;
            try {
                // const user = await Users.findOne({ email: username });
                const user = await UserService.getUser(username)
                if (user) {
                    return done(null, false)
                }
                const hashedPassword = createHash(password)
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: hashedPassword,
                    cart: []
                }
                // let result = await Users.create(newUser);
                let result = await UserService.createUser(newUser);
                return done(null, result)
            } catch (error) {
                done('User Not fount' + error)
            }
        }
    ))

    passport.use('login', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' },
        async (req, email, password, done) => {

            try {
                const user = await UserService.getUser(email)
                // const user = await Users.findOne({ email: email });
                console.log(' User login ' + user)
                if (!user) {
                    return done(null, false)
                }

                if (!isValidPassword(user, password)) {
                    return done(null, false)
                }

                return done(null, user)
            } catch (error) {
                return done(null, false)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await UserService.getID(id)
        done(null, user)
    })
}

export default initializedPassport