<template>
	<div id="app" class="hero is-fullheight">
		<div class="hero-body">
			<transition name="fade" mode="out-in">
				<router-view></router-view>
			</transition>
		</div>
	</div>
</template>

<script>

	export default {
		name: 'app',
		data () {
			return {
				msg: 'Welcome to Your Vue.js App'
			}
		}
	}
	
</script>

<style>

	/* Si l'affichage est en portrait on désactive l'affichage */
	@media screen and (max-width: 768px) and (orientation: landscape){
		#app{
			display:none;
		}
	}

	/* Classes pour la transition entre les pages */
	.fade-enter-active, .fade-leave-active {
		transition: opacity .5s
	}
	.fade-enter, .fade-leave-active {
		opacity: 0
	}

	.hero .notification{
		padding:30px;
		height:100%;
	}
	.hero .box{
		padding:0px;
	}

</style>