'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id: util.pk,
    tipo: {
      type: DataTypes.ENUM,
      values: ['ENTRADA', 'SALIDA'],
      defaultValue: 'ENTRADA',
      allowNull: false,
      xlabel: lang.t('fields.tipo')
    },
    fecha_llegada: {
      type: DataTypes.DATE,
      allowNull: false,
      xlabel: lang.t('fields.fecha_llegada')
    },
    hora_llegada: {
      type: DataTypes.STRING(10),
      allowNull: false,
      xlabel: lang.t('fields.hora_llegada')
    },
    fecha_salida: {
      type: DataTypes.DATE,
      xlabel: lang.t('fields.fecha_salida')
    },
    hora_salida: {
      type: DataTypes.STRING(10),
      xlabel: lang.t('fields.hora_salida')
    },
    llave: {
      type: DataTypes.BOOLEAN,
      xlabel: lang.t('fields.llave')
    },
    estado: {
      type: DataTypes.ENUM,
      values: ['ACTIVO', 'INACTIVO'],
      defaultValue: 'ACTIVO',
      allowNull: false,
      xlabel: lang.t('fields.estado')
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  let Movimientos = sequelize.define('movimientos', fields, {
    timestamps: false,
    tableName: 'par_movimientos'
  });

  return Movimientos;
};
