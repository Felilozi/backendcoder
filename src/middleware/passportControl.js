import passport from "passport";
import { generateToken, checkUser, isValidPassword } from "../utils/helpers.js";

const passportControl = (strategy) => {

return (req, res, next) => {
    passport.authenticate('current', { session: false }, (error, user, info) => {
        if (error) {
            return next(error);
        }
        if (!user) {

            async function checking(email, password) {
                const checkUsers = await checkUser(email, password);
                return checkUsers;
            }

        
            async function mainLogic() {
                const checkUsers = await checking(req.body.email, req.body.password);

                if (checkUsers) {
                    console.log(checkUsers.password,"loge");
                    const result = isValidPassword(checkUsers.password, req.body.password)
                    if (!result) {
                        console.log(req.body.password);
                        throw new Error("Incorrect password");
                    }

                    console.log('password correct');
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
                    console.log(error)
                    res.status(403).send({ status: "error", error: error.message });
                });
        } else {
            if (!isValidPassword(user.password, req.body.password)) {
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