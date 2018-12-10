<template>
  <section>
    <h3 class="primary--text"><v-icon color="primary">home</v-icon> Entrada/Salida de Vehículos</h3>
    <v-card>
      <reloj></reloj>
      <v-form
        ref="form"
        lazy-validation
        v-model="valid"
        @submit.prevent="registrar">
        <v-card-text class="in-out" :class="{ 'success': tipo === 'ENTRADA', 'warning': tipo === 'SALIDA' }">
          <v-container grid-list-xl fluid class="pt-0 pb-0">
            <v-flex xs12>
              <v-radio-group v-model="tipo" row>
                <v-radio
                  color="warning"
                  label="ENTRADA VEHÍCULO"
                  class="white--text"
                  value="ENTRADA"></v-radio>
                <v-radio
                  color="red"
                  label="SALIDA VEHÍCULO"
                  class="white--text"
                  value="SALIDA"></v-radio>
              </v-radio-group>
            </v-flex>
          </v-container>
        </v-card-text>
        <v-card-text>
          <v-container grid-list-xl fluid class="pt-0">
            <v-layout wrap v-if="tipo === 'ENTRADA'">
              <v-flex xs4>
                <v-text-field
                  label="Placa"
                  required
                  :rules="$validate(['required'])"
                  v-model="form.placa"
                  class="uppercase"
                ></v-text-field>
              </v-flex>
              <v-flex xs2 class="checkbox-space">
                <v-checkbox
                  label="Dejó llave"
                  v-model="form.llave"
                ></v-checkbox>
              </v-flex>
              <v-flex xs2>
                <v-btn
                  type="submit"
                  large
                  color="primary">
                  <v-icon>keyboard_arrow_right</v-icon> Registrar
                </v-btn>
              </v-flex>
              <!-- <v-flex xs4>
                <v-switch
                  row
                  color="success"
                  class="autoprint"
                  label="Impresión automática ticket"
                  v-model="autoprint"
                ></v-switch>
              </v-flex> -->
            </v-layout>
            <v-layout wrap v-else>
              <v-flex xs4>
                <v-text-field
                  label="Número de registro"
                  v-model="form.registro"
                  :autofocus="focusR"
                  :rules="$validate(['required'])"
                  required
                  maxlength="10"
                ></v-text-field>
              </v-flex>
              <v-flex xs4>
                <v-btn
                  type="submit"
                  large
                  color="primary">
                  <v-icon>check</v-icon> Terminar
                </v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
      </v-form>
    </v-card>
    <div v-show="false" v-if="printContainer">
      <v-card>
        <v-card-title class="headline">
          <v-icon>print</v-icon> Boletas
          <v-spacer></v-spacer>
          <v-btn @click="printContainer = false"><v-icon>close</v-icon> Cerrar</v-btn>
          <v-btn @click="print" color="primary" v-if="!contrato"><v-icon color="white">print</v-icon> Imprimir</v-btn>
        </v-card-title>
        <v-card-text class="pt-0">
          <div id="boleta" v-if="barcode">
            <div class="boleta elevation-1">
              <table class="table-barcode">
                <tr>
                  <td>
                    <div class="boleta-barcode">
                      <barcode :value="barcode">
                        No se pudo generar el código de barras.
                      </barcode>
                    </div>
                  </td>
                  <td>
                    <div class="boleta-detalle">
                      <p><strong>Fecha:</strong> {{ $datetime.format(data.fecha_llegada) }} <strong>Hora:</strong> {{ data.hora_llegada }}</p>
                      <p><strong>Dejó llave:</strong> {{ data.llave ? 'SI' : 'NO' }}</p>
                      <p><strong>PLACA:</strong> {{ data.vehiculo_placa }}</p>
                    </div>
                  </td>
                </tr>
              </table>
            </div>
            <!-- <hr class="barcode-line">
            <div class="boleta elevation-1">
              <h3>COPIA</h3>
              <div class="boleta-barcode">
                <barcode :value="barcode">
                  No se pudo generar el código de barras.
                </barcode>
              </div>
              <p><strong>Fecha:</strong> {{ $datetime.format(data.fecha_llegada) }} <strong>Hora:</strong> {{ data.hora_llegada }}</p>
              <p><strong>Dejó llave:</strong> {{ data.llave ? 'SI' : 'NO' }}</p>
              <p><strong>PLACA:</strong> {{ data.vehiculo_placa }}</p>
            </div> -->
          </div>
          <div v-else>
            <div v-if="contrato" class="boleta contrato">
              <v-alert value="true" color="info" icon="info" outline class="mb-3">
                <h4 class="m-0">El automóvil tiene un contrato vigente</h4>
              </v-alert>
              <p><strong>Fecha:</strong> {{ $datetime.format(data.fecha_llegada) }} <strong>Hora:</strong> {{ data.hora_llegada }}</p>
              <p><strong>Dejó llave:</strong> {{ data.llave ? 'SI' : 'NO' }}</p>
              <p><strong>PLACA:</strong> {{ data.vehiculo_placa }}</p>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>
    <v-form
      ref="formS"
      v-model="validS"
      @submit.prevent="buscarVehiculo"
      lazy-loading>
      <v-card class="mt-5">
        <v-card-title class="info">
          <v-icon dark>search</v-icon> <span class="white--text">Pagar manualmente</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-layout wrap>
            <v-flex xs4>
              <v-select
                :loading="loading"
                :items="items"
                :rules="$validate(['required'])"
                :search-input.sync="search"
                v-model="formS.placa"
                label="Placa"
                autocomplete
                cache-items
                placeholder="Ingrese la placa a buscar"
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
                    @input="remove3(data.item)"
                  >
                    <strong>{{ data.item }}</strong>
                  </v-chip>
                </template>
              </v-select>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs3>
              <v-btn
                v-show="false"
                large
                type="submit"
                color="primary">
                <v-icon>search</v-icon> Buscar Vehículo
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
      <pendientes
        v-if="showPendientes"
        :placa="formS.placa"
        :callback="registrarSalida">
      </pendientes>
    </v-form>
    <v-dialog v-model="dialog2" max-width="480" persistent>
      <v-card>
        <v-card-title class="headline">
          <v-icon>attach_money</v-icon> Pagar
          <v-spacer></v-spacer>
          <v-chip label color="info" text-color="white">PLACA: <strong>{{ form2.placa }}</strong></v-chip>
        </v-card-title>
        <v-form
          ref="form2"
          lazy-validation
          @submit.prevent="pagar"
          v-model="valid2">
          <v-card-text class="pt-0">
            <h3 class="text-xs-center" v-if="form2.id">Ticket: <strong>{{ $util.pad(form2.id, 10) }}</strong></h3>
            <h2 class="text-xs-center"><strong>TOTAL:</strong> Bs. {{ form2.total }} </h2>
            <!-- <v-select
              :loading="loading2"
              :items="items2"
              :rules="$validate(['required'])"
              :search-input.sync="search2"
              v-model="form2.nit"
              label="NIT"
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
                  @input="e2(data.item)"
                >
                  <strong>{{ data.item }}</strong>
                </v-chip>
              </template>
            </v-select>
            <v-text-field
              class="uppercase"
              label="Razón social"
              v-model="form2.razon_social"
            ></v-text-field> -->
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn type="button" @click="dialog2 = false"><v-icon>cancel</v-icon> Cancelar</v-btn>
            <v-btn type="submit" color="primary"><v-icon>attach_money</v-icon> Pagar</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
