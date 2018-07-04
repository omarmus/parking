'use strict';
const { removeDots } = require('../../../lib/util');
const { permissions } = require('../../../lib/auth');

module.exports = function setupResolver (services) {
  const { Movimiento } = services;

  return {
    Query: {
      movimientos: async (_, args, context) => {
        permissions(context, 'movimientos:read');

        let items = await Movimiento.findAll(args, context.id_rol, context.id_movimiento);
        return removeDots(items.data);
      },
      movimiento: async (_, args, context) => {
        permissions(context, 'movimientos:read');

        let item = await Movimiento.findById(args.id);
        return removeDots(item.data);
      }
    },
    Mutation: {
      movimientoAdd: async (_, args, context) => {
        permissions(context, 'movimientos:create');

        args.movimiento._user_created = context.id_usuario;
        let item = await Movimiento.createOrUpdate(args.movimiento);
        return removeDots(item.data);
      },
      movimientoEdit: async (_, args, context) => {
        permissions(context, 'movimientos:update');

        args.movimiento._user_updated = context.id_usuario;
        args.movimiento._updated_at = new Date();
        args.movimiento.id = args.id;
        let item = await Movimiento.createOrUpdate(args.movimiento);
        return removeDots(item.data);
      },
      movimientoDelete: async (_, args, context) => {
        permissions(context, 'movimientos:delete');

        let deleted = await Movimiento.deleteItem(args.id);
        return { deleted: deleted.data };
      }
    }
  };
};
