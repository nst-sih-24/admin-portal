<template>
  <q-page class="q-pa-md">
    <!-- <pre>{{ routes }}</pre> -->

    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card class="">
          <q-card-section>
            <div class="text-h6">Routes</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-6">
        <q-card>
          <q-list>
            <q-item-label header> Routes </q-item-label>
            <q-item
              v-for="route in routes"
              :key="route.id"
              clickable
              @click="selectRoute(route.id)"
              :class="{
                'bg-blue-3': selectedRouteId === route.id,
              }"
            >
              <q-item-section>
                <q-item-label>
                  {{ route.name }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="eva-chevron-right-outline"></q-icon>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
      <div class="col-6">
        <pre>{{ selectedRouteStops }}</pre>

        <q-card>
          <!-- TODO: Add map to choose a point as a new stop -->
        </q-card>

        <q-card>
          <q-list>
            <q-item-label header> Route Stops </q-item-label>
            <q-item
              v-for="routeStop in selectedRouteStops"
              :key="routeStop.id"
              clickable
              @click="selectStop(stop.id)"
            >
              <q-item-section>
                <q-item-label>
                  {{ routeStop.stop.name }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="eva-chevron-right-outline"></q-icon>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "src/boot/supabase";

const routes = ref([]);

const columns = [
  {
    name: "route_name",
    label: "Route Name",
    align: "left",
    field: "name",
  },
];

const fetchRoutes = async () => {
  const { data, error } = await supabase.from("route").select("*");

  if (error) {
    console.error(error);
  } else {
    routes.value = data;
  }
};

/**
routes = [
  {
    "name": "101",
    "created_at": "2024-12-05T19:37:21.905104+00:00",
    "id": "ea811e39-176c-4116-ba0d-30c47d2c4c52"
  }
]

routeStop = [
  {
    "route_id": "f1992924-beda-4554-8182-67f7e5054e99",
    "stop_id": "7fa22995-4abf-468c-bae2-277346ada855",
    "order": 3,
    "time_from_start": 100,
    "id": "b601b690-f6f7-4775-ae84-f82c4a6d6a1f",
    "created_at": "2024-12-11T05:02:46.206478+00:00",
    "stop": {
      "name": "Ashram",
      "stop_id": "7fa22995-4abf-468c-bae2-277346ada855",
      "latitude": "28.55",
      "longitude": "77.2667",
      "created_at": "2024-12-05T19:56:00.223656+00:00",
      "plus_code_address": "H7F4+MQ New Delhi, Delhi"
    },
    "route": {
      "id": "f1992924-beda-4554-8182-67f7e5054e99",
      "name": "100",
      "created_at": "2024-12-05T19:36:41.485384+00:00"
    }
  }
]

 */

onMounted(() => {
  fetchRoutes();
});

const selectedRouteId = ref(null);
const selectedRouteStops = ref([]);

const selectRoute = async (routeId) => {
  selectedRouteId.value = routeId;
  selectedRouteStops.value = await fetchRouteStops(routeId);
};

const selectStop = (stopId) => {
  console.log(stopId);
};

const fetchRouteStops = async (routeId) => {
  const { data, error } = await supabase
    .from("route_stop")
    .select("*, stop:stop_id(*)")
    .eq("route_id", routeId);

  if (error) {
    console.error(error);
  } else {
    return data;
  }
};

const fetchRoute = async (routeId) => {
  const { data, error } = await supabase
    .from("route")
    .select("*")
    .eq("id", routeId);

  if (error) {
    console.error(error);
  } else {
    return data;
  }
};
</script>
