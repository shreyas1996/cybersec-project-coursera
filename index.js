const cluster = require('cluster');
const numCPUs = process.env.WORKERS || 1;
var bootstrap = require('./bootstrap.js');
var config = require('./config');
var express = require("express");
var app = express();

var cors = require("cors");
var morgan = require("morgan");
var bodyParser = require('body-parser');
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

app.get("/", function(req, res){
    res.status(200).send( JSON.stringify({t: new Date().getTime()}))
})

app.use(morgan('combined', {
    skip: function(req, res) {
        return res.statusCode < 400;
    }
}));
if (process.env.NODE_ENV !== "production") {
     app.use(cors({ origin: "*" }));
}

function init() {

    bootstrap.init(config).then(() => {
        var api = require("./api")
        api.init(app);
        app.listen(process.env.API_PORT || 3000, function(err) {
            if (err) {
                console.log('Error in starting api server:', err);
            }

            console.log("api server listening on", process.env.API_PORT || 3000);
        });
    });
}
if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker) => {
        console.log(`worker ${worker.process.pid} died`);
        cluster.fork();
    });
} else {
    init()
}