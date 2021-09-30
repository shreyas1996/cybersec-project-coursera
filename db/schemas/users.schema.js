'use strict';



const user = {
    "_id": {
        type: String,
        trim: true
    },
    "hash": {
        type: String,
        required: true
    },
    "username": {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 20,
        index: true,
        unique: true
    },
    "emailId": {
        type: String,
        required: true,
        unique: true
    },
    "mOn": {
        type: Date,
        default: Date.now
    }
};

module.exports = user;