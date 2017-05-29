import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// Définition des routes
const routes = [
  { path: '/', name: 'home', component: require('./components/Home.vue') },
  { path: '/jouer', name: 'jeu', component: require('./components/Game.vue') },
  { path: '/classement', name: 'classement', component: require('./components/Classement.vue') }
];

// Création du router :
const router = new VueRouter({
	mode: 'hash',
	routes: routes
});

// Création de l'instance :
const app = new Vue({
  el: '#app',
  router: router,
  render: h => h(require('./components/App.vue'))
})
