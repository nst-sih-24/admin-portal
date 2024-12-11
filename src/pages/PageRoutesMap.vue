<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-3">
        <q-card>
          <q-list>
            <q-item-label header>Routes</q-item-label>

            <q-item>
              <q-item-section>
                <q-btn @click="fetchStopsForSelectedRoutes">Apply</q-btn>
              </q-item-section>
            </q-item>

            <q-item v-for="route in routes" :key="route.id" clickable>
              <q-item-section side>
                <q-checkbox
                  v-model="selectedRoutes"
                  :val="route"
                  class="q-mr-sm"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label>
                  {{ route.name }}
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-icon name="circle" :color="route.color"></q-icon>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <!-- ROUTE STOPS & MANAGEMENT -->
      <div class="col-9">
        <!-- Google Map Section -->
        <q-card class="q-mb-md">
          <q-item-label header>Map</q-item-label>
          <q-card-section>
            <GoogleMap
              :api-key="GMAP_API_KEY"
              :center="mapCenter"
              :zoom="11"
              style="height: 700px"
              mapId="117cde968721239e"
              :options="{
                mapTypeControl: false,
                streetViewControl: false,
                disableDefaultUI: true,
              }"
            >
              <template>
                <Polyline
                  v-for="(route, idx) in visibleRoutes"
                  :key="idx"
                  :options="{
                    path: route,
                    geodesic: true,
                    strokeColor: route[0].color,
                    strokeOpacity: 1.0,
                    strokeWeight: 2,
                  }"
                />
              </template>
            </GoogleMap>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { supabase } from "src/boot/supabase";
import Draggable from "vuedraggable";
import { GoogleMap, AdvancedMarker, Polyline } from "vue3-google-map";

const GMAP_API_KEY = import.meta.env.VITE_GMAP_API_KEY;

const COLORS = [
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
  "pink",
  "black",
  "fuchsia",
  "gray",
  "lime",
  "maroon",
  "navy",
  "olive",
  "silver",
  "teal",
];

const routes = ref([]);

const fetchRoutes = async () => {
  const { data, error } = await supabase.from("route").select("*");
  if (error) {
    console.error(error);
  } else {
    data.forEach((route, idx) => {
      route.color = COLORS[idx % COLORS.length];
    });

    routes.value = data;

    // select all by default
    selectedRoutes.value = data;

    fetchStopsForSelectedRoutes();
  }
};

onMounted(() => {
  fetchRoutes();
});

const selectedRoutes = ref([]);
const visibleRoutes = ref([]);

const fetchStopsForSelectedRoutes = async () => {
  const routeStops = await Promise.all(
    selectedRoutes.value.map(async (route) => {
      const routeStops = await fetchRouteStops(route.id);
      return routeStops.map((rs) => ({
        lat: parseFloat(rs.stop.latitude),
        lng: parseFloat(rs.stop.longitude),
        color: route.color,
      }));
    })
  );

  visibleRoutes.value = routeStops;
};

const mapCenter = {
  // delhi
  lat: 28.6139,
  lng: 77.209,
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
</script>
