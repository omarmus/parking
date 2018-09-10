module.exports = {
  Query: `
    # Lista de contratos
    contratos(
      # Límite de la consulta para la paginación
      limit: Int
      # Nro. de página para la paginación
      page: Int
      # Campo a ordenar, "-campo" ordena descendentemente
      order: String
      # Buscar por fecha_inicio
      fecha_inicio: Date
      # Buscar por fecha_fin
      fecha_fin: Date
      # Buscar por estado
      estado: EstadoContrato
      # Buscar por id_vehiculo
      id_vehiculo: Int
    ): Contratos
    # Obtener un contrato
    contrato(id: Int!): Contrato
  `,
  Mutation: `
    # Agregar contrato
    contratoAdd(contrato: NewContrato!): Contrato
    # Editar contrato
    contratoEdit(id: Int!, contrato: EditContrato!): Contrato
    # Eliminar contrato
    contratoDelete(id: Int!): Delete
  `
};
