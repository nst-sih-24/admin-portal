<template>
  <q-page class="q-pa-md">
    <div class="q-gutter-md">

      <!-- Top Metrics Section -->
      <div class="row q-col-gutter-md">
        <!-- Total Users -->
        <q-card class="col-3">
          <q-card-section>
            <div class="text-h6">Total Users</div>
            <div class="text-h4">{{ stats.totalUsers }}</div>
          </q-card-section>
        </q-card>

        <!-- Active Vehicles -->
        <q-card class="col-3">
          <q-card-section>
            <div class="text-h6">Active Vehicles</div>
            <div class="text-h4">{{ stats.activeVehicles }}</div>
          </q-card-section>
        </q-card>

        <!-- Total Trips -->
        <q-card class="col-3">
          <q-card-section>
            <div class="text-h6">Total Trips</div>
            <div class="text-h4">{{ stats.totalTrips }}</div>
          </q-card-section>
        </q-card>

        <!-- Tickets Sold Today -->
        <q-card class="col-3">
          <q-card-section>
            <div class="text-h6">Tickets Sold Today</div>
            <div class="text-h4">{{ stats.ticketsSoldToday }}</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Revenue Today -->
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-h6">Revenue Today</div>
          <div class="text-h4">₹{{ stats.revenueToday }}</div>
        </q-card-section>
      </q-card>

      <!-- Charts Section -->
      <div class="row q-col-gutter-md">
        <!-- Trips Overview - Line Chart -->
        <q-card class="col-6">
          <q-card-section>
            <div class="text-h6">Trips Overview (Monthly)</div>
            <!-- <canvas ref="tripsOverviewChart" class="chart-canvas"></canvas> -->
          </q-card-section>
        </q-card>

        <!-- Tickets Sales - Bar Chart -->
        <q-card class="col-6">
          <q-card-section>
            <div class="text-h6">Tickets Sales (Weekly)</div>
            <!-- <canvas ref="ticketsSalesChart" class="chart-canvas"></canvas> -->
          </q-card-section>
        </q-card>

        <!-- Monthly Revenue - Pie Chart -->
        <q-card class="col-6">
          <q-card-section>
            <div class="text-h6">Monthly Revenue Distribution</div>
            <!-- <canvas ref="monthlyRevenueChart" class="chart-canvas"></canvas> -->
          </q-card-section>
        </q-card>

        <!-- User Distribution by Type - Doughnut Chart -->
        <q-card class="col-6">
          <q-card-section>
            <div class="text-h6">User Distribution by Type</div>
            <!-- <canvas ref="userDistributionChart" class="chart-canvas"></canvas> -->
          </q-card-section>
        </q-card>

        <!-- Vehicle Utilization - Bar Chart -->
        <q-card class="col-6">
          <q-card-section>
            <div class="text-h6">Vehicle Utilization (Top 5)</div>
            <!-- <canvas ref="vehicleUtilizationChart" class="chart-canvas"></canvas> -->
          </q-card-section>
        </q-card>

        <!-- Top Routes by Trips - Bar Chart -->
        <q-card class="col-6">
          <q-card-section>
            <div class="text-h6">Top 5 Routes by Trips</div>
            <!-- <canvas ref="topRoutesChart" class="chart-canvas"></canvas> -->
          </q-card-section>
        </q-card>

        <!-- Top Stops by Ticket Sales - Horizontal Bar Chart -->
        <q-card class="col-6">
          <q-card-section>
            <div class="text-h6">Top 5 Stops by Ticket Sales</div>
            <!-- <canvas ref="topStopsChart" class="chart-canvas"></canvas> -->
          </q-card-section>
        </q-card>

        <!-- Active Trips - Line Chart -->
        <q-card class="col-6">
          <q-card-section>
            <div class="text-h6">Active Trips (Daily)</div>
            <!-- <canvas ref="activeTripsChart" class="chart-canvas"></canvas> -->
          </q-card-section>
        </q-card>

        <!-- Trips by Vehicle - Bar Chart -->
        <q-card class="col-6">
          <q-card-section>
            <div class="text-h6">Trips by Vehicle</div>
            <!-- <canvas ref="tripsByVehicleChart" class="chart-canvas"></canvas> -->
          </q-card-section>
        </q-card>

        <!-- Tickets by Conductor - Horizontal Bar Chart -->
        <q-card class="col-6">
          <q-card-section>
            <div class="text-h6">Tickets by Conductor (Top 5)</div>
            <!-- <canvas ref="ticketsByConductorChart" class="chart-canvas"></canvas> -->
          </q-card-section>
        </q-card>

        <!-- Schedules Today - Doughnut Chart -->
        <q-card class="col-6">
          <q-card-section>
            <div class="text-h6">Schedules Today</div>
            <!-- <canvas ref="schedulesTodayChart" class="chart-canvas"></canvas> -->
          </q-card-section>
        </q-card>

        <!-- Average Trip Duration - Line Chart -->
        <q-card class="col-6">
          <q-card-section>
            <div class="text-h6">Average Trip Duration (Weekly)</div>
            <!-- <canvas ref="avgTripDurationChart" class="chart-canvas"></canvas> -->
          </q-card-section>
        </q-card>

        <!-- Daily Active Users - Line Chart -->
        <q-card class="col-6">
          <q-card-section>
            <div class="text-h6">Daily Active Users (Last 7 Days)</div>
            <!-- <canvas ref="dailyActiveUsersChart" class="chart-canvas"></canvas> -->
          </q-card-section>
        </q-card>

        <!-- Monthly Active Users - Line Chart -->
        <q-card class="col-6">
          <q-card-section>
            <div class="text-h6">Monthly Active Users (Last 6 Months)</div>
            <!-- <canvas ref="monthlyActiveUsersChart" class="chart-canvas"></canvas> -->
          </q-card-section>
        </q-card>

        <!-- Average Fare - Numerical Widget -->
        <q-card class="col-4">
          <q-card-section>
            <div class="text-h6">Average Fare</div>
            <div class="text-h4">₹{{ stats.averageFare }}</div>
          </q-card-section>
        </q-card>

        <!-- Additional Insights Placeholders -->
        <!-- You can add more charts or widgets here to reach 20 insights -->
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useQuasar } from 'quasar';
// import Chart from 'chart.js/auto';

