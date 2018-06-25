<template>
  <v-navigation-drawer
    temporary
    :right="right"
    v-model="$store.state.layout.rightDrawer"
    fixed
    app
  >
    <v-list>
      <v-list-tile>
        <v-list-tile-action>
          <v-icon>notifications</v-icon>
        </v-list-tile-action>
        <v-list-tile-title>Notificaciones</v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data: () => ({
    right: true
  })
};
</script>
