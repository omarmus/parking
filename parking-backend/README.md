# Base Backend

Este base contiene los siguientes módulos:

- Entidades
- Usuarios
- Personas
- Roles
- Módulos
- Permisos

También ya se integra los siguientes módulos con sus respectivos seeders

- Logs del sistema
- Parámetros del sistema
- Servicios de Interoperabilidad

## Requisitos
- Nodejs 7.6 en adelante

## Instalando el proyecto

Siga los siguientes pasos:

### 1. Instalando dependencias
``` bash
npm install
```
### 2. Creando base de datos
Crear una base de datos en postgres y configurar la conexión en el módulo common instalado fuera del proyecto en `[Ruta del proyecto]/common/src/config/db.js` *(Este archivo se obtiene copiando el archivo db.js.sample)*

### 3. Configurando envío de correo electrónico
Configurar el envío de correo electrónico en el módulo common instalado fuera del proyecto en `[Ruta del proyecto]/common/src/config/mail.js` *(Este archivo se obtiene copiando el archivo mail.js.sample)*

### 4. Creando seeders y test
Ejecutar lo siguiente para crear las tablas, seeders y tests unitarios de las 3 capas del DDD, esto eliminará las tablas y los datos de estas para reescribirlos.

``` bash
npm test

```

O puede usar los siguientes comandos por separado para hacer lo mismo que el comando `npm test`.

``` bash
npm run setup # Construye las tablas de la base de datos
npm run seeders # Crea los seeders de las tablas
npm run test-db # Test de la capa de infrastructura
npm run test-domain # Test de la capa de dominio
```

## Instalando Node.js v8.x

NOTA.- Debian Wheezy no soporta Node 8

``` bash
# Para Ubuntu
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs

# Para Debian, instalar como root
curl -sL https://deb.nodesource.com/setup_8.x | bash -
apt-get install -y nodejs
```
