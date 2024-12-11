<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6">Routes</div>
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
              @click="selectRoute(route.id)"
              :class="{ 'bg-blue-3': selectedRouteId === route.id }"
            >
              <q-item-section>
                <q-item-label>{{ route.name }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="eva-chevron-right-outline"></q-icon>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <!-- ROUTE STOPS & MANAGEMENT -->
      <div class="col-6" v-if="selectedRouteId">
        <!-- <pre>{{ selectedRouteStops }}</pre> -->

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
                    <q-icon name="eva-chevron-right-outline"></q-icon>
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
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "src/boot/supabase";
import Draggable from "vuedraggable";

const routes = ref([]);
const selectedRouteId = ref(null);
const selectedRouteStops = ref([]);
const allStops = ref([]);
const selectedStopToAdd = ref(null);

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
  // Assuming 'stop' table is structured with `stop_id` and `name`.
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

  // Determine new order: one more than the last stop's order or 1 if none
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
  } else {
    selectedRouteStops.value.push(...data); // Add new stop data to the list
    selectedStopToAdd.value = null;
  }
};

// Called after drag-and-drop ends
const updateRouteStopOrder = async (evt) => {
  for (const rs of selectedRouteStops.value) {
    const { error } = await supabase
      .from("route_stop")
      .update({ order: rs.order })
      .eq("id", rs.id);
    if (error) console.error(error);
  }
};

const selectStop = (stopId) => {
  console.log("Selected stop:", stopId);
};
</script>

<style scoped>
.dragging {
  opacity: 0.5;
}
</style>
