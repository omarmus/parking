module.exports = `

  # Vehiculos del sistema
  type Vehiculo {
    # ID del Vehiculo
    id: ID!
    # tipo
    tipo: String
    # placa
    placa: String
    # marca
    marca: String
    # modelo
    modelo: String
    # gestion
    gestion: Int
    # estado
    estado: EstadoVehiculo
    # id_persona
    id_persona: Int
  }

  # Tipos de estado del Vehiculo
  enum EstadoVehiculo {
    # Vehiculo activo
    ACTIVO
    # Vehiculo inactivo
    INACTIVO
  }

  # Objeto para crear un Vehiculo
  input NewVehiculo {
    tipo: String
    placa: String
    marca: String
    modelo: String
    gestion: Int
  }

  # Objeto para editar un Vehiculo
  input EditVehiculo {
    tipo: String
    placa: String
    marca: String
    modelo: String
    gestion: Int
    estado: EstadoVehiculo
  }

  # Objeto de paginación para Vehiculo
  type Vehiculos {
    count: Int
    rows: [Vehiculo]
  }
`;
