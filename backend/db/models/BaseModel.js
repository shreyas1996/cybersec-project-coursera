'use strict';

var Promise = require('bluebird');
var debug = require('debug')('basemodel');
var utils = require("../../utils/");

class BaseModel {

    constructor(name, dbMgr, options) {
        this.utils = utils;
        this.dbMgr = dbMgr;
        this.options = options || {};
        this.debug = debug('model:' + this.constructor.name);
        this.model = this.dbMgr.getModel(name)
    }


    paginate() {
        return this.model.paginage.apply(this.model, arguments);
    }
    aggregate() {
        return this.model.aggregate.apply(this.model, arguments);
    }
    find() {
        return this.model.find.apply(this.model, arguments);
    }

    findOne() {
        return this.model.findOne.apply(this.model, arguments);
    }
    remove() {
        return this.model.deleteMany.apply(this.model, arguments);
    }

    count() {
        return this.model.count.apply(this.model, arguments);
    }
    create() {
        return this.model.create.apply(this.model, arguments);
    }
    update(matchCnd, updateArgs, opts) {
        opts = opts || {};
        if (!updateArgs) {
            return Promise.reject(new Error('updateArgs missing'));
        }

        // add modified date to document if it exists in the dbschema
        if (this.model.schema.paths.mOn) {
            if (updateArgs.$set)
                updateArgs.$set.mOn = new Date();
            else
                updateArgs.$set = {
                    "mOn": new Date()
                };
        }
        return this.model.update(matchCnd, updateArgs, opts);
    }

}
module.exports = BaseModel;