import passport from "passport";
import { generateToken, checkUser, isValidPassword } from "../utils/helpers.js";

const roleAuth = (strategy, adminRequired) => {
    return (req, res, next) => {
        passport.authenticate(strategy, { session: false }, (error, user, info) => {
            if (error) {
                return next(error);
            }
            if (user) {
                if (user._doc.role !== 'ADMIN' && adminRequired === true) {
                    throw new Error("Solo un administrador puede realizar la acción solicitada");
                }else if (user._doc.role !== 'USER' && adminRequired === false) {
                    throw new Error("Solo un usuario puede realizar la acción solicitada");
                }
            }

        }
        )(req, res, next);
    };
};

export default roleAuth;