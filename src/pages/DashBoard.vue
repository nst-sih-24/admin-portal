<template>
  <q-page padding>
    <div class="row q-col-gutter-md q-mt-md">
      <div class="col-4">
        <!-- Combined Profile and Performance Card -->
        <q-card dark>
          <q-card-section>
            <!-- Profile Section -->
            <div class="row items-center no-wrap">
              <q-avatar size="56px">
                <img src="jonathan-roy.jpg" alt="Jonathan Roy" />
              </q-avatar>
              <div class="q-ml-md">
                <div class="text-weight-bold">Jonathan Roy</div>
                <div class="text-grey">CEO</div>
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <!-- Performance Section -->
            <div class="text-h6">Performance</div>
            <div class="q-mt-md">
              <div class="row items-center justify-between">
                <div>Income</div>
                <div class="text-positive">76%</div>
              </div>
              <div class="row items-center justify-between q-mt-sm">
                <div>Spending</div>
                <div class="text-negative">44%</div>
              </div>
              <div class="q-mt-md">
                <q-icon name="check" color="positive" /> Spending course was taken
              </div>
              <div class="q-mt-sm">
                <q-icon name="check" color="positive" /> Deposit programs were setup
              </div>
              <div class="q-mt-sm">
                <q-icon name="check" color="positive" /> Cashback program activated
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <!-- Activity Section with Chart -->
      <div class="col-8">
        <q-card dark>
          <q-card-section>
            <div class="text-h6">Activity</div>
            <div class="q-mt-md">
              <canvas id="activityChart"></canvas>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <!-- Stats Cards -->
    <div class="row q-col-gutter-md q-mt-md">
      <div class="col-3" v-for="(stat, index) in stats" :key="index">
        <q-card dark>
          <q-card-section>
            <div class="text-h6">{{ stat.title }}</div>
            <div class="text-h4 q-mt-md">{{ stat.value }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <!-- Additional Metrics -->
    <div class="row q-col-gutter-md q-mt-md">
      <div class="col-12">
        <q-card dark>
          <q-card-section>
            <div class="row items-center justify-between">
              <div class="text-h6">Your New Metrics</div>
              <q-btn flat color="primary" label="View" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import Chart from "chart.js/auto";

export default defineComponent({
  name: "BoostoDashboard",
  setup() {
    const stats = [
      { title: "This Day", value: 133 },
      { title: "This Week", value: 471 },
      { title: "This Month", value: 929 },
      { title: "Pending", value: 233 },
    ];

    onMounted(() => {
      const ctx = document.getElementById("activityChart").getContext("2d");
      new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          datasets: [
            {
              label: "Activity",
              data: [12, 19, 3, 5, 2, 3, 7],
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
          },
          scales: {
            x: {
              beginAtZero: true,
            },
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    });

    return {
      stats,
    };
  },
});
</script>

<style>
canvas {
  max-width: 100%;
}
</style>
