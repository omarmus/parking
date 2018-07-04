<template>
  <section>
    <h3 class="primary--text"><v-icon color="primary">attach_money</v-icon> Pagos realizados</h3>
    <v-card>
      <v-card-text>
        <crud-table
          :headers="headers"
          :url="url"
          :filters="filters"
          :show-filter="true"
          :graphql="graphql"
        >
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
            <td class="nowrap">
              <v-tooltip bottom v-if="$store.state.permissions['pagos:update']">
                <v-btn
                  slot="activator"
                  @click.native="verDetalle(items.item.id)">
                  <v-icon>list</v-icon> Ver detalles
                </v-btn>
                <span>Ver detalles</span>
              </v-tooltip>
            </td>
            <td>
              <v-chip label color="success" text-color="white" v-if="items.item.estado == 'PAGADO'">
                {{ items.item.estado }}
              </v-chip>
              <v-chip label color="warning" text-color="white" v-if="items.item.estado == 'INACTIVO'">
                {{ items.item.estado }}
              </v-chip>
            </td>
            <td>{{ (items.item.nit) }}</td>
            <td>{{ items.item.razon_social }}</td>
            <td>{{ $datetime.format(items.item.fecha, 'dd/MM/YYYY hrs. HH:mm') }}</td>
            <td class="text-xs-right">Bs. {{ items.item.total }}</td>
            <td>{{ items.item.gestion }}</td>
          </template>
        </crud-table>
      </v-card-text>
    </v-card>
  </section>
</template>
<script>

import CrudTable from '@/common/util/crud-table/CrudTable.vue';
import crud from '@/common/util/crud-table/mixins/crud-table';
import tarifa from '@/components/parking/tarifa/mixins/tarifa';

export default {
  mixins: [ crud, tarifa ],
  created () {
    this.filters[3].items = this.getGestionesFilter();
  },
  data () {
    return {
      movimiento: null,
      graphql: true, // Definiendo el CRUD con Graphql
      url: 'pagos',
      gestiones: [],
      headers: [
        { text: 'Detalles', sortable: false },
        { text: 'Estado', value: 'estado' },
        { text: 'NIT', value: 'nit' },
        { text: 'Razón social', value: 'razon_social' },
        { text: 'Fecha', value: 'fecha' },
        { text: 'Total', value: 'total' },
        { text: 'Gestión', value: 'gestion' }
      ],
      filters: [
        {
          field: 'estado',
          type: 'hidden',
          typeG: 'EstadoPago',
          value: 'PAGADO'
        },
        {
          field: 'nit',
          label: 'NIT',
          type: 'text',
          typeG: 'String'
        },
        {
          field: 'razon_social',
          label: 'Razón social',
          type: 'text',
          typeG: 'String'
        },
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
  components: {
    CrudTable
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
