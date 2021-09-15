'use strict';
const BaseService = require('./BaseService.js');
const Promise = require('bluebird')
const Model = appGlobals.dbModels;
const _ = require("lodash")
const rp = require('request-promise')
function MessageService() {
    BaseService.call(this);
}

MessageService.prototype.getUsers = function(user) {
    let userModel = Model.getModel("users")
    return userModel.find({username: {$ne: user.username}})
}

module.exports = {
    getInst: function () {
        return new MessageService();
    }
};