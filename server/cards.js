// Chargement des modèles
var Profil = require('./models/profil');
var Person = require('./models/person');

var Cards = {

	// Carte de bienvenue
	bienvenue: {
		nom: "bienvenue",
		display: "large",
		question: (socket, callback) => {
			callback("Bienvenue sur Emendare.fr, prêt pour donner votre avis ?");
		},
		reponses: (socket, callback) => {
			callback([
				{nom:"Oui je suis là pour ça voyons !", color:"is-success"}
			]);
		},
		strategies: (res, io, socket, callback) => {
			if(Math.random() > 0.5){
				callback('opposition_directe');
			}else{
				callback('mentions_perso');
			}
		}
	},

	// Carte des profils
	profils: {
		nom: "profils",
		display: "slim",
		question: (socket, callback) => {
			callback("Quel profil souhaitez vous utiliser ?");
		},
		reponses: (socket, callback) => {
			var reponses = [];
			if(socket.profils != null){
				for (var i = 0; i < socket.profils.length; i++) {
					var idx = i+1;
					var nom = '#' + idx + ' : ' + socket.profils[i];
					reponses.push({nom: nom, color:"is-success"});
				}
				reponses.push({nom:"Créer un nouveau profil anonyme"});
			}else{
				reponses.push({nom:"Créer un nouveau profil anonyme", color:"is-success"});
			}
			callback(reponses);
		},
		strategies: (res, io, socket, callback) => {
			if(res == socket.current_card.reponses.length - 1){
				Profil.create({}, function(err, doc){
					if(err){throw err;}
					socket.profil = {_id: doc._id};
					socket.cards_historic = [];
					callback('send_profil');
				});
			}else{
				var profil_id = socket.current_card.reponses[res].nom.split(': ')[1];
				Profil.findOne({_id:profil_id}, (err, profil) => {
					if(err){throw err;}
					socket.profil = profil;
					socket.cards_historic = profil.cards_historic;
					callback('send_profil');
				});
			}
		}
	},

	// Carte pour envoyer l'id du profil
	send_profil: {
		nom: "send_profil",
		display: "slim",
		question: (socket, callback) => {
			callback("Votre identifiant anonyme est : <b>" + socket.profil._id + "</b>");
		},
		reponses: (socket, callback) => {
			callback([
				{nom: "Ok, c'est parti !", color:"is-success"}
			]);
		},
		strategies: (res, io, socket, callback) => {
			if(Math.random() > 0.5){
				callback('opposition_directe');
			}else{
				callback('mentions_perso');
			}
		}
	},

	// Carte de retour à l'accueil
	retour_accueil: {
		nom: "retour_accueil",
		display: "large",
		question: (socket, callback) => {
			callback("Ah zut, dommage ! À bientôt peut-être ?");
		},
		reponses: (socket, callback) => {
			callback([{nom:"Peut-être", color:""}]);
		},
		strategies: (res, io, socket, callback) => {
			callback('sortie');
		}
	},

	// Opposition directe entre deux
	// personnalités prises au hasard
	opposition_directe: {
		nom: "opposition_directe",
		display: "large",
		question: (socket, callback) => {
			callback("Laquelle de ces personnalités vous représente le mieux ?");
		},
		reponses: (socket, callback) => {
			Person.find().sort('-score').select('nom photo score parti -_id').exec((err, persons) => {
				if(err){throw err;}

				// Si la carte précédente était aussi une opposition directe
				if(socket.cards_historic[socket.cards_historic.length-1].nom == "opposition_directe"){
					// On sauvegarde les deux personnalités proposées précédemment
					pre_person1 = socket.cards_historic[socket.cards_historic.length-1].reponses[0];
					pre_person2 = socket.cards_historic[socket.cards_historic.length-1].reponses[1];
				}else{
					pre_person1 = {nom:null};
					pre_person2 = {nom:null};
				}

				var score_total = 0;
				for (var i = 0; i < persons.length; i++){
					score_total = score_total + persons[i].score;
				}
				// On tire au hasard le premier nombre représentant la première carte
				do {
					var rand1 = Math.random()*score_total;
					var selector1 = persons[0].score;
					var compteur1 = 1;
					while(selector1 < rand1){
						selector1 = selector1 + persons[compteur1].score;
						compteur1++;
					}
					var person1 = persons[compteur1-1];
				} while ((person1.nom == pre_person1.nom)||(person1.nom == pre_person2.nom));

				// On tire au hasard le deuxième nombre représentant la deuxième carte
				do {
					var rand2 = Math.random()*score_total;
					var selector2 = persons[0].score;
					var compteur2 = 1;
					while(selector2 < rand2){
						selector2 = selector2 + persons[compteur2].score;
						compteur2++;
					}
					var person2 = persons[compteur2-1];
				} while ((person2.nom == person1.nom)||(person2.nom == pre_person1.nom)||(person2.nom == pre_person2.nom));

				callback([person1, person2, {nom:"Aucun(e) des deux", color:""}]);
			});
		},
		strategies: (res, io, socket, callback) => {
			Person.findOne({nom:socket.current_card.reponses[0].nom}, (err, person1) => {
				if(err){throw err;}
				Person.findOne({nom:socket.current_card.reponses[1].nom}, (err, person2) => {
					if(err){throw err;}
					// si result vaut 0 c'est person 1 qui a gagne, sinon c'est person 2 :
					var diff = person1.score-person2.score;
					if(res == 0){
						person1.score = person1.score + 15*(1 - (1/(1+Math.pow(10,-diff/400))));
						person2.score = person2.score + 15*(0 - (1/(1+Math.pow(10,diff/400))));
					}else if(res == 1){
						person1.score = person1.score + 15*(0 - (1/(1+Math.pow(10,-diff/400))));
						person2.score = person2.score + 15*(1 - (1/(1+Math.pow(10,diff/400))));
					}

					// Sauvegarde des nouveaux scores :
					person1.save((err) => {
						if(err){throw err;}
						person2.save((err) => {
							if(err){throw err;}
							
							// Envoi du nouveau classement aux utilisateurs :
							Person.find().sort('-score').select('nom photo mentions score -_id').exec(function(err, persons){
								if(err){throw err;}
								io.emit('classement', persons);
								if(Math.random() > 0.5){
									callback('opposition_directe');
								}else{
									callback('mentions_perso');
								}
							});
						});
					});
				});
			});
		}
	},

	// Carte de mention pour les personnalites
	mentions_perso: {
		nom: "mentions_perso",
		display: "slim",
		question: (socket, callback) => {
			Person.find().sort('-score').select('nom score -_id').exec((err, persons) => {
				if(err){throw err;}

				var score_total = 0;
				for (var i = 0; i < persons.length; i++){
					score_total = score_total + persons[i].score;
				}
				// On tire au hasard la personnalité :
				var rand = Math.random()*score_total;
				var selector = persons[0].score;
				var compteur = 1;
				while(selector < rand){
					selector = selector + persons[compteur].score;
					compteur++;
				}
				var person = persons[compteur-1];
				callback("Comment évaluez-vous l'action politique de <b>" + person.nom + "</b> ?");
			});
		},
		reponses: (socket, callback) => {
			callback([
				{nom:"Bien / Satisfaisante", color:"is-success"},
				{nom:"Assez bien / Correcte", color:"is-info"},
				{nom:"Passable / Moyenne", color:"is-dark"},
				{nom:"Insuffisante / Mauvaise", color:"is-warning"},
				{nom:"À rejeter / Nulle", color:"is-danger"},
				{nom:"Je ne la connais pas", color:""}
			]);
		},
		strategies: (res, io, socket, callback) => {
			Person.findOne({nom:socket.current_card.question.split('<b>')[1].split('</b>')[0]}, (err, person) => {
				if(err){throw err;}
				if(person.mentions.length == 0){ person.mentions = [0,0,0,0,0,0]; }
				person.mentions[res] += 1;
				person.markModified('mentions');
				person.save((err) => {
					if(err){throw err;}
					// Envoi du nouveau classement aux utilisateurs :
					Person.find().sort('-score').select('nom photo mentions score -_id').exec(function(err, persons){
						if(err){throw err;}
						io.emit('classement', persons);
						if(Math.random() > 0.5){
							callback('opposition_directe');
						}else{
							callback('mentions_perso');
						}
					});
				});
			});
		}
	}

};

module.exports = Cards;