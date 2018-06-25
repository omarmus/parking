<template>
  <div class="not-found">
    <div class="not-found__message text-xs-center">
      <h1>
        <span class="primary--text">4</span>0<span class="primary--text">3</span>
      </h1>
      <h4>NO TIENE PERMISOS PARA REALIZAR ESTA ACCIÓN</h4>
      <v-btn color="primary" round  @click="back()"><v-icon dark>arrow_back</v-icon> Volver atrás</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    back () {
      if (this.$store.state.state403) {
        this.$store.state.state403 = false;
        this.$store.state.modal = false;
        this.$router.go(-2);
      } else {
        this.$router.go(-1);
      }
    }
  }
};
</script>

<style src="./pages.scss" lang="scss"></style>
