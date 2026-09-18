# Trabajo practico N 1 - Ferreira, Alejo

Los tres ejercicios son APIs independientes hechas con ExpressJS. Cada carpeta
tiene su propio `package.json`, su archivo `.http` con las pruebas y un README
con la fundamentacion de las decisiones de diseno.

| Ejercicio | Recurso        | Puerto | Archivo de pruebas  |
|-----------|----------------|--------|---------------------|
| 1         | `rectangulos`  | 3001   | `rectangulos.http`  |
| 2         | `alumnos`      | 3002   | `alumnos.http`      |
| 3         | `tareas`       | 3003   | `tareas.http`       |

Cada uno usa un puerto distinto para poder tener los tres levantados a la vez.

## Como ejecutarlos

Dentro de la carpeta del ejercicio:

```
npm install
npm start
```

## Como probarlos

Los archivos `.http` se ejecutan con la extension **REST Client** de VS Code
(`humao.rest-client`). Una vez instalada aparece un boton *Send Request* arriba
de cada peticion.

Cada archivo incluye tanto los casos correctos como los que tienen que fallar,
para dejar a la vista las validaciones y los codigos de estado devueltos.

## Criterios comunes a los tres ejercicios

- La estructura separa el arranque del servidor (`index.js`) de la configuracion
  de la aplicacion (`app.js`), asi la app se puede montar o probar sin abrir un
  puerto.
- Las rutas viven en `routes/` y las validaciones en `middlewares/`, para que los
  controladores se ocupen solo de la logica de cada operacion.
- Toda respuesta es JSON, incluidos los errores, con el formato
  `{ "error": "...", "detalles": [...] }`.
- Los errores de validacion se acumulan y se devuelven juntos en vez de cortar en
  el primero.
- Codigos usados: 200, 201 y 204 para los casos exitosos; 400 para datos
  invalidos; 404 para recursos que no existen; 409 para conflictos con el estado
  actual de la coleccion.
