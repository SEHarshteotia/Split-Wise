const constants = require('../constants');

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;

    switch (statusCode) {
        case constants.VALIDATION_ERROR:
            res.json({ title: "VALIDATION FAILED", message: err.message, stackTrace: err.stack });
            break;
        case constants.UNAUTHORIZED:
            res.json({ title: "UNAUTHORIZED", message: err.message, stackTrace: err.stack });
            break;
        case constants.NOT_FOUND:
            res.json({ title: "NOT FOUND", message: err.message, stackTrace: err.stack });
            break;
        case constants.FORBIDDEN:
            res.json({ title: "FORBIDDEN", message: err.message, stackTrace: err.stack });
            break;
        case constants.SERVER_ERROR:
            res.json({ title: "SERVER ERROR", message: err.message, stackTrace: err.stack });
            break;
        default:
            // Always respond even if it's not an error
            res.json({ title: "NO ERROR", message: err.message || "All good", stackTrace: err.stack || null });
            break;
    }
};

module.exports = errorHandler;
