<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <!-- Stats Section -->
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="row justify-between items-center">
              <div class="text-h6">Trips</div>
              <div>
                <q-btn
                  color="primary"
                  label="Add Trip"
                  icon="eva-plus"
                  @click="addTrip"
                />
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-3">
                <q-card flat bordered>
                  <q-card-section>
                    <div class="text-subtitle1">Total Trips</div>
                    <div class="text-h5">{{ stats.totalTrips }}</div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-3">
                <q-card flat bordered>
                  <q-card-section>
                    <div class="text-subtitle1">Trips Today</div>
                    <div class="text-h5">{{ stats.tripsToday }}</div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-3">
                <q-card flat bordered>
                  <q-card-section>
                    <div class="text-subtitle1">Trips In Progress</div>
                    <div class="text-h5">{{ stats.tripsInProgress }}</div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-3">
                <q-card flat bordered>
                  <q-card-section>
                    <div class="text-subtitle1">Completed Trips</div>
                    <div class="text-h5">{{ stats.completedTrips }}</div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Trips Table -->
      <div class="col-12">
        <q-table
          :rows="trips"
          :columns="columns"
          row-key="id"
          :rows-per-page-options="[10, 20, 0]"
        >
          <template #body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                icon="edit"
                color="primary"
                round
                flat
                @click="editTrip(props.row)"
                class="q-mr-sm"
              ></q-btn>
              <q-btn
                icon="info"
                color="secondary"
                round
                flat
                @click="viewTripDetails(props.row)"
              ></q-btn>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>

    <!-- Add/Edit Trip Dialog -->
    <q-dialog v-model="showTripDialog">
      <q-card v-if="selectedTrip">
        <q-card-section>
          <div class="text-h6">
            {{ isEdit ? "Edit Trip" : "Add Trip" }}
            <q-btn
              flat
              round
              dense
              icon="close"
              aria-label="Close"
              v-close-popup
              class="float-right"
            />
          </div>
        </q-card-section>

        <q-separator></q-separator>

        <q-card-section>
          <div class="row q-col-gutter-sm">
            <!-- Schedule Selection -->
            <div class="col-12">
              <q-select
                v-model="selectedTrip.schedule_id"
                :options="schedulesOptions"
                label="Schedule"
                outlined
                dense
                clearable
                emit-value
                map-options
              />
            </div>

            <!-- Driver Selection -->
            <div class="col-12">
              <q-select
                v-model="selectedTrip.driver_id"
                :options="driversOptions"
                label="Driver"
                outlined
                dense
                clearable
                emit-value
                map-options
              />
            </div>

            <!-- Conductor Selection -->
            <div class="col-12">
              <q-select
                v-model="selectedTrip.conductor_id"
                :options="conductorsOptions"
                label="Conductor"
                outlined
                dense
                clearable
                emit-value
                map-options
              />
            </div>

            <!-- Route Selection -->
            <div class="col-12">
              <q-select
                v-model="selectedTrip.route_id"
                :options="routesOptions"
                label="Route"
                outlined
                dense
                clearable
                emit-value
                map-options
              />
            </div>

            <!-- Vehicle Selection -->
            <div class="col-12">
              <q-select
                v-model="selectedTrip.vehicle_id"
                :options="vehiclesOptions"
                label="Vehicle"
                outlined
                dense
                clearable
                emit-value
                map-options
              />
            </div>

            <!-- Expected Start Time -->
            <div class="col-12">
              <q-input
                v-model="selectedTrip.expected_start_time"
                type="datetime-local"
                label="Expected Start Time"
                outlined
                dense
                clearable
              />
            </div>

            <!-- Expected End Time -->
            <div class="col-12">
              <q-input
                v-model="selectedTrip.expected_end_time"
                type="datetime-local"
                label="Expected End Time"
                outlined
                dense
                clearable
              />
            </div>

            <!-- Actual Start Time -->
            <div class="col-12">
              <q-input
                v-model="selectedTrip.actual_start_time"
                type="datetime-local"
                label="Actual Start Time"
                outlined
                dense
                clearable
              />
            </div>

            <!-- Actual End Time -->
            <div class="col-12">
              <q-input
                v-model="selectedTrip.actual_end_time"
                type="datetime-local"
                label="Actual End Time"
                outlined
                dense
                clearable
              />
            </div>

            <!-- Last Stop -->
            <div class="col-12">
              <q-input
                v-model="selectedTrip.last_stop"
                placeholder="Last Stop"
                label="Last Stop"
                outlined
                dense
                clearable
              />
            </div>

            <!-- Driver Enter Time -->
            <div class="col-12">
              <q-input
                v-model="selectedTrip.driver_enter_time"
                type="datetime-local"
                label="Driver Enter Time"
                outlined
                dense
                clearable
              />
            </div>

            <!-- Driver Exit Time -->
            <div class="col-12">
              <q-input
                v-model="selectedTrip.driver_exit_time"
                type="datetime-local"
                label="Driver Exit Time"
                outlined
                dense
                clearable
              />
            </div>

            <!-- Conductor Enter Time -->
            <div class="col-12">
              <q-input
                v-model="selectedTrip.conductor_enter_time"
                type="datetime-local"
                label="Conductor Enter Time"
                outlined
                dense
                clearable
              />
            </div>

            <!-- Delete Button -->
            <div class="col-auto" v-if="isEdit">
              <q-btn
                icon="delete"
                color="negative"
                round
                flat
                @click="deleteTrip"
                v-close-popup
              ></q-btn>
            </div>

            <!-- Save Button -->
            <div class="col">
              <q-btn
                label="Save"
                color="primary"
                rounded
                class="full-width"
                @click="saveTrip"
              ></q-btn>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Trip Details Side Panel -->
    <q-drawer
      v-model="showTripDetails"
      side="right"
      :width="400"
      overlay
      class="bg-grey-2"
    >
      <q-card>
        <q-card-section>
          <div class="row justify-between items-center">
            <div class="text-h6">Trip Details</div>
            <q-btn
              flat
              round
              dense
              icon="close"
              aria-label="Close"
              @click="showTripDetails = false"
            />
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div v-if="selectedTripDetails">
            <div class="q-mb-md">
              <strong>Registration No:</strong>
              {{ selectedTripDetails.vehicle.registration_no }}
            </div>
            <div class="q-mb-md">
              <strong>Driver:</strong> {{ selectedTripDetails.driver.name }}
            </div>
            <div class="q-mb-md">
              <strong>Conductor:</strong>
              {{ selectedTripDetails.conductor.name }}
            </div>
            <div class="q-mb-md">
              <strong>Route:</strong> {{ selectedTripDetails.route.name }}
            </div>
            <div class="q-mb-md">
              <strong>Schedule ID:</strong>
              {{ selectedTripDetails.schedule.id }}
            </div>
            <div class="q-mb-md">
              <strong>Expected Start Time:</strong>
              {{ formatTimestamp(selectedTripDetails.expected_start_time) }}
            </div>
            <div class="q-mb-md">
              <strong>Expected End Time:</strong>
              {{ formatTimestamp(selectedTripDetails.expected_end_time) }}
            </div>
            <div class="q-mb-md">
              <strong>Actual Start Time:</strong>
              {{ formatTimestamp(selectedTripDetails.actual_start_time) }}
            </div>
            <div class="q-mb-md">
              <strong>Actual End Time:</strong>
              {{ formatTimestamp(selectedTripDetails.actual_end_time) }}
            </div>
            <div class="q-mb-md">
              <strong>Last Stop:</strong> {{ selectedTripDetails.last_stop }}
            </div>
            <div class="q-mb-md">
              <strong>Driver Enter Time:</strong>
              {{ formatTimestamp(selectedTripDetails.driver_enter_time) }}
            </div>
            <div class="q-mb-md">
              <strong>Driver Exit Time:</strong>
              {{ formatTimestamp(selectedTripDetails.driver_exit_time) }}
            </div>
            <div class="q-mb-md">
              <strong>Conductor Enter Time:</strong>
              {{ formatTimestamp(selectedTripDetails.conductor_enter_time) }}
            </div>

            <q-separator />

            <!-- Map Section -->
            <div class="q-mb-md">
              <strong>Last Stop Location:</strong>
              <div v-if="mapCenter">
                <GoogleMap
                  :api-key="GMAP_API_KEY"
                  :center="mapCenter"
                  :zoom="12"
                  style="height: 200px; width: 100%"
                  mapId="117cde968721239e"
                  :options="{
                    mapTypeControl: false,
                    streetViewControl: false,
                    disableDefaultUI: true,
                  }"
                >
                  <AdvancedMarker
                    :options="{
                      position: mapCenter,
                      title: selectedTripDetails.last_stop || 'Last Stop',
                    }"
                  />
                </GoogleMap>
              </div>
              <div v-else>
                <q-spinner-dots color="primary" />
              </div>
            </div>

            <q-separator />

            <div class="text-h6 q-mt-md">Ticket Sales</div>
            <div class="q-mb-md">
              <strong>Total Tickets Sold:</strong> {{ tripStats.totalTickets }}
            </div>
            <div class="q-mb-md">
              <strong>Total Revenue:</strong> ₹{{ tripStats.totalRevenue }}
            </div>
            <div class="q-mb-md">
              <strong>Unique Customers:</strong> {{ tripStats.uniqueCustomers }}
            </div>
            <div class="q-mb-md">
              <strong>Busy Stops:</strong>
              <ul>
                <li v-for="stop in tripStats.busyStops" :key="stop.stop_id">
                  {{ stop.name }} ({{ stop.ticketCount }} tickets)
                </li>
              </ul>
            </div>
          </div>
          <div v-else>
            <q-spinner-dots color="primary" />
          </div>
        </q-card-section>
      </q-card>
    </q-drawer>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { supabase } from "src/boot/supabase";
