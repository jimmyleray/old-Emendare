<template>
	<div class="container">
		<div class="columns">
			<div class="column is-1"></div>
			<div class="column is-10">
				<div class="tile is-ancestor">
					<div class="tile is-parent is-6 is-hidden-mobile">
						<div class="tile is-child box">
							<div class="notification is-dark has-text-centered">
								<h1 class="title is-1">EMENDARE</h1>
								<h2 class="subtitle is-5">Le jeu démocratique et citoyen</h2>
							</div>
						</div>
					</div>
					<div class="tile is-parent is-6">
						<router-link :to="{ name: 'jeu' }" class="tile is-child box is-block">
							<div class="notification is-success has-text-centered">
								<span class="icon is-large"><i class="fa fa-play"></i></span>
								<h3 class="title is-4">Jouer</h3>
							</div>
						</router-link>
					</div>
				</div>
				<div class="tile is-ancestor">
					<div class="tile is-parent is-6">
						<a href="https://www.facebook.com/EmendareFR/" target="_blank" class="tile is-child box is-block">
							<div class="notification is-info has-text-centered">
								<span class="icon is-large"><i class="fa fa-facebook"></i></span>
								<h3 class="title is-4">Facebook</h3>
							</div>
						</a>
					</div>
					<div class="tile is-parent is-6">
						<router-link :to="{ name: 'classement' }" class="tile is-child box is-block">
							<div class="notification is-danger has-text-centered">
								<span class="icon is-large"><i class="fa fa-list"></i></span>
								<span class="icon is-large"><i class="fa fa-line-chart"></i></span>
								<h3 class="title is-4">Classement</h3>
							</div>
						</router-link>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

	export default {
		name: 'home'
	}

</script>