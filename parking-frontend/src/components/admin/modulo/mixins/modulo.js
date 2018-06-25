'use strict';

export default {
  methods: {
    getMenu () {
      this.$service.get('system/menu')
      .then(response => {
        // Actualizando menú
        this.$storage.set('menu', response.menu);
        this.$store.commit('setMenu', response.menu);

        // Actualizando permisos
        this.$storage.set('permissions', response.permisos);
        this.$store.commit('setPermissions', response.permisos);

        // Actualizando token
        this.$storage.set('token', response.token);
      });
    }
  }
};
