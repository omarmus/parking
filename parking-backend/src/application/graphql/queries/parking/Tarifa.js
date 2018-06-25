module.exports = {
  Query: `
    # Lista de tarifas
    tarifas(
      # Límite de la consulta para la paginación
      limit: Int
      # Nro. de página para la paginación
      page: Int
      # Campo a ordenar, "-campo" ordena descendentemente
      order: String
      # Buscar por minutos
      minutos: Int
      # Buscar por precio
      precio: Float
      # Buscar por turno
      turno: TurnoTarifa
      # Buscar por gestion
      gestion: Int
      # Buscar por estado
      estado: EstadoTarifa
    ): Tarifas
    # Obtener un tarifa
    tarifa(id: Int!): Tarifa
  `,
  Mutation: `
    # Agregar tarifa
    tarifaAdd(tarifa: NewTarifa!): Tarifa
    # Editar tarifa
    tarifaEdit(id: Int!, tarifa: EditTarifa!): Tarifa
    # Eliminar tarifa
    tarifaDelete(id: Int!): Delete
  `
};
