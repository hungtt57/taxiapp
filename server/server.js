let express = require("express");
let path = require("path");
let bodyParser = require("body-parser");

let index = require("./routes/index");
let bookings = require('./routes/bookings');

let app = express();

let port = 3000;
app.listen(port, function () {
   console.log('Server running on port : ',port);
});
//
app.set("views",  path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("html",require("ejs").renderFile);

//body parse MW
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend:true}));

// app.use(function (req, res, next) {
//
//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', '*');
//
//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//
//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//
//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);
//
//     // Pass to next layer of middleware
//     next();
// });
//Routes
app.use("/",index);
app.use("/api",bookings);
