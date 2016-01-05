Afiliaciones - Partido de la Red
================================

App para administrar los afiliados del Partido de la Red.

## Comandos

* `npm run start`: Abrir server en `production`.
* `npm run dev`: Abrir server en `development`, se reinicia cuando se cambia algún archivo.
* `npm run build`: Buildear los assets en `/build`, para que puedan ser usados desde el HTML.
* `npm run watch`: Lo mismo que `npm run build`, pero para `development`, se queda esperando por cambios y re-compila.

## Estructura

```bash
afiliaciones
└── lib // Lógica compartida, Modelos, etc
└── site // Home pública de la app, ¿Qué son las afiliaciones?, ¿Dónde me afilio?, etc.
└── admin // Administrador de afiliados.
└── config // Archivos de configuración
    └── defaults.json // Valores predeterminados ¡No editar!
    └── development.json // [git-ignored] Valores para development local. Cambiar a piacere.
    └── production.json // [git-ignored] Valores para producción, también se pueden usar variables de entorno.
└── bin // Comandos para ser usados desde la terminal.
└── public // Assets státicos, servidos en '/'.
└── build // [git-ignored] Assets buildeados.
```

## Code Styles
* [Javascript Standard](https://github.com/feross/standard)
* **Tab Size:** 2 Spaces.

## Dependencias

### Server
* [Node.js v5+](https://nodejs.org/en/)
* [Mongo DB](https://www.mongodb.org/)
* [Express](http://expressjs.com/)
* [Mongoose](http://mongoosejs.com/)
* [Passport](http://passportjs.org/)

### Autenticación
* [`passport-local-mongoose`](https://github.com/saintedlama/passport-local-mongoose).

### Front End
* [`express-handlebars`](https://github.com/ericf/express-handlebars)
* [`Pleeease CSS`](http://pleeease.io/)

## Models Validation
Los modelos están creados con [Mongoose](http://mongoosejs.com/) en la carpeta `/lib/models`. Están hechos para que también se pueda validar desde el frontend como se explica [acá](http://mongoosejs.com/docs/browser.html).

Desde el server hay que usar `var Peer = require('../models').Peer`, y en el browser `var Peer = require('../models/models').Peer`

## Crear Admins

Desde la terminal, con el comando `node bin/create-user -e mail@mail.com -p lapassword`.

## Extras
* Info afiliaciones
  * http://elecciones.gob.ar/articulo_princ.php?secc=1&sub_secc=4
* Original de Ficha a completar
  * http://www.elecciones.gov.ar/admin/ckfinder/userfiles/files/Ficha_Afiliaci%C3%B3n.pdf
