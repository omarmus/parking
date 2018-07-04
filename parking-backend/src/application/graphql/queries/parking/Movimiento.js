module.exports = {
  Query: `
    # Lista de movimientos
    movimientos(
      # Límite de la consulta para la paginación
      limit: Int
      # Nro. de página para la paginación
      page: Int
      # Campo a ordenar, "-campo" ordena descendentemente
      order: String
      # Buscar por fecha_llegada
      fecha_llegada: Date
      # Buscar por hora_llegada
      hora_llegada: String
      # Buscar por fecha_salida
      fecha_salida: Date
      # Buscar por hora_salida
      hora_salida: String
      # Buscar por estado
      estado: EstadoMovimiento
      # Buscar por id_vehiculo
      id_vehiculo: Int
      # Buscar por id_pago
      id_pago: Int
      # Buscar por id_usuario_llegada
      id_usuario_llegada: Int
      # Buscar por id_usuario_salida
      id_usuario_salida: Int
    ): Movimientos
    # Obtener un movimiento
    movimiento(id: Int!): Movimiento
  `,
  Mutation: `
    # Agregar movimiento
    movimientoAdd(movimiento: NewMovimiento!): Movimiento
    # Editar movimiento
    movimientoEdit(id: Int!, movimiento: EditMovimiento!): Movimiento
    # Eliminar movimiento
    movimientoDelete(id: Int!): Delete
  `
};
