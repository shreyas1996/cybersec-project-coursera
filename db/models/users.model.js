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

    create(userObj) {
        userObj._id = this.utils.User();
        return bcrypt.genSaltAsync(10).then(salt => {
            return bcrypt.hashAsync(userObj.password, salt, null)
                .then(hash => {
                    userObj.hash = hash;
                    console.log("hash", userObj)
                    return this.model.create(userObj)
                })
        })
    }

    findAndCheck(username, password) {
        console.log("passss", password)
        return this.findOne({
            username: username
        }).then(user => {
            console.log("user", user)
            if (!user)
                return Promise.reject(new Error("user not found"))
            console.log("awsrdfghj")
            return bcrypt.compareAsync(password, user.hash)
                .then(function(data) {
                    if (data)
                        return user;
                    return Promise.reject(new Error("Invalid Password"))
                })
        })
    }
}

module.exports = UsersModel;