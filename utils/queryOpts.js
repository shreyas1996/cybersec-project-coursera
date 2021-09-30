const _ = require("lodash")
module.exports.parseOffsetAndLimit = function(query){
    query.offset = parseInt(query.offset) || 0;
    query.limit = parseInt(query.limit) || 100;
    if(_.has(query, "since")){
        query.since = new Date(query.since)
    }
}