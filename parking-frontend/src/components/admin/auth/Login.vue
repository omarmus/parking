<template>
  <section>
    <div class="login-container">
      <!-- <div class="logo-app"></div> -->
      <v-card class="login-form">
        <v-form
          @submit.prevent="submit"
          v-model="valid"
          ref="form"
          lazy-validation
        >
          <v-card-title primary-title>
            <h4>{{ $t('login.title') }}</h4>
            <v-container fluid>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    name="username"
                    :label="$t('login.user')"
                    id="username"
                    append-icon="person"
                    v-model="form.username"
                    autofocus
                    maxlength="25"
                    :rules="$validate(['required'])"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    name="password"
                    :label="$t('login.password')"
                    id="password"
                    append-icon="lock"
                    :append-icon="getIcon"
                    :append-icon-cb="changeIcon"
                    :type="hidePass ? 'password' : 'text'"
                    v-model="form.password"
                    maxlength="100"
                    :rules="$validate(['required'])"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-title>
          <v-card-actions>
            <v-btn
              color="primary"
              block
              large
              :disabled="!valid"
              type="submit"
            >{{ $t('login.login') }}</v-btn>
          </v-card-actions>
          <v-card-title>
            <v-container fluid>
              <v-layout row class="login-options">
                <v-flex xs5>
                  <v-checkbox :label="$t('login.rememberMe')" v-model="remember" color="primary"></v-checkbox>
                </v-flex>
                <v-flex xs7>
                  <div class="text-xs-right">
                    <a href=""><v-icon>lock_outline</v-icon> {{ $t('login.forgotPass') }}</a>
                  </div>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-title>
          <v-card-title class="info">
            <a href="">{{ $t('login.signUp') }}</a>
          </v-card-title>
        </v-form>
      </v-card>
    </div>
    <div class="login-lang">
      <app-lang></app-lang>
    </div>
  </section>
</template>

<script>

import Auth from './mixins/auth';
import AppLang from '@/common/layout/AppLang';
import validate from '@/common/mixins/validate';

export default {
  mixins: [ Auth, validate ],
  data () {
    return {
      valid: true,
      form: {
        username: '',
        password: ''
      },
      hidePass: true,
      remember: false
    };
  },
  methods: {
    changeIcon () {
      if (this.form.password.length) {
        this.hidePass = !this.hidePass;
      }
    },
    submit () {
      if (this.$refs.form.validate()) {
        this.login(this.form);
      }
    }
  },
  components: { AppLang },
  computed: {
    getIcon () {
      return this.form.password.length === 0 ? 'lock' : this.hidePass ? 'visibility' : 'visibility_off';
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

<style src="./login.scss" lang="scss"></style>
