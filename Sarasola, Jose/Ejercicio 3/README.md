# Ejercicio 3 - Gestión de tareas

## Modelo

Cada tarea se representa mediante:

`{ nombre, completada }`

`nombre` identifica la tarea y `completada` es un valor booleano que indica su estado.

Las tareas se conservan en un arreglo interno en memoria.

## Unicidad

No pueden existir dos tareas con el mismo nombre.

Para evitar duplicados lógicamente equivalentes, la comparación de nombres elimina espacios externos e ignora diferencias entre mayúsculas y minúsculas.

Por ejemplo, `Estudiar` y `estudiar` se consideran el mismo nombre.

## Recursos y métodos

### GET /tareas

Obtiene todas las tareas.

También admite el query parameter `completada`.

Ejemplos:

`GET /tareas?completada=true`

Obtiene únicamente tareas completadas.

`GET /tareas?completada=false`

Obtiene únicamente tareas pendientes.

Se utiliza un query parameter porque completada y pendiente no son recursos distintos, sino estados utilizados para filtrar la colección de tareas.

### GET /tareas/:nombre

Obtiene una tarea determinada.

### POST /tareas

Crea una tarea.

Si el campo `completada` se omite, la tarea se considera pendiente y se utiliza `false` como valor predeterminado.

Esto se adopta como decisión de diseño porque una tarea recién creada normalmente comienza pendiente.

### PUT /tareas/:nombre

Reemplaza una tarea existente.

El body debe contener tanto el nombre como el estado.

### DELETE /tareas/:nombre

Elimina una tarea.

## Validaciones

El nombre:

- es obligatorio;
- debe ser una cadena;
- no puede estar vacío;
- debe ser único.

El campo `completada` debe ser booleano.

En el filtro mediante query solamente se admiten los strings `true` y `false`, debido a que los query parameters recibidos por HTTP son cadenas de texto.

## Códigos HTTP

- `200`: consulta o modificación correcta.
- `201`: tarea creada correctamente.
- `204`: tarea eliminada correctamente.
- `400`: información o filtros inválidos.
- `404`: tarea o recurso inexistente.
- `409`: nombre duplicado.

## Persistencia

Las tareas se almacenan únicamente en memoria. Al reiniciar el servidor se eliminan los registros almacenados.

## Ejecución

Instalar dependencias:

`npm install`

Ejecutar:

`npm start`

Servidor:

`http://localhost:3003`