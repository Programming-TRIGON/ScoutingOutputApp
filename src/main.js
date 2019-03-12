// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import VueFire from 'vuefire'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
Vue.use(VueFire)
firebase.initializeApp({
  apiKey: 'AIzaSyBWtKMnLKY_gTQ_cq_YKXIIk1KZc_kwgjg',
  authDomain: 'trigonscouting.firebaseapp.com',
  projectId: 'trigonscouting',
  databaseURL: 'https://trigonscouting.firebaseio.com'
})


export const db = firebase.firestore()

db.enablePersistence()
  .catch(function (err) {
    if (err.code == 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a a time.
      // ...
      console.log('Multiple tabs open, offline failed')
    } else if (err.code == 'unimplemented') {
      // The current browser does not support all of the
      // features required to enable persistence
      // ...
      console.log('Incompatible browser, offline failed')
    }
  });

import {MdMenu,MdButton, MdContent, MdTabs, MdCard, MdField, MdTable, MdRipple, MdToolbar, MdDialog, MdList, MdCheckbox, MdSubheader, MdDivider, MdRadio, MdSwitch, MdSnackbar, MdIcon, MdSteppers } from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

Vue.use(MdButton)
Vue.use(MdContent)
Vue.use(MdTabs)
Vue.use(MdCard)
Vue.use(MdField)
Vue.use(MdTable)
Vue.use(MdRipple)
Vue.use(MdToolbar)
Vue.use(MdDialog)
Vue.use(MdList)
Vue.use(MdCheckbox)
Vue.use(MdSubheader)
Vue.use(MdDivider)
Vue.use(MdRadio)
Vue.use(MdSwitch)
Vue.use(MdSnackbar)
Vue.use(MdIcon)
Vue.use(MdSteppers)
Vue.use(MdMenu)



Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
