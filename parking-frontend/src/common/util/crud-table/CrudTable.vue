<template>
    <div class="crud-table">
      <v-layout row wrap>
        <v-flex xs8 class="btn-container">
          <!-- Section buttons -->
          <slot name="buttons"></slot>
          <div class="btn-filter" :class="{ 'active': showFilterActive }">
            <v-tooltip bottom>
               <v-btn
                 v-if="filters.length"
                 @click.native="filtrar()"
                 class="btn-refresh"
                 :id="idFilter"
                 slot="activator"><v-icon>filter_list</v-icon>
               </v-btn>
               <span>{{$t('common.filters')}}</span>
             </v-tooltip>
          </div>
          <v-tooltip bottom>
            <v-btn
              @click.native="getData()"
              class="btn-refresh"
              :id="idRefresh"
              slot="activator"><v-icon>refresh</v-icon>
            </v-btn>
             <span>{{$t('common.updateList')}}</span>
           </v-tooltip>
          <!-- END Section buttons -->

          <!-- Modal Add/Edit -->
          <v-dialog v-model="modal" persistent :max-width="widthModal">
            <v-card class="crud-dialog">
              <slot name="form">Agregue su formulario aquí</slot>
            </v-card>
          </v-dialog>
          <!-- END Modal Add/Edit -->
        </v-flex>

        <!-- Section label -->
        <v-flex xs4>
          <slot name="labels"></slot>
        </v-flex>
        <!-- END Section label -->

        <!-- Section details -->
        <v-flex xs12>
          <slot name="details"></slot>
        </v-flex>
        <!-- END Section details -->

        <!-- Section Filter -->
        <v-flex xs12 v-if="filter">
          <slot name="filters" :search="search">
            <v-text-field
              append-icon="search"
              label="Buscar"
              single-line
              hide-details
              v-model="search"
              ></v-text-field>
          </slot>
        </v-flex>
        <v-flex xs12 v-if="filters.length">
          <transition name="slide-fade">
            <div class="filter-container" v-show="showFilterActive">
              <v-icon color="primary">search</v-icon>
              <div
                v-for="filter in filters"
                class="filter-item"
                v-show="filter.type != 'hidden'">
                <v-text-field
                  v-if="filter.type == 'text'"
                  v-model="search[filter.field]"
                  :label="filter.label"
                  hide-details
                  ></v-text-field>
                <v-select
                  v-if="filter.type == 'select'"
                  :items="filter.items"
                  v-model="search[filter.field]"
                  :label="filter.label"
                  item-text="text"
                  item-value="value"
                  hide-details
                  autocomplete
                  ></v-select>
                <v-switch
                  v-if="filter.type == 'boolean'"
                  v-model="items.item.visible"
                  :value="true"
                  @change="changeVisible(items.item, items.item.id, 'modulo', 'EditModulo')"
                  slot="activator"
                  color="info"></v-switch>
                <input
                  v-if="filter.type == 'hidden'"
                  v-model="search[filter.field]"
                  type="hidden">
              </div>
              <v-tooltip bottom>
                <v-btn icon @click.native="filtrar()" slot="activator">
                  <v-icon>close</v-icon>
                </v-btn>
                <span>Cerrar filtro/búsqueda</span>
              </v-tooltip>
            </div>
          </transition>
        </v-flex>
        <!-- END Section Filter -->
      </v-layout>
      <div>
        <v-data-table
          :headers="getHeaders"
          :items="items"
          :pagination.sync="pagination"
          :total-items="totalItems"
          :loading="loading"
          :rowsPerPageText="$t('common.rowsPage')"
          noResultsText="No se encontraron registros que coincidan"
          noDataText="No hay resultados"
          :rowsPerPageItems="rowsPerPageItems"
          >
          <template slot="items" slot-scope="props">
            <tr>
              <slot name="items" :item="props.item">
                Defina la lista de registros aquí
              </slot>
            </tr>
          </template>
          <template slot="pageText" slot-scope="{ pageStart, pageStop }">
            {{ pageStart }}-{{ pageStop }} {{$t('common.of') }} {{ totalItems }}
          </template>
        </v-data-table>
      </div>
    </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  props: {
    headers: {
      type: Array,
      default: () => []
    },
    url: {
      type: String,
      default: this.$apiUrl
    },
    filter: {
      type: Boolean,
      default: false
    },
    idRefresh: {
      type: String,
      default: 'btn-refresh-list'
    },
    idFilter: {
      type: String,
      default: 'btn-filter'
    },
    filters: {
      type: Array,
      default: () => []
    },
    order: {
      type: Array,
      default: () => []
    },
    widthModal: {
      type: Number,
      default: 480
    },
    graphql: {
      type: Boolean,
      default: false
    },
    dataGraphql: {
      type: String,
      default: ''
    },
    showFilter: {
      type: Boolean,
      default: false
    },
    successList: {
      type: Function,
      default: null
    }
  },
  data () {
    return {
      search: {},
      totalItems: 0,
      items: [],
      loading: true,
      pagination: {
        rowsPerPage: 10
      },
      load: false,
      // rowsPerPageItems: [5, 10, 25, { text: 'Todos', value: -1 }]
      rowsPerPageItems: [5, 10, 25],
      showFilterActive: this.showFilter
    };
  },
  created () {
    if (this.$util.toType(this.order) === 'array' && this.order.length) {
      this.pagination.sortBy = this.order[0];
      if (this.order[1]) {
        this.pagination.descending = this.order[1] === 'DESC';
      }
    }
  },
  mounted () {
    this.getData();

    this.$bus.$on('updateList', () => {
      this.getData();
    });

    // this.setFilterValues();
  },
  computed: {
    ...mapState(['modal']),

    getHeaders () {
      let items = [];
      this.headers.map(el => {
        el.align = 'left';
        items.push(el);
      });
      return items;
    }
  },
  methods: {
    getValues () {
      if (this.dataGraphql.length) {
        return this.dataGraphql || 'id';
      } else {
        let values = [];
        this.headers.map(el => {
          if (el.value) {
            values.push(el.value);
          }
        });
        return values.join('\n');
      }
    },
    getFilterTypes () {
      let values = [];
      this.filters.map(el => {
        if (el.typeG) {
          if (el.type !== 'hidden') {
            values.push(`$${el.field}: ${el.typeG}`);
          }
        }
      });
      return values.join(',\n');
    },
    getFilterParams () {
      let values = [];
      this.filters.map(el => {
        if (el.typeG) {
          if (el.type === 'hidden') {
            if (el.typeG === 'String') {
              values.push(`${el.field}: "${el.value}"`);
            } else {
              values.push(`${el.field}: ${el.value}`);
            }
          } else {
            values.push(`${el.field}: $${el.field}`);
          }
        }
      });
      return values.join(',\n');
    },
    setFilterValues () {
      this.filters.map(el => {
        if (el.value && el.value.length) {
          this.search[el.field] = el.value;
        }
      });
    },
    getData () {
      this.loading = true;
      const { sortBy, descending, page, rowsPerPage } = this.pagination;

      let query = {
        limit: rowsPerPage,
        page
      };

      if (sortBy) {
        query.order = (descending ? '-' : '') + sortBy;
      }

      if (Object.keys(this.search).length) {
        for (let key in this.search) {
          if (!this.$filter.empty(this.search[key])) {
            query[key] = this.search[key];
          }
          if (this.search[key] === 'false') {
            query[key] = false;
          }
        }
      }

      if (this.graphql) {
        this.$service.graphql({
          query: `
            query getLista(
              $order: String,
              $limit: Int,
              $page: Int,
              ${this.getFilterTypes()}
            ) {
              ${this.url}(
                limit: $limit,
                order: $order,
                page: $page,
                ${this.getFilterParams()}
              ) {
                count
                rows {
                  id
                  ${this.getValues()}
                }
              }
            }
          `,
          variables: query
        })
        .then(response => {
          if (response) {
            let items = response[this.url].rows;
            items.map(el => {
              if (el.estado !== undefined) {
                el.active = el.estado === 'INACTIVO' ? 'INACTIVE' : 'ACTIVE';
              }
            });

            this.items = items;
            this.totalItems = response[this.url].count;
            this.loading = false;
            this.load = true;

            if (typeof this.successList === 'function') {
              this.successList();
            }
          }
        });
      } else {
        this.$service.list(this.url.list || this.url, query)
        .then(response => {
          if (response) {
            let items = response.datos;
            items.map(el => {
              if (el.estado !== undefined) {
                el.active = el.estado === 'INACTIVO' ? 'INACTIVE' : 'ACTIVE';
              }
            });

            this.items = items;
            this.totalItems = response.totalFiltro || response.total || response.count;
            if (response.totalFiltro !== undefined && response.totalFiltro < response.total && response.totalFiltro < this.pagination.rowsPerPage) {
              this.pagination.page = 1;
            }
            this.loading = false;
            this.load = true;
          }
        });
      }
    },
    filtrar () {
      this.showFilterActive = !this.showFilterActive;

      if (!this.showFilterActive) {
        for (let key in this.search) {
          this.search[key] = '';
        }
      }
    }
  },
  watch: {
    pagination: {
      handler () {
        if (this.load) {
          this.getData();
        }
      },
      deep: true
    },
    search: {
      handler () {
        if (this.load) {
          this.getData();
        }
      },
      deep: true
    }
  }
};
</script>
<style lang="scss">
  @import '../../../assets/scss/_variables.scss';

  $filterBackground: #f5f5f5;
  $filterBorder: #e5e5e5;

  .crud-table {
    .table-actions {
      white-space: nowrap;
      padding: 0 0 0 5px !important;
      text-align: center;
    }

    td {
      .alert {
        padding: 2px 8px;
        text-align: center;
        font-size: 0.9rem;
        font-weight: 600;
        display: inline-block;
      }
    }

    .btn-refresh {
      min-width: 52px;

      .btn__content {
        padding: 0;
      }

    }

    .btn-filter {
      display: inline-block;
      position: relative;

      &.active {
        .btn {
          background-color: $filterBackground !important;
          box-shadow: none;
        }

        &::after, &::before {
          display: block;
        }
      }

      &::before {
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        bottom: -10px;
        left: 14px;
        border-bottom: 12px solid $filterBorder;
        border-left: 14px solid transparent;
        border-right: 14px solid transparent;
        display: none;
      }

      &::after {
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        bottom: -11px;
        left: 14px;
        border-bottom: 12px solid $filterBackground;
        border-left: 14px solid transparent;
        border-right: 14px solid transparent;
        z-index: 1;
        display: none;
      }
    }

    .filter-container {
      background-color: $filterBackground;
      padding: 10px 15px 20px;
      border: 1px solid $filterBorder;
      position: relative;
      // margin-top: 10px;

      .filter-item {
        display: inline-block;
        width: 200px;
        margin-right: 10px;
        vertical-align: top;
      }

      & > .tooltip {
        position: absolute;
        top: -3px;
        right: 0px;
      }

      & > .icon {
        display: inline-block;
        margin: 14px 5px 0 0;
      }
    }
  }
</style>
