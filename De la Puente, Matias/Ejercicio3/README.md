## 📋 Ejercicio 3: Lista de Tareas

### ¿Cómo lo pensé?
Este ejercicio pedía administrar tareas y saber si estaban completadas o pendientes. Nuevamente usé un arreglo en memoria para ir guardando el listado.

### Decisiones que tomé:
- Estructura de la Tarea: Cada tarea tiene un `id`, un `nombre` y un estado booleano `completada` (`true` o `false`). Por defecto, cuando creás una tarea arranca como pendiente (`false`).
- Filtrado por Estado: Para consultar cuáles están listas y cuáles no, usé la ruta `GET /api/tareas` permitiendo mandar un filtro por la URL (ej: `?completada=true` o `?completada=false`). Si no mandan filtro, muestro todas.
- Uso de `PATCH`: Para cambiar el estado de la tarea (de pendiente a completada) creé una ruta especial con `PATCH` que solo modifica ese campo sin tocar el resto de la tarea.
- Validaciones: No permito crear tareas sin nombre ni tareas con nombres duplicados.