import { useQuasar } from "quasar";

import { GoogleMap, AdvancedMarker } from "vue3-google-map";

// Add this at the top of your <script setup> section
const GMAP_API_KEY = import.meta.env.VITE_GMAP_API_KEY; // Ensure your .env has this key

const $q = useQuasar();

const trips = ref([]);
const selectedTrip = ref(null);
const isEdit = ref(false);
const showTripDialog = ref(false);

// Side Panel
const showTripDetails = ref(false);
const selectedTripDetails = ref(null);
const tripStats = ref({
  totalTickets: 0,
  totalRevenue: 0,
  uniqueCustomers: 0,
  busyStops: [],
});

// Stats object
const stats = ref({
  totalTrips: 0,
  tripsToday: 0,
  tripsInProgress: 0,
  completedTrips: 0,
});

// Related Data
const schedules = ref([]);
const drivers = ref([]);
const conductors = ref([]);
const routes = ref([]);
const vehicles = ref([]);

// Options for Selects
const schedulesOptions = computed(() =>
  schedules.value.map((s) => ({ label: `ID: ${s.id}`, value: s.id }))
);
const driversOptions = computed(() =>
  drivers.value.map((d) => ({ label: d.name, value: d.id }))
);
const conductorsOptions = computed(() =>
  conductors.value.map((c) => ({ label: c.name, value: c.id }))
);
const routesOptions = computed(() =>
  routes.value.map((r) => ({ label: r.name, value: r.id }))
);
const vehiclesOptions = computed(() =>
  vehicles.value.map((v) => ({ label: v.registration_no, value: v.id }))
);

