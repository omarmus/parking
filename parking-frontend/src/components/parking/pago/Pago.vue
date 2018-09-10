<template>
  <section>
    <h3 class="primary--text">
      <v-icon color="primary">attach_money</v-icon> Pagos
      <span v-if="$store.state.user.id_rol === 3"> del {{ $datetime.format(fecha) }}</span>
    </h3>
    <div class="grid" :class="{ 'grid-column': $store.state.user.id_rol !== 3 }">
      <div v-if="$store.state.user.id_rol !== 3">
        <v-alert :value="true" color="info" outline icon="info">
          Seleccione una fecha del calendario.
        </v-alert>
        <v-date-picker
          v-model="fecha"
          class="mb-2"
          locale="es"
          :first-day-of-week="1"></v-date-picker>
        <v-card>
          <v-card-text>
            <h4 class="primary--text">Reporte por rango de fechas</h4>
            <v-form
              @submit.prevent="generarReporte"
              v-model="valid"
              ref="form"
              lazy-validation
              >
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
              <v-btn
                type="submit"
                :disabled="!valid"
                block
                color="primary"
                large>
                <v-icon>print</v-icon> Generar reporte
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </div>
      <div v-if="fecha">
        <v-tabs
          v-model="active"
          class="tab-preferencias"
          color="info"
          dark
          slider-color="warning"
        >
          <v-tab
            key="pagados"
            href="#pagados"
            ripple>
            <v-icon>settings_applications</v-icon> Pagos realizados
          </v-tab>
          <v-tab
            key="pendientes"
            href="#pendientes"
            ripple>
            <v-icon>person_outline</v-icon> Pagos pendientes
          </v-tab>
          <v-tab-item
            key="pagados"
            id="pagados">
            <v-card flat>
              <v-card-text>
                <crud-table
                  :headers="headers"
                  :url="url"
                  :filters="filters"
                  :show-filter="false"
                  :graphql="graphql"
                  :data-graphql="dataGraphql"
                >
                  <template slot="buttons">
                    <v-btn @click="pagosCsv()">
                      <v-icon>print</v-icon> Descargar CSV
                    </v-btn>
                  </template>
                  <template slot="labels">
                    <div class="text-xs-right">
                      <v-chip label outline color="info" :value="true" class="text-xs-center">
                        <h3 class="m-0">Total: {{ total }} Bs.</h3>
                      </v-chip>
                    </div>
                  </template>
                  <template slot="form">
                    <v-card-title class="headline">
                      <v-icon>list</v-icon> Detalles
                      <v-spacer></v-spacer>
                      <v-btn icon @click.native="$store.commit('closeModal')">
                        <v-icon>close</v-icon>
                      </v-btn>
                    </v-card-title>
                    <v-card-text class="pt-0 movimiento-detalle" v-if="movimiento">
                      <h4><strong class="primary--text">PLACA:</strong> {{ movimiento.vehiculo_placa }}</h4>
                      <p>
                        <strong class="primary--text">Fecha de ingreso:</strong> {{ $datetime.format(movimiento.fecha_llegada) }}
                        <strong class="primary--text">Hora:</strong> {{ movimiento.hora_llegada }}
                      </p>
                      <p>
                        <strong class="primary--text">Fecha de salida:</strong> {{ $datetime.format(movimiento.fecha_salida) }}
                        <strong class="primary--text">Hora:</strong> {{ movimiento.hora_salida }}
                      </p>
                      <p><strong class="primary--text">Dejó llave:</strong> {{ movimiento.llave ? 'SI' : 'NO' }}</p>
                      <!-- <p><strong>Estado:</strong> {{ movimiento.estado }}</p> -->
                    </v-card-text>
                  </template>
                  <template slot="items" slot-scope="items">
                    <td class="text-xs-right">{{ $util.pad(items.item.id, 10) }}</td>
                    <td>
                      <v-chip label small color="success" text-color="white">
                        {{ items.item.estado }}
                      </v-chip>
                    </td>
                    <td>{{ items.item.vehiculo_placa }}</td>
                    <td>{{ $datetime.format(items.item.pago_fecha, 'dd/MM/YYYY hrs. HH:mm') }}</td>
                    <td class="text-xs-right">Bs. {{ items.item.pago_total }}</td>
                    <td>{{ $datetime.format(items.item.fecha_llegada) }}</td>
                    <td>{{ items.item.hora_llegada }}</td>
                    <td>{{ $datetime.format(items.item.fecha_salida) }}</td>
                    <td>{{ items.item.hora_salida }}</td>
                    <td>
                      <v-icon v-if="items.item.llave" color="success">check</v-icon>
                      <v-icon v-if="!items.item.llave" color="error">close</v-icon>
                    </td>
                  </template>
                </crud-table>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item
            key="pendientes"
            id="pendientes">
            <pendientes :fecha="fecha"></pendientes>
          </v-tab-item>
        </v-tabs>
      </div>
    </div>
  </section>
</template>
<script>

import CrudTable from '@/common/util/crud-table/CrudTable.vue';
import crud from '@/common/util/crud-table/mixins/crud-table';
import tarifa from '@/components/parking/tarifa/mixins/tarifa';
import validate from '@/common/mixins/validate';
import Pendientes from './Pendientes';

