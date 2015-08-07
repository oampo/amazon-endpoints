var bodyValidator = function(req, res, next) {
    // Allows us to disambiguate empty bodies and {}, which can't be done with
    // body-parser.  Relies on trusting content-length, but if you send an
    // invalid content-length then you don't deserve a good error message...
    var length = req.get('content-length');
    if (!length || length == 0) {
        var error = new Error();
        error.message = 'Empty request body.';
        error.status = 400;
        return next(error);
    }
    next();
};

module.exports = bodyValidator;

