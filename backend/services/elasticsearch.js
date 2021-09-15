const Bluebird = require('bluebird');
const elasticsearch = require('elasticsearch')
const client = new elasticsearch.Client({
    host: config.get("es.host"),
    log:config.get("es.log"),
  defer: function () {
    return Bluebird.defer();
  }
});

module.exports =  client;