// Quasar instance for notifications
const $q = useQuasar();

// Refs for Chart.js canvases
const tripsOverviewChart = ref(null);
const ticketsSalesChart = ref(null);
const monthlyRevenueChart = ref(null);
const userDistributionChart = ref(null);
const vehicleUtilizationChart = ref(null);
const topRoutesChart = ref(null);
const topStopsChart = ref(null);
const activeTripsChart = ref(null);
const tripsByVehicleChart = ref(null);
const ticketsByConductorChart = ref(null);
const schedulesTodayChart = ref(null);
const avgTripDurationChart = ref(null);
const dailyActiveUsersChart = ref(null);
const monthlyActiveUsersChart = ref(null);

// Chart instances to manage lifecycle
const chartInstances = ref([]);

// Stats object with mock data
const stats = ref({
  totalUsers: 1500,
  activeVehicles: 120,
  totalTrips: 4500,
  ticketsSoldToday: 320,
  revenueToday: '₹75,000',
  tripsInProgress: 15,
  completedTrips: 4485,
  averageFare: '₹235.50',
});

// Charts data with mock data
const charts = ref({
  tripsOverview: {
    labels: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    datasets: [{
      label: 'Trips',
      data: [300, 450, 500, 600, 700, 650, 800, 750, 700, 850, 900, 950],
      backgroundColor: 'rgba(33, 150, 243, 0.5)',
      borderColor: 'rgba(33, 150, 243, 1)',
      borderWidth: 1,
      fill: true,
      tension: 0.4,
    }]
  },
  ticketsSales: {
    labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    datasets: [{
      label: 'Tickets Sold',
      data: [50, 60, 70, 80, 90, 100, 120],
      backgroundColor: 'rgba(102, 187, 106, 0.6)',
      borderColor: 'rgba(102, 187, 106, 1)',
      borderWidth: 1,
    }]
  },
  monthlyRevenue: {
    labels: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    datasets: [{
      label: 'Revenue (₹)',
      data: [500000, 600000, 550000, 700000, 800000, 750000, 850000, 900000, 800000, 950000, 1000000, 1050000],
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
        '#9966FF', '#FF9F40', '#FF6384', '#36A2EB',
        '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
      ],
    }]
  },
  userDistribution: {
    labels: ['Admin', 'Regular', 'Driver', 'Conductor', 'Other'],
    datasets: [{
      label: 'Users',
      data: [50, 1300, 80, 70, 0],
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
      ],
    }]
  },
  vehicleUtilization: {
    labels: ['AB-1234', 'CD-5678', 'EF-9012', 'GH-3456', 'IJ-7890'],
    datasets: [{
      label: 'Trips',
      data: [300, 250, 400, 350, 200],
      backgroundColor: 'rgba(171, 71, 188, 0.6)',
      borderColor: 'rgba(171, 71, 188, 1)',
      borderWidth: 1,
    }]
  },
  topRoutes: {
    labels: ['Route A', 'Route B', 'Route C', 'Route D', 'Route E'],
    datasets: [{
      label: 'Trips',
      data: [500, 450, 400, 350, 300],
      backgroundColor: 'rgba(38, 166, 154, 0.6)',
      borderColor: 'rgba(38, 166, 154, 1)',
      borderWidth: 1,
    }]
  },
  topStops: {
    labels: ['Stop 1', 'Stop 2', 'Stop 3', 'Stop 4', 'Stop 5'],
    datasets: [{
      label: 'Tickets Sold',
      data: [150, 120, 100, 90, 80],
      backgroundColor: 'rgba(236, 66, 122, 0.6)',
      borderColor: 'rgba(236, 66, 122, 1)',
      borderWidth: 1,
    }]
  },
  activeTrips: {
    labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    datasets: [{
      label: 'Active Trips',
      data: [10, 12, 15, 14, 13, 16, 18],
      backgroundColor: 'rgba(255, 112, 67, 0.6)',
      borderColor: 'rgba(255, 112, 67, 1)',
      borderWidth: 1,
      fill: true,
      tension: 0.4,
    }]
  },
  tripsByVehicle: {
    labels: ['AB-1234', 'CD-5678', 'EF-9012', 'GH-3456', 'IJ-7890'],
    datasets: [{
      label: 'Trips',
      data: [300, 250, 400, 350, 200],
      backgroundColor: 'rgba(66, 165, 245, 0.6)',
      borderColor: 'rgba(66, 165, 245, 1)',
      borderWidth: 1,
    }]
  },
  ticketsByConductor: {
    labels: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Emily Davis', 'Robert Brown'],
    datasets: [{
      label: 'Tickets Sold',
      data: [120, 110, 100, 90, 80],
      backgroundColor: 'rgba(126, 87, 194, 0.6)',
      borderColor: 'rgba(126, 87, 194, 1)',
      borderWidth: 1,
    }]
  },
  schedulesToday: {
    labels: ['Schedules Today', 'Other'],
    datasets: [{
      label: 'Schedules',
      data: [25, 75],
      backgroundColor: ['rgba(38, 198, 218, 0.6)', 'rgba(176, 190, 197, 0.6)'],
      borderColor: ['rgba(38, 198, 218, 1)', 'rgba(176, 190, 197, 1)'],
      borderWidth: 1,
    }]
  },
  avgTripDuration: {
    labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    datasets: [{
      label: 'Avg Duration (hrs)',
      data: [2.5, 3.0, 2.8, 3.2, 2.9, 3.1, 3.3],
      backgroundColor: 'rgba(255, 82, 82, 0.6)',
      borderColor: 'rgba(255, 82, 82, 1)',
      borderWidth: 1,
      fill: false,
      tension: 0.4,
    }]
  },
  dailyActiveUsers: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Active Users',
      data: [120, 150, 130, 170, 160, 180, 200],
      backgroundColor: 'rgba(141, 110, 99, 0.6)',
      borderColor: 'rgba(141, 110, 99, 1)',
      borderWidth: 1,
      fill: false,
      tension: 0.4,
    }]
  },
  monthlyActiveUsers: {
    labels: ['Aug 2023', 'Sep 2023', 'Oct 2023', 'Nov 2023', 'Dec 2023', 'Jan 2024'],
    datasets: [{
      label: 'Active Users',
      data: [800, 850, 900, 950, 1000, 1050],
      backgroundColor: 'rgba(66, 165, 245, 0.6)',
      borderColor: 'rgba(66, 165, 245, 1)',
      borderWidth: 1,
      fill: false,
      tension: 0.4,
    }]
  },
});

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: false,
      text: 'Chart Title',
    },
  },
};

