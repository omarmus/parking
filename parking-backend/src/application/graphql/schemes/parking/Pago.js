module.exports = `

  # Pagos del sistema
  type Pago {
    # ID del Pago
    id: ID!
    # nit
    nit: String
    # razon_social
    razon_social: String
    # nro_factura
    nro_factura: String
    # nro_autorizacion
    nro_autorizacion: String
    # fecha
    fecha: Date
    # total
    total: Float
    # gestión
    gestion: Int
    # estado
    estado: EstadoPago
    # id_persona
    id_persona: Int
    # id_usuario
    id_usuario: Int
  }

  # Tipos de estado del Pago
  enum EstadoPago {
    # Pago CREADO
    CREADO
    # Pago POR_PAGAR
    POR_PAGAR
    # Pago PAGADO
    PAGADO
  }

  # Objeto para crear un Pago
  input NewPago {
    nit: String
    razon_social: String
    nro_factura: String
    nro_autorizacion: String
    fecha: Date
    total: Float
    id_movimiento: Int
  }

  # Objeto para editar un Pago
  input EditPago {
    nit: String
    razon_social: String
    nro_factura: String
    nro_autorizacion: String
    fecha: Date
    total: Float
    estado: EstadoPago
    id_movimiento: Int
  }

  # Objeto de paginación para Pago
  type Pagos {
    count: Int
    rows: [Pago]
  }
`;
