const createError = require('http-errors');

module.exports.Response = {
    success: (res, status, message = 'Ok', body = {}) => {
        res.status(status).json({ message, body });
    },
    error: (res, error = null) => {
        const { statusCode, message } = new createError.InternalServerError();
    }
};