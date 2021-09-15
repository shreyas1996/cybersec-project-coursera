'use strict';
const BaseService = require('./BaseService.js');
const Promise = require('bluebird')
const Model = appGlobals.dbModels;
const _ = require("lodash")
const rp = require('request-promise')
const cipherService = require("../../services/aesCypher")
function MessageService() {
    BaseService.call(this);
}

MessageService.prototype.getMessages = async function(user) {
    let userModel = Model.getModel("users")
    return userModel.findOne({username: user.username})
        .then((userData) => {
            let messagesModel = Model.getModel("messages")
            return messagesModel.find({ users: {$in: [ userData._id ] }})
                .then((docs) => {
                    if(docs.length) {
                        return Promise.map(docs, (msgData) => {
                            let finalData = {}
                            finalData = {...finalData, ...msgData._doc}
                            console.log("1", finalData)
                            return Promise.mapSeries(Object.keys(finalData.messages),(key) => {
                                // let messages = []
                                console.log("2", key, finalData.messages[key])
                                return Promise.mapSeries(finalData.messages[key], async(msg) => {
                                    let encryptedMessage = await cipherService.encryptMessage(msg)
                                    // messages.push(encryptedMessage)
                                    return encryptedMessage
                                }).then((data) => {
                                    console.log("mess list", data)
                                    finalData.messages[key] = Array.from(data)
                                    return Promise.resolve(true)
                                })
                            }).then((fdata) => {
                                console.log("finalData", finalData)
                                return finalData;
                            })
                        }).then((dataArr) => {
                            console.log("dataarr", dataArr);
                            return dataArr
                        })
                    }
                    else {
                        return []
                    }
                })
        })
}

MessageService.prototype.getMessage = async function(msgId) {
    // let userModel = Model.getModel("users")
    // return userModel.findOne({username: user.username})
    //     .then((userData) => {
            let messagesModel = Model.getModel("messages")
            return messagesModel.findOne({ _id: msgId })
                .then((msgData) => {
                    let finalData = {}
                    finalData = {...finalData, ...msgData}
                    return Promise.mapSeries(Object.keys(finalData.messages),(key) => {
                        let messages = []
                        return Promise.mapSeries(finalData.messages[key], async(msg) => {
                            let encryptedMessage = await cipherService.encryptMessage(msg)
                            messages.push(encryptedMessage)
                        }).then((data) => {
                            finalData.messages[key] = Array.from(messages)
                            return Promise.resolve(true)
                        })
                    }).then((fdata) => {
                        console.log("finalData", finalData)
                        return finalData;
                    })
                })

        // })
}

MessageService.prototype.sendMessage = function(user, body) {
    let userModel = Model.getModel("users")
    return userModel.findOne({username: user.username})
        .then((user1) => {
            console.log("user1", user1);
            return userModel.findOne({_id: body.username})
                .then((user2) => {
                    console.log("user2", user2);
                    let messagesModel = Model.getModel("messages")
                    if(body.conversationId) {
                        return messagesModel.findOne({ _id: body.conversationId })
                        .then((msgData) => {
                            if(msgData) {
                                return cipherService.decryptMessage(body.message)
                                    .then((message) => {
                                        console.log("message", message)
                                        msgData.messages[user1._id].push(message)
                                        return messagesModel.update({ _id: msgData._id }, msgData, { new: true })
                                    })
                            }
                            else {
                                return cipherService.decryptMessage(body.message)
                                    .then((message) => {
                                        console.log("message", message)
                                        let doc = {
                                            users: [ user1._id, user2._id ],
                                            messages: {
                                                [user1._id]: [message],
                                                [user2._id]: []
                                            }
                                        }
                                        return messagesModel.create(doc)
                                    })
                            }
                        })
                    }
                    else {
                        return messagesModel.findOne({ users: { $all: [user1._id, user2._id] } })
                        .then((msgData) => {
                            if(msgData) {
                                return cipherService.decryptMessage(body.message)
                                    .then((message) => {
                                        console.log("message", message)
                                        msgData.messages[user1._id].push(message)
                                        return messagesModel.update({ _id: msgData._id }, msgData, { new: true })
                                    })
                            }
                            else {
                                return cipherService.decryptMessage(body.message)
                                    .then((message) => {
                                        console.log("message", message)
                                        let doc = {
                                            users: [ user1._id, user2._id ],
                                            messages: {
                                                [user1._id]: [message],
                                                [user2._id]: []
                                            }
                                        }
                                        return messagesModel.create(doc)
                                    })
                            }
                        })
                    }
                })
        })
}


module.exports = {
    getInst: function () {
        return new MessageService();
    }
};