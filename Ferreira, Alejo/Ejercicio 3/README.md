# Ejercicio 3 - Tareas

API con ExpressJS para administrar tareas y su estado de avance. Cada tarea
tiene un nombre y un estado que indica si fue completada, y viven en un arreglo
interno.

## Como levantarlo

```
npm install
npm start
```

Queda escuchando en `http://localhost:3003`. Las pruebas estan en `tareas.http`.

## Decisiones de diseno

### Recurso e identificacion

El recurso es **`tareas`**. Como el enunciado prohibe nombres repetidos, el
nombre alcanza como identificador y va en la ruta: `/api/tareas/:nombre`.

Igual que en el ejercicio anterior, la comparacion de nombres se hace
normalizada (sin espacios de sobra y sin distinguir mayusculas), asi
`"leer el enunciado"` no puede entrar dos veces escrito distinto. El nombre se
guarda como lo escribio el cliente.

### Distinguir completadas de pendientes

Se resuelve con el parametro de consulta `completada`:

- `GET /api/tareas` devuelve todas;
- `GET /api/tareas?completada=true` devuelve las completadas;
- `GET /api/tareas?completada=false` devuelve las pendientes.

Se evaluo usar rutas del estilo `/api/tareas/completadas`, pero chocarian con
`/api/tareas/:nombre`: una tarea que se llamara "completadas" volveria
inalcanzable esa ruta. El estado ademas no identifica una tarea, filtra la
coleccion, que es justamente para lo que sirve la query string.

Un detalle a tener en cuenta: los valores de la query siempre llegan como texto,
nunca como booleanos, por eso la comparacion es contra la cadena `'true'`. Si el
valor no es ni `true` ni `false` se responde 400 en lugar de devolver una lista
vacia, para no hacerle creer al cliente que no hay tareas en ese estado.

### Metodos HTTP y endpoints

| Metodo | Ruta                  | Para que                                   |
|--------|-----------------------|--------------------------------------------|
| GET    | `/api/tareas`         | Listar. Acepta `?completada=true|false`    |
| GET    | `/api/tareas/:nombre` | Consultar una tarea                        |
| POST   | `/api/tareas`         | Crear una tarea                            |
| PUT    | `/api/tareas/:nombre` | Reemplazar la tarea completa               |
| PATCH  | `/api/tareas/:nombre` | Cambiar solo el estado o solo el nombre    |
| DELETE | `/api/tareas/:nombre` | Eliminar una tarea                         |

Aca si se justifican PUT y PATCH por separado, y es la diferencia principal con
el ejercicio 2:

- **PUT** es un reemplazo: exige los dos campos y deja la tarea tal cual la
  describe el cuerpo.
- **PATCH** es una modificacion parcial: alcanza con mandar `completada` para
  marcar o desmarcar una tarea, sin tener que reenviar el nombre. Como marcar
  una tarea como hecha es la operacion mas comun, obligar a mandar el recurso
  entero para eso seria incomodo y propenso a pisar datos sin querer.

En el alta, si no se manda `completada` la tarea nace en `false`: una tarea que
recien se crea todavia esta por hacer. Es el unico valor por defecto de la API.

El alta responde **201** con la cabecera `Location`, y la baja **204** sin cuerpo.

### Validaciones

En `middlewares/validarTarea.js`, con una funcion por caso de uso porque las
reglas cambian segun el metodo:

- `nombre`: cadena, no vacia luego de recortar espacios, hasta 100 caracteres;
- `completada`: booleano estricto. No se acepta `"true"` como texto ni `1`, para
  que el cliente mande el tipo correcto y no se guarden estados ambiguos;
- en PATCH tiene que venir al menos uno de los dos campos, si no la peticion no
  pide ningun cambio.

Reglas de negocio:

- **409** al crear una tarea con un nombre existente, o al renombrar una hacia un
  nombre ocupado. El cuerpo es valido, lo que no lo permite es el estado de la
  coleccion.
- **404** al consultar, modificar o eliminar una tarea que no esta.
- **400** si el cuerpo no es un JSON valido.
