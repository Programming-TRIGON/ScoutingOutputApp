import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import TeamView from '@/components/Team'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path:'/team',
      name:'Team',
      component: TeamView,
      props:true
    }
  ]
})
