var mimetypeValidator = function(mimetype) {
    return function(req, res, next) {
        if (req.get('content-type') != mimetype) {
            var error = new Error();
            error.message = 'Unexpected mimetype. ' +
                            'Expected ' + mimetype + '. ' +
                            'Received ' + req.get('content-type') + '.';
            error.status = 415;
            return next(error);
        }
        next();
    };
};

module.exports = mimetypeValidator;

