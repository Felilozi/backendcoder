import passport from "passport";
import { generateToken, checkUser, isValidPassword } from "../utils/helpers.js";
import { ERROR} from "../commons/dictionaryError.js";
import { RoleManager } from "../controller/roleController.js";
const roleAuth = (strategy, adminRequired,action) => {
    return (req, res, next) => {
        passport.authenticate(strategy, { session: false }, (error, user, info) => {
            if (error) {
                return next(error);
            }
            if (user && action) {

                const result = RoleManager.determineAuthByRole(action, role);
                if (result === false) {
                    throw new Error(ERROR.ADMIN_ACTION_REQUIRED)
                }
            }

        }
        )(req, res, next);
    };
};

export default roleAuth;