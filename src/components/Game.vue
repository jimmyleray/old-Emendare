<template>
	<div class="container">
		<div class="tile is-ancestor is-vertical">
			<div class="tile is-parent">
				<div class="tile is-child has-text-centered">
					<div id="game" class="is-inline-block has-text-centered">
						<transition name="fade" mode="out-in">
							<div v-if="card_visible">
								<p v-html="card.question" style="line-height:normal;" class="title is-4"></p>
								<div v-for="(reponse, index) in card.reponses" @click="send_reponse(index)" v-bind:class="reponse.color" class="notification is-inline-block">
									<div>{{reponse.nom}}</div>
									<figure v-if="reponse.photo" class="image is-2by1">
										<img :src="'/img/' + reponse.photo + '.jpg'" :alt='reponse.photo'>
									</figure>
								</div>
							</div>
						</transition>
					</div>
				</div>
			</div>
			<div class="tile is-parent">
				<link-button :is-centered="true">Retour au menu principal</link-button>
			</div>
		</div>
	</div>
</template>

<script>

	import LinkButton from './LinkButton.vue'

	export default {
		name: 'game',
		data: function(){
			return {
				card: {},
				card_visible: false
			};
		},
		components: {
			LinkButton
		},
		mounted: function(){
			socket.on('card', (res) => {
				this.card_visible = false;

				if(res.nom == 'send_profil'){
					var profil_id = res.question.split('<b>')[1].split('</b>')[0];
					var profils = JSON.parse(localStorage.getItem('profils'));
					if(profils == null){ profils = []; }
					if(profils.indexOf(profil_id) == -1){ profils.push(profil_id); }
					localStorage.setItem("profils", JSON.stringify(profils));
				}

				setTimeout(() => {
					if(res.display == 'slim'){
						$('#game').css('max-width', '440px');
					}else{
						$('#game').css('max-width', '960px');
					}
					this.card = res;
					this.card_visible = true;
				}, 500);
			});

			// Lancement du jeu :
			if(typeof localStorage!='undefined'){
				// Si localStorage est défini, on récupère les id des profils existants :
				var profils = JSON.parse(localStorage.getItem('profils'));
				socket.emit('launch_game', profils);
			}else{
				socket.emit('launch_game', null);
			}
		},
		methods: {
			send_reponse: function(res){
				socket.emit('send_reponse', res);
			}
		}
	}

</script>

<style lang="scss" scoped>

	.notification{
		cursor:pointer;
		max-width:306px;
		width:100%;
		margin-bottom:10px;
		padding:3px;
		height:auto;

		&:hover{transform:scale(1.01);}
		&>div{padding:8px;}
	}

</style>