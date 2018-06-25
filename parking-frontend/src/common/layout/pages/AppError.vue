<template>
  <div class="not-found">
    <div class="not-found__message text-xs-center">
      <h1>
        <span class="primary--text">5</span>0<span class="primary--text">0</span>
      </h1>
      <h4>SE PRODUJO UN ERROR EN EL SERVIDOR</h4>
      <div class="error-500" v-if="$store.state.message">
        {{ $store.state.message }}
      </div>
      <v-btn color="primary" round  @click="back()"><v-icon dark>arrow_back</v-icon> Volver atrás</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    back () {
      this.$store.state.message = null;
      this.$store.state.modal = false;
      this.$router.go(-1);
    }
  }
};
</script>

<style src="./pages.scss" lang="scss"></style>
