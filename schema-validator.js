var getType = function(object) {
      return Object.prototype.toString.call(object).slice(8, -1);
};

var isType = function(object, type) {
      return getType(object) === type;
};

var findInvalidObject = function(object, schema, path) {
    if (!isType(object, 'Object')) {
        var error = new Error();
        error.message = 'Incorrect type: ' + path + '. ' +
                       'Expected Object. ' +
                       'Received ' + getType(object) + '.';
        error.status = 422;
        return error;
    }

    for (var key in schema) {
        var currentPath = path;
        if (currentPath.length) {
            currentPath += '.';
        }
        currentPath += key;

        if (!(key in object)) {
            var error = new Error();
            error.message = 'Missing attribute: ' + currentPath + '.';
            error.status = 422;
            return error;
        }

        var error = findInvalid(object[key], schema[key], currentPath);
        if (error) {
            return error;
        }
    }

    return null;
};

var findInvalidArray = function(object, schema, path) {
    if (!isType(object, 'Array')) {
        var error = new Error();
        error.message = 'Incorrect type: ' + path + '. ' +
                       'Expected Array. ' +
                       'Received ' + getType(object) + '.';
        error.status = 422;
        return error;
    }

    for (var i=0; i<object.length; i++) {
        var currentPath = path + '[' + i + ']';
        var error = findInvalid(object[i], schema[0], currentPath);
        if (error) {
            return error;
        }
    }
    return null;
};

var findInvalidLiteral = function(object, schema, path) {
    var expected = getType(schema);
    if (!isType(object, expected)) {
        var error = new Error();
        error.message = 'Incorrect type: ' + path + '. ' +
                       'Expected ' + expected + '. ' +
                       'Received ' + getType(object) + '.';
        error.status = 422;
        return error;
    }
    return null;
};


var findInvalid = function(object, schema, path) {
    path = path || '';
    if (isType(schema, 'Object')) {
        return findInvalidObject(object, schema, path);
    }
    else if (isType(schema, 'Array')) {
        return findInvalidArray(object, schema, path);
    }
    else {
        return findInvalidLiteral(object, schema, path);
    }
};

var schemaValidator = function(schema) {
    return function(req, res, next) {
        var error = findInvalid(req.body, schema);
        if (error) {
            return next(error);
        }

        next();
    }
};

module.exports = schemaValidator;
