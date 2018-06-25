module.exports = `

  # Movimientos del sistema
  type Movimiento {
    # ID del Movimiento
    id: ID!
    # tipo
    tipo: TipoMovimiento
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
  }

  # Tipos de estado del Movimiento
  enum EstadoMovimiento {
    # Movimiento ACTIVO
    ACTIVO
    # Movimiento INACTIVO
    INACTIVO
  }

  # Tipos de estado del Movimiento
  enum TipoMovimiento {
    # Movimiento ENTRADA
    ENTRADA
    # Movimiento SALIDA
    SALIDA
  }

  # Objeto para crear un Movimiento
  input NewMovimiento {
    tipo: TipoMovimiento
    fecha_llegada: Date
    hora_llegada: String
    fecha_salida: Date
    hora_salida: String
  }

  # Objeto para editar un Movimiento
  input EditMovimiento {
    tipo: TipoMovimiento
    fecha_llegada: Date
    hora_llegada: String
    fecha_salida: Date
    hora_salida: String
    estado: EstadoMovimiento
  }

  # Objeto de paginación para Movimiento
  type Movimientos {
    count: Int
    rows: [Movimiento]
  }
`;
