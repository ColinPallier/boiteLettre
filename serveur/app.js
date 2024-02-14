var createError = require("http-errors");
var express = require("express");
var http = require("http"); // Import the http module
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var { ReadlineParser } = require("serialport");
var db = require("./utils/db");
var port = require("./utils/port");
var cors = require("cors");
var socketIo = require("socket.io");
var indexRouter = require("./routes/index");

const app = express();
const server = http.createServer(app);

const io = socketIo(server);

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", indexRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

const parser = new ReadlineParser();
port.pipe(parser);

parser.on("data", async (msg) => {
  try {
    var statut = JSON.parse(msg).ouverture ? "ouvert" : "ferme";
    console.log(statut);
    await db.query("INSERT INTO mesures ( statut ) VALUES ( $1 );", [statut]);

    io.emit("statut", statut);
  } catch (error) {
    console.log(error);
  }
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

server.listen(9000, () => {
  console.log("Server listening on port 9000");
});

module.exports = app;
