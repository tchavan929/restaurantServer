var mongoose = require('mongoose');
var Schema = mongoose.Schema;
RestaurantMenuSchema = new Schema({
    restaurant_id:String,
    menu_id:String,
    cusine:String,
    name:String,
    price:String,
    desc:String
});
module.exports = mongoose.model('RestaurantMenu', RestaurantMenuSchema);