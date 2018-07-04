'use strict';

// Definiendo asociaciones de las tablas
module.exports = function associations (models) {
  const {
    roles,
    usuarios,
    entidades,
    modulos,
    permisos,
    personas,
    vehiculos,
    movimientos,
    pagos
  } = models;

  // MODULO USUARIOS
  // Asociaciones tabla usuarios
  usuarios.belongsTo(entidades, { foreignKey: { name: 'id_entidad', allowNull: false }, as: 'entidad' });
  entidades.hasMany(usuarios, { foreignKey: { name: 'id_entidad', allowNull: false }, as: 'entidad' });

  usuarios.belongsTo(roles, { foreignKey: { name: 'id_rol', allowNull: false }, as: 'rol' });
  roles.hasMany(usuarios, { foreignKey: { name: 'id_rol', allowNull: false }, as: 'rol' });

  usuarios.belongsTo(personas, { foreignKey: { name: 'id_persona', allowNull: false }, as: 'persona' });
  personas.hasMany(usuarios, { foreignKey: { name: 'id_persona', allowNull: false }, as: 'persona' });

  // Asociaciones tablas permisos - roles
  permisos.belongsTo(roles, { foreignKey: { name: 'id_rol', allowNull: false }, as: 'rol' });
  roles.hasMany(permisos, { foreignKey: { name: 'id_rol', allowNull: false } });

  // Asociaciones tablas permisos - modulos
  permisos.belongsTo(modulos, { foreignKey: { name: 'id_modulo', allowNull: false }, as: 'modulo' });
  modulos.hasMany(permisos, { foreignKey: { name: 'id_modulo', allowNull: false } });

  // Asociaciones tablas modulos - sección
  modulos.belongsTo(modulos, { foreignKey: 'id_modulo' });
  modulos.hasMany(modulos, { foreignKey: 'id_modulo' });
  modulos.belongsTo(modulos, { foreignKey: 'id_seccion' });
  modulos.hasMany(modulos, { foreignKey: 'id_seccion' });

  // MODULO PARKING
  // Asociaciones tabla movimientos
  movimientos.belongsTo(vehiculos, { foreignKey: { name: 'id_vehiculo', allowNull: false }, as: 'vehiculo' });
  vehiculos.hasMany(movimientos, { foreignKey: { name: 'id_vehiculo', allowNull: false }, as: 'vehiculo' });

  movimientos.belongsTo(pagos, { foreignKey: { name: 'id_pago' }, as: 'pago' });
  pagos.hasMany(movimientos, { foreignKey: { name: 'id_pago' }, as: 'pago' });

  movimientos.belongsTo(usuarios, { foreignKey: { name: 'id_usuario_llegada', allowNull: false }, as: 'usuario_llegada' });
  usuarios.hasMany(movimientos, { foreignKey: { name: 'id_usuario_llegada', allowNull: false } });

  movimientos.belongsTo(usuarios, { foreignKey: { name: 'id_usuario_salida' }, as: 'usuario_salida' });
  usuarios.hasMany(movimientos, { foreignKey: { name: 'id_usuario_salida' } });

  // Asociaciones tabla vehículos
  vehiculos.belongsTo(personas, { foreignKey: { name: 'id_persona' }, as: 'persona' });
  personas.hasMany(vehiculos, { foreignKey: { name: 'id_persona' } });

  // Asociaciones tabla pagos
  pagos.belongsTo(personas, { foreignKey: { name: 'id_persona' }, as: 'persona' });
  personas.hasMany(pagos, { foreignKey: { name: 'id_persona' } });

  pagos.belongsTo(personas, { foreignKey: { name: 'id_usuario', allowNull: false }, as: 'usuario' });
  personas.hasMany(pagos, { foreignKey: { name: 'id_usuario', allowNull: false } });

  return models;
};
