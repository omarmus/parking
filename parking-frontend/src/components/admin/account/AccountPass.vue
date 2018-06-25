<template>
  <v-dialog v-model="modal" max-width="420">
    <v-card class="dialog-token">
      <v-card-title class="headline">
        <v-icon>lock</v-icon> Cambiar mi contraseña
        <v-spacer></v-spacer>
        <v-btn icon @click.native="$store.commit('closeModal')">
          <v-icon>close</v-icon>
        </v-btn>
      </v-card-title>
      <v-form
        @submit.prevent="changePassword"
        v-model="valid"
        ref="form"
        lazy-validation>
        <v-card-text>
          <v-alert color="info" icon="info" value="true" class="mb-4">Haga click en <v-icon dark>visibility</v-icon> para poder ver/ocultar su contraseña.</v-alert>
          <v-text-field
            label="Antigua contraseña"
            append-icon="lock"
            :append-icon="getIcon"
            :append-icon-cb="changeIcon"
            :type="hidePass ? 'password' : 'text'"
            v-model="form.password"
            maxlength="100"
            :rules="$validate(['required'])"
            required
          ></v-text-field>
          <v-text-field
            label="Nueva contraseña"
            append-icon="lock"
            :append-icon="getIcon"
            :append-icon-cb="changeIcon"
            :type="hidePass ? 'password' : 'text'"
            v-model="form.newPassword"
            maxlength="100"
            :rules="$validate(['required'])"
            required
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click.native="$store.commit('closeModal')"><v-icon>cancel</v-icon> {{ $t('common.cancel') }}</v-btn>
          <v-btn color="primary" type="submit"><v-icon dark>lock</v-icon> Cambiar</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import Auth from '@/components/admin/auth/mixins/auth';
import validate from '@/common/mixins/validate';
import { mapState } from 'vuex';

export default {
  mixins: [ Auth, validate ],
  data () {
    return {
      hidePass: true,
      form: {
        password: '',
        newPassword: ''
      },
      valid: true
    };
  },
  computed: {
    ...mapState(['user', 'modal']),
    getIcon () {
      return this.form.password.length === 0 ? 'lock' : this.hidePass ? 'visibility' : 'visibility_off';
    }
  },
  methods: {
    changePassword () {
      if (this.$refs.form.validate()) {
        this.$service.patch(`system/cambiar_pass`, this.form)
        .then(response => {
          if (response) {
            this.$message.success(response.message);
            this.$store.commit('closeModal');
          }
        });
      }
    },
    changeIcon () {
      if (this.form.password.length) {
        this.hidePass = !this.hidePass;
      }
    }
  },
  watch: {
    'form.password': function (val) {
      if (val.length === 0) {
        this.hidePass = true;
      }
    },
    'form.newPassword': function (val) {
      if (val.length === 0) {
        this.hidePass = true;
      }
    }
  }
};
</script>
