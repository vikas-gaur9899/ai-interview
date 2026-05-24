import winston from "winston";

const logger = winston.createLogger({

  transports: [

    new winston.transports.Console(),

    new winston.transports.File({

      filename: "logs/error.log"

    })

  ]

});

export default logger;