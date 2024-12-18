const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/app.log' }), // Save logs to file
    // new winston.transports.Console(), // Output logs to console
  ],
});

module.exports = logger;
