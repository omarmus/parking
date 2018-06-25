<template>
  <v-dialog v-model="show" persistent content-class="dialog--alert" max-width="360">
    <v-card>
      <v-card-title class="headline"><v-icon>warning</v-icon> Confirmar</v-card-title>
      <v-card-text v-html="text" class="pt-0"></v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click.native="cancel()" id="md-btn-confirm-selected-cancel">{{ textCancel }}</v-btn>
        <v-btn color="primary" @click.native="ok()" id="md-btn-confirm-selected-ok">{{ textOk }}</v-btn>
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
    let el = document.querySelector('.dialog--alert');
    if (el) {
      el.parentNode.style.zIndex = 100;
    }
  },
  methods: {
    ok () {
      let confirm = this.$store.state.confirm;
      confirm.show = false;
      this.$store.commit('CLOSE_CONFIRM');

      if (typeof confirm.callbackOk === 'function') {
        confirm.callbackOk();
      }
    },
    cancel () {
      let confirm = this.$store.state.confirm;
      confirm.show = false;
      this.$store.commit('CLOSE_CONFIRM');

      if (typeof confirm.callbackCancel === 'function') {
        confirm.callbackCancel();
      }
    }
  },
  computed: mapState({
    show: store => store.confirm.show,
    text: store => store.confirm.text,
    textOk: store => store.confirm.textOk,
    textCancel: store => store.confirm.textCancel
  })
};
</script>

<style>
.overlay + .overlay {
  z-index: 99;
}
</style>
