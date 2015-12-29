Afiliaciones - Partido de la Red
================================

App para administrar los afiliados del Partido de la Red.

## Comandos

* `npm run start`: Abrir server para `production`.
* `npm run dev`: Abrir server para `development`, se reinicia cuando se cambia algun archivo.
* `npm run build`: Buildear los assets en `/build`, para que puedan ser usados desde el HTML.
* `npm run watch`: Lo mismo que `npm run build`, pero para `development`, se queda esperando por cambios y re-compila.

## Dependencias

### Estructura
* [NodeJS Starter](https://github.com/rickyrauch/nodejs-starter)

### Base
* [Node.js v5+](https://nodejs.org/en/)
* [Mongo DB](https://www.mongodb.org/)

### Server
* [Express](http://expressjs.com/)
* [Mongoose](http://mongoosejs.com/)
* [Passport](http://passportjs.org/)

### Autenticación
* [`passport-local-mongoose`](https://github.com/saintedlama/passport-local-mongoose).

### Views
* [`express-handlebars`](https://github.com/ericf/express-handlebars)

## Models Validation
Los modelos están creados con [Mongoose](http://mongoosejs.com/) en la carpeta `/lib/models`. Están hechos para que también se pueda validar desde el frontend como se explica [acá](http://mongoosejs.com/docs/browser.html).

Desde el server hay que usar `var Peer = require('../models').Peer`, y en el browser `var Peer = require('../models/models').Peer`

## Extras
* Info afiliaciones
  * http://elecciones.gob.ar/articulo_princ.php?secc=1&sub_secc=4
* Original de Ficha a completar
  * http://www.elecciones.gov.ar/admin/ckfinder/userfiles/files/Ficha_Afiliaci%C3%B3n.pdf
