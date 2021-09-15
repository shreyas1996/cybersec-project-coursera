'use strict';

var DBManager = require('./DBManager');
var models    = require('./models');

module.exports.initialize = function(dbConfig){
    var dbMgr;

    dbMgr = new DBManager(dbConfig);

    return dbMgr.init()
            .then(() =>{
                models.init(dbMgr);
                return dbMgr;
            });
};

