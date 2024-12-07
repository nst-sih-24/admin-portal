<template>
  <q-page padding>
    <!-- Combined Profile and Performance Section -->
    <div class="row q-col-gutter-md q-mt-md">
      <div class="col-4">
        <q-card dark>
          <q-card-section>
            <!-- Profile Section -->
            <div class="row items-center no-wrap">
              <q-avatar size="56px">
                <img src="worker-avatar.jpg" alt="Worker Avatar" />
              </q-avatar>
              <div class="q-ml-md">
                <div class="text-weight-bold">Employee Name</div>
                <div class="text-grey">Designation</div>
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <!-- Performance Section -->
            <div class="text-h6">Performance Metrics</div>
            <div class="q-mt-md">
              <div class="row items-center justify-between">
                <div>Tickets Resolved</div>
                <div class="text-positive">85%</div>
              </div>
              <div class="row items-center justify-between q-mt-sm">
                <div>Customer Satisfaction</div>
                <div class="text-positive">92%</div>
              </div>
              <div class="q-mt-md">
                <q-icon name="check" color="positive" /> Top Performer Badge
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <!-- Activity Section with Graph -->
      <div class="col-8">
        <q-card dark>
          <q-card-section>
            <div class="text-h6">Tickets Booked</div>
            <div class="q-mt-md">
              <canvas id="ticketsChart"></canvas>
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
    <!-- Hot News Section -->
    <div class="row q-col-gutter-md q-mt-md">
      <div class="col-12">
        <q-card dark>
          <q-card-section>
            <div class="row items-center justify-between">
              <div class="text-h6">Hot News</div>
              <q-btn flat color="primary" label="View All" />
            </div>
            <ul class="q-mt-md">
              <li v-for="(news, index) in newsList" :key="index" class="text-body1">
                {{ news }}
              </li>
            </ul>
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
  name: "DashBoard",
  setup() {
    const stats = [
      { title: "Daily", value: 120 },
      { title: "Weekly", value: 850 },
      { title: "Monthly", value: 3400 },
      { title: "Yearly", value: 40200 },
    ];

    const newsList = [
      "New feature released: Instant Refunds.",
      "Employee of the Month: John Doe.",
      "System Maintenance Scheduled for Dec 15.",
      "Record-breaking ticket sales yesterday!",
    ];

    onMounted(() => {
      const ctx = document.getElementById("ticketsChart").getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              label: "Tickets Booked",
              data: [50, 75, 100, 150, 200, 175, 225],
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
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
      newsList,
    };
  },
});
</script>

<style>
canvas {
  max-width: 100%;
}
</style>
