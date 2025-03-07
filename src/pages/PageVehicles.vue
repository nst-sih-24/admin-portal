<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="row justify-between">
              <div class="text-h6">Vehicles</div>
              <div class="actions">
                <q-btn
                  color="primary"
                  label="Add Vehicle"
                  @click="addVehicle"
                  icon="eva-plus"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-8">
        <q-table
          :rows="vehicles"
          :columns="columns"
          row-key="id"
          :rows-per-page-options="[10, 20, 0]"
          @row-click="selectVehicle"
        >
          <template #body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                icon="edit"
                color="primary"
                round
                flat
                @click="editVehicle(props.row)"
              ></q-btn>
            </q-td>
          </template>
        </q-table>
      </div>

      <div class="col-4">
        <div class="col-4">
          <q-card v-if="selectedVehicle">
            <q-img
              src="/images/bus.jpg"
              style="height: 300px; object-fit: cover"
              placeholder="path/to/placeholder.jpg"
            />

            <q-card-section>
              <div class="text-subtitle1">
                {{ selectedVehicle.registration_no }}
              </div>
              <div>Type: {{ selectedVehicle.type }}</div>
              <div>
                Current Location: {{ selectedVehicle.current_location }}
              </div>
              <div>
                Insurance Expiry:
                {{ formatTimestamp(selectedVehicle.insurance_expiry) }}
              </div>
              <div>
                Registration Date:
                {{ formatDate(selectedVehicle.registration_date) }}
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <q-dialog v-model="showVehicleDialog">
      <q-card v-if="selectedVehicle">
        <q-card-section>
          <div class="text-h6">
            {{ isEdit ? "Edit Vehicle" : "Add Vehicle" }}
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
                v-model="selectedVehicle.type"
                placeholder="Type"
                outlined
                dense
                clearable
                autofocus
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="selectedVehicle.registration_no"
                placeholder="Registration No"
                outlined
                dense
                clearable
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="selectedVehicle.current_location"
                placeholder="Current Location (lat,lng)"
                outlined
                dense
                clearable
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="selectedVehicle.insurance_expiry"
                type="datetime-local"
                placeholder="Insurance Expiry"
                outlined
                dense
                clearable
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="selectedVehicle.registration_date"
                type="date"
                placeholder="Registration Date"
                outlined
                dense
                clearable
              />
            </div>

            <div class="col-auto" v-if="isEdit">
              <q-btn
                icon="delete"
                color="negative"
                round
                flat
                @click="deleteVehicle"
                v-close-popup
              ></q-btn>
            </div>

            <div class="col">
              <q-btn
                label="Save"
                color="primary"
                rounded
                class="full-width"
                @click="saveVehicle"
              ></q-btn>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { supabase } from "src/boot/supabase";
import { useQuasar } from "quasar";
import { GoogleMap, AdvancedMarker } from "vue3-google-map";

const GMAP_API_KEY = import.meta.env.VITE_GMAP_API_KEY;
const $q = useQuasar();

const vehicles = ref([]);
const selectedVehicle = ref(null);
const isEdit = ref(false);
const showVehicleDialog = ref(false);

// Columns for the table
const columns = [
  {
    name: "type",
    label: "Type",
    align: "left",
    field: "type",
  },
  {
    name: "registration_no",
    label: "Registration No",
    align: "left",
    field: "registration_no",
  },
  {
    name: "current_location",
    label: "Current Location",
    align: "left",
    field: "current_location",
  },
  {
    name: "insurance_expiry",
    label: "Insurance Expiry",
    align: "left",
    field: "insurance_expiry",
  },
  {
    name: "registration_date",
    label: "Registration Date",
    align: "left",
    field: "registration_date",
  },
  {
    name: "actions",
    label: "Actions",
    align: "center",
    field: "actions",
  },
];

onMounted(() => {
  fetchVehicles();
});

