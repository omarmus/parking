<template>
  <section>
    <h3 class="primary--text"><v-icon color="primary">settings</v-icon> {{ $t('parametro.preferencias') }}</h3>
    <v-tabs
      v-model="active"
      class="tab-preferencias"
      color="info"
      dark
      slider-color="warning"
    >
      <v-tab
        key="parametros"
        href="#parametros"
        v-if="$store.state.permissions['parametros:read']"
        ripple>
        <v-icon>settings_applications</v-icon> {{ $t('parametro.title') }}
      </v-tab>
      <v-tab
        key="roles"
        href="#roles"
        v-if="$store.state.permissions['roles:read']"
        ripple>
        <v-icon>person_outline</v-icon> {{ $t('rol.title') }}
      </v-tab>
      <v-tab-item
        key="parametros"
        id="parametros">
        <v-card flat>
          <parametro v-if="$store.state.permissions['parametros:read'] && active == 'parametros'"></parametro>
        </v-card>
      </v-tab-item>
      <v-tab-item
        key="roles"
        id="roles">
        <v-card flat>
          <rol v-if="$store.state.permissions['roles:read'] && active == 'roles'"></rol>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </section>
</template>

<script>
import Rol from './Rol';
import Parametro from './Parametro';

export default {
  data () {
    return {
      active: 'parametros'
    };
  },
  components: {
    Rol,
    Parametro
  },
  watch: {
    active: function (val) {
      console.log(val);
    }
  }
};
</script>

<style lang="scss">
  .tab-preferencias {
    .tabs__wrapper {
      margin: 0 !important;
    }
  }
</style>
