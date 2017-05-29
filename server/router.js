var express = require('express');
var router = express.Router();

// Chargement de la configuration
var config = require('../config');

// Chargement des modèles
//var Person = require('./models/person');

router.get('/', (req, res, next) => {

	// On passe des données utiles
	res.locals.req = req;
	res.locals.config = config;
	res.render('index');

});

module.exports = router;