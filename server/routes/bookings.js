let express = require("express");
let router = express.Router();
let mongojs = require('mongojs');

let db = mongojs("mongodb://hinkeu:hinkeu@ds137256.mlab.com:37256/taxiappreactnative", ["bookings"]);


router.get("/bookings", function (req, res, next) {
    db.bookings.find(function (err, bookings) {
        if (err) {
            res.send(err);
        }
        res.json(bookings);

    })
});

router.post("/bookings", function(req, res, next){
    var booking = req.body.data;
    // var nearByDriver = req.body.nearByDriver;
    // var io = req.app.io;
    if(!booking.userName){
        res.status(400);
        res.json({
            error:"Bad data"
        });
    } else {
        db.bookings.save(booking, function(err, savedBooking){
            if(err){
                res.send(err);
            }
            res.json(savedBooking);
            // if(nearByDriver.socketId){
            //     io.emit(nearByDriver.socketId + "driverRequest", savedBooking);
            // }else{
            //     console.log("Driver not connected");
            // }
        });
    }
});

module.exports = router;