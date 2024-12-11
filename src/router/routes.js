// const routes = [
//   // {
//   //   path:'/',
//   //   component:()=>import('layouts/LoginLayout.vue'),
//   //   children:[
//   //     {path:'',component:()=>import('src/pages/AuthPage.vue')},
//   //   ]
//   // },
//   // {
//     {path: '/',
//     component: () => import('src/layouts/PlannerLayout.vue'),
//     children: [
//       { path: '/PlannerDashboard', component: () => import('src/pages/Planner_DashBoard.vue') },
//       { path: '/PlannerCreateNewRoutes', component: () => import('src/pages/Planner_create_new_routes.vue') },
//       { path: '/PlannerJourneyStats', component: () => import('src/pages/Planner_journey_stats.vue') },
//       { path: '/PlannerRoutesTrafficAnalysis', component: () => import('src/pages/Planner_RouteTraffic_Analysis.vue') },
//       { path: '/PlannerVehicleDetails', component: () => import('src/pages/Planner_vehicle_details.vue') },
//     ]
//   },

//   // Always leave this as last one,
//   // but you can also remove it
//   {
//     path: '/:catchAll(.*)*',
//     component: () => import('pages/ErrorNotFound.vue')
//   }
// ]

// export default routes


import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import('src/layouts/PlannerLayout.vue'),
    children: [
      { path: '', redirect: '/PlannerDashboard' },
      { path: 'PlannerDashboard', component: () => import('src/pages/Planner_DashBoard.vue') },
      { path: 'PlannerCreateNewRoutes', component: () => import('src/pages/Planner_create_new_routes.vue') },
      { path: 'PlannerJourneyStats', component: () => import('src/pages/Planner_journey_stats.vue') },
      { path: 'PlannerRoutesTrafficAnalysis', component: () => import('src/pages/Planner_RouteTraffic_Analysis.vue') },
      { path: 'PlannerVehicleDetails', component: () => import('src/pages/Planner_vehicle_details.vue') },
    ]
  },
  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/AuthPage.vue') },
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard
router.beforeEach((to, from, next) => {
  if (to.path !== '/login' && !isLoggedIn()) {
    // If not logged in and trying to access a restricted page, redirect to login
    next('/login');
  } else if (to.path === '/login' && isLoggedIn()) {
    // If logged in and trying to access login page, redirect to planner dashboard
    next('/PlannerDashboard');
  } else {
    // Otherwise, proceed to the route
    next();
  }
});

export default router;
