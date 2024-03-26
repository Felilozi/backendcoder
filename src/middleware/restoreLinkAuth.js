import { ERROR ,SUCCESS} from '../commons/dictionaryError.js';
import { verifyToken } from "../utils/helpers.js";


export function verifyTokenMiddleware(req, res, next) {
    const token = req.query.token; 

    if (!token) {
        return res.status(403).send({ status: 'error', error: ERROR.NO_TOKEN_PROVIDED });
    }

    const decodedData = verifyToken(token);

    if (!decodedData) {
        return res.status(401).send({ status: 'error', error: ERROR.INVALID_TOKEN });
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (decodedData.exp < currentTimestamp) {

        return res.redirect('/api/views/sendrestore');
    }

    req.decodedData = decodedData;

    next();
}