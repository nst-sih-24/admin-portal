<template>
  <q-layout view="lHh Lpr lff">
    <q-header elevated="elevated">
      <q-toolbar>
        <q-btn
          flat="flat"
          dense="dense"
          round="round"
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        ></q-btn>
        <q-toolbar-title>Flora</q-toolbar-title>
        <q-btn
          flat="flat"
          dense="dense"
          round="round"
          icon="notifications"
          aria-label="User"
          @click="toggleNotifications"
        >
          <q-badge color="red" floating="floating" v-show="notificationCount">{{
            notificationCount
          }}</q-badge>
        </q-btn>
        <q-btn
          class="q-mx-sm"
          flat="flat"
          dense="dense"
          round="round"
          icon="account_circle"
          aria-label="User"
          @click="toggleUserChooser"
        ></q-btn>
        <q-btn
          flat="flat"
          dense="dense"
          round="round"
          icon="person"
          aria-label="User"
          @click="toggleRightDrawer"
        ></q-btn>
      </q-toolbar>
    </q-header>
    <LeftSideDrawer></LeftSideDrawer>
    <q-dialog v-model="showNotifications" position="top" maximized="maximized">
      <Notifications></Notifications>
    </q-dialog>
    <q-dialog v-model="showUserChooser" position="right">
      <UserChooser></UserChooser>
    </q-dialog>
    <q-dialog v-model="showRightSideDrawer" position="right">
      <RightSideDrawer></RightSideDrawer>
    </q-dialog>
    <q-page-container>
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import LeftSideDrawer from "components/LeftSideDrawer";
import RightSideDrawer from "components/RightSideDrawer";
import Notifications from "components/Notifications";
import UserChooser from "components/UserChooser";

export default {
  name: "MainLayout",

  components: {
    LeftSideDrawer,
    RightSideDrawer,
    Notifications,
    UserChooser,
  },

  data() {
    return {
      showNotifications: false,
      showUserChooser: false,
      showRightSideDrawer: false,
    };
  },

  computed: {
    notificationCount() {
      return this.$store.getters["general/notificationCount"];
    },

    // title() {
    //   return this.$store.getters['general/title']
    // },

    user() {
      let user = this.$store.getters["auth/user"];
      return {
        ...user,
        token: this.$store.getters["auth/token"],
      };
    },
  },

  created() {
    if (!this.$route.path.includes("/auth/login")) {
      if (!this.user.username || !this.user.token) {
        this.logout();
      }
    }
    this.setHeaders();
    // this.$q.dark.set(this.darkMode)
  },

  methods: {
    toggleLeftDrawer() {
      this.$store.dispatch("general/toggleLeftSideDrawer");
    },
    toggleRightDrawer() {
      this.showRightSideDrawer = !this.showRightSideDrawer;
    },
    toggleNotifications() {
      this.showNotifications = !this.showNotifications;
    },
    toggleUserChooser() {
      this.showUserChooser = !this.showUserChooser;
    },

    logout() {
      this.$store.dispatch("auth/logout");
      this.$router.replace("/auth/login");
    },

    setHeaders() {
      this.$axios.defaults.headers.common["Authorization"] =
        "Bearer " + this.user.token;
    },
  },

  sockets: {
    notification(data) {
      this.$store.dispatch("general/addNotification", data);
    },
  },
};
</script>
