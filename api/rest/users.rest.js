var serviceHandler = require('../serviceHandler.js').serviceHandler;
var userService = require('../services/UserService.js').getInst();
var logger = require('../../loggers').accessLogger;

module.exports.init = function(app) {
    app.get('/getUsers', function (req, res) {
        let p = userService.getUsers(req.user)
        return serviceHandler(req, res, p)
    })

};