<template>
  <section>
    <h3 class="primary--text"><v-icon color="primary">business</v-icon> {{ $t('module.title') }}</h3>
    <v-card>
      <v-card-text>
        <crud-table
          :headers="headers"
          :url="url"
          :filters="filters"
          :graphql="graphql"
          :data-graphql="dataGraphql"
          :widthModal="640"
        >
          <template slot="buttons">
            <v-tooltip bottom v-if="$store.state.permissions['modulos:create']">
             <v-btn
               color="primary"
               dark
               @click.native.stop="openModal()"
               slot="activator"
             ><v-icon dark>add</v-icon> {{$t('common.add') }}</v-btn>
             <span>{{$t('module.add')}}</span>
           </v-tooltip>
          </template>

          <template slot="form">
            <v-card-title class="headline">
              <v-flex xs9>
                <v-icon>business</v-icon> {{ form.id ? $t('module.crud.editModule') :  $t('module.crud.addModule') }}
              </v-flex>
              <v-chip label color="success" text-color="white" v-if="form.estado == 'ACTIVO'">
                {{ form.estado }}
              </v-chip>
              <v-chip label color="warning" text-color="white" v-if="form.estado == 'INACTIVO'">
                {{ form.estado }}
              </v-chip>
              <v-spacer></v-spacer>
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
                  <v-layout wrap>
                    <v-flex xs7>
                      <v-text-field
                        name="label"
                        :label="$t('module.crud.label')"
                        v-model="form.label"
                        autofocus
                        maxlength="50"
                        :rules="$validate(['required'])"
                        required
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs5>
                      <v-text-field
                        name="ruta"
                        :label="$t('module.crud.path')"
                        v-model="form.ruta"
                        maxlength="50"
                        :rules="$validate(['required'])"
                        required
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs4>
                      <v-text-field
                        :disabled="isSection"
                        name="icono"
                        :label="$t('module.crud.icon')"
                        v-model="form.icono"
                        maxlength="30"
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs3>
                      <v-text-field
                        name="orden"
                        label="Nro. de orden"
                        v-model="form.orden"
                        maxlength="3"
                        :rules="$validate(['required'])"
                        required
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs5 justify-center v-if="!form.id">
                      <v-switch
                      v-model="form.visible"
                      :value="true"
                      label="Visible en el menú"
                      color="info"
                      required></v-switch>
                    </v-flex>
                  </v-layout>

                  <h4>Dependencias</h4>
                  <v-layout wrap>
                    <v-flex xs6>
                      <v-switch
                      v-model="isSection"
                      :value="true"
                      label="¿Depende de otro módulo?"
                      color="info"></v-switch>
                    </v-flex>
                    <v-flex xs6>
                      <v-select
                        v-if="isSection"
                        :items="modulos"
                        v-model="form.id_modulo"
                        label="Módulo padre"
                        item-text="text"
                        item-value="value"
                        :rules="$validate(['required'])"
                        required
                        ></v-select>
                    </v-flex>
                  </v-layout>

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
              <v-tooltip bottom v-if="$store.state.permissions['modulos:update']">
                <v-btn
                  icon
                  slot="activator"
                  @click.native="editItem(items.item.id, 'modulo', dataGraphql)">
                  <v-icon>edit</v-icon>
                </v-btn>
                <span>Editar registro</span>
              </v-tooltip>
              <v-tooltip bottom v-if="$store.state.permissions['modulos:delete']">
                <v-btn
                  icon
                  slot="activator"
                  @click.native="deleteItem(items.item.id, 'modulo')">
                  <v-icon color="red">delete</v-icon>
                </v-btn>
                <span>Eliminar registro</span>
              </v-tooltip>
            </td>
            <td class="nowrap">
              <v-tooltip bottom v-if="$store.state.permissions['permisos:update']">
                <v-btn
                  icon
                  slot="activator"
                  @click.native="openPermisos(items.item)">
                  <v-icon color="primary">security</v-icon>
                </v-btn>
                <span>Editar permisos</span>
              </v-tooltip>
            </td>
            <td>
              <v-tooltip bottom v-if="$store.state.permissions['modulos:update']">
                <v-switch
                  v-model="items.item.active"
                  value="ACTIVE"
                  @change="changeActive(items.item, items.item.id, 'modulo', 'EditModulo', getMenu)"
                  slot="activator"
                  color="success"></v-switch>
                <span>Activar/desactivar registro</span>
              </v-tooltip>
              <v-icon
                v-else
                :color="items.item.active === 'ACTIVE' ? 'success' : 'error'">
                {{ items.item.active === 'ACTIVE' ? 'check' : 'close' }}
              </v-icon>
            </td>
            <td>
              <v-tooltip bottom v-if="$store.state.permissions['modulos:update']">
                <v-switch
                  v-model="items.item.visible"
                  :value="true"
                  @change="changeVisible(items.item, items.item.id)"
                  slot="activator"
                  color="info"></v-switch>
                <span>Poner como visible en el menú</span>
              </v-tooltip>
              <v-icon
                v-else
                :color="items.item.visible ? 'success' : 'error'">
                {{ items.item.active === 'ACTIVE' ? 'check' : 'close' }}
              </v-icon>
            </td>
            <td>{{ items.item.label }}</td>
            <td>{{ items.item.ruta }}</td>
            <td>
              <v-tooltip bottom v-if="items.item.icono">
                <v-icon slot="activator">{{ items.item.icono }}</v-icon>
                <span>{{ items.item.icono }}</span>
              </v-tooltip>
            </td>
            <td>{{ getModulo(items.item.id_modulo) }}</td>
            <td class="text-xs-right">{{ items.item.orden }}</td>
            <td>
              <v-chip label color="success" text-color="white" v-if="items.item.visible">
                VISIBLE
              </v-chip>
              <v-chip label color="warning" text-color="white" v-else>
                OCULTO
              </v-chip>
            </td>
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
      </v-card-text>
    </v-card>
    <!-- Modal para permisos -->
    <v-dialog v-model="$store.state.modal2" max-width="960">
      <permisos :modulo="modulo" :roles="roles" v-if="roles.length"></permisos>
    </v-dialog>
  </section>
