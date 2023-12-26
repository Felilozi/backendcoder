import passport from "passport";
import { generateToken, checkUser, isValidPassword } from "../utils/helpers.js";

const passportControl = (strategy) => {
//     return (req, res, next) => {
//         console.log("passport control", strategy)
//         passport.authenticate(strategy, { session: false }, (error, user, info) => {
//             if (error) {
//                 return next(error);
//             }
//             if (!user) {
//                 return res.status(401).json({Error:"Este es el error" });
//             }
//             req.user = user;
//             next();
//         })(req, res, next);
//     };


return (req, res, next) => {
    passport.authenticate('current', { session: false }, (error, user, info) => {
        if (error) {
            return next(error);
        }
        if (!user) {

            async function checking(email, password) {
                const checkUsers = await checkUser(email, password);
                console.log(checkUsers);
                return checkUsers;
            }

        
            async function mainLogic() {
                const checkUsers = await checking(req.body.email, req.body.password);

                if (checkUsers) {
                    if (!isValidPassword(checkUsers._doc, req.body.password)) {
                        throw new Error("Incorrect password");
                    }

                    const access_token = generateToken(req.body.email);
                    res.cookie('currentToken', access_token, {
                        maxAge: 60 * 60 * 1000,
                        httpOnly: true
                    });
                    return checkUsers._doc;
                }
            }

            mainLogic()
                .then((userDoc) => {
                    req.user = userDoc;
                    next();
                })
                .catch((error) => {
                    // Handle errors here
                    res.status(403).send({ status: "error", error: error.message });
                });
        } else {
            if (!isValidPassword(user._doc, req.body.password)) {
                return res.status(403).send({ status: "error", error: "Incorrect password" });
            }
            req.user = user;
            next();
        }

    }
    )(req, res, next);
};
};

export default passportControl;