<template>
  <section>
    <h3 class="primary--text"><v-icon color="primary">person_outline</v-icon> {{$t('app.account') }}</h3>
    <v-card class="success white--text account">
      <v-container fluid grid-list-lg>
        <v-layout row>
          <v-flex xs8>
            <div>
              <div class="headline">{{ user.nombres }} {{ user.primer_apellido }} {{ user.segundo_apellido }}</div>
              <p>@{{ user.usuario }}</p>
              <div class="account-info">
                <p><strong>Correo electrónico:</strong> {{ user.email }}</p>
                <p><strong>{{ $t('account.crud.entity') }}:</strong> {{ user.entidad }}</p>
                <p><strong>{{ $t('user.crud.role') }}:</strong> {{ user.rol }}</p>
              </div>
            </div>
          </v-flex>
          <v-flex xs4 class="center-flex">
            <div class="sidenav-user__photo">{{ inicial }}</div>
          </v-flex>
        </v-layout>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click.native="openPass()"><v-icon>lock</v-icon> Cambiar contraseña</v-btn>
        <v-btn @click.native="openDeactivate()" v-if="user.id_rol != 1" color="error"><v-icon dark>cancel</v-icon> Desactivar cuenta</v-btn>
      </v-card-actions>
    </v-card>

    <!-- Dialog para la desactivación -->
    <v-dialog v-model="modalDeactivate" max-width="420">
      <v-card class="dialog-token">
        <v-card-title class="headline">
          <v-icon>cancel</v-icon> Desactivar mi cuenta
          <v-spacer></v-spacer>
          <v-btn icon @click.native="modalDeactivate = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>
        <v-form
          @submit.prevent="deactivate"
          ref="form2"
          lazy-validation>
          <v-card-text>
            <v-alert color="warning" icon="warning" value="true">Una vez desactivada su cuenta si desea volver a habilitarla deberá contactarse con el administrador del sistema.</v-alert>
            <v-alert color="info" value="true" icon="info" class="mb-4">Ingrese su contraseña para confirmar la desactivación de su cuenta.</v-alert>
            <v-text-field
              name="password"
              :label="$t('login.password')"
              append-icon="lock"
              :append-icon="getIcon"
              :append-icon-cb="changeIcon"
              :type="hidePass ? 'password' : 'text'"
              v-model="form.password"
              :rules="$validate(['required'])"
              required
              maxlength="100"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click.native="modalDeactivate = false"><v-icon>cancel</v-icon> {{ $t('common.cancel') }}</v-btn>
            <v-btn color="error" type="submit"><v-icon dark>vpn_key</v-icon> Desactivar</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- Dialog para el cambio de contraseña -->
    <account-pass></account-pass>

  </section>
</template>

<script>
import Auth from '@/components/admin/auth/mixins/auth';
import { mapState } from 'vuex';
import AccountPass from './AccountPass';
import validate from '@/common/mixins/validate';
import Layout from '@/common/layout/mixins/layout';

export default {
  mixins: [ Auth, Layout, validate ],
  mounted () {
    this.setActive('account');
  },
  data () {
    return {
      modalDeactivate: false,
      hidePass: true,
      form: {
        password: ''
      }
    };
  },
  components: { AccountPass },
  computed: {
    ...mapState(['user']),
    inicial () {
      let user = this.$store.state.user;
      if (user.usuario) {
        return (user.usuario[0] || '?').toUpperCase();
      }
      return '?';
    },
    getIcon () {
      return this.form.password.length === 0 ? 'lock' : this.hidePass ? 'visibility' : 'visibility_off';
    }
  },
  methods: {
    openPass () {
      this.$store.commit('openModal');
    },
    openDeactivate () {
      this.form.password = '';
      this.hidePass = true;
      this.modalDeactivate = true;
    },
    deactivate () {
      if (this.$refs.form2.validate()) {
        this.$confirm('¿Está seguro que quiere desactivar su cuenta? Una vez desactivada tendrá que contactarse con el administrador del sistema para poder activar su cuenta otra vez.', () => {
          this.$service.patch(`system/desactivar_cuenta`, { password: this.form.password })
          .then(response => {
            if (response) {
              this.$message.success(response.message);
              this.$store.commit('closeModal');
              this.logout();
            }
          });
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
    }
  }
};
</script>

<style lang="scss">
@import '../../../assets/scss/_variables.scss';
.account {
  background: transparent url(../../../assets/images/bg.png) no-repeat;
  background-size: cover;

  .sidenav-user__photo {
    background-color: $info;
    height: 160px;
    width: 160px;
    font-size: 7rem;
    line-height: 152px;
    margin: 0;
    border-radius: 50%;
    text-align: center;
  }

  .account-info {
    background-color: rgba(255, 255, 255, .8);
    color: #777;
    padding: 20px;

    p {
      margin-bottom: 5px;
    }

    p:last-child {
      margin-bottom: 0;
    }
  }

  .card__actions {
    padding: 15px;
    background-color: white;
  }
}

.center-flex {
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-white {
  background-color: rgba($info, 0.8);
}
</style>
