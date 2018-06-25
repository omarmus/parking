<template>
  <v-footer
    :fixed="fixed"
    :inset="inset"
    height="28"
    app
  >
    <v-spacer></v-spacer>
    <div>&copy; Agetic {{ new Date().getFullYear() }}</div>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    fixed: false,
    inset: true
  })
};
</script>

<style lang="scss">
@import '../../assets/scss/_variables.scss';

.theme--light .footer {
  font-size: 0.8rem;
  background: rgba(white, 0.8);
  min-height: 28px;
  color: $color;

  div {
    padding: 0 10px;
  }
}
</style>