// Initialize all charts with mock data
function initializeCharts() {
  // Trips Overview - Line Chart (Monthly Trips)
  const tripsOverviewCtx = tripsOverviewChart.value.getContext('2d');
  const tripsOverview = new Chart(tripsOverviewCtx, {
    type: 'line',
    data: charts.value.tripsOverview,
    options: chartOptions,
  });
  chartInstances.value.push(tripsOverview);

  // Tickets Sales - Bar Chart (Weekly)
  const ticketsSalesCtx = ticketsSalesChart.value.getContext('2d');
  const ticketsSales = new Chart(ticketsSalesCtx, {
    type: 'bar',
    data: charts.value.ticketsSales,
    options: chartOptions,
  });
  chartInstances.value.push(ticketsSales);

  // Monthly Revenue - Pie Chart
  const monthlyRevenueCtx = monthlyRevenueChart.value.getContext('2d');
  const monthlyRevenue = new Chart(monthlyRevenueCtx, {
    type: 'pie',
    data: charts.value.monthlyRevenue,
    options: chartOptions,
  });
  chartInstances.value.push(monthlyRevenue);

  // User Distribution by Type - Doughnut Chart
  const userDistributionCtx = userDistributionChart.value.getContext('2d');
  const userDistribution = new Chart(userDistributionCtx, {
    type: 'doughnut',
    data: charts.value.userDistribution,
    options: chartOptions,
  });
  chartInstances.value.push(userDistribution);

  // Vehicle Utilization - Bar Chart (Top 5)
  const vehicleUtilizationCtx = vehicleUtilizationChart.value.getContext('2d');
  const vehicleUtilization = new Chart(vehicleUtilizationCtx, {
    type: 'bar',
    data: charts.value.vehicleUtilization,
    options: chartOptions,
  });
  chartInstances.value.push(vehicleUtilization);

  // Top Routes by Trips - Bar Chart
  const topRoutesCtx = topRoutesChart.value.getContext('2d');
  const topRoutes = new Chart(topRoutesCtx, {
    type: 'bar',
    data: charts.value.topRoutes,
    options: chartOptions,
  });
  chartInstances.value.push(topRoutes);

  // Top Stops by Ticket Sales - Horizontal Bar Chart
  const topStopsCtx = topStopsChart.value.getContext('2d');
  const topStops = new Chart(topStopsCtx, {
    type: 'bar',
    data: charts.value.topStops,
    options: {
      ...chartOptions,
      indexAxis: 'y',
    },
  });
  chartInstances.value.push(topStops);

  // Active Trips - Line Chart (Daily)
  const activeTripsCtx = activeTripsChart.value.getContext('2d');
  const activeTrips = new Chart(activeTripsCtx, {
    type: 'line',
    data: charts.value.activeTrips,
    options: chartOptions,
  });
  chartInstances.value.push(activeTrips);

  // Trips by Vehicle - Bar Chart
  const tripsByVehicleCtx = tripsByVehicleChart.value.getContext('2d');
  const tripsByVehicle = new Chart(tripsByVehicleCtx, {
    type: 'bar',
    data: charts.value.tripsByVehicle,
    options: chartOptions,
  });
  chartInstances.value.push(tripsByVehicle);

  // Tickets by Conductor - Horizontal Bar Chart
  const ticketsByConductorCtx = ticketsByConductorChart.value.getContext('2d');
  const ticketsByConductor = new Chart(ticketsByConductorCtx, {
    type: 'bar',
    data: charts.value.ticketsByConductor,
    options: {
      ...chartOptions,
      indexAxis: 'y',
    },
  });
  chartInstances.value.push(ticketsByConductor);

  // Schedules Today - Doughnut Chart
  const schedulesTodayCtx = schedulesTodayChart.value.getContext('2d');
  const schedulesToday = new Chart(schedulesTodayCtx, {
    type: 'doughnut',
    data: charts.value.schedulesToday,
    options: chartOptions,
  });
  chartInstances.value.push(schedulesToday);

  // Average Trip Duration - Line Chart (Weekly)
  const avgTripDurationCtx = avgTripDurationChart.value.getContext('2d');
  const avgTripDuration = new Chart(avgTripDurationCtx, {
    type: 'line',
    data: charts.value.avgTripDuration,
    options: chartOptions,
  });
  chartInstances.value.push(avgTripDuration);

  // Daily Active Users - Line Chart (Last 7 Days)
  const dailyActiveUsersCtx = dailyActiveUsersChart.value.getContext('2d');
  const dailyActiveUsers = new Chart(dailyActiveUsersCtx, {
    type: 'line',
    data: charts.value.dailyActiveUsers,
    options: chartOptions,
  });
  chartInstances.value.push(dailyActiveUsers);

  // Monthly Active Users - Line Chart (Last 6 Months)
  const monthlyActiveUsersCtx = monthlyActiveUsersChart.value.getContext('2d');
  const monthlyActiveUsers = new Chart(monthlyActiveUsersCtx, {
    type: 'line',
    data: charts.value.monthlyActiveUsers,
    options: chartOptions,
  });
  chartInstances.value.push(monthlyActiveUsers);
}

