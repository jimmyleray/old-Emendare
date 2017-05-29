var mongoose = require('mongoose');

var profilSchema = mongoose.Schema({
	cards_historic: {type: Array, default: []}
});

module.exports = mongoose.model('Profil', profilSchema);