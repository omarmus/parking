module.exports = {
  Query: `
    # Lista de vehiculos
    vehiculos(
      # Límite de la consulta para la paginación
      limit: Int
      # Nro. de página para la paginación
      page: Int
      # Campo a ordenar, "-campo" ordena descendentemente
      order: String
      # Buscar por tipo
      tipo: String
      # Buscar por placa
      placa: String
      # Buscar por marca
      marca: String
      # Buscar por modelo
      modelo: String
      # Buscar por gestion
      gestion: Int
      # Buscar por estado
      estado: EstadoVehiculo
      # Buscar por id_persona
      id_persona: Int
    ): Vehiculos
    # Obtener un vehiculo
    vehiculo(id: Int!): Vehiculo
  `,
  Mutation: `
    # Agregar vehiculo
    vehiculoAdd(vehiculo: NewVehiculo!): Vehiculo
    # Editar vehiculo
    vehiculoEdit(id: Int!, vehiculo: EditVehiculo!): Vehiculo
    # Eliminar vehiculo
    vehiculoDelete(id: Int!): Delete
  `
};