// Add a computed property or a reactive reference for mapCenter
const mapCenter = ref({
  lat: 28.6139, // Example: New Delhi latitude
  lng: 77.209, // Example: New Delhi longitude
});

onMounted(() => {
  fetchTrips();
  fetchRelatedData();
  fetchStats();
});

/**
trip = {
  "id": "cbd1604e-e29c-4a84-833f-29690d38fcf9",
  "schedule_id": "cfd2bb3b-bb5f-40f9-85da-95ca99330800",
  "driver_id": "e0049b01-e301-4739-8518-433caac5c550",
  "conductor_id": "e3448832-d618-4ad2-a038-286fdc00efac",
  "route_id": "ea811e39-176c-4116-ba0d-30c47d2c4c52",
  "vehicle_id": "e1450cce-9624-44b7-889f-9f6665dafa90",
  "expected_start_time": "2024-12-11T05:25:55+00:00",
  "expected_end_time": "2024-12-10T20:24:00+00:00",
  "actual_start_time": null,
  "actual_end_time": null,
  "last_stop": null,
  "driver_enter_time": null,
  "driver_exit_time": null,
  "conductor_enter_time": null,
  "driver": {
      "name": "Sumit"
  },
  "conductor": {
      "name": "Roni"
  },
  "route": {
      "name": "101"
  },
  "vehicle": {
      "registration_no": "DL012024"
  },
  "schedule": {
      "id": "cfd2bb3b-bb5f-40f9-85da-95ca99330800"
  }
} */

