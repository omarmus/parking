module.exports = {
  Query: `
    # Lista de pagos
    pagos(
      # Límite de la consulta para la paginación
      limit: Int
      # Nro. de página para la paginación
      page: Int
      # Campo a ordenar, "-campo" ordena descendentemente
      order: String
      # Buscar por nit
      nit: String
      # Buscar por razon_social
      razon_social: String
      # Buscar por nro_factura
      nro_factura: String
      # Buscar por nro_autorizacion
      nro_autorizacion: String
      # Buscar por fecha
      fecha: Date
      # Buscar por total
      total: Float
      # Buscar por estado
      estado: EstadoPago
      # gestion
      gestion: Int
      # Buscar por id_persona
      id_persona: Int
      # Buscar por id_usuario
      id_usuario: Int
    ): Pagos
    # Obtener un pago
    pago(id: Int!): Pago
    # Obtener un nit
    nit(nit: String!): Pago
  `,
  Mutation: `
    # Agregar pago
    pagoAdd(pago: NewPago!): Pago
    # Editar pago
    pagoEdit(id: Int!, pago: EditPago!): Pago
    # Eliminar pago
    pagoDelete(id: Int!): Delete
  `
};