</template>
<script>

import CrudTable from '@/common/util/crud-table/CrudTable.vue';
import crud from '@/common/util/crud-table/mixins/crud-table';
import validate from '@/common/mixins/validate';
import Permisos from './Permisos';
import usuario from '@/components/admin/usuario/mixins/usuario';
import modulo from './mixins/modulo';

export default {
  mixins: [ crud, validate, usuario, modulo ],
  created () {
    this.user = this.$storage.getUser();
    this.modulos = [];
    this.getModulos();
    this.roles = [];
    this.getRoles();

    this.$store.state.modal2 = false;
  },
  data () {
    return {
      graphql: true, // Definiendo el CRUD con Graphql
      url: 'modulos',
      headers: [
        { text: this.$t('common.actions'), sortable: false },
        { text: this.$t('module.crud.permissions'), sortable: false },
        { text: this.$t('common.active'), sortable: false },
        { text: this.$t('module.crud.visible'), sortable: false },
        { text: this.$t('module.crud.label'), value: 'label' },
        { text: this.$t('module.crud.path'), value: 'ruta' },
        { text: this.$t('module.crud.icon'), value: 'icono' },
        { text: this.$t('module.crud.module'), value: 'id_modulo' },
        { text: this.$t('module.crud.order'), value: 'orden' },
        { text: this.$t('module.crud.is_visible'), value: 'visible' },
        { text: this.$t('common.status'), value: 'estado' }
      ],
      form: {
        label: '',
        ruta: '',
        icono: '',
        orden: '',
        visible: true,
        id_modulo: ''
      },
      dataGraphql: `
        id
        ruta
        label
        icono
        orden
        estado
        visible
        id_modulo
        modulo_label
        seccion_label
      `,
      filters: [
        {
          field: 'label',
          label: this.$t('module.crud.label'),
          type: 'text',
          typeG: 'String'
        },
        {
          field: 'id_modulo',
          label: this.$t('module.crud.module'),
          type: 'select',
          typeG: 'Int',
          items: []
        },
        {
          field: 'estado',
          label: this.$t('module.crud.status'),
          type: 'select',
          typeG: 'EstadoModulo',
          items: [
            { value: '', text: 'TODOS' },
            { value: 'ACTIVO', text: 'ACTIVO' },
            { value: 'INACTIVO', text: 'INACTIVO' }
          ]
        }
      ],
      modulos: [],
      valid: true,
      modulo: {},
      isSection: false
    };
  },
  methods: {
    openModal (data = {}) {
      this.$refs.form.reset();
      if (data.id) {
        this.form = data;
        this.form.id_modulo = this.getValue(this.form.id_modulo, this.modulos);
        if (this.form.id_modulo) {
          this.isSection = true;
        }
      } else {
        this.form = {
          label: '',
          ruta: '',
          icono: '',
          orden: '',
          visible: true,
          id_modulo: ''
        };
      }
      this.$store.commit('openModal');
    },
    save () {
      if (this.$refs.form.validate()) {
        let data = Object.assign({}, this.form);
        if (data.id_modulo && data.id_modulo.value) {
          data.id_modulo = data.id_modulo.value;
          if (data.id_modulo) {
            data.icono = '';
          }
        } else {
          delete data.id_modulo;
        }

        if (data.id) {
          delete data.id;
          delete data.modulo_label;
          delete data.seccion_label;
          this.$service.graphql({
            query: `
              mutation edit($id: Int!, $modulo: EditModulo!) {
                moduloEdit(id: $id, modulo: $modulo) {
                  id
                }
              }
            `,
            variables: {
              id: this.form.id,
              modulo: data
            }
          }).then(response => {
            if (response) {
              this.$store.commit('closeModal');
              this.updateList();
              this.$message.success('Se actualizó el registro correctamente');
              this.getMenu();
            }
          });
        } else {
          this.$service.graphql({
            query: `
              mutation add($modulo: NewModulo!) {
                moduloAdd(modulo: $modulo) {
                  id
                  label
                }
              }
            `,
            variables: {
              modulo: data
            }
          }).then(response => {
            if (response) {
              this.openPermisos(response.moduloAdd);
              this.$store.commit('closeModal');
              this.updateList();
              this.$message.success();
            }
          });
        }
      }
    },
    getModulos () {
      this.$service.graphql({
        query: `
          query getModulos($estado: EstadoModulo, $id_modulo: Int) {
            modulos(estado: $estado, id_modulo: $id_modulo) {
              count
              rows {
                id
                label
                icono
              }
            }
          }
        `,
        variables: {
          estado: 'ACTIVO',
          id_modulo: 0
        }
      }).then(response => {
        if (response) {
          let items = response.modulos.rows;
          let modulos = [];
          items.map(mod => {
            modulos.push({ value: mod.id, text: mod.label });
          });
          this.modulos = this.filters[1].items = modulos;
        }
      });
    },
    changeVisible (obj, id) {
      let visible = !!obj.visible;
      this.$confirm(`¿Está seguro de ${visible ? 'mostrar' : 'ocultar'} el módulo en el menú?.`, () => {
        this.$service.graphql({
          query: `
            mutation edit($id: Int!, $modulo: EditModulo!) {
              moduloEdit(id: $id, modulo: $modulo) {
                id
              }
            }
          `,
          variables: {
            id,
            modulo: {
              visible: visible
            }
          }
        }).then(response => {
          if (response) {
            if (visible) {
              this.$message.success(`¡Módulo visible!`, null, { timeout: 1500 });
            } else {
              this.$message.warning(`¡Módulo oculto!`, null, { timeout: 1500 });
            }
            this.updateList();
            this.getMenu();
          }
        });
      }, () => (obj.visible = !visible));
    },
    getModulo (id) {
      for (let i in this.modulos) {
        if (id) {
          if (parseInt(this.modulos[i].value) === id) {
            return this.modulos[i].text;
          }
        }
      }
      return '';
    },
    openPermisos (modulo) {
      this.modulo = modulo;
      this.$store.commit('openModal', 2);
    }
  },
  components: {
    CrudTable,
    Permisos
  },
  watch: {
    '$store.state.modal2': function (val) {
      if (val === false && this.$store.state.changes) {
        this.$store.commit('setChanges', 0);
        this.getMenu();
      }
    }
  }
};
</script>
