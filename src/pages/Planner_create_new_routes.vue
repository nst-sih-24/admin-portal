<template>
  <q-layout view="lHh Lpr lff">
    <q-page-container>
      <q-page>
        <div class="flex-container">
          <!-- Routes Planner Section (40%) -->
          <div class="flex-item routes-planner">
            <h3 class="heading">
              <i class="fa fa-bus"></i> DTC Bus Route Planner
            </h3>

            <q-form class="form-container" @submit="handleSubmit">
              <!-- Route No Input -->
              <q-input
                v-model="routeNumber"
                label="Route No"
                filled
                required
                class="input-field"
                :before="'fa-route'"
              />

              <!-- Bus No Input -->
              <q-input
                v-model="busNumber"
                label="Bus No"
                filled
                required
                class="input-field"
                :before="'fa-bus'"
              />

              <!-- Source Input -->
              <q-input
                v-model="source"
                label="Source"
                filled
                required
                class="input-field"
                :before="'fa-location-arrow'"
              />

              <!-- Stop List Input with Add Button -->
              <div class="stop-input-container">
                <q-input
                  v-model="stopInput"
                  label="Enter Stop"
                  filled
                  class="input-field"
                  autofocus
                  :before="'fa-plus'"
                  @keyup.enter="addStop"
                />
                <q-btn
                  label="Add Stop"
                  icon="add_location"
                  color="primary"
                  class="add-stop-btn"
                  @click="addStop"
                />
                <div v-if="stops.length" class="stops-list">
                  <p><strong>Stops:</strong></p>
                  <ul>
                    <li v-for="(stop, index) in stops" :key="index">
                      {{ stop.name }}
                      <q-btn
                        flat
                        icon="delete"
                        color="negative"
                        @click="removeStop(index)"
                      />
                      <!-- Trigger removeStop on Delete -->
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Destination Input -->
              <q-input
                v-model="destination"
                label="Destination"
                filled
                required
                class="input-field destination-field"
                :before="'fa-flag'"
              />

              <!-- Submit Button -->
              <div class="q-mt-md">
                <q-btn
                  label="Submit"
                  type="submit"
                  color="primary"
                  class="submit-btn"
                  icon="check"
                />
              </div>
            </q-form>
          </div>

          <!-- Map Section (60%) -->
          <div class="flex-item map-container">
            <h3 class="heading">
              <i class="fa fa-map-marker-alt"></i> Route on Map
            </h3>
            <GoogleMap
              api-key="AIzaSyCX7YZQFXhOtlyC-El4uG9baq4qSY68MZg"
              style="
                width: 100%;
                height: 80%;
                border-radius: 8px;
                box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
              "
              :center="center"
              :zoom="12"
            >
              <!-- Center Marker -->
              <Marker :options="{ position: center }" />

              <!-- Dynamic Markers for Stops -->
              <Marker
                v-for="(stop, index) in stops"
                :key="index"
                :options="{ position: stop.position }"
              />
            </GoogleMap>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { GoogleMap, Marker } from "vue3-google-map";
import { ref } from "vue";

const center = { lat: 28.522813, lng: 77.216687 };
const routeNumber = ref("");
const busNumber = ref("");
const source = ref("");
const destination = ref("");
const stopInput = ref("");
const stops = ref([]);

const handleSubmit = () => {
  console.log("Route Details Submitted:", {
    routeNumber: routeNumber.value,
    busNumber: busNumber.value,
    source: source.value,
    destination: destination.value,
    stops: stops.value,
  });
};

const addStop = () => {
  if (
    stopInput.value &&
    !stops.value.some((stop) => stop.name === stopInput.value)
  ) {
    const newStop = {
      name: stopInput.value,
      position: {
        lat: center.lat + Math.random() * 0.01,
        lng: center.lng + Math.random() * 0.01,
      },
    };
    stops.value.push(newStop);
    stopInput.value = ""; // Clear the input
  }
};

const removeStop = (index) => {
  stops.value.splice(index, 1);
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: "Poppins", sans-serif;
}

html,
body {
  background: url("https://www.example.com/background.jpg") no-repeat center
    center fixed;
  background-size: cover;
  font-family: "Poppins", sans-serif;
  color: #333;
  height: 100%;
  overflow: hidden;
}

.flex-container {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  margin: 24px;
}

.flex-item {
  flex: 1;
  padding: 16px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
  transition: transform 0.3s ease-in-out;
}

.flex-item:hover {
  transform: translateY(-5px);
}

/* Routes Planner Section Styling */
.routes-planner {
  width: 40%;
}

.map-container {
  width: 60%;
}

.form-container {
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  border: 1px solid #ddd;
}

.input-field {
  margin-bottom: 16px;
  border-radius: 6px;
  padding: 10px;
  font-size: 14px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  transition: all 0.3s ease;
}

.input-field .q-field__control {
  padding: 10px;
  font-size: 14px;
  border-radius: 6px;
}

.input-field .q-field__control:focus-within {
  border-color: #2196f3;
  box-shadow: 0 0 5px rgba(33, 150, 243, 0.3);
  transform: scale(1.02);
}

.destination-field {
  margin-top: 16px;
}

.submit-btn,
.add-stop-btn {
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 6px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.submit-btn {
  background-color: #2196f3;
  color: white;
  border: 1px solid #2196f3;
}

.submit-btn:hover {
  background-color: #1976d2;
  border-color: #1976d2;
  transform: translateY(-3px);
}

.add-stop-btn {
  background-color: #4caf50;
  color: white;
  border: 1px solid #4caf50;
  margin-top: 12px;
}

.add-stop-btn:hover {
  background-color: #388e3c;
  border-color: #388e3c;
  transform: translateY(-3px);
}

.stops-list {
  margin-top: 12px;
  padding: 0;
  list-style-type: none;
}

.stops-list ul li {
  padding: 10px;
  background-color: #f1f1f1;
  margin-bottom: 6px;
  border-radius: 6px;
  border: 1px solid #ddd;
}

.stops-list ul li:hover {
  background-color: #e0e0e0;
}

.heading {
  font-size: 1.8rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.heading i {
  margin-right: 8px;
}

.heading:hover {
  color: #2196f3;
}

@media (max-width: 768px) {
  .flex-container {
    flex-direction: column;
    padding: 16px;
  }

  .flex-item {
    margin-bottom: 16px;
  }

  .form-container {
    padding: 16px;
  }
}
</style>
