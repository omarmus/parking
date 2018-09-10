module.exports = `

  # Contratos del sistema
  type Contrato {
    # ID del Contrato
    id: ID!
    # fecha_inicio
    fecha_inicio: Date
    # fecha_fin
    fecha_fin: Date
    # estado
    estado: EstadoContrato
    # id_vehiculo
    id_vehiculo: Int
    # tipo
    vehiculo_tipo: String
    # placa
    vehiculo_placa: String
    # marca
    vehiculo_marca: String
    # modelo
    vehiculo_modelo: String
    # gestion
    vehiculo_gestion: Int
    # estado
    vehiculo_estado: EstadoVehiculo
    # id_persona
    vehiculo_id_persona: Int
  }

  # Tipos de estado del Contrato
  enum EstadoContrato {
    # Contrato ACTIVO
    ACTIVO
    # Contrato INACTIVO
    INACTIVO
  }

  # Objeto para crear un Contrato
  input NewContrato {
    fecha_inicio: Date!
    fecha_fin: Date!
    id_vehiculo: Int
    placa: String
  }

  # Objeto para editar un Contrato
  input EditContrato {
    fecha_inicio: Date
    fecha_fin: Date
    id_vehiculo: Int
    placa: String
    estado: EstadoContrato
  }

  # Objeto de paginación para Contrato
  type Contratos {
    count: Int
    rows: [Contrato]
  }
`;
