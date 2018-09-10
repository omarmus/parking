<template>
  <section>
    <h3 class="primary--text"><v-icon color="primary">attach_money</v-icon> Tarifas</h3>
    <v-card>
      <v-card-text>
        <crud-table
          :headers="headers"
          :url="url"
          :filters="filters"
          :graphql="graphql"
          :width-modal="380"
        >
          <template slot="buttons">
            <v-tooltip bottom v-if="$store.state.permissions['tarifas:create']">
             <v-btn color="primary" dark
               @click.native.stop="openModal()"
               slot="activator"
             ><v-icon dark>add</v-icon> {{$t('common.add') }}</v-btn>
             <span>Agregar nueva tarifa</span>
           </v-tooltip>
          </template>

          <template slot="form">
            <v-card-title class="headline">
              <v-icon>attach_money</v-icon> {{ form.id ? 'Editar tarifa' : 'Agregar tarifa' }}
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
              <v-card-text class="pt-0">
                <v-container grid-list-md class="pt-0">

                  <v-text-field
                    label="Minutos"
                    :rules="$validate(['required'])"
                    required
                    v-model="form.minutos"
                    maxlength="10"
                    @keydown.native="$filter.integer($event)"
                  ></v-text-field>

                  <v-text-field
                    label="Precio"
                    :rules="$validate(['required'])"
                    required
                    v-model="form.precio"
                    maxlength="10"
                    @keydown.native="$filter.decimalFormat($event)"
                  ></v-text-field>

                  <v-select
                    label="Turno"
                    v-model="form.turno"
                    :items="turnos"
                    :rules="$validate(['required'])"
                    required
                  ></v-select>

                  <v-select
                    label="Gestión"
                    v-model="form.gestion"
                    :items="gestiones"
                    :rules="$validate(['required'])"
                    required
                  ></v-select>

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
            <td class="nowrap" v-if="$store.state.user.id_rol !== 3">
              <v-tooltip bottom v-if="$store.state.permissions['tarifas:update']">
                <v-btn
                  icon
                  slot="activator"
                  @click.native="editItem(items.item.id, 'tarifa', dataGraphql)">
                  <v-icon>edit</v-icon>
                </v-btn>
                <span>Editar registro</span>
              </v-tooltip>
              <v-tooltip bottom v-if="$store.state.permissions['tarifas:delete']">
                <v-btn
                  icon
                  slot="activator"
                  @click.native="deleteItem(items.item.id, 'tarifa')">
                  <v-icon color="red">delete</v-icon>
                </v-btn>
                <span>Eliminar registro</span>
              </v-tooltip>
            </td>
            <td v-if="$store.state.user.id_rol !== 3">
              <v-tooltip bottom v-if="$store.state.permissions['tarifas:update']">
                <v-switch
                  v-model="items.item.active"
                  value="ACTIVE"
                  @change="changeActive(items.item, items.item.id, 'tarifa', 'EditTarifa')"
                  slot="activator"
                  color="success"></v-switch>
                <span>Activar/desactivar registro</span>
              </v-tooltip>
            </td>
            <td class="text-xs-right">{{ getHora(items.item.minutos) }}</td>
            <td class="text-xs-right"><span v-if="items.item.minutos">1 a {{ items.item.minutos }}</span></td>
            <td class="text-xs-right">Bs. {{ items.item.precio }}</td>
            <td>{{ items.item.turno }}</td>
            <td>{{ items.item.gestion }}</td>
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
  </section>
</template>
<script>

import CrudTable from '@/common/util/crud-table/CrudTable.vue';
import crud from '@/common/util/crud-table/mixins/crud-table';
import validate from '@/common/mixins/validate';
import tarifa from './mixins/tarifa';

const turnos = [
  'DIURNO',
  'NOCTURNO'
];

export default {
  mixins: [ crud, validate, tarifa ],
  created () {
    this.gestiones = this.getGestiones();
    this.filters[0].items = this.getGestionesFilter(true);

    this.headers = [
      { text: 'Hora', value: 'minutos' },
      { text: 'Minutos', value: 'minutos' },
      { text: 'Precio', value: 'precio' },
      { text: 'Turno', value: 'turno' },
      { text: 'Gestión', value: 'gestion' },
      { text: 'Estado', value: 'estado' }
    ];

    if (this.$store.state.user.id_rol !== 3) {
      this.headers.unshift({ text: this.$t('common.actions'), sortable: false });
      this.headers.unshift({ text: 'Activo', sortable: false });
    }
  },
  data () {
    return {
      turnos,
      graphql: true, // Definiendo el CRUD con Graphql
      url: 'tarifas',
      gestiones: [],
      headers: [],
      form: {
        minutos: '',
        precio: '',
        turno: '',
        gestion: ''
      },
      dataGraphql: `
        id
        minutos
        precio
        turno
        gestion
        estado
      `,
      filters: [
        {
          field: 'gestion',
          label: 'Gestión',
          type: 'select',
          typeG: 'Int',
          items: []
        }
      ],
      valid: true
    };
  },
  methods: {
    getHora (minutos) {
      return this.$datetime.timeLiteral(minutos * 60);
    },
    getGestiones () {
      let items = [];
      let gestion = new Date().getFullYear();
      for (let i = 0; i < 3; i++, gestion++) {
        items.push(gestion);
      }
      return items;
    },
    openModal (data = {}) {
      this.$refs.form.reset();
      if (data.id) {
        this.form = data;
      } else {
        this.form = {
          minutos: '',
          precio: '',
          turno: 'DIURNO',
          gestion: new Date().getFullYear()
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
              mutation edit($id: Int!, $tarifa: EditTarifa!) {
                tarifaEdit(id: $id, tarifa: $tarifa) {
                  id
                }
              }
            `,
            variables: {
              id: this.form.id,
              tarifa: data
            }
          }).then(response => {
            if (response) {
              this.$store.commit('closeModal');
              this.updateList();
              this.$message.success('Se actualizó el registro correctamente');
            }
          });
        } else {
          this.$service.graphql({
            query: `
              mutation add($tarifa: NewTarifa!) {
                tarifaAdd(tarifa: $tarifa) {
                  id
                }
              }
            `,
            variables: {
              tarifa: data
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
    }
  },
  components: {
    CrudTable
  }
};
</script>
