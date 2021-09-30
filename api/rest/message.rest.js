var serviceHandler = require('../serviceHandler.js').serviceHandler;
var messageService = require('../services/MessageService.js').getInst();
// var logger = require('../../loggers').accessLogger;

module.exports.init = function(app) {
    app.get('/messages', function (req, res) {
        let p = messageService.getMessages(req.user)
        return serviceHandler(req, res, p)
    })
    app.post('/message', function(req, res) {
        // logger.info(req.user+',SEARCH,'+req.body);
        let p = messageService.sendMessage(req.user, req.body)
        return serviceHandler(req, res, p)
    });

};