// Destroy all chart instances to prevent memory leaks
function destroyCharts() {
  chartInstances.value.forEach(chart => {
    chart.destroy();
  });
  chartInstances.value = [];
}

// Fetch data and prepare charts with mock data
function fetchDataAndPrepareCharts() {
  try {
    // 1. Total Users
    stats.value.totalUsers = 1500;

    // 2. Active Vehicles
    stats.value.activeVehicles = 120;

    // 3. Total Trips
    stats.value.totalTrips = 4500;

    // 4. Tickets Sold Today
    stats.value.ticketsSoldToday = 320;

    // 5. Revenue Today
    stats.value.revenueToday = '₹75,000';

    // 6. Trips In Progress
    stats.value.tripsInProgress = 15;

    // 7. Completed Trips
    stats.value.completedTrips = 4485;

    // 8. Top 5 Routes by Trips (Already Initialized in Mock Data)

    // 9. Monthly Revenue (Already Initialized in Mock Data)

    // 10. Tickets Sales - Weekly Bar Chart (Already Initialized in Mock Data)

    // 11. User Distribution by Type (Already Initialized in Mock Data)

    // 12. Vehicle Utilization - Top 5 Vehicles by Trips (Already Initialized in Mock Data)

    // 13. Top 5 Stops by Ticket Sales (Already Initialized in Mock Data)

    // 14. Active Trips - Line Chart (Daily) (Already Initialized in Mock Data)

    // 15. Trips by Vehicle - Bar Chart (Already Initialized in Mock Data)

    // 16. Tickets by Conductor - Horizontal Bar Chart (Already Initialized in Mock Data)

    // 17. Schedules Today - Doughnut Chart (Already Initialized in Mock Data)

    // 18. Average Trip Duration - Line Chart (Weekly) (Already Initialized in Mock Data)

    // 19. Daily Active Users - Line Chart (Last 7 Days) (Already Initialized in Mock Data)

    // 20. Monthly Active Users - Line Chart (Last 6 Months) (Already Initialized in Mock Data)

    // 21. Average Fare
    stats.value.averageFare = '₹235.50';

  } catch (error) {
    console.error(error);
    $q.notify({ type: 'negative', message: 'Failed to load dashboard data' });
  }
}

// Lifecycle Hooks
onMounted(() => {
  // fetchDataAndPrepareCharts();
  // initializeCharts();
});

onBeforeUnmount(() => {
  // destroyCharts();
});
</script>

<style scoped>
.chart-canvas {
  width: 100%;
  height: 200px;
}
</style>
