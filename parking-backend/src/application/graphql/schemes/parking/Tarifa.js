module.exports = `

  # Tarifas del sistema
  type Tarifa {
    # ID del Tarifa
    id: ID!
    # minutos
    minutos: Int
    # precio
    precio: Float
    # turno
    turno: TurnoTarifa
    # gestion
    gestion: Int
    # estado
    estado: EstadoTarifa
  }

  # Tipos de estado del Tarifa
  enum EstadoTarifa {
    # Tarifa activo
    ACTIVO
    # Tarifa inactivo
    INACTIVO
  }

  # Tipos de tarifa del Tarifa
  enum TurnoTarifa {
    # Tarifa DIURNO
    DIURNO
    # Tarifa NOCTURNO
    NOCTURNO
  }

  # Objeto para crear un Tarifa
  input NewTarifa {
    minutos: Int
    precio: Float
    turno: TurnoTarifa
    gestion: Int
  }

  # Objeto para editar un Tarifa
  input EditTarifa {
    minutos: Int
    precio: Float
    turno: TurnoTarifa
    gestion: Int
    estado: EstadoTarifa
  }

  # Objeto de paginación para Tarifa
  type Tarifas {
    count: Int
    rows: [Tarifa]
  }
`;