const columns = [
  {
    name: "schedule_id",
    label: "Schedule ID",
    align: "left",
    field: "schedule_id",
  },
  {
    name: "driver_id",
    label: "Driver",
    align: "left",
    field: "driver_id",
  },
  {
    name: "conductor_id",
    label: "Conductor",
    align: "left",
    field: "conductor_id",
  },
  {
    name: "route_id",
    label: "Route",
    align: "left",
    field: "route_id",
  },
  {
    name: "vehicle_id",
    label: "Vehicle",
    align: "left",
    field: "vehicle_id",
  },
  {
    name: "expected_start_time",
    label: "Expected Start Time",
    align: "left",
    field: "expected_start_time",
    format: (val) => formatDate(val),
  },
  {
    name: "expected_end_time",
    label: "Expected End Time",
    align: "left",
    field: "expected_end_time",
    format: (val) => formatDate(val),
  },
  {
    name: "actual_start_time",
    label: "Actual Start Time",
    align: "left",
    field: "actual_start_time",
    format: (val) => formatTimestamp(val),
  },
  {
    name: "actual_end_time",
    label: "Actual End Time",
    align: "left",
    field: "actual_end_time",
    format: (val) => formatTimestamp(val),
  },
  {
    name: "last_stop",
    label: "Last Stop",
    align: "left",
    field: "last_stop",
  },
  {
    name: "driver_enter_time",
    label: "Driver Enter Time",
    align: "left",
    field: "driver_enter_time",
    format: (val) => formatTimestamp(val),
  },
  {
    name: "driver_exit_time",
    label: "Driver Exit Time",
    align: "left",
    field: "driver_exit_time",
    format: (val) => formatTimestamp(val),
  },
  {
    name: "conductor_enter_time",
    label: "Conductor Enter Time",
    align: "left",
    field: "conductor_enter_time",
    format: (val) => formatTimestamp(val),
  },
  {
    name: "actions",
    label: "Actions",
    align: "center",
    field: "actions",
  },
];

async function fetchTrips() {
  try {
    const { data, error } = await supabase
      .from("trip")
      .select(
        `
        *,
        driver:driver_id(name),
        conductor:conductor_id(name),
        route:route_id(name),
        vehicle:vehicle_id(registration_no),
        schedule:schedule_id(id)
      `
      )
      .order("expected_start_time", { ascending: false });

    if (error) {
      console.error(error);
      $q.notify({ type: "negative", message: "Failed to fetch trips" });
    } else {
      trips.value = data;
    }
  } catch (error) {
    console.error(error);
    $q.notify({ type: "negative", message: "Failed to fetch trips" });
  }
}

async function fetchRelatedData() {
  try {
    // Fetch Schedules
    const { data: scheduleData, error: scheduleError } = await supabase
      .from("schedule")
      .select("*");
    if (scheduleError) {
      console.error(scheduleError);
      $q.notify({ type: "negative", message: "Failed to fetch schedules" });
    } else {
      schedules.value = scheduleData;
    }

    // Fetch Drivers (users with type 'driver')
    const { data: driverData, error: driverError } = await supabase
      .from("user")
      .select("*")
      .eq("type", "driver");
    if (driverError) {
      console.error(driverError);
      $q.notify({ type: "negative", message: "Failed to fetch drivers" });
    } else {
      drivers.value = driverData;
    }

    // Fetch Conductors (users with type 'conductor')
    const { data: conductorData, error: conductorError } = await supabase
      .from("user")
      .select("*")
      .eq("type", "conductor");
    if (conductorError) {
      console.error(conductorError);
      $q.notify({ type: "negative", message: "Failed to fetch conductors" });
    } else {
      conductors.value = conductorData;
    }

    // Fetch Routes
    const { data: routeData, error: routeError } = await supabase
      .from("route")
      .select("*");
    if (routeError) {
      console.error(routeError);
      $q.notify({ type: "negative", message: "Failed to fetch routes" });
    } else {
      routes.value = routeData;
    }

    // Fetch Vehicles
    const { data: vehicleData, error: vehicleError } = await supabase
      .from("vehicle")
      .select("*");
    if (vehicleError) {
      console.error(vehicleError);
      $q.notify({ type: "negative", message: "Failed to fetch vehicles" });
    } else {
      vehicles.value = vehicleData;
    }
  } catch (error) {
    console.error(error);
    $q.notify({ type: "negative", message: "Failed to fetch related data" });
  }
}

