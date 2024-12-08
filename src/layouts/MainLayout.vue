<template>
  <q-layout view="hHh Lpr lFf" style="background-color: #1e1e2f;">
    <!-- Drawer -->
    <q-drawer v-model="drawerOpen" show-if-above behavior="desktop" elevated>
      <q-list style="background-color: #1e1e2f; color: #ffffff;">
        <!-- App Logo Section -->
        <div class="column items-center q-pa-md text-center">
          <q-item-label class="text-h6 q-mt-sm">NavSmart</q-item-label>
          <q-item-label class="q-mt-xs text-positive" style="font-size: 12px; background: lime; border-radius: 4px; padding: 2px 8px;">
            PRO
          </q-item-label>
          <q-img
            src="/src/assets/—Pngtree—doraemon pictures_7031645.png"
            alt="NavSmart Logo"
            style=" height: 70%; border-radius: 50%;"
          />
        </div>
        <q-separator spaced />

        <!-- Navigation -->
        <q-item clickable v-ripple to="/defi" class="text-white">
          <q-item-section avatar>
            <q-icon name="bolt" color="lime" />
          </q-item-section>
          <q-item-section>DeFi</q-item-section>
        </q-item>

        <q-expansion-item
          label="Yields"
          icon="analytics"
          class="text-white"
          header-class="q-py-none text-white"
        >
          <q-list>
            <q-item clickable v-ripple>
              <q-item-section>Details</q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

        <q-expansion-item
          label="DEXes"
          icon="currency_exchange"
          class="text-white"
          header-class="q-py-none text-white"
        >
          <q-list>
            <q-item clickable v-ripple>
              <q-item-section>Options</q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

        <q-item clickable v-ripple to="/protocols" class="text-white">
          <q-item-section avatar>
            <q-icon name="trending_up" color="white" />
          </q-item-section>
          <q-item-section>Protocols</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/settings" class="text-white">
          <q-item-section avatar>
            <q-icon name="settings" color="white" />
          </q-item-section>
          <q-item-section>Settings</q-item-section>
        </q-item>

        <q-separator spaced />
        <q-item clickable v-ripple to="/logout" class="text-negative">
          <q-item-section avatar>
            <q-icon name="logout" color="negative" />
          </q-item-section>
          <q-item-section>Log Out</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Page Content -->
    <q-page-container>
      <q-page>
        <RouterView />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";

defineOptions({
  name: "NavSmartLayout",
});

const drawerOpen = ref(false);
</script>

<style>
/* Drawer Styling */
.q-drawer {
  background-color: #1e1e2f;
  color: #ffffff;
}

.q-item-label {
  font-size: 14px;
}

.text-positive {
  font-weight: bold;
}
</style>
