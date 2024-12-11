<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="row justify-between items-center">
              <div class="text-h6">Routes</div>
              <div>
                <q-btn
                  color="primary"
                  label="Add Route"
                  icon="eva-plus"
                  @click="addRoute"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- ROUTE LIST -->
      <div class="col-6">
        <q-card>
          <q-list>
            <q-item-label header>Routes</q-item-label>
            <q-item
              v-for="route in routes"
              :key="route.id"
              clickable
              :class="{ 'bg-blue-3': selectedRouteId === route.id }"
            >
              <q-item-section @click.stop="selectRoute(route.id)">
                <q-item-label>{{ route.name }}</q-item-label>
              </q-item-section>
              <q-item-section side class="row">
                <div class="items-center q-gutter-sm">
                  <!-- Edit Route Button -->
                  <q-btn
                    icon="edit"
                    color="primary"
                    round
                    flat
                    dense
                    @click.stop="editRoute(route)"
                  />

                  <q-btn
                    icon="chevron_right"
                    round
                    flat
                    dense
                    @click.stop="selectRoute(route.id)"
                  />
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <!-- ROUTE STOPS & MANAGEMENT -->
      <div class="col-6" v-if="selectedRouteId">
        <!-- Placeholder for map -->
        <q-card class="q-mb-md">
          <q-item-label header>Map</q-item-label>
          <q-card-section>
            <div class="map-placeholder"></div>
            <!-- TODO: Add map to choose a point as a new stop -->
          </q-card-section>

          <q-separator></q-separator>

          <q-item-label header>Stops</q-item-label>
          <q-card-section>
            <!-- Add Stop Dropdown -->
            <div class="row q-col-gutter-sm items-center">
              <div class="col">
                <q-select
                  v-model="selectedStopToAdd"
                  :options="
                    allStops.map((s) => ({
                      label: s.name,
                      value: s.stop_id,
                      key: s.stop_id,
                    }))
                  "
                  emit-value
                  map-options
                  label="Select Stop"
                  dense
                  outlined
                  clearable
                />
              </div>
              <div class="col-auto">
                <q-btn
                  label="Add Stop"
                  color="primary"
                  @click="addStopToRoute"
                  :disable="!selectedStopToAdd"
                />
              </div>
            </div>
          </q-card-section>

          <q-item>
            <q-item-section>
              <q-item-label caption>
                <q-icon name="info"></q-icon>
                Drag to rearrange route stops below.
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-list>
            <!-- Draggable stops list -->
            <draggable
              v-model="selectedRouteStops"
              @end="updateRouteStopOrder"
              handle=".handle"
              :animation="200"
              item-key="id"
            >
              <template #item="{ element }">
                <q-item clickable>
                  <q-item-section side class="handle">
                    <q-icon name="drag_indicator" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ element.stop.name }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <!-- Delete Route Stop Button -->
                    <q-btn
                      icon="delete"
                      color="negative"
                      round
                      flat
                      dense
                      @click.stop="deleteRouteStop(element.id)"
                    />
                  </q-item-section>
                </q-item>
              </template>
            </draggable>
          </q-list>
        </q-card>
      </div>

      <!-- NO ROUTE SELECTED -->
      <div v-else class="col-6">
        <q-card>
          <q-item-label header>Select a route to see details.</q-item-label>
        </q-card>
      </div>
    </div>

    <!-- Add/Edit Route Dialog -->
    <q-dialog v-model="showRouteDialog">
      <q-card v-if="selectedRoute">
        <q-card-section>
          <div class="text-h6">
            {{ isEditRoute ? "Edit Route" : "Add Route" }}
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
                v-model="selectedRoute.name"
                placeholder="Route Name"
                outlined
                dense
                clearable
                autofocus
              />
            </div>

            <div class="col-auto" v-if="isEditRoute">
              <q-btn
                icon="delete"
                color="negative"
                round
                flat
                @click="deleteRoute(selectedRoute)"
                v-close-popup
              ></q-btn>
            </div>

            <div class="col">
              <q-btn
                label="Save"
                color="primary"
                rounded
                class="full-width"
                @click="saveRoute"
              ></q-btn>
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
import Draggable from "vuedraggable";
import { useQuasar } from "quasar";

const $q = useQuasar();

const routes = ref([]);
const selectedRouteId = ref(null);
const selectedRouteStops = ref([]);
const allStops = ref([]);
const selectedStopToAdd = ref(null);

const showRouteDialog = ref(false);
const selectedRoute = ref(null);
const isEditRoute = ref(false);

onMounted(() => {
  fetchRoutes();
  fetchAllStops();
});

const fetchRoutes = async () => {
  const { data, error } = await supabase.from("route").select("*");
  if (error) {
    console.error(error);
  } else {
    routes.value = data;
  }
};

const fetchAllStops = async () => {
  const { data, error } = await supabase.from("stop").select("*");
  if (error) {
    console.error(error);
  } else {
    allStops.value = data;
  }
};

