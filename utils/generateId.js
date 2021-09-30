const uuidv4 = require('uuid').v4;


function createID(idprefix, namespace) {
    return idprefix + '-' + uuidv4();
}

function IDGeneratorFactory(_prefix) {
    return function (parentns) {
        return createID(_prefix, parentns);
    };
}

function initIDGenerators(_idmap, _idgen) {
    Object.keys(_idmap).forEach(function (type) {
        exports[type] = _idgen(_idmap[type]);
    });
}


var idmap = {
    User: 'u',
    UserHistory: 'uh',
    FAQ: 'f',
    features: 'features',
    Application: 'a',
    HelloJio: "hj",
    Progress: "p",
    trending: "t",
    Message: "m"
};

initIDGenerators(idmap, IDGeneratorFactory);