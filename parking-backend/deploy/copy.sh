#!/usr/bin/env bash
echo - Copiando archivos para el deploy -
pwd
echo 1. Copiando Backend
rm -rf roles/backend/files/base-backend
cp -rf ../../base-backend roles/backend/files
rm -rf roles/backend/files/base-backend/node_modules
rm -rf roles/backend/files/base-backend/deploy
rm -f roles/backend/files/base-backend/src/common/src/config/db.js
cp roles/backend/files/base-backend/src/common/src/config/db.js.sample roles/backend/files/base-backend/src/common/src/config/db.js
rm -f roles/backend/files/base-backend/src/common/src/config/correo.js
cp roles/backend/files/base-backend/src/common/src/config/correo.js.sample roles/backend/files/base-backend/src/common/src/config/correo.js
echo 2. ¡Finalizado!


