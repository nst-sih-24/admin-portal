<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="row justify-between">
              <div class="text-h6">Users</div>
              <div class="actions">
                <q-btn
                  color="primary"
                  label="Add User"
                  @click="addUser"
                  icon="eva-plus"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12">
        <q-table
          :rows="users"
          :columns="columns"
          row-key="id"
          :rows-per-page-options="[10, 20, 0]"
          @row-click="selectUser"
        >
          <template #body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                icon="edit"
                color="primary"
                round
                flat
                @click="editUser(props.row)"
              ></q-btn>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>

    <q-dialog v-model="showUserDialog">
      <q-card v-if="selectedUser">
        <q-card-section>
          <div class="text-h6">
            {{ isEdit ? 'Edit User' : 'Add User' }}
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
                v-model="selectedUser.username"
                placeholder="Username"
                outlined
                dense
                clearable
                autofocus
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="selectedUser.password"
                placeholder="Password"
                type="password"
                outlined
                dense
                clearable
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="selectedUser.name"
                placeholder="Name"
                outlined
                dense
                clearable
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="selectedUser.email"
                placeholder="Email"
                outlined
                dense
                clearable
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="selectedUser.phone"
                placeholder="Phone"
                outlined
                dense
                clearable
              />
            </div>
            <div class="col-12">
              <q-select
                v-model="selectedUser.type"
                :options="userTypes"
                placeholder="Type"
                outlined
                dense
                clearable
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="selectedUser.coins"
                placeholder="Coins"
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
                @click="deleteUser"
                v-close-popup
              ></q-btn>
            </div>

            <div class="col">
              <q-btn
                label="Save"
                color="primary"
                rounded
                class="full-width"
                @click="saveUser"
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

const users = ref([]);
const selectedUser = ref(null);
const isEdit = ref(false);
const showUserDialog = ref(false);

// Adjust userTypes as needed if you know the enum values of user_type.
// Example: user_type might be an enum like: 'admin', 'regular', etc.
const userTypes = [
  { label: "Admin", value: "admin" },
  { label: "Regular", value: "regular" }
];

const columns = [
  {
    name: "username",
    label: "Username",
    align: "left",
    field: "username",
  },
  {
    name: "name",
    label: "Name",
    align: "left",
    field: "name",
  },
  {
    name: "email",
    label: "Email",
    align: "left",
    field: "email",
  },
  {
    name: "phone",
    label: "Phone",
    align: "left",
    field: "phone",
  },
  {
    name: "type",
    label: "Type",
    align: "left",
    field: "type",
  },
  {
    name: "coins",
    label: "Coins",
    align: "left",
    field: "coins",
  },
  {
    name: "actions",
    label: "Actions",
    align: "center",
    field: "actions",
  },
];

onMounted(() => {
  fetchUsers();
});

async function fetchUsers() {
  try {
    const { data, error } = await supabase
      .from("user")
      .select("*");
    if (error) {
      console.error(error);
      $q.notify({ type: "negative", message: "Failed to fetch users" });
    } else {
      users.value = data;
    }
  } catch (error) {
    console.error(error);
    $q.notify({
      type: "negative",
      message: "Failed to fetch users",
    });
  }
}

function addUser() {
  selectedUser.value = {
    username: "",
    password: "",
    name: "",
    phone: "",
    type: null,
    email: "",
    coins: "",
  };
  isEdit.value = false;
  showUserDialog.value = true;
}

function editUser(user) {
  selectedUser.value = { ...user };
  isEdit.value = true;
  showUserDialog.value = true;
}

function selectUser(evt, row, idx) {
  selectedUser.value = { ...row };
}

async function saveUser() {
  const userData = { ...selectedUser.value };
  // If empty strings for optional fields, you can set them to null if desired:
  if (!userData.type) userData.type = null;
  if (!userData.coins) userData.coins = null;
  if (!userData.email) userData.email = null;
  if (!userData.phone) userData.phone = null;

  try {
    $q.loading.show();
    if (isEdit.value) {
      // update existing user
      const { error } = await supabase
        .from("user")
        .update(userData)
        .eq("id", userData.id);

      if (error) {
        console.error(error);
        $q.notify({ type: "negative", message: "Failed to update user" });
      } else {
        $q.notify({ type: "positive", message: "User updated!" });
        fetchUsers();
      }
    } else {
      // insert new user
      const { error } = await supabase.from("user").insert(userData);
      if (error) {
        console.error(error);
        $q.notify({ type: "negative", message: "Failed to create user" });
      } else {
        $q.notify({ type: "positive", message: "User created!" });
        fetchUsers();
      }
    }
  } catch (error) {
    console.error(error);
    $q.notify({ type: "negative", message: "Error saving user" });
  } finally {
    $q.loading.hide();
    showUserDialog.value = false;
  }
}

function deleteUser() {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure you want to delete this user?",
    cancel: true,
    persistent: true,
    ok: { label: "Delete", color: "negative", flat: true },
  }).onOk(async () => {
    try {
      $q.loading.show();
      const { error } = await supabase
        .from("user")
        .delete()
        .eq("id", selectedUser.value.id);

      if (error) {
        console.error(error);
        $q.notify({ type: "negative", message: "Failed to delete user" });
      } else {
        $q.notify({ type: "positive", message: "User deleted" });
        fetchUsers();
        selectedUser.value = null;
      }
    } catch (error) {
      console.error(error);
      $q.notify({ type: "negative", message: "Error deleting user" });
    } finally {
      $q.loading.hide();
    }
  });
}
</script>