async function fetchStats() {
  try {
    // Total trips count
    const { count: totalCount, error: countError } = await supabase
      .from("trip")
      .select("id", { count: "exact", head: true });
    if (!countError && totalCount !== null) {
      stats.value.totalTrips = totalCount;
    }

    // Trips today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const { count: tripsTodayCount, error: tripsTodayError } = await supabase
      .from("trip")
      .select("id", { count: "exact", head: true })
      .gte("expected_start_time", today.toISOString())
      .lt("expected_start_time", tomorrow.toISOString());

    if (!tripsTodayError && tripsTodayCount !== null) {
      stats.value.tripsToday = tripsTodayCount;
    }

    // Trips in progress (actual_start_time is not null and actual_end_time is null)
    const { count: inProgressCount, error: inProgressError } = await supabase
      .from("trip")
      .select("id", { count: "exact", head: true })
      .not("actual_start_time", "is", null)
      .is("actual_end_time", null);
    if (!inProgressError && inProgressCount !== null) {
      stats.value.tripsInProgress = inProgressCount;
    }

    // Completed trips (actual_end_time is not null)
    const { count: completedCount, error: completedError } = await supabase
      .from("trip")
      .select("id", { count: "exact", head: true })
      .not("actual_end_time", "is", null);
    if (!completedError && completedCount !== null) {
      stats.value.completedTrips = completedCount;
    }
  } catch (error) {
    console.error(error);
    $q.notify({ type: "negative", message: "Failed to fetch trip stats" });
  }
}

function addTrip() {
  selectedTrip.value = {
    schedule_id: "",
    driver_id: "",
    conductor_id: "",
    route_id: "",
    vehicle_id: "",
    expected_start_time: "",
    expected_end_time: "",
    actual_start_time: "",
    actual_end_time: "",
    last_stop: "",
    driver_enter_time: "",
    driver_exit_time: "",
    conductor_enter_time: "",
  };
  isEdit.value = false;
  showTripDialog.value = true;
}

function editTrip(trip) {
  selectedTrip.value = { ...trip };
  isEdit.value = true;
  showTripDialog.value = true;
}

async function saveTrip() {
  const tripData = { ...selectedTrip.value };

  // Convert empty strings to null for optional datetime fields
  [
    "actual_start_time",
    "actual_end_time",
    "driver_enter_time",
    "driver_exit_time",
    "conductor_enter_time",
  ].forEach((field) => {
    if (!tripData[field]) tripData[field] = null;
  });

  try {
    $q.loading.show();
    if (isEdit.value) {
      // Update existing trip
      const { error } = await supabase
        .from("trip")
        .update(tripData)
        .eq("id", tripData.id);
      if (error) {
        console.error(error);
        $q.notify({ type: "negative", message: "Failed to update trip" });
      } else {
        $q.notify({ type: "positive", message: "Trip updated!" });
        fetchTrips();
        fetchStats();
      }
    } else {
      // Insert new trip
      const { error } = await supabase.from("trip").insert(tripData);
      if (error) {
        console.error(error);
        $q.notify({ type: "negative", message: "Failed to create trip" });
      } else {
        $q.notify({ type: "positive", message: "Trip created!" });
        fetchTrips();
        fetchStats();
      }
    }
  } catch (error) {
    console.error(error);
    $q.notify({ type: "negative", message: "Error saving trip" });
  } finally {
    $q.loading.hide();
    showTripDialog.value = false;
  }
}

function deleteTrip() {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure you want to delete this trip?",
    cancel: true,
    persistent: true,
    ok: { label: "Delete", color: "negative", flat: true },
  }).onOk(async () => {
    try {
      $q.loading.show();
      const { error } = await supabase
        .from("trip")
        .delete()
        .eq("id", selectedTrip.value.id);
      if (error) {
        console.error(error);
        $q.notify({ type: "negative", message: "Failed to delete trip" });
      } else {
        $q.notify({ type: "positive", message: "Trip deleted" });
        fetchTrips();
        fetchStats();
        selectedTrip.value = null;
      }
    } catch (error) {
      console.error(error);
      $q.notify({ type: "negative", message: "Error deleting trip" });
    } finally {
      $q.loading.hide();
    }
  });
}