async function fetchVehicles() {
  try {
    const { data, error } = await supabase
      .from("vehicle")
      .select("*")
      .order("registration_date", { ascending: false });

    if (error) {
      console.error(error);
      $q.notify({ type: "negative", message: "Failed to fetch vehicles" });
    } else {
      vehicles.value = data;
    }
  } catch (error) {
    console.error(error);
    $q.notify({
      type: "negative",
      message: "Failed to fetch vehicles",
    });
  }
}

function selectVehicle(evt, row, idx) {
  selectedVehicle.value = { ...row };
}

function addVehicle() {
  selectedVehicle.value = {
    type: "",
    registration_no: "",
    current_location: "",
    insurance_expiry: "",
    registration_date: "",
  };
  isEdit.value = false;
  showVehicleDialog.value = true;
}

function editVehicle(vehicle) {
  selectedVehicle.value = { ...vehicle };
  isEdit.value = true;
  showVehicleDialog.value = true;
}

async function saveVehicle() {
  const vehicleData = { ...selectedVehicle.value };

  // Parse timestamps/dates if necessary, else leave as is
  // If fields are empty strings, can set them to null
  if (!vehicleData.insurance_expiry) vehicleData.insurance_expiry = null;
  if (!vehicleData.registration_date) vehicleData.registration_date = null;

  try {
    $q.loading.show();
    if (isEdit.value) {
      // Update existing vehicle
      const { error } = await supabase
        .from("vehicle")
        .update(vehicleData)
        .eq("id", vehicleData.id);

      if (error) {
        console.error(error);
        $q.notify({ type: "negative", message: "Failed to update vehicle" });
      } else {
        $q.notify({ type: "positive", message: "Vehicle updated!" });
        fetchVehicles();
      }
    } else {
      // Insert new vehicle
      const { error } = await supabase.from("vehicle").insert(vehicleData);
      if (error) {
        console.error(error);
        $q.notify({ type: "negative", message: "Failed to create vehicle" });
      } else {
        $q.notify({ type: "positive", message: "Vehicle created!" });
        fetchVehicles();
      }
    }
  } catch (error) {
    console.error(error);
    $q.notify({ type: "negative", message: "Error saving vehicle" });
  } finally {
    $q.loading.hide();
    showVehicleDialog.value = false;
  }
}

function deleteVehicle() {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure you want to delete this vehicle?",
    cancel: true,
    persistent: true,
    ok: { label: "Delete", color: "negative", flat: true },
  }).onOk(async () => {
    try {
      $q.loading.show();
      const { error } = await supabase
        .from("vehicle")
        .delete()
        .eq("id", selectedVehicle.value.id);

      if (error) {
        console.error(error);
        $q.notify({ type: "negative", message: "Failed to delete vehicle" });
      } else {
        $q.notify({ type: "positive", message: "Vehicle deleted" });
        fetchVehicles();
        selectedVehicle.value = null;
      }
    } catch (error) {
      console.error(error);
      $q.notify({ type: "negative", message: "Error deleting vehicle" });
    } finally {
      $q.loading.hide();
    }
  });
}

const mapCenter = computed(() => {
  if (!selectedVehicle.value) {
    return { lat: 28.6139, lng: 77.209 }; // Default to New Delhi
  }

  // Parse current_location as "lat,lng"
  const loc = selectedVehicle.value.current_location;
  if (!loc) return { lat: 28.6139, lng: 77.209 };

  const parts = loc.split(",");
  if (parts.length === 2) {
    const lat = parseFloat(parts[0]);
    const lng = parseFloat(parts[1]);
    if (!isNaN(lat) && !isNaN(lng)) {
      return { lat, lng };
    }
  }

  return { lat: 28.6139, lng: 77.209 };
});

function formatTimestamp(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  return d.toLocaleString();
}

function formatDate(dt) {
  if (!dt) return "";
  const d = new Date(dt);
  return d.toLocaleDateString();
}
</script>
