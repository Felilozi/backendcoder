import passport from "passport";

const passportControl = (strategy) => {
    return (req, res, next) => {
        console.log("passport control", strategy)
        passport.authenticate(strategy, { session: false }, (error, user, info) => {
            if (error) {
                return next(error);
            }
            if (!user) {
                return res.status(401).json({Error:"Este es el error" });
            }
            req.user = user;
            next();
        })(req, res, next);
    };
};

export default passportControl;