const Promise = require("bluebird")
const csv = require('csvtojson')
var Model = appGlobals.dbModels;
var modelName = 'applications'
// var alert = require('alert-node');

module.exports = function (p, lang, user) {
    return Promise.resolve().then(() => {
            return csv({
                    noheader: true
                })
                .fromFile(p)
        })
        .then((jsonObj) => {
            let applicationModel = Model.getModel(modelName)
            return applicationModel.remove({
                lang: lang
            }).then(() => {
                jsonObj.splice(0, 1)
                
                if(Object.keys(jsonObj[0]).length === 10)
                return Promise.map(jsonObj, (obj) => {

                    return applicationModel.create({
                        _id: obj.field1,
                        qid: obj.field1,
                        q: obj.field2,
                        user: user.username,
                        lang: lang,
                        keywords: obj.field3,
                        extraInfo: [{
                                packageName: obj.field5,
                                deepLink: obj.field6,
                                iconUrl: obj.field4,
                                type: 'android'
                            },
                            {
                                packageName: obj.field9,
                                deepLink: obj.field10,
                                iconUrl: obj.field7,
                                iconAsset: obj.field8,
                                type: 'ios'
                            }
                        ]
                    })
                }, {concurrency: 10})
                else
                    return Promise.reject(new Error('Wrong File Uploaded'))
            })

        })
}