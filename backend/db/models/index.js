'use strict';
const debug = require("debug")("dbmodels");
const _ = require("lodash");
const fs = require("fs");
const path = require("path")
var models;

models = {};

module.exports.getModel = function (name) {
    return models[name];
};

module.exports.init = function (dbMgr) {

    var files;

    debug('loading models');
    files = fs.readdirSync(path.resolve(__dirname, './'));
    _
        .chain(files)
        .each((file) => {
            if (file.indexOf('.model.js') === -1) {
                return;
            }
            debug("file", file)
            let model = require(path.resolve(__dirname, './' + file))
            models[file.split(".")[0]] = new model(dbMgr);
            debug('loaded model %s', file);
        })
        .value();
};