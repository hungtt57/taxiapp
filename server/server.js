let express = require("express");
let path = require("path");
let bodyParser = require("body-parser");

let index = require("./routes/index");
let bookings = require('./routes/bookings');
let driverLocationSocket = require('./routes/driverLocation');
let driverLocation = require('./routes/driverLocation');

let app = express();

let port = 3000;

let socket_io  = require("socket.io");
var io = socket_io();



//
app.set("views",  path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("html",require("ejs").renderFile);

//body parse MW
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend:true}));

//Routes
app.use("/",index);
app.use("/api",bookings);
app.use("/api/",driverLocationSocket);
app.use("/api/",driverLocation);

io.listen(app.listen(port, function () {
    console.log('Server running on port : ',port);
}));
app.io = io.on("connection",function(socket) {
    console.log("SOCKET connected" + socket.id);
});