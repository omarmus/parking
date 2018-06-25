<template>
  <v-card class="crud-dialog">
    <v-card-title class="headline">
      <v-icon>security</v-icon> Permisos para {{ modulo.label }}
      <v-spacer></v-spacer>
      <v-btn icon @click.native="$store.commit('closeModal', 2)">
        <v-icon>close</v-icon>
      </v-btn>
    </v-card-title>
    <v-alert color="info" icon="info" value="true" class="alert-permiso">
      <v-layout>
        <v-flex xs7>Habilite/deshabilite los permisos del módulo para cada rol, donde:</v-flex>
        <v-flex xs3>
          <v-switch
            v-model="activo"
            label="Con permiso"
            @change="activo = true"
            :value="true"
            text-color="white"
            color="primary">
          </v-switch>
        </v-flex>
        <v-flex xs2>
          <v-switch
            label="Sin permiso"
            text-color="white"
            color="primary">
          </v-switch>
        </v-flex>
      </v-layout>
    </v-alert>
    <v-card-text>
      <table class="table">
        <thead>
          <tr>
            <th>Rol</th>
            <th class="width-permiso">Ver</th>
            <th class="width-permiso">Crear</th>
            <th class="width-permiso">Actualizar</th>
            <th class="width-permiso">Eliminar</th>
            <th class="width-permiso">CSV</th>
            <th class="width-permiso">Firmar</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in permisos">
            <td class="title-permiso">
              <strong>{{ item.rol_nombre }}</strong><br>
              <sub><em>{{ item.rol_descripcion }}</em></sub>
            </td>
            <td>
              <v-switch
                color="primary"
                @change="setPermiso(item)"
                v-model="item.read">
              </v-switch>
            </td>
            <td>
              <v-switch
                color="primary"
                @change="setPermiso(item)"
                v-model="item.create">
              </v-switch>
            </td>
            <td>
              <v-switch
                color="primary"
                @change="setPermiso(item)"
                v-model="item.update">
              </v-switch>
            </td>
            <td>
              <v-switch
                color="primary"
                @change="setPermiso(item)"
                v-model="item.delete">
              </v-switch>
            </td>
            <td>
              <v-switch
                color="primary"
                @change="setPermiso(item)"
                v-model="item.csv">
              </v-switch>
            </td>
            <td>
              <v-switch
                color="primary"
                @change="setPermiso(item)"
                v-model="item.firma">
              </v-switch>
            </td>
          </tr>
        </tbody>
      </table>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        @click.native="$store.commit('closeModal', 2);">
        <v-icon>cancel</v-icon> {{$t('common.close') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  props: {
    roles: {
      type: Array,
      default: () => []
    },
    modulo: {
      type: Object,
      default: () => {}
    }
  },
  created () {
    this.getPermisos(this.modulo.id);
  },
  data () {
    return {
      permisos: [],
      activo: true
    };
  },
  methods: {
    setPermiso (data) {
      let permiso = Object.assign({}, data);
      delete permiso.id;
      delete permiso.rol_nombre;
      delete permiso.rol_descripcion;
      this.$service.graphql({
        query: `
          mutation update($id: Int!, $permiso: EditPermiso!) {
            permisoEdit(id: $id, permiso: $permiso) {
              id
            }
          }
        `,
        variables: {
          id: data.id,
          permiso
        }
      }).then(response => {
        if (response) {
          console.log('changes', this.$store.state.changes);
          this.$store.commit('setChanges', this.$store.state.changes + 1);
          this.$message.success('¡Permiso actualizado!', null, { timeout: 1500 });
        }
      });
    },
    getPermisos (idModulo) {
      this.permisos = [];
      this.$service.graphql({
        query: `
          query getPermisos($id_modulo: Int) {
            permisos(id_modulo: $id_modulo, order: "id_rol") {
              count
              rows {
                id
                create
                read
                update
                delete
                firma
                csv
                activo
                id_modulo
                id_rol
                rol_nombre
                rol_descripcion
              }
            }
          }
        `,
        variables: {
          id_modulo: idModulo
        }
      }).then(response => {
        if (response) {
          this.permisos = response.permisos.rows;
        }
      });
    }
  },
  watch: {
    'modulo.id': function (val) {
      this.getPermisos(val);
    }
  }
};
</script>

<style lang="scss">
  .width-permiso {
    width: 100px;
  }
  .alert-permiso {
    label {
      color: white !important;
    }
    .input-group__details {
      display: none;
    }
  }
  .title-permiso {
    line-height: .9rem;
  }
</style>
