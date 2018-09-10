<template>
  <section>
    <h3 class="primary--text"><v-icon color="primary">attach_money</v-icon> Contratos</h3>
    <v-card>
      <v-card-text>
        <crud-table
          :headers="headers"
          :url="url"
          :filters="filters"
          :graphql="graphql"
          :width-modal="380"
          :data-graphql="dataGraphql"
        >
          <template slot="buttons">
            <v-tooltip bottom v-if="$store.state.permissions['contratos:create']">
             <v-btn color="primary" dark
               @click.native.stop="openModal()"
               slot="activator"
             ><v-icon dark>add</v-icon> {{$t('common.add') }}</v-btn>
             <span>Agregar nueva contrato</span>
           </v-tooltip>
          </template>

          <template slot="form">
            <v-card-title class="headline">
              <v-icon>attach_money</v-icon> {{ form.id ? 'Editar contrato' : 'Agregar contrato' }}
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

                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-select
                        :loading="loading"
                        :items="items"
                        :rules="$validate(['required'])"
                        :search-input.sync="search"
                        v-model="form.placa"
                        label="Placa"
                        autocomplete
                        cache-items
                        :multiple="false"
                        combobox
                        required
                        class="uppercase"
                      >
                        <template slot="selection" slot-scope="data">
                          <v-chip
                            class="uppercase"
                            :selected="data.selected"
                            close
                            @input="remove(data.item)"
                          >
                            <strong>{{ data.item }}</strong>
                          </v-chip>
                        </template>
                      </v-select>
                    </v-flex>

                    <v-flex xs12>
                      <v-menu
                        ref="menu1"
                        :close-on-content-click="false"
                        v-model="menu1"
                        :nudge-right="40"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        max-width="290px"
                        min-width="290px"
                      >
                        <v-text-field
                          slot="activator"
                          v-model="dateFormatted"
                          label="Desde"
                          hint="DD/MM/YYYY"
                          required
                          :rules="$validate(['required'])"
                          persistent-hint
                          prepend-icon="event"
                          @blur="date = parseDate(dateFormatted)"
                        ></v-text-field>
                        <v-date-picker v-model="date" no-title @input="menu1 = false"></v-date-picker>
                      </v-menu>
                    </v-flex>

                    <v-flex xs12>
                      <v-menu
                        ref="menu2"
                        :close-on-content-click="false"
                        v-model="menu2"
                        :nudge-right="40"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        max-width="290px"
                        min-width="290px"
                      >
                        <v-text-field
                          slot="activator"
                          v-model="dateFormatted2"
                          label="Hasta"
                          hint="DD/MM/YYYY"
                          required
                          :rules="$validate(['required'])"
                          persistent-hint
                          prepend-icon="event"
                          @blur="date2 = parseDate(dateFormatted2)"
                        ></v-text-field>
                        <v-date-picker v-model="date2" no-title @input="menu2 = false"></v-date-picker>
                      </v-menu>
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
            <td class="nowrap" v-if="$store.state.user.id_rol !== 3">
              <v-tooltip bottom v-if="$store.state.permissions['contratos:update']">
                <v-btn
                  icon
                  slot="activator"
                  @click.native="editItem(items.item.id, 'contrato', dataGraphql)">
                  <v-icon>edit</v-icon>
                </v-btn>
                <span>Editar registro</span>
              </v-tooltip>
              <v-tooltip bottom v-if="$store.state.permissions['contratos:delete']">
                <v-btn
                  icon
                  slot="activator"
                  @click.native="deleteItem(items.item.id, 'contrato')">
                  <v-icon color="red">delete</v-icon>
                </v-btn>
                <span>Eliminar registro</span>
              </v-tooltip>
            </td>
            <td v-if="$store.state.user.id_rol !== 3">
              <v-tooltip bottom v-if="$store.state.permissions['contratos:update']">
                <v-switch
                  v-model="items.item.active"
                  value="ACTIVE"
                  @change="changeActive(items.item, items.item.id, 'contrato', 'EditContrato')"
                  slot="activator"
                  color="success"></v-switch>
                <span>Activar/desactivar registro</span>
              </v-tooltip>
            </td>

            <td>{{ items.item.vehiculo_placa }}</td>
            <td>{{ $datetime.format(items.item.fecha_inicio) }}</td>
            <td>{{ $datetime.format(items.item.fecha_fin) }}</td>
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

