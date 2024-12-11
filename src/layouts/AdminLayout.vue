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

        <div>Quasar v{{ $q.version }}</div>
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
    link: "/admin",
  },
  {
    title: "Trips",
    icon: "event",
    link: "/admin/trips",
  },
  {
    title: "Schedules",
    icon: "schedule",
    link: "/admin/schedules",
  },
  {
    title: "Stops",
    icon: "pin_drop",
    link: "/admin/stops",
  },
  {
    title: "Routes",
    icon: "directions",
    link: "/admin/routes",
  },
  {
    title: "Vehicles",
    icon: "directions_bus",
    link: "/admin/vehicles",
  },
  {
    title: "Drivers",
    icon: "person",
    link: "/admin/drivers",
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
