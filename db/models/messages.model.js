var BaseModel = require('./BaseModel');
var bcrypt = require('bcrypt-nodejs');
const Promise = require("bluebird")
Promise.promisifyAll(bcrypt)
// const modelName = __filename.split("/").pop().split(".")[0];
const path = require('path');
const filename = path.basename(__filename);
// console.log("filename", filename);
const modelName = filename.split(".")[0];
console.log("modelName", modelName);
class UsersModel extends BaseModel {

    constructor(dbMgr, options) {
        super(modelName, dbMgr, options);
    }

    create(msgObj) {
        msgObj._id = this.utils.Message();
        return this.model.create(msgObj)
    }
}

module.exports = UsersModel;