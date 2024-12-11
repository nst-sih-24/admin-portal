<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">

      <!-- Stats Section -->
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="row justify-between items-center">
              <div class="text-h6">Tickets</div>
              <div>
                <q-btn color="primary" label="Add Ticket" icon="eva-plus" @click="addTicket" />
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-3">
                <q-card flat bordered>
                  <q-card-section>
                    <div class="text-subtitle1">Total Tickets</div>
                    <div class="text-h5">{{ stats.totalTickets }}</div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-3">
                <q-card flat bordered>
                  <q-card-section>
                    <div class="text-subtitle1">Unique Customers</div>
                    <div class="text-h5">{{ stats.uniqueCustomers }}</div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-3">
                <q-card flat bordered>
                  <q-card-section>
                    <div class="text-subtitle1">Unique Trips</div>
                    <div class="text-h5">{{ stats.uniqueTrips }}</div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-3">
                <q-card flat bordered>
                  <q-card-section>
                    <div class="text-subtitle1">Average Fare</div>
                    <div class="text-h5">{{ stats.avgFare }}</div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Tickets Table -->
      <div class="col-12">
        <q-table
          :rows="tickets"
          :columns="columns"
          row-key="id"
          :rows-per-page-options="[10, 20, 0]"
        >
          <template #body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                icon="edit"
                color="primary"
                round
                flat
                @click="editTicket(props.row)"
              ></q-btn>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>

    <q-dialog v-model="showTicketDialog">
      <q-card v-if="selectedTicket">
        <q-card-section>
          <div class="text-h6">
            {{ isEdit ? 'Edit Ticket' : 'Add Ticket' }}
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
                v-model="selectedTicket.customer_id"
                placeholder="Costumer ID"
                outlined
                dense
                clearable
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="selectedTicket.trip_id"
                placeholder="Trip ID"
                outlined
                dense
                clearable
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="selectedTicket.source_stop_id"
                placeholder="Source Stop ID"
                outlined
                dense
                clearable
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="selectedTicket.destination_stop_id"
                placeholder="Destination Stop ID"
                outlined
                dense
                clearable
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="selectedTicket.fare"
                placeholder="Fare"
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
                @click="deleteTicket"
                v-close-popup
              ></q-btn>
            </div>

            <div class="col">
              <q-btn
                label="Save"
                color="primary"
                rounded
                class="full-width"
                @click="saveTicket"
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
import { useQuasar } from "quasar";

const $q = useQuasar();

const tickets = ref([]);
const selectedTicket = ref(null);
const isEdit = ref(false);
const showTicketDialog = ref(false);

// Stats object
const stats = ref({
  totalTickets: 0,
  uniqueCustomers: 0,
  uniqueTrips: 0,
  avgFare: 0,
});

const columns = [
  {
    name: "customer_id",
    label: "Costumer ID",
    align: "left",
    field: "customer_id",
  },
  {
    name: "trip_id",
    label: "Trip ID",
    align: "left",
    field: "trip_id",
  },
  {
    name: "source_stop_id",
    label: "Source Stop ID",
    align: "left",
    field: "source_stop_id",
  },
  {
    name: "destination_stop_id",
    label: "Destination Stop ID",
    align: "left",
    field: "destination_stop_id",
  },
  {
    name: "fare",
    label: "Fare",
    align: "left",
    field: "fare",
  },
  {
    name: "actions",
    label: "Actions",
    align: "center",
    field: "actions",
  },
];

onMounted(() => {
  fetchTickets();
  fetchStats();
});

async function fetchTickets() {
  try {
    const { data, error } = await supabase.from("ticket").select("*");
    if (error) {
      console.error(error);
      $q.notify({ type: "negative", message: "Failed to fetch tickets" });
    } else {
      tickets.value = data;
    }
  } catch (error) {
    console.error(error);
    $q.notify({
      type: "negative",
      message: "Failed to fetch tickets",
    });
  }
}

