import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import TeamView from '@/components/Team'
import Trials from '@/components/Trials'
import Login from '@/components/Login'
import ScoutingForm from '@/components/ScoutingForm'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/list',
      name: 'Team List',
      component: Hello,
      props: true
    },
    {
      path: '/team',
      name: 'Team',
      component: TeamView,
      props: true
    },
    {
      path: '/scouting',
      name: 'Scouting Form',
      component: ScoutingForm,
      props: true
    },
    {
      path: '/trials',
      name: 'Trials',
      component: Trials
    }
  ]
})
