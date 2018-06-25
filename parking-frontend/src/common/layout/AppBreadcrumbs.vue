<template>
  <v-breadcrumbs>
    <v-icon slot="divider">chevron_right</v-icon>
    <v-breadcrumbs-item v-for="item in $store.state.layout.breadcrumbs" :key="item.text" :disabled="item.disabled">
      {{ item.text }}
    </v-breadcrumbs-item>
  </v-breadcrumbs>
</template>

<script>
export default {
  created () {
    if (this.$storage.exist('menu')) {
      let items = this.$util.getMenuOption(this.$storage.get('menu'), this.$util.trimUrl(this.$route.path));
      this.$store.commit('layout/setBreadcrumbs', items);
    }
  }
};
</script>

<style lang="scss">
.breadcrumbs {
  padding: 12px 15px;
}
</style>
