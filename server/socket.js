// Chargement des cartes de jeu
var Cards = require('./cards');

// Chargement des modèles
var Person = require('./models/person');
var Profil = require('./models/profil');

// Fonction pour cloner un objet :
function clone(srcInstance){
	/*Si l'instance source n'est pas un objet ou qu'elle ne vaut rien c'est une feuille donc on la retourne*/
	if(typeof(srcInstance) != 'object' || srcInstance == null)
	{
		return srcInstance;
	}
	/*On appel le constructeur de l'instance source pour crée une nouvelle instance de la même classe*/
	var newInstance = srcInstance.constructor();
	/*On parcourt les propriétés de l'objet et on les recopies dans la nouvelle instance*/
	for(var i in srcInstance)
	{
		newInstance[i] = clone(srcInstance[i]);
	}
	/*On retourne la nouvelle instance*/
	return newInstance;
}

// Fonction pour sauvegarder le profil :
function saveProfil(socket, callback){
	callback();
	/*
	if(socket.profil){
		Profil.findOne({_id:socket.profil._id}, (err, profil) => {
			if(err){throw err;}
			profil.cards_historic = socket.cards_historic;
			profil.save((err) => {
			if(err){throw err;}
				callback();
			})
			
		});
	}
	*/
}

// Ensemble des règles de Socket.io côté serveur
module.exports = (io) => {

	// Si un utilisateur se connecte
	io.on('connection', (socket) => {

		socket.on('get_classement', () => {
			Person.find().sort('-score').select('nom photo score mentions -_id').exec(function(err, persons){
				if(err){throw err;}
				socket.emit('classement', persons);
			});
		});

		socket.on('launch_game', (profils) => {
			socket.cards_historic = [];
			socket.profils = profils;
			socket.current_card = clone(Cards.profils);
			var card = { nom: socket.current_card.nom, display: socket.current_card.display };
			socket.current_card.question(socket, (question) => {
				socket.current_card.question = question;
				card.question = question;
				socket.current_card.reponses(socket, (reponses) => {
					socket.current_card.reponses = reponses;
					card.reponses = reponses;
					socket.emit('card', card);
				});
			});
		});

		socket.on('send_reponse', (res) => {
			socket.current_card.resultat = res;
			socket.cards_historic.push(socket.current_card);
			socket.current_card.strategies(res, io, socket, (next_card) => {
				saveProfil(socket, () => {
					socket.current_card = eval('clone(Cards.' + next_card + ')');
					var card = { nom: socket.current_card.nom, display: socket.current_card.display };
					socket.current_card.question(socket, (question) => {
						socket.current_card.question = question;
						card.question = question;
						socket.current_card.reponses(socket, (reponses) => {
							socket.current_card.reponses = reponses;
							card.reponses = reponses;
							socket.emit('card', card);
						});
					});
				});
			});
		});

		// Si un utilisateur se déconnecte
		socket.once('disconnect', () => {});
	});
}