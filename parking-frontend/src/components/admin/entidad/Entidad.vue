<template>
  <section>
    <h3 class="primary--text"><v-icon color="primary">business</v-icon> {{ $store.state.user.id_rol !== 2 ? $t('entity.title') : 'Entidad' }}</h3>
    <v-card>
      <v-card-text>
        <crud-table
          :headers="headers"
          :url="url"
          :filters="filters"
          :graphql="graphql"
          :widthModal="800"
          v-if="$store.state.user.id_rol !== 2"
        >
          <template slot="buttons">
            <!-- <v-tooltip bottom v-if="$store.state.permissions['entidades:create']">
              <v-btn
                @click="descargarTodo()"
                slot="activator"
                color="primary">
                <v-icon>sync</v-icon> Sincronizar
              </v-btn>
              <span>Sincronizar con el Portal Único de Trámites</span>
            </v-tooltip> -->
            <v-tooltip bottom v-if="$store.state.permissions['entidades:create']">
              <v-btn color="primary"
                @click.native.stop="openModal()"
                slot="activator">
                <v-icon>add</v-icon> {{$t('common.add') }}
              </v-btn>
              <span>{{$t('entity.add')}}</span>
            </v-tooltip>
          </template>

          <template slot="form">
            <v-card-title class="headline">
              <v-flex xs9>
                <v-icon>business</v-icon> {{ form.id ? $t('entity.crud.editEnt') :  $t('entity.crud.addEnt') }}
              </v-flex>
              <v-flex xs2 text-md-right>
                <v-chip label color="success" text-color="white" v-if="form.estado == 'ACTIVO'">
                  {{ form.estado }}
                </v-chip>
                <v-chip label color="warning" text-color="white" v-if="form.estado == 'INACTIVO'">
                  {{ form.estado }}
                </v-chip>
              </v-flex>
              <v-flex xs1 text-md-right>
                <v-btn icon @click.native="$store.commit('closeModal')">
                  <v-icon>close</v-icon>
                </v-btn>
              </v-flex>
            </v-card-title>
            <v-form
              @submit.prevent="save"
              v-model="valid"
              ref="form"
              lazy-validation
              >
              <v-card-text class="pt-0">
                <v-container grid-list-md>
                  <h4>Datos generales</h4>
                  <v-layout wrap>
                    <v-flex xs9>
                      <v-text-field
                        name="nombre"
                        :label="$t('entity.crud.name')"
                        id="nombre"
                        v-model="form.nombre"
                        autofocus
                        maxlength="150"
                        :rules="$validate(['required'])"
                        required
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs3>
                      <v-text-field
                        name="sigla"
                        :label="$t('entity.crud.acronym')"
                        id="sigla"
                        v-model="form.sigla"
                        maxlength="20"
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs8>
                      <v-text-field
                        name="descripcion"
                        :label="$t('entity.crud.description')"
                        id="descripcion"
                        v-model="form.descripcion"
                        maxlength="500"
                        :counter="500"
                        :rules="$validate(['required'])"
                        required
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs4>
                      <v-text-field
                        name="codigo_portal"
                        label="Código único de portal"
                        id="codigo_portal"
                        v-model="form.codigo_portal"
                        maxlength="20"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>

                  <h4>Datos de contacto</h4>
                  <v-layout wrap>
                    <v-text-field
                      name="email"
                      :label="$t('entity.crud.email')"
                      prepend-icon="email"
                      id="email"
                      v-model="form.email"
                      maxlength="100"
                      :rules="$validate(['email'])"
                    ></v-text-field>

                    <v-text-field
                      name="web"
                      :label="$t('entity.crud.web')"
                      prepend-icon="public"
                      id="web"
                      v-model="form.web"
                      maxlength="100"
                      :rules="$validate(['url'])"
                    ></v-text-field>
                  </v-layout>

                  <v-flex xs12>
                    <v-text-field
                      name="direccion"
                      :label="$t('entity.crud.address')"
                      id="direccion"
                      v-model="form.direccion"
                      maxlength="500"
                      :counter="500"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12>
                    <v-select
                      :label="$t('entity.crud.phones')"
                      chips
                      tags
                      prepend-icon="phone"
                      v-model="form.telefonos"
                    >
                      <template slot="selection" slot-scope="data">
                        <v-chip
                          close
                          @input="remove(data.item)"
                          :selected="data.selected"
                        >
                          {{ data.item }}
                        </v-chip>
                      </template>
                    </v-select>
                  </v-flex>
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
                  <v-icon>check</v-icon> {{$t('common.save') }}
                </v-btn>
              </v-card-actions>
            </v-form>
          </template>

          <template slot="items" slot-scope="items">
            <td class="nowrap">
              <v-tooltip bottom v-if="$store.state.permissions['entidades:update']">
                <v-btn
                  icon
                  slot="activator"
                  @click.native="editItem(items.item.id, 'entidad', dataGraphql)">
                  <v-icon>edit</v-icon>
                </v-btn>
                <span>Editar registro</span>
              </v-tooltip>
              <v-tooltip bottom v-if="$store.state.permissions['entidades:delete']">
                <v-btn
                  icon
                  slot="activator"
                  @click.native="deleteItem(items.item.id, 'entidad')">
                  <v-icon color="red">delete</v-icon>
                </v-btn>
                <span>Eliminar registro</span>
              </v-tooltip>
            </td>
            <td>
              <v-tooltip bottom v-if="$store.state.permissions['entidades:update']">
                <v-switch
                  v-model="items.item.active"
                  value="ACTIVE"
                  @change="changeActive(items.item, items.item.id, 'entidad', 'EditEntidad')"
                  v-if="idEntidad != items.item.id"
                  slot="activator"
                  color="success"></v-switch>
                <span>Activar/desactivar registro</span>
              </v-tooltip>
              <v-icon
                v-if="!$store.state.permissions['entidades:update'] && idEntidad != items.item.id"
                :color="items.item.active === 'ACTIVE' ? 'success' : 'error'">
                {{ items.item.active === 'ACTIVE' ? 'check' : 'close' }}
              </v-icon>
              <v-tooltip bottom>
                <v-btn
                  icon
                  v-if="idEntidad == items.item.id"
                  slot="activator">
                  <v-icon>business</v-icon>
                </v-btn>
                <span>Esta es mi entidad.</span>
              </v-tooltip>
            </td>
            <td>{{ items.item.nombre }}</td>
            <td>{{ items.item.sigla }}</td>
            <td>{{ items.item.web }}</td>
            <td>{{ items.item.direccion }}</td>
            <td>
              <v-chip label color="success" text-color="white" v-if="items.item.estado == 'ACTIVO'">
                {{ items.item.estado }}
              </v-chip>
              <v-chip label color="warning" text-color="white" v-if="items.item.estado == 'INACTIVO'">
                {{ items.item.estado }}
              </v-chip>
            </td>
          </template>
        </crud-table>
        <v-form
          @submit.prevent="save"
          v-model="valid"
          ref="form"
          lazy-validation
          v-else
          >
          <v-card-text>
            <v-container grid-list-md>
              <h4>Datos generales</h4>
              <v-layout wrap>
                <v-flex xs9>
                  <v-text-field
                    name="nombre"
                    :label="$t('entity.crud.name')"
                    id="nombre"
                    v-model="form.nombre"
                    autofocus
                    maxlength="150"
                    :rules="$validate(['required'])"
                    required
                  ></v-text-field>
                </v-flex>

                <v-flex xs3>
                  <v-text-field
                    name="sigla"
                    :label="$t('entity.crud.acronym')"
                    id="sigla"
                    v-model="form.sigla"
                    maxlength="20"
                  ></v-text-field>
                </v-flex>

                <v-flex xs8>
                  <v-text-field
                    name="descripcion"
                    :label="$t('entity.crud.description')"
                    id="descripcion"
                    v-model="form.descripcion"
                    maxlength="500"
                    :counter="500"
                    :rules="$validate(['required'])"
                    required
                  ></v-text-field>
                </v-flex>

                <v-flex xs4>
                  <v-text-field
                    name="codigo_portal"
                    label="Código único de portal"
                    id="codigo_portal"
                    v-model="form.codigo_portal"
                    maxlength="20"
                    :rules="$validate(['required'])"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>

              <h4>Datos de contacto</h4>
              <v-layout wrap>
                <v-text-field
                  name="email"
                  :label="$t('entity.crud.email')"
                  prepend-icon="email"
                  id="email"
                  v-model="form.email"
                  maxlength="100"
                  :rules="$validate(['email'])"
                ></v-text-field>

                <v-text-field
                  name="web"
                  :label="$t('entity.crud.web')"
                  prepend-icon="public"
                  id="web"
                  v-model="form.web"
                  maxlength="100"
                  :rules="$validate(['url'])"
                ></v-text-field>
              </v-layout>

              <v-flex xs12>
                <v-text-field
                  name="direccion"
                  :label="$t('entity.crud.address')"
                  id="direccion"
                  v-model="form.direccion"
                  maxlength="500"
                  :counter="500"
                ></v-text-field>
              </v-flex>

              <v-flex xs12>
                <v-select
                  :label="$t('entity.crud.phones')"
                  chips
                  tags
                  prepend-icon="phone"
                  v-model="form.telefonos"
                >
                  <template slot="selection" slot-scope="data">
                    <v-chip
                      close
                      @input="remove(data.item)"
                      :selected="data.selected"
                    >
                      {{ data.item }}
                    </v-chip>
                  </template>
                </v-select>
              </v-flex>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <small class="error--text text-required">* Los campos son obligatorios</small>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              type="submit"
              :disabled="!valid">
              <v-icon>check</v-icon> Guardar cambios
            </v-btn>
          </v-card-actions>
        </v-form>
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
    this.idEntidad = this.user.id_entidad;
  },
  mounted () {
    if (this.$store.state.user.id_rol === 5) {
      this.editItem(this.$store.state.user.id_entidad, 'entidad', this.dataGraphql, false);
    }
  },
  data () {
    return {
      successAlert: false,
      graphql: true, // Definiendo el CRUD con Graphql
      url: 'entidades',
      headers: [
        { text: this.$t('common.actions'), sortable: false },
        { text: this.$t('common.active'), sortable: false },
        { text: this.$t('entity.crud.name'), value: 'nombre' },
        { text: this.$t('entity.crud.acronym'), value: 'sigla' },
        { text: this.$t('entity.crud.web'), value: 'web' },
        { text: this.$t('entity.crud.address'), value: 'direccion' },
        { text: this.$t('common.status'), value: 'estado' }
      ],
      form: {
        nombre: '',
        sigla: '',
        descripcion: '',
        email: '',
        web: '',
        direccion: '',
        telefonos: [],
        estado: ''
      },
      dataGraphql: `
        id
        nombre
        sigla
        descripcion
        email
        telefonos
        direccion
        codigo_portal
        web
        estado
      `,
      filters: [
        {
          field: 'nombre',
          label: this.$t('entity.crud.name'),
          type: 'text',
          typeG: 'String'
        },
        {
          field: 'sigla',
          label: this.$t('entity.crud.acronym'),
          type: 'text',
          typeG: 'String'
        },
        {
          field: 'estado',
          label: this.$t('entity.crud.status'),
          type: 'select',
          typeG: 'EstadoEntidad',
          items: [
            { value: '', text: 'TODOS' },
            { value: 'ACTIVO', text: 'ACTIVO' },
            { value: 'INACTIVO', text: 'INACTIVO' }
          ]
        }
      ],
      idEntidad: null,
      valid: true
    };
  },
  methods: {
    openModal (data = {}, form = true) {
      this.valid = true;
      this.$refs.form.reset();
      if (data.id) {
        if (data.telefonos) {
          data.telefonos = data.telefonos.split(',');
        } else {
          data.telefonos = [];
        }
        this.form = data;
      } else {
        this.form = {
          nombre: '',
          sigla: '',
          descripcion: '',
          email: '',
          web: '',
          direccion: '',
          telefonos: [],
          estado: ''
        };
      }
      if (form) {
        this.$store.commit('openModal');
      }
    },
    save () {
      if (this.$refs.form.validate()) {
        let data = Object.assign({}, this.form);
        data.telefonos = data.telefonos.join(',');
        if (data.id) {
          delete data.id;
          this.$service.graphql({
            query: `
              mutation edit($id: Int!, $entidad: EditEntidad!) {
                entidadEdit(id: $id, entidad: $entidad) {
                  id
                }
              }
            `,
            variables: {
              id: this.form.id,
              entidad: data
            }
          }).then(response => {
            if (response) {
              this.$store.commit('closeModal');
              this.updateList();
              this.$message.success('Se actualizó el registro correctamente');
            }
          });
        } else {
          data.estado = 'ACTIVO';
          this.$service.graphql({
            query: `
              mutation add($entidad: NewEntidad!) {
                entidadAdd(entidad: $entidad) {
                  id
                }
              }
            `,
            variables: {
              entidad: data
            }
          }).then(response => {
            if (response) {
              this.$store.commit('closeModal');
              this.updateList();
              this.$message.success();
            }
          });
        }
      }
    },
    remove (item) {
      this.form.telefonos.splice(this.form.telefonos.indexOf(item), 1);
      this.form.telefonos = [...this.form.telefonos];
    },
    descargarTodo () {
      // TODO: Implementar función de sincronización con el portál único
    }
  },
  components: {
    CrudTable
  }
};
</script>
