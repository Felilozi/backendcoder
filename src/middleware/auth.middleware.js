'use strict'


function auth(req, res, next) {

    if (req.session?.isAdmin) {
        return next()
    }
    return res.status(401).send(' User no esta autorizado')


}
export default auth