<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">

      <!-- Stats Section -->
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="row justify-between items-center">
              <div class="text-h6">Schedules</div>
              <div>
                <q-btn color="primary" label="Add Schedule" icon="eva-plus" @click="addSchedule" />
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-3">
                <q-card flat bordered>
                  <q-card-section>
                    <div class="text-subtitle1">Total Schedules</div>
                    <div class="text-h5">{{ stats.totalSchedules }}</div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-3">
                <q-card flat bordered>
                  <q-card-section>
                    <div class="text-subtitle1">Unique Vehicles</div>
                    <div class="text-h5">{{ stats.uniqueVehicles }}</div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-3">
                <q-card flat bordered>
                  <q-card-section>
                    <div class="text-subtitle1">Unique drivers</div>
                    <div class="text-h5">{{ stats.uniquedriver }}</div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-3">
                <q-card flat bordered>
                  <q-card-section>
                    <div class="text-subtitle1">Unique Conductors</div>
                    <div class="text-h5">{{ stats.uniqueConductors }}</div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-3">
                <q-card flat bordered>
                  <q-card-section>
                    <div class="text-subtitle1">Earliest Start</div>
                    <div class="text-h5">{{ stats.earliestStart }}</div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Schedules Table -->
      <div class="col-12">
        <q-table :rows="schedules" :columns="columns" row-key="id" :rows-per-page-options="[10, 20, 0]">
          <template #body-cell-actions="props">
            <q-td :props="props">
              <q-btn icon="edit" color="primary" round flat @click="editSchedule(props.row)"></q-btn>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>

    <q-dialog v-model="showScheduleDialog">
      <q-card v-if="selectedSchedule">
        <q-card-section>
          <div class="text-h6">
            {{ isEdit ? 'Edit Schedule' : 'Add Schedule' }}
            <q-btn flat round dense icon="close" aria-label="Close" v-close-popup class="float-right" />
          </div>
        </q-card-section>

        <q-separator></q-separator>

        <q-card-section>
          <div class="row q-col-gutter-sm">
            <div class="col-12">
              <q-input v-model="selectedSchedule.vehicle_id" placeholder="Vehicle ID" outlined dense clearable />
            </div>
            <div class="col-12">
              <q-input v-model="selectedSchedule.driver_id" placeholder="Driver ID" outlined dense clearable />
            </div>
            <div class="col-12">
              <q-input v-model="selectedSchedule.driver_name" placeholder="Driver Name" outlined dense clearable />
            </div>
            <div class="col-12">
              <q-input v-model="selectedSchedule.conductor_id" placeholder="Conductor ID" outlined dense clearable />
            </div>
            <div class="col-12">
              <q-input v-model="selectedSchedule.conductor_name" placeholder="Conductor Name" outlined dense
                clearable />
            </div>
            <div class="col-12">
              <q-input v-model="selectedSchedule.time_start" type="datetime-local" placeholder="Start Time" outlined
                dense clearable />
            </div>
            <div class="col-12">
              <!-- frequency is an interval, user can input as HH:MM:SS -->
              <q-input v-model="selectedSchedule.frequency" placeholder="Frequency (HH:MM:SS)" outlined dense
                clearable />
            </div>

            <div class="col-auto" v-if="isEdit">
              <q-btn icon="delete" color="negative" round flat @click="deleteSchedule" v-close-popup></q-btn>
            </div>

            <div class="col">
              <q-btn label="Save" color="primary" rounded class="full-width" @click="saveSchedule"></q-btn>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "src/boot/supabase";
import { useQuasar } from "quasar";

const $q = useQuasar();

const schedules = ref([]);
const selectedSchedule = ref(null);
const isEdit = ref(false);
const showScheduleDialog = ref(false);

const stats = ref({
  totalSchedules: 0,
  uniqueVehicles: 0,
  uniqueDrivers: 0,
  uniqueConductors: 0,
  earliestStart: "",
});

const columns = [
  { name: "vehicle_id", label: "Vehicle ID", align: "left", field: row => row.vehicle.registration_no },
  { name: "driver_id", label: "Driver ID", align: "left", field: "driver_id" },
  { name: "driver_name", label: "Driver Name", align: "left", field: "driver_name" },
  { name: "conductor_id", label: "Conductor ID", align: "left", field: "conductor_id" },
  { name: "conductor_name", label: "Conductor Name", align: "left", field: "conductor_name" },
  { name: "time_start", label: "Start Time", align: "left", field: "time_start" },
  { name: "frequency", label: "Frequency", align: "left", field: "frequency" },
  { name: "created_at", label: "Created At", align: "left", field: "created_at" },
  { name: "actions", label: "Actions", align: "center", field: "actions" },
];

