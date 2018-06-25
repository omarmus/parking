<template>
  <v-dialog v-model="show" persistent content-class="dialog--confirm" max-width="360">
    <v-card>
      <v-card-title class="headline">Alerta</v-card-title>
      <v-card-text v-html="text" class="pt-0"></v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click.native="ok()">Aceptar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex';
import modal from './mixins/modal';

export default {
  mixins: [ modal ],
  mounted () {
    let el = document.querySelector('.dialog--confirm');
    if (el) {
      el.parentNode.style.zIndex = 100;
    }
  },
  methods: {
    ok () {
      let alert = this.$store.state.alert;
      this.$store.commit('CLOSE_ALERT');

      if (typeof alert.callback === 'function') {
        alert.callback();
      }
    }
  },
  computed: mapState({
    show: store => store.alert.show,
    text: store => store.alert.text
  })
};
</script>

<style lang="scss">
  .dialog--confirm, .dialog--alert {
    z-index: 100;
  }
</style>
