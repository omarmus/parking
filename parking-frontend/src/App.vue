<template>
  <v-app :class="{ 'app-login': !auth }">
    <app-sidenav v-if="auth && sidenav"></app-sidenav>
    <app-navbar v-if="auth"></app-navbar>
    <v-content v-if="main">
      <app-breadcrumbs v-if="auth"></app-breadcrumbs>
      <div class="main">
        <transition :name="transitionName" mode="out-in">
          <router-view/>
        </transition>
      </div>
    </v-content>
    <app-notification></app-notification>
    <app-footer></app-footer>
    <app-messages></app-messages>
    <app-alert></app-alert>
    <app-confirm></app-confirm>
    <vue-progress-bar></vue-progress-bar>
    <app-loading></app-loading>
  </v-app>
</template>

<script>
import AppSidenav from '@/common/layout/AppSidenav';
import AppNavbar from '@/common/layout/AppNavbar';
import AppFooter from '@/common/layout/AppFooter';
import AppBreadcrumbs from '@/common/layout/AppBreadcrumbs';
import AppLoading from '@/common/plugins/loading/AppLoading';
import AppMessages from '@/common/plugins/message/AppMessages';
import AppNotification from '@/common/layout/AppNotification';
import AppAlert from '@/common/plugins/modal/AppAlert';
import AppConfirm from '@/common/plugins/modal/AppConfirm';
import Auth from '@/components/admin/auth/mixins/auth';
import { mapState } from 'vuex';

// Páginas que no necesitan autenticación/token/sesión
const PageNoLogin = ['login'];

export default {
  name: 'App',
  mixins: [ Auth ],
  created () {
    if (this.$storage.existUser()) {
      this.$store.commit('setAuth', true);

      if (this.$storage.exist('sidenav')) {
        this.$store.commit('setSidenav', this.$storage.get('sidenav'));
      }

      if (this.$storage.exist('permissions')) {
        this.$store.commit('setPermissions', this.$storage.get('permissions'));
      }

      this.timerSession();
    } else {
      if (PageNoLogin.indexOf(this.$route.path.substring(1)) === -1 || this.$route.path === '/') {
        this.logout();
      }
    }

    // loading bar config
    this.$Progress.start();
    this.$router.beforeEach((to, from, next) => {
      if (to.meta.progress !== undefined) {
        let meta = to.meta.progress;
        this.$Progress.parseMeta(meta);
      }
      this.$Progress.start();
      next();
    });
    this.$router.afterEach((to, from) => {
      this.$Progress.finish();
    });

    // Cargando
    this.$util.events();
  },
  data: () => ({
    transitionName: ''
  }),
  components: {
    AppSidenav,
    AppNavbar,
    AppFooter,
    AppBreadcrumbs,
    AppMessages,
    AppLoading,
    AppNotification,
    AppAlert,
    AppConfirm
  },
  computed: {
    ...mapState(['auth', 'sidenav', 'main'])
  },
  watch: {
    '$route' (to, from) {
      if (!this.$storage.existUser() && PageNoLogin.indexOf(to.path.substring(1)) === -1) {
        this.logout();
      }
      if (to.path !== '/login' && from.path !== '/login') {
        this.transitionName = 'fade';
      } else {
        this.transitionName = '';
      }
      this.$store.commit('closeModal');
    }
  }
};
</script>

<style lang="scss">
@import 'assets/scss/index.scss';
</style>
