export default {
  methods: {
    editItem (id, url, fields = 'id', form = true) {
      if (this.graphql) {
        this.$service.graphql({
          query: `
            query get($id: Int!) {
              ${url}(id: $id) {
                ${fields}
              }
            }
          `,
          variables: { id }
        }).then(response => {
          if (response) {
            this.openModal(response[url], form);
          }
        });
      } else {
        this.$service.get(`${url || this.url}/${id}`)
        .then(response => {
          if (response) {
            this.openModal(response, form);
          }
        });
      }
    },

    deleteItem (id, url) {
      this.$confirm('¿Quiere eliminar el registro?', () => {
        if (this.graphql) {
          this.$service.graphql({
            query: `
              mutation remove($id: Int!) {
                ${url}Delete(id: $id) {
                  deleted
                }
              }
            `,
            variables: { id }
          }).then(response => {
            if (response && response[url + 'Delete'] && response[url + 'Delete'].deleted) {
              this.$message.success('¡Registro eliminado correctamente!');
              this.updateList();
            }
          });
        } else {
          this.$service.delete(url || this.url, id)
          .then(response => {
            this.$message.success('¡Registro eliminado correctamente!');
            this.updateList();
          });
        }
      });
    },

    changeActive (obj, id, url, type, callback, method = 'Edit') {
      let active = obj.active === 'ACTIVE';
      this.$confirm(`¿Está seguro de ${active ? 'activar' : 'desactivar'} el registro?.`, () => {
        if (this.graphql) {
          this.$service.graphql({
            query: `
              mutation edit($id: Int!, $${url}: ${type}!) {
                ${url}${method}(id: $id, ${url}: $${url}) {
                  id
                }
              }
            `,
            variables: {
              id,
              [url]: {
                estado: active ? 'ACTIVO' : 'INACTIVO'
              }
            }
          }).then(response => {
            if (response) {
              if (active) {
                this.$message.success(`¡Registro activado!`, null, { timeout: 2000 });
              } else {
                this.$message.warning(`¡Registro desactivado!`, null, { timeout: 2000 });
              }
              this.updateList();
              if (typeof callback === 'function') {
                callback();
              }
            }
          });
        } else {
          this.$service.patch(`${this.url}/${id}`, { 'transicion': active ? 'activar' : 'inactivar' })
          .then(response => {
            if (response) {
              if (active) {
                this.$message.success(`¡Registro activado!`, null, { timeout: 2000 });
              } else {
                this.$message.warning(`¡Registro desactivado!`, null, { timeout: 2000 });
              }
              this.updateList();
              if (typeof callback === 'function') {
                callback();
              }
            }
          });
        }
      }, () => (obj.active = active ? 'INACTIVE' : 'ACTIVE'));
    },

    updateList (id = 'btn-refresh-list') {
      if (document.getElementById(id)) {
        document.getElementById(id).dispatchEvent(new window.Event('click'));
      }
    },

    getValue (id, items) {
      id = id + '';
      // console.log(id, items);
      for (let i in items) {
        // console.log(items[i].value, typeof items[i].value, items[i].value === id);
        if (items[i].value === id) {
          return items[i];
        }
      }
      return null;
    },

    $update (key, event) {
      this.$store.commit('update', {
        path: [key],
        value: event.target.value
      });
    }
  }
};
