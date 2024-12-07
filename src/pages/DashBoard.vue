<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          <img src="boosto-logo.png" alt="Boosto" class="q-mr-md" />
        </q-toolbar-title>
        <q-btn flat round dense icon="menu" @click="toggleDrawer" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawerOpen" show-if-above behavior="desktop" elevated>
      <q-list>
        <q-item-label header>Navigation</q-item-label>
        <q-item clickable v-ripple to="/dashboard">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/customers">
          <q-item-section avatar>
            <q-icon name="people" />
          </q-item-section>
          <q-item-section>Customers</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/solutions">
          <q-item-section avatar>
            <q-icon name="business" />
          </q-item-section>
          <q-item-section>Solutions</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/settings">
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section>Settings</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <q-page padding>
        <div class="row q-col-gutter-md">
          <div class="col-4">
            <q-card dark>
              <q-card-section>
                <div class="row items-center no-wrap">
                  <q-avatar size="56px">
                    <img src="jonathan-roy.jpg" alt="Jonathan Roy">
                  </q-avatar>
                  <div class="text-weight-bold q-ml-md">Jonathan Roy</div>
                  <div class="text-grey q-ml-md">CEO</div>
                </div>
              </q-card-section>
            </q-card>
            <q-card dark>
              <q-card-section>
                <div class="text-h6">Performance</div>
                <div class="q-mt-md">
                  <div class="row items-center justify-between">
                    <div>Income</div>
                    <div class="text-positive">76%</div>
                  </div>
                  <div class="row items-center justify-between q-mt-sm">
                    <div>Spending</div>
                    <div class="text-negative">44%</div>
                  </div>
                  <div class="q-mt-md">
                    <q-icon name="check" color="positive" /> Spending course was taken
                  </div>
                  <div class="q-mt-sm">
                    <q-icon name="check" color="positive" /> Deposit programs were setup
                  </div>
                  <div class="q-mt-sm">
                    <q-icon name="check" color="positive" /> Cashback program activated
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-8">
            <q-card dark>
              <q-card-section>
                <div class="text-h6">Activity</div>
                <div class="row q-mt-md">
                  <div class="col-6">
                    <div class="text-subtitle1">Clicks</div>
                    <div class="text-h4 q-mt-md">12,560</div>
                  </div>
                  <div class="col-6">
                    <div class="text-subtitle1">Sales</div>
                    <div class="text-h4 q-mt-md">$34,890</div>
                  </div>
                </div>
                <div class="q-mt-md">
                  <q-linear-progress :value="0.5" color="primary" />
                </div>
                <div class="row justify-between q-mt-md">
                  <div v-for="day in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']" :key="day" class="text-center">
                    {{ day }}
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <div class="row q-col-gutter-md q-mt-md">
          <div class="col-3">
            <q-card dark>
              <q-card-section>
                <div class="text-h6">This Day</div>
                <div class="text-h4 q-mt-md">133</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-3">
            <q-card dark>
              <q-card-section>
                <div class="text-h6">This Week</div>
                <div class="text-h4 q-mt-md">471</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-3">
            <q-card dark>
              <q-card-section>
                <div class="text-h6">This Month</div>
                <div class="text-h4 q-mt-md">929</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-3">
            <q-card dark>
              <q-card-section>
                <div class="text-h6">Pending</div>
                <div class="text-h4 q-mt-md">233</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <div class="row q-col-gutter-md q-mt-md">
          <div class="col-12">
            <q-card dark>
              <q-card-section>
                <div class="text-h6">Your New Metrics</div>
                <q-btn flat color="primary" label="View" />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'BoostoDashboard',
  setup() {
    const drawerOpen = ref(false)

    const toggleDrawer = () => {
      drawerOpen.value = !drawerOpen.value
    }

    return {
      drawerOpen,
      toggleDrawer
    }
  }
})
</script>
