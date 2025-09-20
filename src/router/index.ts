import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import Home from '../views/Margin.vue'
// import Page2 from '../views/Page2.vue'

// Use the correct type for the routes array
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  }
//   {
//     path: '/page2',
//     name: 'Page2',
//     component: Page2
//   }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router