var mongoose = require('mongoose');
var Schema = mongoose.Schema;
RestaurantSchema = new Schema({
    restaurant_id:String,
    restaurant_name:String,
});
module.exports = mongoose.model('Restaurant', RestaurantSchema);