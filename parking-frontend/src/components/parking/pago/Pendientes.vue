<template>
  <v-card flat>
    <v-card-text>
      <crud-table
        v-if="fecha"
        :url="url"
        :headers="headers"
        :graphql="graphql"
        :filters="filters"
        :id-refresh="idCrud"
        :data-graphql="dataGraphql"
      >
        <template slot="items" slot-scope="items">
          <td class="text-xs-right">{{ $util.pad(items.item.id, 10) }}</td>
          <td>{{ items.item.vehiculo_placa }}</td>
          <td>{{ $datetime.format(items.item.fecha_llegada) }}</td>
          <td>{{ items.item.hora_llegada }}</td>
          <td>
            <v-icon v-if="items.item.llave" color="success">check</v-icon>
            <v-icon v-if="!items.item.llave" color="error">close</v-icon>
          </td>
          <td>
            <v-chip label small color="success" text-color="white" v-if="items.item.estado == 'INGRESO'">
              {{ items.item.estado }}
            </v-chip>
            <v-chip label small color="warning" text-color="white" v-if="items.item.estado == 'POR_PAGAR'">
              {{ items.item.estado }}
            </v-chip>
          </td>
        </template>
      </crud-table>
    </v-card-text>
  </v-card>
</template>

<script>
import CrudTable from '@/common/util/crud-table/CrudTable.vue';
import crud from '@/common/util/crud-table/mixins/crud-table';

export default {
  props: {
    fecha: {
      type: String,
      default: null
    }
  },
  mounted () {
    if (this.fecha) {
      this.filters[1].value = this.fecha;
    }
  },
  mixins: [ crud ],
  data () {
    return {
      idCrud: 'btn-refresh-pendientes',
      graphql: true,
      url: 'movimientos',
      dataGraphql: `
        vehiculo_placa
        fecha_llegada
        hora_llegada
        llave
        estado
      `,
      headers: [
        { text: 'Nro. Ticket', value: 'id' },
        { text: 'Placa', value: 'id_vehiculo' },
        { text: 'Fecha de llegada', value: 'fecha_llegada' },
        { text: 'Hora llegada', value: 'hora_llegada' },
        { text: 'Llave', value: 'llave' },
        { text: 'Estado', value: 'estado' }
      ],
      filters: [
        {
          field: 'pendientes',
          type: 'hidden',
          typeG: 'Boolean',
          value: true
        },
        {
          field: 'fecha_llegada',
          type: 'hidden',
          typeG: 'String'
        }
      ]
    };
  },
  watch: {
    fecha () {
      this.filters[1].value = this.fecha;
      this.updateList('btn-refresh-pendientes');
    }
  },
  components: {
    CrudTable
  }
};
</script>
