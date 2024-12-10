const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/PlannerDashboard', component: () => import('src/pages/Planner_DashBoard.vue') },
      { path: '/PlannerCreateNewRoutes', component: () => import('src/pages/Planner_create_new_routes.vue') },
      { path: '/PlannerJourneyStats', component: () => import('src/pages/Planner_journey_stats.vue') },
      { path: '/PlannerRoutesTrafficAnalysis', component: () => import('src/pages/Planner_RouteTraffic_Analysis.vue') },
      { path: '/PlannerVehicleDetails', component: () => import('src/pages/Planner_vehicle_details.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
