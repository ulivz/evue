import Vue from 'vue'
import App from './App.vue'
import simple from '../examples/simple.vue'

new Vue({
  el: '#app',
  render: h => h(simple)
})
