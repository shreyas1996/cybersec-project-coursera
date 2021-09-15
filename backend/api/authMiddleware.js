let jwt = require('jsonwebtoken');
const Promise = require("bluebird");
const Model = appGlobals.dbModels;

const User = Model.getModel("users");
const Message = Model.getModel("messages");
const passport = new require('passport'),
    BearerStrategy = new require('passport-http-bearer').Strategy;
    LocalStrategy = require('passport-local').Strategy;
Promise.promisifyAll(jwt)
const NodeRSA = require('node-rsa');
const fs = require("fs")
const path = require("path")
const key = new NodeRSA(fs.readFileSync(path.join(__dirname, "../config/jwtencryptionkey.pem")).toString());
key.setOptions({encryptionScheme: 'pkcs1'});

function signup(req, res, next) {
    if (!req.body.username || !req.body.password) {
        res.json({
            success: false,
            msg: 'Please pass username and password.'
        });
    } else {
        User.findOne({username: req.body.username.toLowerCase()})
            .then((userData) => {
                if(userData) {
                    res.status(422).json({
                        success: false,
                        msg: 'User already exists! Please try a different username'
                    });
                }
                else {
                    var newUser = {
                        username: req.body.username.toLowerCase(),
                        password: req.body.password,
                        emailId: req.body.emailId
                    };
                    // save the user
                    User.create(newUser).then(() => {
                        res.json({
                            success: true,
                            msg: 'Successfully created new user.'
                        });
                    }).catch(err => {
                        console.log('err', err)
                        if (err) {
                            return res.json({
                                success: false,
                                msg: err.msg || err.errmsg
                            });
                        }
                    });
                }
            }).catch(err => {
                console.log('err', err)
                if (err) {
                    return res.json({
                        success: false,
                        msg: err.msg || err.errmsg
                    });
                }
            });
        }
}

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findAndCheck(username, password)
            .then(user => {
                console.log("USER", user)
                let token = jwt.sign({
                    username: username
                }, config.get("auth.jwt.secret"), {
                    expiresIn: config.get("auth.jwt.expiresIn")
                })
                return done(null, {
                    token: token,
                    user: user._id
                });
            })
            .catch(e => {
                console.log(e);
                done(null, {
                    token: false,
                })
            })
    }
));

function dumpDbData(req, res, next) {
    Message.find({})
        .then((docs) => {
            if(docs.length) {
                let dumpData = []
                docs.forEach(doc => {
                    Object.keys(doc.messages).forEach((key) => {
                        dumpData = dumpData.concat(doc.messages[key])
                    })
                });
                console.log("dumpdata", dumpData);
                res.json({
                    dbDumpData: dumpData
                })
            }
            else {
                res.json({
                    dbDumpData: []
                })
            }
        })
}

passport.use("api-bearer", new BearerStrategy(
    function(token, done) {
        console.log("token", token)
        if(config.get("auth.jwt.encryption_enabled")){
            try{
                token = key.decrypt(token.replace(/\\n/g,"\n")).toString()
                console.log("token", token)
            }
            catch(e){
                console.error(e);
                return done(null, false)
            }
        }
        jwt.verifyAsync(token, config.get("auth.jwt.secret")).then((decoded) => {
            decoded.username = decoded.username.trim();

            done(null, decoded)
        }).catch(e => {
            console.info(e);
            done(null, false);
        });
    }
));

module.exports.init = function(app) {
    app.post("/signup", signup);
    app.get("/dbdump", dumpDbData);
    app.post("/login", passport.authenticate("local", {
        session: false
    }), function(req, res, next) {
        res.send(req.user)
    })
    app.use("/", passport.authenticate("api-bearer", {
        session: false,
        authenticate: true
    }))
};
