<template>
  <section>
    <!-- <h3 class="primary--text"><v-icon color="primary">business</v-icon> {{ $t('rol.title') }}</h3> -->
    <v-card>
      <v-card-text>
        <crud-table
          :headers="headers"
          :url="url"
          :filters="filters"
          :graphql="graphql"
          id-refresh="btn-refresh-rol"
        >
          <template slot="buttons">
            <v-tooltip bottom v-if="$store.state.permissions['roles:create']">
             <v-btn color="primary" dark
               @click.native.stop="openModal()"
               slot="activator"
             ><v-icon dark>add</v-icon> {{$t('common.add') }}</v-btn>
             <span>{{$t('rol.add')}}</span>
           </v-tooltip>
          </template>

          <template slot="form">
            <v-card-title class="headline">
              <v-flex xs10>
                <v-icon>business</v-icon> {{ form.id ? $t('rol.crud.editRol') :  $t('rol.crud.addRol') }}
              </v-flex>
              <v-btn icon @click.native="$store.commit('closeModal')">
                <v-icon>close</v-icon>
              </v-btn>
            </v-card-title>
            <v-form
              @submit.prevent="save"
              v-model="valid"
              ref="form"
              lazy-validation
              >
              <v-card-text>
                <v-container grid-list-md>

                <v-text-field
                  name="nombre"
                  :label="$t('rol.crud.name')"
                  id="nombre"
                  :rules="$validate(['required'])"
                  required
                  v-model="form.nombre"
                  maxlength="50"
                ></v-text-field>

                <v-text-field
                  name="descripcion"
                  :label="$t('rol.crud.description')"
                  id="descripcion"
                  :rules="$validate(['required'])"
                  required
                  v-model="form.descripcion"
                ></v-text-field>

                </v-container>
              </v-card-text>
              <v-card-actions>
                <small class="error--text text-required">* Los campos son obligatorios</small>
                <v-spacer></v-spacer>
                <v-btn
                  @click.native="$store.commit('closeModal');">
                  <v-icon>cancel</v-icon> {{$t('common.cancel') }}
                </v-btn>
                <v-btn
                  color="primary"
                  type="submit"
                  :disabled="!valid">
                  <v-icon dark>check</v-icon> {{$t('common.save') }}
                </v-btn>
              </v-card-actions>
            </v-form>
          </template>

          <template slot="items" slot-scope="items">
            <td class="nowrap">
              <v-tooltip bottom v-if="$store.state.permissions['roles:update']">
                <v-btn
                  icon
                  slot="activator"
                  @click.native="editItem(items.item.id, 'rol', dataGraphql)">
                  <v-icon>edit</v-icon>
                </v-btn>
                <span>Editar registro</span>
              </v-tooltip>
              <v-tooltip bottom v-if="$store.state.permissions['roles:delete']">
                <v-btn
                  icon
                  slot="activator"
                  @click.native="deleteItem(items.item.id, 'rol')">
                  <v-icon color="red">delete</v-icon>
                </v-btn>
                <span>Eliminar registro</span>
              </v-tooltip>
            </td>
            <td>{{ items.item.nombre }}</td>
            <td>{{ items.item.descripcion }}</td>

          </template>
        </crud-table>
      </v-card-text>
    </v-card>
  </section>
</template>
<script>

import CrudTable from '@/common/util/crud-table/CrudTable.vue';
import crud from '@/common/util/crud-table/mixins/crud-table';
import validate from '@/common/mixins/validate';

export default {
  mixins: [ crud, validate ],
  created () {
    this.user = this.$storage.getUser();
    this.idRol = this.user.id_rol;
  },
  data () {
    return {
      graphql: true, // Definiendo el CRUD con Graphql
      url: 'roles',
      headers: [
        { text: this.$t('common.actions'), sortable: false },
        { text: this.$t('rol.crud.name'), value: 'nombre' },
        { text: this.$t('rol.crud.description'), value: 'descripcion' }
      ],
      form: {
        nombre: '',
        descripcion: ''
      },
      dataGraphql: `
        id
        nombre
        descripcion
      `,
      filters: [],
      idRol: null,
      valid: true,
      tipos: [
        { text: 'ADMIN' },
        { text: 'CANCILLERIA' },
        { text: 'ENTIDAD' }
      ]
    };
  },
  methods: {
    openModal (data = {}) {
      this.$refs.form.reset();
      if (data.id) {
        this.form = data;
      } else {
        this.form = {
          nombre: '',
          descripcion: ''
        };
      }
      this.$store.commit('openModal');
    },
    save () {
      if (this.$refs.form.validate()) {
        let data = Object.assign({}, this.form);
        if (data.id) {
          delete data.id;
          this.$service.graphql({
            query: `
              mutation edit($id: Int!, $rol: EditRol!) {
                rolEdit(id: $id, rol: $rol) {
                  id
                }
              }
            `,
            variables: {
              id: this.form.id,
              rol: data
            }
          }).then(response => {
            if (response) {
              this.$store.commit('closeModal');
              this.updateList('btn-refresh-rol');
              this.$message.success('Se actualizó el registro correctamente');
            }
          });
        } else {
          this.$service.graphql({
            query: `
              mutation add($rol: NewRol!) {
                rolAdd(rol: $rol) {
                  id
                }
              }
            `,
            variables: {
              rol: data
            }
          }).then(response => {
            if (response) {
              this.$store.commit('closeModal');
              this.updateList('btn-refresh-rol');
              this.$message.success();
            }
          });
        }
      }
    }
  },
  components: {
    CrudTable
  }
};
</script>