export default {
  mixins: [ crud, tarifa, validate ],
  data () {
    return {
      active: 'pagados',
      total: 0,
      movimiento: null,
      graphql: true, // Definiendo el CRUD con Graphql
      url: 'movimientos',
      gestiones: [],
      fecha: null,
      valid: true,
      dataGraphql: `
        vehiculo_placa
        fecha_llegada
        hora_llegada
        fecha_salida
        hora_salida
        llave
        estado
        pago_fecha
        pago_total
        pago_gestion
        pago_estado
      `,
      headers: [
        { text: 'Nro. Ticket', value: 'id' },
        { text: 'Estado', value: 'estado' },
        { text: 'Placa', value: 'id_vehiculo' },
        { text: 'Fecha de pago', value: 'fecha_llegada' },
        { text: 'Total', value: 'fecha_llegada' },
        { text: 'Fecha de llegada', value: 'fecha_llegada' },
        { text: 'Hora llegada', value: 'hora_llegada' },
        { text: 'Fecha de salida', value: 'fecha_salida' },
        { text: 'Hora salida', value: 'hora_salida' },
        { text: 'Llave', value: 'llave' }
      ],
      filters: [
        {
          field: 'estado',
          type: 'hidden',
          typeG: 'EstadoPago',
          value: 'PAGADO'
        },
        {
          field: 'fecha_pago',
          type: 'hidden',
          typeG: 'String'
        }
      ],
      loading: false,
      pendientes: false,
      date: null,
      date2: null,
      dateFormatted: null,
      dateFormatted2: null,
      menu1: false,
      menu2: false,
      headersCsv: [
        'TICKET',
        'PLACA',
        'ESTADO',
        'PAGO FECHA',
        'PAGO TOTAL',
        'FECHA LLEGADA',
        'FECHA SALIDA',
        'LLAVE'
      ]
    };
  },
  mounted () {
    this.fecha = this.$datetime.now(false, 'SIN_FORMATO');
  },
  methods: {
    generarReporte () {
      if (this.$refs.form.validate()) {
        // let date1 = date1.
        this.$loading.show('Generando reporte');
        this.$service.graphql({
          query: `
            query reporte {
              movimientos(fecha_inicio: "${this.date}", fecha_fin: "${this.date2}", estado: PAGADO) {
                count
                rows {
                  id
                  ${this.dataGraphql}
                }
              }
            }
          `,
          variables: {}
        }).then(response => {
          if (response) {
            let movimientos = response.movimientos.rows;
            this.$util.csv(this.createData(movimientos), this.headersCsv);
          }
        });
      }
    },
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
    pagosCsv () {
      this.$loading.show('Generando reporte');
      this.$service.graphql({
        query: `
          query reporte {
            movimientos(fecha_pago: "${this.fecha}", estado: PAGADO) {
              count
              rows {
                id
                ${this.dataGraphql}
              }
            }
          }
        `,
        variables: {}
      }).then(response => {
        if (response) {
          let movimientos = response.movimientos.rows;
          this.$util.csv(this.createData(movimientos), this.headersCsv);
        }
      });
    },
    createData (items) {
      let rows = [];
      let total = 0;
      for (let i in items) {
        let fila = [];
        fila.push(this.$util.pad(items[i].id + '', 10));
        fila.push(items[i].vehiculo_placa);
        fila.push(items[i].estado);
        fila.push(this.$datetime.format(items[i].pago_fecha, 'dd/MM/YYYY hrs. HH:mm'));
        fila.push('Bs.' + items[i].pago_total);
        fila.push(this.$datetime.format(items[i].fecha_llegada) + ' Hrs. ' + items[i].hora_llegada);
        fila.push(this.$datetime.format(items[i].fecha_salida) + ' Hrs. ' + items[i].hora_salida);
        fila.push(items[i].llave ? 'SI' : 'NO');
        rows.push(fila);
        total += parseFloat(items[i].pago_total);
      }
      rows.push([`TOTAL: Bs. ${total}`]);
      return rows;
    },
    seleccionarDia (fecha) {
      if (fecha) {
        this.loading = true;
        this.$loading.show('Cargando pagos');
        this.filters[1].value = this.fecha;
        this.updateList();
        this.getTotal();
      }
    },
    getTotal () {
      this.$service.graphql({
        query: `
          query {
            pagos(fecha: "${this.fecha}") {
              count
              rows {
                total
                estado
              }
            }
          }
        `,
        variables: {}
      }).then(response => {
        if (response && response.pagos) {
          let total = 0;
          response.pagos.rows.map(item => {
            if (item.estado === 'PAGADO') {
              total += parseFloat(item.total);
            }
          });

          this.total = total;
        }
      });
    },
    verDetalle (id) {
      this.$service.graphql({
        query: `
          query ($pago: Int) {
            movimientos(id_pago: $pago) {
              count
              rows {
                id
                fecha_llegada
                hora_llegada
                fecha_salida
                hora_salida
                llave
                estado
                vehiculo_placa
              }
            }
          }
        `,
        variables: {
          pago: id
        }
      }).then(response => {
        if (response) {
          this.movimiento = response.movimientos.rows[0];
          this.$store.commit('openModal');
        }
      });
    }
  },
  watch: {
    date (val) {
      this.dateFormatted = this.formatDate(this.date);
    },
    date2 (val) {
      this.dateFormatted2 = this.formatDate(this.date2);
    },
    fecha (val) {
      if (val) {
        this.seleccionarDia(this.$datetime.transform(val));
      }
    }
  },
  components: {
    CrudTable,
    Pendientes
  }
};
</script>

<style lang="scss">
.movimiento-detalle {
  p {
    margin-bottom: 5px;
  }
}
</style>
