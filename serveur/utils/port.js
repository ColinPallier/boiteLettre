var { SerialPort } = require("serialport");
require("dotenv").config({ path: "../.env" });

const port = new SerialPort({
  path: process.env.PATH_ARDUINO,
  baudRate: 9600,
});

module.exports = port;
