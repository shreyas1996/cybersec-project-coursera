const Promise = require('bluebird');
const csv = require('csvtojson');
var Model = appGlobals.dbModels;
module.exports = function (filePath, lang, user) {

    return csv({
        noheader: true
    })
        .fromFile(filePath)
        .then((jsonObj) => {
            let model = Model.getModel("trendings");
            jsonObj.splice(0, 2);
            return model.remove({ lang: lang })
                .then(() => {
                    var keys = [];
                    for (let k in jsonObj[0]) {
                        keys.push(k);
                    }
                    if(keys.length === 8)
                return Promise.map(jsonObj, (data) => {
                    return model.create({
                        _id: data.field1,
                        qid: data.field1,
                        q: data.field2,
                        keywords: data.field4,
                        serviceType: data.field3,
                        user: user,
                        lang: lang,
                        extraInfo: [{
                            //actionType: data.field3,
                            //actionTag: data.field4,
                            deepLinkIdentifier: data.field5,
                            actionWebURL: data.field6,
                            type: "android"
                        }, {
                            //actionType: data.field7,
                            //actionTag: data.field8,
                            deepLinkIdentifier: data.field7,
                            actionWebURL: data.field8,
                            type: "ios"
                        }]
                    })
                }, {concurrency: 10})
                    else
                        return Promise.reject(new Error('Wrong File Uploaded'))
                })
        })
}