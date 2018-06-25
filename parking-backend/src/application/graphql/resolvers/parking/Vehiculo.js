'use strict';
const { permissions } = require('../../../lib/auth');

module.exports = function setupResolver (services) {
  const { Vehiculo } = services;

  return {
    Query: {
      vehiculos: async (_, args, context) => {
        permissions(context, 'vehiculos:read');

        let items = await Vehiculo.findAll(args, context.id_rol, context.id_vehiculo);
        return items.data;
      },
      vehiculo: async (_, args, context) => {
        permissions(context, 'vehiculos:read');

        let item = await Vehiculo.findById(args.id);
        return item.data;
      }
    },
    Mutation: {
      vehiculoAdd: async (_, args, context) => {
        permissions(context, 'vehiculos:create');

        args.vehiculo._user_created = context.id_usuario;
        let item = await Vehiculo.createOrUpdate(args.vehiculo);
        return item.data;
      },
      vehiculoEdit: async (_, args, context) => {
        permissions(context, 'vehiculos:update');

        args.vehiculo._user_updated = context.id_usuario;
        args.vehiculo._updated_at = new Date();
        args.vehiculo.id = args.id;
        let item = await Vehiculo.createOrUpdate(args.vehiculo);
        return item.data;
      },
      vehiculoDelete: async (_, args, context) => {
        permissions(context, 'vehiculos:delete');

        let deleted = await Vehiculo.deleteItem(args.id);
        return { deleted: deleted.data };
      }
    }
  };
};
