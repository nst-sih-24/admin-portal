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
        <q-table
          :rows="stops"
          :columns="columns"
          row-key="stop_id"
          :rows-per-page-options="[10, 20, 0]"
        >
          <template #body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                icon="edit"
                color="primary"
                round
                flat
                @click="editStop(props.row)"
              ></q-btn>
            </q-td>
          </template>
        </q-table>
      </div>

      <div class="col-6">
        <q-card>
          <!-- TODO: Add map to choose a point as a new stop -->
        </q-card>
      </div>
    </div>

    <q-dialog v-model="showStopDialog">
      <q-card v-if="selectedStop">
        <q-card-section>
          <div class="text-h6">
            Edit Stop
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
            <div class="col-12">
              <q-input
                v-model="selectedStop.name"
                placeholder="Stop Name"
                outlined
                dense
                clearable
                autofocus
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="selectedStop.plus_code_address"
                placeholder="Plus Code Address"
                outlined
                dense
                clearable
              ></q-input>
            </div>
            <div class="col-6">
              <q-input
                v-model="selectedStop.latitude"
                placeholder="Latitude"
                outlined
                dense
                clearable
              />
            </div>
            <div class="col-6">
              <q-input
                v-model="selectedStop.longitude"
                placeholder="Longitude"
                outlined
                dense
                clearable
              ></q-input>
            </div>

            <div class="col-auto" v-if="isEdit">
              <q-btn
                icon="delete"
                color="negative"
                round
                flat
                @click="deleteStop"
                v-close-popup
              ></q-btn>
            </div>

            <div class="col">
              <q-btn
                label="Save"
                color="primary"
                rounded
                class="full-width"
                @click="saveStop"
              ></q-btn>
            </div>
          </div>

          <!-- TODO: map picker -->
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
  {
    name: "actions",
    label: "Actions",
    align: "center",
    field: "actions",
    format: (val, row) => {
      return [
        {
          name: "edit",
          icon: "eva-edit",
          color: "primary",
          size: "md",
          onClick: () => editStop(row),
        },
      ];
    },
  },
];

const fetchStops = async () => {
  try {
    const { data, error } = await supabase
      .from("stop")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      stops.value = data;
    }
  } catch (error) {
    console.error(error);
    $q.notify({
      type: "negative",
      message: "Failed to fetch stops",
    });
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

const isEdit = ref(false);
const showStopDialog = ref(false);

function addStop() {
  selectedStop.value = {
    name: "",
    plus_code_address: "",
    latitude: "",
    longitude: "",
  };
  isEdit.value = false;
  showStopDialog.value = true;
}

function editStop(stop) {
  selectedStop.value = { ...stop };
  isEdit.value = true;
  showStopDialog.value = true;
}

async function saveStop() {
  if (isEdit.value) {
    // update
    try {
      $q.loading.show();
      const { data, error } = await supabase
        .from("stop")
        .update(selectedStop.value)
        .eq("stop_id", selectedStop.value.stop_id);

      if (error) {
        console.error(error);
      } else {
        fetchStops();
        $q.notify({
          type: "positive",
          message: "Stop updated!",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      $q.loading.hide();
      showStopDialog.value = false;
    }
  } else {
    // insert
    try {
      $q.loading.show();
      const { data, error } = await supabase
        .from("stop")
        .insert(selectedStop.value);

      if (error) {
        console.error(error);
      } else {
        fetchStops();
        $q.notify({
          type: "positive",
          message: "Stop created!",
        });
      }
    } catch (error) {
      console.error(error);
      $q.notify({
        type: "negative",
        message: "Failed to save stop",
      });
    } finally {
      $q.loading.hide();
      showStopDialog.value = false;
    }
  }
}

async function deleteStop() {
  // delete
  $q.dialog({
    title: "Confirm",
    message: "Are you sure you want to delete this stop?",
    cancel: true,
    persistent: true,
    ok: { label: "Delete", color: "negative", flat: true },
  }).onOk(async () => {
    try {
      $q.loading.show();
      const { data, error } = await supabase
        .from("stop")
        .delete()
        .eq("stop_id", selectedStop.value.stop_id);

      if (error) {
        console.error(error);
      } else {
        fetchStops();
        $q.notify({
          type: "positive",
          message: "Stop deleted",
        });
      }
    } catch (error) {
      console.error(error);
      $q.notify({
        type: "negative",
        message: "Failed to delete stop",
      });
    } finally {
      $q.loading.hide();
    }
  });
}
</script>
