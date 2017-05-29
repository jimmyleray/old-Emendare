<template>
	<div id="classement_container" class="container">
		<div class="columns">
			<div class="column is-4"></div>
			<div class="column is-4">
				<div id="fiches_person" class="tile is-ancestor is-vertical">
					<div class="tile is-parent">
						<link-button :is-centered="true">Retour au menu principal</link-button>
					</div>
					<div v-if="index == selected" v-for="(person, index) in classement" class="tile is-parent">
						<div class="tile is-child box">
							<div class="notification is-light has-text-centered">
								<figure class="image is-2by1">
									<img :src="'/img/' + person.photo + '.jpg'" alt="" width=300 height=150>
								</figure>
								<h3 class="title is-5" style="margin: 9px 0px 3px 0px;">#{{index + 1}} - {{person.nom}}</h3>
								<span>Score : {{Math.floor(person.score)}} - 
								Notorieté : {{Math.floor(100*person.total_exp/person.total)}}%</span>
								<div style="position:relative;height:12px;margin:4px;">
									<progress class="progress is-danger" value="100" max="100"></progress>
									<progress class="progress is-warning" :value="person.valueW" max="100"></progress>
									<progress class="progress" :value="person.valueD" max="100"></progress>
									<progress class="progress is-info" :value="person.valueI" max="100"></progress>
									<progress class="progress is-success" :value="person.valueS" max="100"></progress>
								</div>
							</div>
						</div>
					</div>
					<div class="tile is-parent">
						<div id="classement_person" class="tile is-child has-text-centered">
							<table class="table">
								<thead>
									<tr>
										<th>#</th>
										<th>Personnalité</th>
										<th>Score</th>
									</tr>
								</thead>
								<tbody>
									<tr @click="select_person(index)" v-for="(person, index) in classement" v-bind:class="{ active: index == selected }">
										<td>{{index + 1}}</td>
										<td>{{person.nom}}</td>
										<td>{{ Math.floor(person.score)}}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

	import LinkButton from './LinkButton.vue'

	export default {
		name: 'classement',
		data: function(){
			return {
				classement: {},
				selected: 0
			};
		},
		components: {
			LinkButton
		},
		mounted: function(){
			socket.on('classement', (res) => {
				// On rajoute l'index dans les données et on arrondit les scores :
				for (var i = 0; i < res.length; i++){
					if(i%4 == 0){ res[i].sep = true; if(i!=0){res[i].init = true;} }

					res[i].m = res[i].mentions;
					// Protection pour éviter les erreurs dues aux nouveaux candidats :
					if(res[i].m.length == 0){ res[i].m = [0,0,0,0,0,0]; }

					// Calcul du nombre de votes exprimés et total :
					res[i].total_exp = res[i].m[0] + res[i].m[1] + res[i].m[2] + res[i].m[3] + res[i].m[4];
					res[i].total = res[i].total_exp + res[i].m[5];
					res[i].valueW = Math.floor(100*(res[i].m[0]+res[i].m[1]+res[i].m[2]+res[i].m[3])/res[i].total_exp);
					res[i].valueD = Math.floor(100*(res[i].m[0]+res[i].m[1]+res[i].m[2])/res[i].total_exp);
					res[i].valueI = Math.floor(100*(res[i].m[0]+res[i].m[1])/res[i].total_exp);
					res[i].valueS = Math.floor(100*res[i].m[0]/res[i].total_exp);
				}
				this.classement = res;
			});
			socket.emit('get_classement');
		},
		methods: {
			select_person(index){
				this.selected = index;
			}
		}
	}

</script>

<style lang="scss" scoped>

	tr.active{
		background-color: #f5f5f5;
	}

	#fiches_person{
		.notification{padding: 4px;}
		progress{position: absolute;}
		progress[value]::-webkit-progress-bar{background-color: transparent;}
	}

</style>