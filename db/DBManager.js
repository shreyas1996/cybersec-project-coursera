'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var debug = require('debug');
var BlueBird = require('bluebird');
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
mongoose.Promise = require('bluebird');
const config  = require('../config');
class DBManager {

    constructor(config) {
        this.name = config.name || 'dbmanager';
        this.debug = debug('dbmanager');
        this.config = config;
        this.mongoose = mongoose;
        mongoose.set('debug', true);
    }

    prepareDBURL() {
        return config.get("db.host");
    }

    loadSchemas() {
        var files;

        this.debug('loading schemas');
        files = fs.readdirSync(path.resolve(__dirname, './schemas'));

        _
            .chain(files)
            .each((file) => {
                if (file.indexOf('.schema.js') === -1) {
                    return;
                }

                let schema = require(path.resolve(__dirname, './schemas/' + file))
                let _schema = new mongoose.Schema(schema)
                _schema.plugin(mongoosePaginate);
                mongoose.model(file.split(".")[0], _schema);
                this.debug('loaded schema %s', file.split(".")[0]);
            })
            .value();
    }

    init() {
        return new BlueBird((resolve, reject) => {
            this.debug(this.name + ' : initialization in progress');
            var dbURL;

            dbURL = this.prepareDBURL();
            this.loadSchemas();

            this.connection = mongoose.createConnection(dbURL);
            return resolve();
        });
    }

    getModel(modelName) {
        return this.connection.model(modelName);
    }
}

module.exports = DBManager;