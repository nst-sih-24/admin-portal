<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> NavSmart Admin </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";

const linksList = [
  {
    title: "Dashboard",
    icon: "dashboard",
    link: "/",
  },
  {
    title: "Trips",
    icon: "event",
    link: "/trips",
  },
  {
    title: "Schedules",
    icon: "schedule",
    link: "/schedules",
  },
  {
    title: "Stops",
    icon: "pin_drop",
    link: "/stops",
  },
  {
    title: "Routes",
    icon: "directions",
    link: "/routes",
  },
  {
    title: "Vehicles",
    icon: "directions_bus",
    link: "/vehicles",
  },
  {
    title: "Drivers",
    icon: "person",
    link: "/drivers",
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
