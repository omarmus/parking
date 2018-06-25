/* eslint no-useless-escape: 0 */

'use strict';

export default {
  methods: {
    getRoles (filter) {
      this.$service.graphql({
        query: `
          query getRoles {
            roles {
              count
              rows {
                id
                nombre
                descripcion
              }
            }
          }
        `,
        variables: {}
      }).then(response => {
        if (response) {
          let items = response.roles.rows;
          let roles = [];
          items.map(rol => {
            roles.push({ value: rol.id, text: rol.nombre + ' - ' + rol.descripcion });
          });
          this.roles = roles;
          if ((filter || filter === 0) && this.filters[filter] && this.filters[filter].items) {
            this.filters[filter].items = this.roles;
          }
        }
      });
    },
    getEntidades (filter) {
      this.$service.graphql({
        query: `
          query getRoles($estado: EstadoEntidad) {
            entidades(estado: $estado) {
              count
              rows {
                id
                nombre
                sigla
              }
            }
          }
        `,
        variables: {
          estado: 'ACTIVO'
        }
      }).then(response => {
        if (response) {
          let items = response.entidades.rows;
          let entidades = [];
          items.map(est => {
            entidades.push({ value: est.id, text: (est.sigla ? `${est.sigla} - ` : '') + est.nombre });
          });
          this.entidades = entidades;
          if ((filter || filter === 0) && this.filters[filter] && this.filters[filter].items) {
            this.filters[filter].items = this.entidades;
          }
        }
      });
    }
  }
};
