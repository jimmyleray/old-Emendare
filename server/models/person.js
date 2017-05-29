var mongoose = require('mongoose');

var personSchema = mongoose.Schema({
	nom: {type: String,default: ""},
	photo: {type: String,default: ""},
	parti: {type: String,default: ""},
	score: {type: Number, default: 1000},
	mentions: {type: Array, default: [Number]}
});

module.exports = mongoose.model('Person', personSchema);