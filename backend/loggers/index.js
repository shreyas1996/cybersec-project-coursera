const os = require("os");
const DailyRotateFile = require('winston-daily-rotate-file');
const winston = require('winston');
const path = require('path');
const config = require("../config");

const {format} = winston;
const loggers = config.get("loggers")


module.exports.accessLogger = winston.createLogger({
    transports: [
        new (DailyRotateFile)({
            filename: path.join((loggers.access.log_dir || "/tmp/" ), os.hostname(), loggers.access.name),
            format: format.combine(
                format.timestamp(),
                format.printf(i => `${i.timestamp}, ${i.message}`)
            ),  
            json: false
        })  
    ]   
})
