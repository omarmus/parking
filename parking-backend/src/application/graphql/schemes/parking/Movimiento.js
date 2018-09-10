module.exports = `

  # Movimientos del sistema
  type Movimiento {
    # ID del Movimiento
    id: ID!
    # fecha_llegada
    fecha_llegada: Date
    # hora_llegada
    hora_llegada: String
    # fecha_salida
    fecha_salida: Date
    # hora_salida
    hora_salida: String
    # llave
    llave: Boolean
    # estado
    estado: EstadoMovimiento
    # id_vehiculo
    id_vehiculo: Int
    # id_pago
    id_pago: Int
    # id_usuario_llegada
    id_usuario_llegada: Int
    # id_usuario_salida
    id_usuario_salida: Int
    # vehiculo placa
    vehiculo_placa: String
    # nuevo registro
    nuevo: Boolean
    # Total pago
    total: Float
    # Tiene contrato
    contrato: Boolean
    # pago_fecha
    pago_fecha: Date
    # pago_total
    pago_total: Float
    # pago_gestion
    pago_gestion: Int
    # pago_estado
    pago_estado: EstadoPago
  }

  # Tipos de estado del Movimiento
  enum EstadoMovimiento {
    INGRESO
    SALIDA
    PAGADO
    FACTURADO
    OBSERVADO
    POR_PAGAR
  }

  # Objeto para crear un Movimiento
  input NewMovimiento {
    fecha_llegada: Date
    hora_llegada: String
    fecha_salida: Date
    hora_salida: String
    llave: Boolean
    placa: String
  }

  # Objeto para editar un Movimiento
  input EditMovimiento {
    fecha_llegada: Date
    hora_llegada: String
    fecha_salida: Date
    hora_salida: String
    llave: Boolean
    estado: EstadoMovimiento
  }

  # Objeto de paginación para Movimiento
  type Movimientos {
    count: Int
    rows: [Movimiento]
  }
`;
