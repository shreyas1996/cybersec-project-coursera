var bootstrap = require('../bootstrap.js');
var config = require('../config');


bootstrap.init().then(() =>{
    const User = require("../db/models").getModel("users");
    console.log("config", config)
    var newUser = {
        username: "hellojioadmin",
        password: "A@wuv956Secr3t",
        emailId: "example@example.com"
    };
    // save the user
    User.create(newUser).then(() => {
        console.log({
            success: true,
            msg: 'Successfully created new user.'
        });
    }).catch(err => {
        console.log('err', err)
        
    }).then(() =>{
        process.exit();
    });
});