'use strict';



const message = {
    "_id": {
        type: String,
        trim: true
    },
    "users" :{
        type: Array,
        length: 2
    },
    "messages" :{
        type: Object
    },
    "mOn": {
        type: Date,
        default: Date.now
    }
};

module.exports = message;