onMounted(() => {
  fetchSchedules();
  fetchStats();
});

async function fetchSchedules() {
  try {
    const { data, error } = await supabase.from("schedule").select("*, vehicle: vehicle_id(*),driver: driver_name(*),conductor: conductor_name(*)");
    if (error) {
      console.error(error);
      $q.notify({ type: "negative", message: "Failed to fetch schedules" });
    } else {
      schedules.value = data;
    }
  } catch (error) {
    console.error(error);
    $q.notify({ type: "negative", message: "Failed to fetch schedules" });
  }
}

async function fetchStats() {
  try {
    // total schedules
    const { count: totalCount, error: countError } = await supabase
      .from("schedule")
      .select("id", { count: "exact", head: true });
    if (!countError && totalCount !== null) {
      stats.value.totalSchedules = totalCount;
    }

    // unique vehicles
    const { data: vehicleData, error: vehicleError } = await supabase
      .from("schedule")
      .select("vehicle_id");
    if (!vehicleError && vehicleData) {
      const vehicleSet = new Set(vehicleData.map(r => r.vehicle_id));
      stats.value.uniqueVehicles = vehicleSet.size;
    }
    //unique drivers
    const { data: driverData, error: driverError } = await supabase
      .from("schedule")
      .select("driver_id");
    if (!driverError && driverData) {
      const driverSet = new Set(driverData.map(r => r.driver_id));
      stats.value.uniquedrivers = driverSet.size;
    }

    // unique conductors
    const { data: conductorData, error: conductorError } = await supabase
      .from("schedule")
      .select("conductor_id");
    if (!conductorError && conductorData) {
      const conductorSet = new Set(conductorData.map(r => r.conductor_id));
      stats.value.uniqueConductors = conductorSet.size;
    }

    // earliest start
    const { data: startData, error: startError } = await supabase
      .from("schedule")
      .select("time_start")
      .order("time_start", { ascending: true })
      .limit(1);
    if (!startError && startData.length > 0) {
      const earliest = new Date(startData[0].time_start);
      stats.value.earliestStart = earliest.toLocaleString();
    } else {
      stats.value.earliestStart = "N/A";
    }

  } catch (error) {
    console.error(error);
    $q.notify({ type: "negative", message: "Failed to fetch schedule stats" });
  }
}

function addSchedule() {
  selectedSchedule.value = {
    vehicle_id: "",
    driver_id: "",
    driver_name: '',
    conductor_id: "",
    conductor_name: '',
    time_start: "",
    frequency: "",
  };
  isEdit.value = false;
  showScheduleDialog.value = true;
}

function editSchedule(schedule) {
  selectedSchedule.value = { ...schedule };
  isEdit.value = true;
  showScheduleDialog.value = true;
}

async function saveSchedule() {
  const scheduleData = { ...selectedSchedule.value };

  try {
    $q.loading.show();
    if (isEdit.value) {
      const { error } = await supabase
        .from("schedule")
        .update(scheduleData)
        .eq("id", scheduleData.id);
      if (error) {
        console.error(error);
        $q.notify({ type: "negative", message: "Failed to update schedule" });
      } else {
        $q.notify({ type: "positive", message: "Schedule updated!" });
        fetchSchedules();
        fetchStats();
      }
    } else {
      const { error } = await supabase.from("schedule").insert(scheduleData);
      if (error) {
        console.error(error);
        $q.notify({ type: "negative", message: "Failed to create schedule" });
      } else {
        $q.notify({ type: "positive", message: "Schedule created!" });
        fetchSchedules();
        fetchStats();
      }
    }
  } catch (error) {
    console.error(error);
    $q.notify({ type: "negative", message: "Error saving schedule" });
  } finally {
    $q.loading.hide();
    showScheduleDialog.value = false;
  }
}

function deleteSchedule() {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure you want to delete this schedule?",
    cancel: true,
    persistent: true,
    ok: { label: "Delete", color: "negative", flat: true },
  }).onOk(async () => {
    try {
      $q.loading.show();
      const { error } = await supabase
        .from("schedule")
        .delete()
        .eq("id", selectedSchedule.value.id);

      if (error) {
        console.error(error);
        $q.notify({ type: "negative", message: "Failed to delete schedule" });
      } else {
        $q.notify({ type: "positive", message: "Schedule deleted" });
        fetchSchedules();
        fetchStats();
        selectedSchedule.value = null;
      }
    } catch (error) {
      console.error(error);
      $q.notify({ type: "negative", message: "Error deleting schedule" });
    } finally {
      $q.loading.hide();
    }
  });
}
</script>