// Side Panel: Fetch and Display Trip-wise Stats
async function viewTripDetails(trip) {
  selectedTripDetails.value = null;
  tripStats.value = {
    totalTickets: 0,
    totalRevenue: 0,
    uniqueCustomers: 0,
    busyStops: [],
  };
  showTripDetails.value = true;
  await fetchTripDetails(trip.id);
}

async function fetchTripDetails(tripId) {
  try {
    // Fetch trip details with related data
    const { data, error } = await supabase
      .from("trip")
      .select(
        `
        *,
        driver:driver_id(name),
        conductor:conductor_id(name),
        route:route_id(name),
        vehicle:vehicle_id(registration_no),
        schedule:schedule_id(id)
      `
      )
      .eq("id", tripId)
      .single();

    if (error) {
      console.error(error);
      $q.notify({ type: "negative", message: "Failed to fetch trip details" });
      return;
    }

    selectedTripDetails.value = data;

    // Fetch related ticket data for statistics
    const { data: tickets, error: ticketError } = await supabase
      .from("ticket")
      .select("*")
      .eq("trip_id", tripId);

    if (ticketError) {
      console.error(ticketError);
      $q.notify({
        type: "negative",
        message: "Failed to fetch tickets for trip",
      });
      return;
    }

    // Compute Total Tickets
    tripStats.value.totalTickets = tickets.length;

    // Compute Total Revenue (assuming fare is numeric stored as text)
    const numericFares = tickets
      .map((t) => parseFloat(t.fare))
      .filter((f) => !isNaN(f));
    tripStats.value.totalRevenue = numericFares
      .reduce((acc, val) => acc + val, 0)
      .toFixed(2);

    // Compute Unique Customers
    const uniqueCustSet = new Set(tickets.map((t) => t.costumer_id));
    tripStats.value.uniqueCustomers = uniqueCustSet.size;

    // Compute Busy Stops (source and destination)
    const stopCounts = {};
    tickets.forEach((t) => {
      if (t.source_stop_id) {
        stopCounts[t.source_stop_id] = (stopCounts[t.source_stop_id] || 0) + 1;
      }
      if (t.destination_stop_id) {
        stopCounts[t.destination_stop_id] =
          (stopCounts[t.destination_stop_id] || 0) + 1;
      }
    });

    // Fetch stop details
    const stopIds = Object.keys(stopCounts);
    const { data: stopsData, error: stopsError } = await supabase
      .from("stop")
      .select("stop_id, name")
      .in("stop_id", stopIds);

    if (stopsError) {
      console.error(stopsError);
      $q.notify({
        type: "negative",
        message: "Failed to fetch stops for trip",
      });
      return;
    }

    // Map stop_id to name
    const stopMap = {};
    stopsData.forEach((stop) => {
      stopMap[stop.stop_id] = stop.name;
    });

    // Prepare busy stops list
    const busyStopsList = Object.entries(stopCounts).map(
      ([stop_id, count]) => ({
        stop_id,
        name: stopMap[stop_id] || "Unknown",
        ticketCount: count,
      })
    );

    // Sort busy stops by ticket count descending
    busyStopsList.sort((a, b) => b.ticketCount - a.ticketCount);

    // Assign to tripStats
    tripStats.value.busyStops = busyStopsList.slice(0, 5); // Top 5 busy stops

    // Set mapCenter based on the last_stop's coordinates
    // Assuming 'last_stop' contains the stop_id
    if (data.last_stop && stopMap[data.last_stop]) {
      mapCenter.value = {
        lat: stopMap[data.last_stop].latitude,
        lng: stopMap[data.last_stop].longitude,
      };
    } else {
      mapCenter.value = null; // Or set to a default location
    }
  } catch (error) {
    console.error(error);
    $q.notify({ type: "negative", message: "Failed to fetch trip details" });
  }
}

// Formatting Functions
function formatTimestamp(ts) {
  if (!ts) return "N/A";
  const d = new Date(ts);
  return d.toLocaleString();
}

function formatDate(dt) {
  if (!dt) return "N/A";
  const d = new Date(dt);
  return d.toLocaleDateString();
}
</script>

<style scoped>
.dragging {
  opacity: 0.5;
}
</style>
