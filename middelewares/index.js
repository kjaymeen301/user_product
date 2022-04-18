const jwt = require('jsonwebtoken');
const {
    User,
    // APILogs 
} = require('../helpers/DBconnect');
const { ErrorResponse } = require('../helpers/response.js');


module.exports = function(req, res, next) {
    let token = req.headers['x-access-token'] || req.headers['authorization'] || req.headers['Authorization']; // Express headers are auto converted to lowercase
    const isRefreshToken = req.headers['isrefreshtoken'];

    if (token === undefined) {
        return ErrorResponse(req, res, 'Unauthorized Access!', { 'message': 'authorize token missing' }, 401);
    }

    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }
    if (token) {
        jwt.verify(token, process.env.secret, async(err, decoded) => {
            if (err) {
                if (err.name == "TokenExpiredError") {
                    if (isRefreshToken) {
                        const payload = jwt.verify(token, process.env.secret, { ignoreExpiration: true }, async(err, decodede) => {
                            const userInfo = await User.findOne({
                                where: { token: decodede.tokendata }
                            });
                            // console.log(decodede.tokendata)
                            if (userInfo) {
                                req.decoded = userInfo.dataValues;
                                next();
                            } else {
                                return ErrorResponse(req, res, 'Unauthorized Access!', { 'message': 'user not found' }, 401);
                            }
                            // console.log("user:" +userInfo.id);
                        });

                    } else {

                        return ErrorResponse(req, res, 'Unauthorized Access!', { 'message': 'Unauthorized Access!', "isExpired": 1 }, 401);
                    }

                } else {

                    return ErrorResponse(req, res, 'Unauthorized Access!', { 'message': 'Unauthorized Access!' }, 401);
                }


                // return ErrorResponse(req, res, 'Unauthorized Access!', { 'message': 'Unauthorized Access!' }, 401);
            } else {
                const userInfo = await User.findOne({
                    where: { token: decoded.tokendata }
                });
                if (userInfo === null) {
                    return ErrorResponse(req, res, 'Unauthorized Access!', { 'message': 'Unauthorized Access!' }, 401);
                } else {

                    if (userInfo.dataValues.status != 1) {
                        return ErrorResponse(req, res, 'Your Account has been deactive', { 'account': 'Your Account has as deactive.' }, 422);
                    } else {
                        req.decoded = userInfo.dataValues;
                        next();
                    }
                }
            }
        });
    } else {
        return ErrorResponse(req, res, 'Unauthorized Access!', { 'message': 'authorize token missing' }, 401);
    }
};