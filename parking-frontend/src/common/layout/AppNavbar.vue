<template>
  <v-toolbar
    app
    :clipped-left="clipped"
    height="70"
    class="app-navbar white"
  >
    <v-toolbar-side-icon @click.stop="$store.commit('layout/toggleMiniVariant')"></v-toolbar-side-icon>
    <v-spacer></v-spacer>
    <app-lang></app-lang>
    <v-tooltip bottom>
      <v-btn icon @click="fullscreen()" class="btn-fullscreen" slot="activator">
        <v-icon>fullscreen</v-icon>
        <v-icon>fullscreen_exit</v-icon>
      </v-btn>
      <span>Pantalla completa</span>
    </v-tooltip>
    <v-tooltip bottom>
      <v-btn icon @click="reload" slot="activator">
        <v-icon>refresh</v-icon>
      </v-btn>
      <span>Actualizar la página</span>
    </v-tooltip>
    <v-btn icon @click.stop="$store.commit('layout/toggleRightDrawer')">
      <v-icon>notifications</v-icon>
    </v-btn>
    <v-menu
      offset-x
      :close-on-content-click="false"
      max-width="320"
      min-width="320"
    >
      <v-toolbar-title slot="activator">
        <v-avatar class="info">
          <span class="white--text headline">{{ inicial }}</span>
        </v-avatar>
      </v-toolbar-title>
      <v-card>
        <v-container grid-list-md class="menu-person">
          <v-layout row wrap>
            <v-flex xs3 text-md-center>
              <v-avatar
                class="info"
                size="64"
              >
                <span class="white--text headline">{{ inicial }}</span>
              </v-avatar>
            </v-flex>
            <v-flex xs9>
              <h3>{{ nombreCompleto }}</h3>
              <v-icon>mail</v-icon> {{ user.email }}<br>
              <v-icon>person_pin</v-icon> {{ user.rol }} <br>
              <v-icon>location_city</v-icon>{{ user.entidad }}
            </v-flex>
          </v-layout>
        </v-container>
        <v-divider></v-divider>
        <v-list>
          <v-list-tile @click="$router.push('account')">
            <v-list-tile-title>
              <v-icon>account_circle</v-icon> {{$t('app.account') }}
            </v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="logout()">
            <v-list-tile-title>
              <v-icon>&#xE8AC;</v-icon> {{$t('app.logOut') }}
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-menu>
  </v-toolbar>
</template>

<script>
import Auth from '@/components/admin/auth/mixins/auth';
import AppLang from './AppLang';
import { mapState } from 'vuex';

export default {
  mixins: [ Auth ],
  data: () => ({
    clipped: false
  }),
  methods: {
    fullscreen () {
      document.querySelector('body').classList.toggle('fullscreen');
      this.$util.fullscreen();
    }
  },
  components: { AppLang },
  computed: {
    ...mapState(['user']),
    nombreCompleto () {
      let user = this.$store.state.user;

      return user.nombres;
    },
    inicial () {
      let user = this.$store.state.user;
      if (user.usuario) {
        return (user.usuario[0] || '?').toUpperCase();
      }
      return '?';
    }
  }
};
</script>

<style lang="scss">
@import '../../assets/scss/_variables.scss';

.app-navbar {
  box-shadow: 0px 1px 15px 1px rgba(69, 65, 78, 0.1);

  .toolbar__content {
    padding: 0 15px;
  }

  .btn .icon {
    color: $color;
  }

  .menu-user {
    margin-right: 10px;
    .toolbar__title {
      font-size: 16px;
      color: $color;
    }
    .icon {
      font-size: 40px;
    }
  }

}

.btn-fullscreen {
  .icon:last-child {
    display: none;
  }
}

body.fullscreen {
  .btn-fullscreen {
    .icon:first-child {
      display: none;
    }
    .icon:last-child {
      display: inline-block;
    }
  }
}

.menu-person {
  color: lighten($warning, 10%);
  font-size: 1rem;
  padding: 10px 15px;
  background-color: darken($primary, 5%);
  background-image: url(../../assets/images/bg.png);
  background-position: center;
  background-size: cover;

  h3 {
    font-size: 1.3rem;
    color: white;
    font-weight: 400;
  }

  .icon {
    color: white;
    font-size: 1.1rem;
  }
}
</style>
