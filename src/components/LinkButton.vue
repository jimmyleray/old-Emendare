<template>
	<router-link :to="{ name: routeLink }" class="button" v-bind:class="{ centered: isCentered }">
		<slot></slot>
	</router-link>
</template>

<script>

	export default {
		name: 'LinkButton',
		data: function(){
			return {

			};
		},
		props: {
			isCentered: { type: Boolean, default: false },
			routeLink : { type: String, default: 'home' }
		}
	}

</script>

<style lang="scss" scoped>
	.centered{
		margin: auto;
	}
</style>