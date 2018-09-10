'use strict';
const { permissions } = require('../../../lib/auth');
const { removeDots } = require('../../../lib/util');

module.exports = function setupResolver (services) {
  const { Contrato } = services;

  return {
    Query: {
      contratos: async (_, args, context) => {
        permissions(context, 'contratos:read');

        let items = await Contrato.findAll(args, context.id_rol, context.id_contrato);
        return removeDots(items.data);
      },
      contrato: async (_, args, context) => {
        permissions(context, 'contratos:read');

        let item = await Contrato.findById(args.id);
        return removeDots(item.data);
      }
    },
    Mutation: {
      contratoAdd: async (_, args, context) => {
        permissions(context, 'contratos:create');

        args.contrato._user_created = context.id_usuario;
        let item = await Contrato.createOrUpdate(args.contrato);
        return item.data;
      },
      contratoEdit: async (_, args, context) => {
        permissions(context, 'contratos:update');

        args.contrato._user_updated = context.id_usuario;
        args.contrato._updated_at = new Date();
        args.contrato.id = args.id;
        let item = await Contrato.createOrUpdate(args.contrato);
        return item.data;
      },
      contratoDelete: async (_, args, context) => {
        permissions(context, 'contratos:delete');

        let deleted = await Contrato.deleteItem(args.id);
        return { deleted: deleted.data };
      }
    }
  };
};