import VueBarcode from 'vue-barcode';
import Reloj from '@/components/parking/movimiento/Reloj';
import Pendientes from '@/components/parking/pago/Pendientes';
import validate from '@/common/mixins/validate';

const css = `
@media print {
  .boleta {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 12px;
    padding: 0;
    width: 100%;
    max-width: 350px;
    margin: 0 auto 10px;
  }
  .boleta.contrato {
    max-width: 100%;
    padding: 5px;
  }
  .boleta .boleta-barcode {
    text-align: center;
    margin-left: -10px;
    margin-top: -15px;
    margin-bottom: -25px;
  }
  .boleta .vue-barcode-element {
    width: 150px;
  }
  .boleta h3 {
    font-size: 1rem;
    margin: 0;
    text-align: center;
    line-height: 1rem;
  }
  .boleta p {
    margin: 0;
    line-height: 15px;
  }

  .barcode-line {
    border: none;
    border-top: 1px solid #ccc;
    margin-bottom: 10px;
  }

  .table-barcode {
    border: none;
    border-collapse: collapse;
  }
  .table-barcode td {
    border: none;
    padding: 0;
    vertical-align: top;
  }

  .boleta-detalle {
    margin: 12px 0 0 0;
  }
}
`;

export default {
  mixins: [ validate ],
  data () {
    return {
      showPendientes: false,
      validS: true,
      hover: false,
      printContainer: false,
      dialog2: false,
      barcode: null,
      tipo: 'ENTRADA',
      form: {
        registro: '',
        placa: null,
        llave: false
      },
      form2: {
        nit: null,
        razon_social: '',
        id_pago: null,
        total: 0
      },
      formS: {
        placa: null
      },
      focusP: false,
      focusR: false,
      loading: false,
      loading2: false,
      items: [],
      items2: [],
      search: null,
      search2: null,
      valid: false,
      valid2: false,
      validB: false,
      data: null,
      pressed: false,
      chars: [],
      contrato: false,
      autoprint: true,
      placas: []
    };
  },
  mounted () {
    window.addEventListener('keypress', e => {
      if (e.which >= 48 && e.which <= 57) {
        this.chars.push(String.fromCharCode(e.which));
      }
      console.log(e.which + ':' + this.chars.join('|'));
      if (this.pressed === false) {
        setTimeout(() => {
          if (this.chars.length >= 8) {
            this.tipo = 'SALIDA';
            var barcode = this.chars.join('');
            console.log('Barcode Scanned: ' + barcode);
            this.form.registro = barcode;
            setTimeout(() => {
              this.registrar();
            }, 250);
          }
          this.chars = [];
          this.pressed = false;
        }, 250);
      }
      this.pressed = true;
    }, false);
  },
  destroy () {
    window.addEventListener('keypress', null, false);
  },
  methods: {
    buscarVehiculo () {
      this.$service.graphql({
        query: `
          query busqueda {
            movimientos(placa: "${this.formS.placa}", pendientes: true) {
              count
              rows {
                id
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
    getNits (nit) {
      this.loading2 = true;
      this.$service.graphql({
        query: `
          query ($nit: String) {
            pagos (nit: $nit, limit: 10) {
              count
              rows {
                id
                nit
                razon_social
              }
            }
          }
        `,
        variables: {
          nit: nit.toUpperCase()
        }
      }).then(response => {
        if (response && response.pagos) {
          console.log(response.pagos);
          let items = [];
          response.pagos.rows.map(item => {
            items.push({
              value: item.nit,
              text: item.nit,
              title: item.razon_social
            });
          });
          this.items2 = items;
          this.loading2 = false;
        }
      });
    },
    remove (item) {
      this.form.placa = null;
    },
    remove2 (item) {
      this.form2.nit = null;
    },
    remove3 (item) {
      this.formS.placa = null;
    },
    registrar () {
      console.log('Enviando!');
      if (this.$refs && this.$refs.form && this.$refs.form.validate()) {
        if (this.tipo === 'ENTRADA') { // Registrando ENTRADA
          if (this.$filter.empty(this.form.placa)) {
            return false;
          }
          let data = Object.assign({}, this.form);
          delete data.registro;
          if (Array.isArray(data.placa) && data.placa[0]) {
            data.placa = data.placa[0];
          }
          data.placa = data.placa.toUpperCase();
          this.$service.graphql({
            query: `
              mutation add($movimiento: NewMovimiento!) {
                movimientoAdd(movimiento: $movimiento) {
                  id
                  nuevo
                  fecha_llegada
                  hora_llegada
                  llave
                  vehiculo_placa
                  contrato
                }
              }
            `,
            variables: {
              movimiento: data
            }
          }).then(response => {
            if (response && response.movimientoAdd) {
              let movimiento = response.movimientoAdd;
              this.form = {
                registro: '',
                placa: null,
                llave: false
              };
              this.barcode = null;
              this.contrato = movimiento.contrato;
              if (!movimiento.contrato) {
                this.$nextTick(() => {
                  this.barcode = this.$util.pad(movimiento.id, 10);
                });
              }
              this.data = movimiento;

              this.printContainer = false;
              this.$nextTick(() => {
                this.printContainer = true;
                setTimeout(() => {
                  this.print();
                }, 100);
              });
              this.$message.success();
            }
          });
        } else { // SALIDA
          if (this.$filter.empty(this.form.registro)) {
            return false;
          }
          this.registrarSalida();
        }
      }
    },
    registrarSalida (id) {
      console.log('Enviando salida');
      this.$service.graphql({
        query: `
          mutation edit($id: Int!, $movimiento: EditMovimiento!) {
            movimientoEdit(id: $id, movimiento: $movimiento) {
              id
              estado
              total
              id_pago
              vehiculo_placa
            }
          }
        `,
        variables: {
          id: parseInt(id || this.form.registro),
          movimiento: {}
        }
      }).then(response => {
        if (response) {
          this.form.registro = '';
          let movimiento = response.movimientoEdit;
          if ((movimiento.estado === 'SALIDA' || movimiento.estado === 'POR_PAGAR') && movimiento.id_pago) {
            this.dialog2 = true;
            this.form2 = {
              id: movimiento.id,
              id_pago: movimiento.id_pago,
              total: movimiento.total,
              placa: movimiento.vehiculo_placa,
              id_movimiento: movimiento.id
            };
            this.formS.placa = null;
            this.$message.success();
          } else {
            this.$message.warning('Ya se realizó el registro anteriormente.');
          }
        }
      });
    },
    print () {
      let html = document.getElementById('boleta').innerHTML;
      this.$util.print(html, css);
    },
    pagar () {
      if (this.$refs.form2.validate()) {
        this.$service.graphql({
          query: `
            mutation edit($id: Int!, $pago: EditPago!) {
              pagoEdit(id: $id, pago: $pago) {
                id
              }
            }
          `,
          variables: {
            id: this.form2.id_pago,
            pago: {
              id_movimiento: this.form2.id_movimiento,
              nit: this.form2.nit,
              razon_social: (this.form2.razon_social || '').toUpperCase()
            }
          }
        }).then(response => {
          if (response) {
            this.$message.success('Se realizó el pago correspondiente');
            this.dialog2 = false;
          }
        });
      }
    }
  },
  watch: {
    tipo: function (val) {
      if (val === 'ENTRADA') {
        this.focusP = true;
        this.focusR = false;
      }
      if (val === 'SALIDA') {
        this.focusP = false;
        this.focusR = true;
      }
    },
    search (val) {
      val && this.getPlacas(val);
    },
    search2 (val) {
      val && this.getNits(val);
    },
    'form2.nit' (val) {
      console.log('select NIT', val);
      for (let i in this.items2) {
        if (val === this.items2[i].value) {
          this.form2.razon_social = this.items2[i].title;
          break;
        }
      }
    },
    'formS.placa' (val) {
      this.showPendientes = false;
      this.$nextTick(() => {
        if (val) {
          this.showPendientes = true;
        }
      });
    }
  },
  components: {
    barcode: VueBarcode,
    Reloj,
    Pendientes
  }
};
</script>

<style lang="scss" src="./movimiento.scss"></style>
