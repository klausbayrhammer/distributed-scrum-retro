var mongoose = require('mongoose');
mongoose.connect('mongodb://192.168.99.100/retro');

const Card = mongoose.model('Card', { title: String, category: String, board:String });

module.exports = mongoose;