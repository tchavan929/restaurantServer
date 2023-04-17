//var database = require('../config/database');
var mongoose = require('mongoose');
module.exports.initializemk = (connectionStirng) => {
    console.log(connectionStirng);
    console.log(__dirname);
    /*
    mongoose.connect(connectionStirng)
    .then( () => {
        console.log('Connected to the database ')
        var Movie = require('../models/movie');
		console.log("App listening on port : " + port);
		app.listen(port);
		//console.log( mongoose);
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. n${err}`);
		//app.off()
    })*/
}