const selectRoute = async (routeId) => {
  selectedRouteId.value = routeId;
  selectedRouteStops.value = await fetchRouteStops(routeId);
};

const fetchRouteStops = async (routeId) => {
  const { data, error } = await supabase
    .from("route_stop")
    .select("*, stop:stop_id(*)")
    .eq("route_id", routeId)
    .order("order", { ascending: true });

  if (error) {
    console.error(error);
    return [];
  } else {
    return data;
  }
};

const addStopToRoute = async () => {
  if (!selectedStopToAdd.value || !selectedRouteId.value) return;

  const maxOrder = selectedRouteStops.value.reduce(
    (acc, rs) => Math.max(acc, rs.order),
    0
  );
  const newOrder = maxOrder + 1;

  const { data, error } = await supabase
    .from("route_stop")
    .insert({
      route_id: selectedRouteId.value,
      stop_id: selectedStopToAdd.value,
      order: newOrder,
    })
    .select("*, stop:stop_id(*)");

  if (error) {
    console.error(error);
    $q.notify({ type: "negative", message: "Failed to add stop to route" });
  } else {
    selectedRouteStops.value.push(...data);
    selectedStopToAdd.value = null;
    $q.notify({ type: "positive", message: "Stop added to route!" });
  }
};

const deleteRouteStop = async (routeStopId) => {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure you want to delete this stop from the route?",
    cancel: true,
    persistent: true,
    ok: { label: "Delete", color: "negative", flat: true },
  }).onOk(async () => {
    try {
      $q.loading.show();
      const { error } = await supabase
        .from("route_stop")
        .delete()
        .eq("id", routeStopId);
      if (error) {
        console.error(error);
        $q.notify({ type: "negative", message: "Failed to delete stop" });
      } else {
        $q.notify({ type: "positive", message: "Stop deleted" });
        selectedRouteStops.value = selectedRouteStops.value.filter(
          (rs) => rs.id !== routeStopId
        );
      }
    } catch (error) {
      console.error(error);
      $q.notify({ type: "negative", message: "Error deleting stop" });
    } finally {
      $q.loading.hide();
    }
  });
};

const updateRouteStopOrder = async (evt) => {
  for (const rs of selectedRouteStops.value) {
    const { error } = await supabase
      .from("route_stop")
      .update({ order: rs.order })
      .eq("id", rs.id);
    if (error) {
      console.error(error);
      $q.notify({ type: "negative", message: "Failed to update order" });
    }
  }
};

const selectStop = (stopId) => {
  console.log("Selected stop:", stopId);
};

function addRoute() {
  selectedRoute.value = { name: "" };
  isEditRoute.value = false;
  showRouteDialog.value = true;
}

function editRoute(route) {
  selectedRoute.value = { ...route };
  isEditRoute.value = true;
  showRouteDialog.value = true;
}

async function saveRoute() {
  try {
    $q.loading.show();
    if (isEditRoute.value) {
      // update existing route
      const { error } = await supabase
        .from("route")
        .update({ name: selectedRoute.value.name })
        .eq("id", selectedRoute.value.id);

      if (error) {
        console.error(error);
        $q.notify({ type: "negative", message: "Failed to update route" });
      } else {
        $q.notify({ type: "positive", message: "Route updated!" });
        fetchRoutes();
      }
    } else {
      // insert new route
      const { data, error } = await supabase
        .from("route")
        .insert({ name: selectedRoute.value.name })
        .select("*");

      if (error) {
        console.error(error);
        $q.notify({ type: "negative", message: "Failed to create route" });
      } else {
        $q.notify({ type: "positive", message: "Route created!" });
        fetchRoutes();
      }
    }
  } catch (error) {
    console.error(error);
    $q.notify({ type: "negative", message: "Error saving route" });
  } finally {
    $q.loading.hide();
    showRouteDialog.value = false;
  }
}

function deleteRoute(route) {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure you want to delete this route?",
    cancel: true,
    persistent: true,
    ok: { label: "Delete", color: "negative", flat: true },
  }).onOk(async () => {
    try {
      $q.loading.show();
      const { error } = await supabase
        .from("route")
        .delete()
        .eq("id", route.id);
      if (error) {
        console.error(error);
        $q.notify({ type: "negative", message: "Failed to delete route" });
      } else {
        $q.notify({ type: "positive", message: "Route deleted" });
        fetchRoutes();
        // If deleted route was selected, clear selection
        if (selectedRouteId.value === route.id) {
          selectedRouteId.value = null;
          selectedRouteStops.value = [];
        }
      }
    } catch (error) {
      console.error(error);
      $q.notify({ type: "negative", message: "Error deleting route" });
    } finally {
      $q.loading.hide();
    }
  });
}
</script>

<style scoped>
.dragging {
  opacity: 0.5;
}

.map-placeholder {
  height: 200px;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