const turnos = [
  'DIURNO',
  'NOCTURNO'
];

export default {
  mixins: [ crud, validate ],
  created () {
  },
  data () {
    return {
      turnos,
      graphql: true, // Definiendo el CRUD con Graphql
      url: 'contratos',
      headers: [
        { text: this.$t('common.actions'), sortable: false },
        { text: 'Activo', sortable: false },
        { text: 'Placa', value: 'id_vehiculo' },
        { text: 'Fecha de inicio', value: 'fecha_inicio' },
        { text: 'Fecha final', value: 'fecha_fin' },
        { text: 'Estado', value: 'estado' }
      ],
      form: {
        fecha_inicio: '',
        fecha_fin: '',
        placa: null
      },
      dataGraphql: `
        id
        id_vehiculo
        fecha_inicio
        fecha_fin
        vehiculo_placa
        estado
      `,
      filters: [
        // {
        //   field: 'gestion',
        //   label: 'Gestión',
        //   type: 'select',
        //   typeG: 'Int',
        //   items: []
        // }
      ],
      valid: true,
      date: null,
      date2: null,
      dateFormatted: null,
      dateFormatted2: null,
      menu1: false,
      menu2: false,
      search: null,
      loading: false,
      items: []
    };
  },
  methods: {
    formatDate (date) {
      if (!date) return null;

      const [year, month, day] = date.split('-');
      return `${day}/${month}/${year}`;
    },
    parseDate (date) {
      if (!date) return null;

      const [day, month, year] = date.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    },
    getHora (minutos) {
      return this.$datetime.timeLiteral(minutos * 60);
    },
    openModal (data = {}) {
      this.$refs.form.reset();
      if (data.id) {
        this.date = data.fecha_inicio;
        this.date2 = data.fecha_fin;
        this.dateFormatted = this.formatDate(data.fecha_inicio);
        this.dateFormatted2 = this.formatDate(data.fecha_fin);
        this.form.id = data.id;
        this.form.placa = data.vehiculo_placa;
      } else {
        this.form = {
          fecha_inicio: '',
          fecha_fin: '',
          placa: null
        };
      }
      this.$store.commit('openModal');
    },
    save () {
      if (this.$refs.form.validate()) {
        let data = Object.assign({}, this.form);
        data.fecha_inicio = this.date;
        data.fecha_fin = this.date2;
        if (data.id) {
          delete data.id;
          this.$service.graphql({
            query: `
              mutation edit($id: Int!, $contrato: EditContrato!) {
                contratoEdit(id: $id, contrato: $contrato) {
                  id
                }
              }
            `,
            variables: {
              id: this.form.id,
              contrato: data
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
              mutation add($contrato: NewContrato!) {
                contratoAdd(contrato: $contrato) {
                  id
                }
              }
            `,
            variables: {
              contrato: data
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
    getPlacas (placa) {
      this.loading = true;
      this.$service.graphql({
        query: `
          query ($placa: String) {
            vehiculos (placa: $placa, limit: 10) {
              count
              rows {
                id
                placa
              }
            }
          }
        `,
        variables: {
          placa: placa.toUpperCase()
        }
      }).then(response => {
        if (response && response.vehiculos) {
          let items = [];
          response.vehiculos.rows.map(item => {
            items.push(item.placa);
          });
          this.items = items;
          this.loading = false;
        }
      });
    },
    remove (item) {
      this.form.placa = null;
    }
  },
  components: {
    CrudTable
  },
  watch: {
    date (val) {
      this.dateFormatted = this.formatDate(this.date);
    },
    date2 (val) {
      this.dateFormatted2 = this.formatDate(this.date2);
    },
    search (val) {
      val && this.getPlacas(val);
    }
  }
};
</script>
