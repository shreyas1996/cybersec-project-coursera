var express = require("express");
var fs = require('fs');
var authMiddleware = require("./authMiddleware");
const router = express.Router()

function init(path, app) {
    authMiddleware.init(router)
    var rest = path + '/rest';
    var files = fs.readdirSync(rest);

    files.forEach(function(file) {
        if (['.', '..'].indexOf(file) > -1) {
            return;
        }
        var filePath = [rest, file].join('/');
        var pathStat = fs.statSync(filePath);
        if (pathStat.isFile() && file.substr(-3) === '.js') {
            require(filePath).init(router);
        }
    });
    app.use(config.get("app.apiPrefix") + "/v" + config.get("app.version"), router);
}

module.exports.init = function(app) {
    init(__dirname, app);
};