async function fetchStats() {
  try {
    // total tickets count
    const { count: totalCount, error: countError } = await supabase
      .from("ticket")
      .select("id", { count: "exact", head: true });
    if (!countError && totalCount !== null) {
      stats.value.totalTickets = totalCount;
    }

    // unique customers
    const { data: uniqueCustData, error: custError } = await supabase
      .from("ticket")
      .select("customer_id", { count: "exact" })
      .neq("customer_id", null);
    if (!custError && uniqueCustData) {
      const uniqueCustSet = new Set(uniqueCustData.map(t => t.customer_id));
      stats.value.uniqueCustomers = uniqueCustSet.size;
    }

    // unique trips
    const { data: uniqueTripData, error: tripError } = await supabase
      .from("ticket")
      .select("trip_id")
      .neq("trip_id", null);
    if (!tripError && uniqueTripData) {
      const uniqueTripSet = new Set(uniqueTripData.map(t => t.trip_id));
      stats.value.uniqueTrips = uniqueTripSet.size;
    }

    // average fare (assuming fare is numeric stored as text)
    const { data: fareData, error: fareError } = await supabase
      .from("ticket")
      .select("fare");
    if (!fareError && fareData.length > 0) {
      const numericFares = fareData
        .map(t => parseFloat(t.fare))
        .filter(f => !isNaN(f));
      if (numericFares.length > 0) {
        const sum = numericFares.reduce((acc, val) => acc + val, 0);
        stats.value.avgFare = (sum / numericFares.length).toFixed(2);
      } else {
        stats.value.avgFare = 0;
      }
    }

  } catch (error) {
    console.error(error);
    $q.notify({
      type: "negative",
      message: "Failed to fetch ticket stats",
    });
  }
}

function addTicket() {
  selectedTicket.value = {
    customer_id: "",
    trip_id: "",
    source_stop_id: "",
    destination_stop_id: "",
    fare: "",
  };
  isEdit.value = false;
  showTicketDialog.value = true;
}

function editTicket(ticket) {
  selectedTicket.value = { ...ticket };
  isEdit.value = true;
  showTicketDialog.value = true;
}

async function saveTicket() {
  const ticketData = { ...selectedTicket.value };

  try {
    $q.loading.show();
    if (isEdit.value) {
      const { error } = await supabase
        .from("ticket")
        .update(ticketData)
        .eq("id", ticketData.id);
      if (error) {
        console.error(error);
        $q.notify({ type: "negative", message: "Failed to update ticket" });
      } else {
        $q.notify({ type: "positive", message: "Ticket updated!" });
        fetchTickets();
        fetchStats();
      }
    } else {
      const { error } = await supabase.from("ticket").insert(ticketData);
      if (error) {
        console.error(error);
        $q.notify({ type: "negative", message: "Failed to create ticket" });
      } else {
        $q.notify({ type: "positive", message: "Ticket created!" });
        fetchTickets();
        fetchStats();
      }
    }
  } catch (error) {
    console.error(error);
    $q.notify({ type: "negative", message: "Error saving ticket" });
  } finally {
    $q.loading.hide();
    showTicketDialog.value = false;
  }
}

function deleteTicket() {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure you want to delete this ticket?",
    cancel: true,
    persistent: true,
    ok: { label: "Delete", color: "negative", flat: true },
  }).onOk(async () => {
    try {
      $q.loading.show();
      const { error } = await supabase
        .from("ticket")
        .delete()
        .eq("id", selectedTicket.value.id);

      if (error) {
        console.error(error);
        $q.notify({ type: "negative", message: "Failed to delete ticket" });
      } else {
        $q.notify({ type: "positive", message: "Ticket deleted" });
        fetchTickets();
        fetchStats();
        selectedTicket.value = null;
      }
    } catch (error) {
      console.error(error);
      $q.notify({ type: "negative", message: "Error deleting ticket" });
    } finally {
      $q.loading.hide();
    }
  });
}
</script>
