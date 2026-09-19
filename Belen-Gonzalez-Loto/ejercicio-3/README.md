# Ejercicio 3

## Descripcion

Se desarrollo una API con ExpressJS para administrar tareas y su estado de avance.

Cada tarea tiene un `nombre` y un estado `completada`, que indica si la tarea ya fue finalizada. La informacion se guarda en un arreglo interno dentro de la aplicacion.

No se permite crear ni modificar tareas usando un nombre que ya exista.

## Recurso elegido

El recurso elegido es `tareas`, porque la API administra una coleccion de tareas.

Se usa el recurso en plural porque representa varios registros dentro del arreglo interno.

## Estructura de una tarea

Cada tarea se almacena con la siguiente estructura:

{
    "nombre": "Leer material de clase",
    "completada": false
}

Se guarda solamente el nombre y el estado de avance, porque son los datos pedidos por la consigna.

## Rutas y metodos HTTP

### GET /api/tareas

Se utiliza para consultar todas las tareas.

No modifica el arreglo interno, solo devuelve la informacion almacenada.

### GET /api/tareas?estado=completadas

Se utiliza para consultar solamente las tareas completadas.

Se usa un query param porque el recurso sigue siendo `tareas`, pero se aplica un filtro sobre la coleccion.

### GET /api/tareas?estado=pendientes

Se utiliza para consultar solamente las tareas pendientes.

Tambien se usa query param porque es una consulta filtrada.

### GET /api/tareas/:nombre

Se utiliza para consultar una tarea especifica.

El `nombre` se usa como parametro de ruta porque no pueden existir tareas con el mismo nombre, entonces permite identificar una tarea concreta.

### POST /api/tareas

Se utiliza para crear una nueva tarea.

Corresponde usar `POST` porque se agrega un nuevo recurso al arreglo interno.

### PUT /api/tareas/:nombre

Se utiliza para modificar completamente una tarea existente.

Corresponde usar `PUT` porque se reemplazan los datos principales de la tarea: `nombre` y `completada`.

### PATCH /api/tareas/:nombre/estado

Se utiliza para modificar solamente el estado de avance de una tarea.

Corresponde usar `PATCH` porque se actualiza parcialmente el recurso, cambiando solo el campo `completada`.

### DELETE /api/tareas/:nombre

Se utiliza para eliminar una tarea existente.

Corresponde usar `DELETE` porque se quita un recurso del arreglo interno.

## Metodos no utilizados para otros casos

No se utiliza `POST` para consultar tareas porque las consultas corresponden a `GET`.

No se utiliza `PUT` para cambiar solamente el estado, porque `PUT` representa una modificacion completa. Para modificar solo el estado se usa `PATCH`.

No se utiliza `PATCH` para crear tareas porque `PATCH` se usa para modificar parcialmente un recurso existente.

## Justificacion de campos

### nombre

Se utiliza `nombre` porque identifica a cada tarea.

Se valida que sea unico, ya que la consigna indica que no pueden existir tareas con el mismo nombre.

Tambien se valida que sea texto y que tenga entre 3 y 60 caracteres. Se eligio este rango porque un nombre demasiado corto puede ser poco descriptivo y uno demasiado largo no resulta practico para este ejercicio.

### completada

Se utiliza `completada` porque representa directamente si la tarea fue finalizada.

Debe ser un valor booleano:

- `true`: tarea completada.
- `false`: tarea pendiente.

Se eligio booleano porque el estado pedido tiene solo dos posibilidades.

## Validaciones

La API valida que:

- El `nombre` haya sido enviado.
- El `nombre` sea texto.
- El `nombre` tenga entre 3 y 60 caracteres.
- No exista otra tarea con el mismo nombre.
- `completada` haya sido enviado.
- `completada` sea booleano.
- El filtro `estado`, si se usa, sea `completadas` o `pendientes`.

Para evitar duplicados, los nombres se comparan sin distinguir mayusculas y minusculas.

## Codigos de estado

- `200 OK`: consulta, modificacion o eliminacion correcta.
- `201 Created`: tarea creada correctamente.
- `400 Bad Request`: datos invalidos enviados por el cliente.
- `404 Not Found`: tarea no encontrada.
- `409 Conflict`: ya existe una tarea con ese nombre.

## Ejemplos

Crear una tarea:

POST /api/tareas

{
    "nombre": "Leer material de clase",
    "completada": false
}

Consultar tareas pendientes:

GET /api/tareas?estado=pendientes

Actualizar solo el estado:

PATCH /api/tareas/Leer%20material%20de%20clase/estado

{
    "completada": true
}