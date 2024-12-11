<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="row justify-between">
              <div class="text-h6">Stops</div>

              <div class="actions">
                <q-btn
                  color="primary"
                  label="Add Stop"
                  @click="addStop"
                  icon="eva-plus"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12">
        <q-table :rows="stops" :columns="columns" row-key="stop_id"></q-table>
      </div>

      <div class="col-6">
        <q-card>
          <!-- TODO: Add map to choose a point as a new stop -->
        </q-card>
      </div>
    </div>

    <q-dialog v-model="showStopDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">
            Edit Stop
            <q-btn
              flat
              round
              dense
              icon="close"
              aria-label="Close"
              @click="showStopDialog = false"
              class="float-right"
            />
          </div>
        </q-card-section>

        <q-spearator></q-spearator>

        <q-card-section>
          <q-input
            v-model="selectedStop.name"
            placeholder="Stop Name"
            outlined
            dense
            clearable
            class="q-mb-md"
          />

          <q-input
            v-model="selectedStop.plus_code_address"
            placeholder="Plus Code Address"
            outlined
            dense
            clearable
          ></q-input>

          <!-- TODO: map picker -->

          <q-input
            v-model="selectedStop.latitude"
            placeholder="Latitude"
            outlined
            dense
            clearable
            class="q-mb-md"
          />

          <q-input
            v-model="selectedStop.longitude"
            placeholder="Longitude"
            outlined
            dense
            clearable
          ></q-input>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "src/boot/supabase";

const stops = ref([]);

const columns = [
  {
    name: "stop_name",
    label: "Stop Name",
    align: "left",
    field: "name",
  },
  {
    name: "plus_code_address",
    label: "Plus Code Address",
    align: "left",
    field: "plus_code_address",
  },
  {
    name: "latitude",
    label: "Latitude",
    align: "left",
    field: "latitude",
  },
  {
    name: "longitude",
    label: "Longitude",
    align: "left",
    field: "longitude",
  },
];

const fetchStops = async () => {
  const { data, error } = await supabase.from("stop").select("*");

  if (error) {
    console.error(error);
  } else {
    stops.value = data;
  }
};

/**
stops = [{
    "stop_id": "cc4067e9-c9b0-46c7-9e3a-2af06a313420",
    "name": "NSIT",
    "plus_code_address": "J25P+82 New Delhi, Delhi",
    "created_at": "2024-12-05T20:05:20.36071+00:00",
    "latitude": "28.64399",
    "longitude": "77.091"
  }]
 */

onMounted(() => {
  fetchStops();
});

const selectedStop = ref(null);

const showStopDialog = ref(false);

function addStop() {
  selectedStop.value = {
    name: "",
    plus_code_address: "",
    latitude: "",
    longitude: "",
  };
  showStopDialog.value = true;
}
</script>
