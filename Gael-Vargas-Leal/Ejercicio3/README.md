# Ejercicio 3 - API de Gestión de Tareas (To-Do List)

## Decisiones de Diseño y Fundamentación  (index.js)

- **Persistencia en Memoria y Estado:**  
  Las tareas se administran mediante un arreglo en memoria (`tareas`), con identificadores únicos autoincrementales asignados por la variable `proximoId`. Cada entidad cuenta con `id`, `nombre` y la propiedad booleana `completada`.

- **Filtrado Opcional por Query Parameters (`GET /api/tareas`):**  
  El endpoint principal permite filtrar las tareas según su estado de realización mediante `?completada=true` o `?completada=false`. La API valida que el valor sea estrictamente booleano; de lo contrario, retorna un estado `400 Bad Request`.

- **Validación Centralizada y Control de Duplicados (`validarDatosTarea`):**  
  Se garantiza que el campo `nombre` sea un texto válido y no vacío. Además, la lógica verifica que no existan tareas registradas con el mismo nombre (insensible a mayúsculas y espacios en blanco), previniendo redundancia tanto en la creación (`POST`) como en la edición (`PUT`).

- **Asignación de Valores por Defecto:**  
  Al registrar una nueva tarea vía `POST`, si no se indica expresamente la propiedad `completada`, el servidor le asigna automáticamente el valor `false`.

- **Respuestas Semánticas HTTP:**  
  Se implementaron los códigos de estado estándar: `200 OK` en consultas, actualizaciones y bajas exitosas, `201 Created` al registrar una tarea, `400 Bad Request` por errores de validación o parámetros incorrectos, y `404 Not Found` cuando el recurso solicitado no existe.

---

## Fundamentación de la Suite de Pruebas  (peticiones.http)

- **Verificación de Flujos Exitosos (CRUD y Filtros):**  
  - **Listado y Filtrado por Estado (`GET`):** Prueba la lectura del listado total y evalúa el filtrado selectivo para tareas completadas (`?completada=true`) y pendientes (`?completada=false`).
  - **Alta de Tareas (`POST`):** Verifica el registro de una nueva tarea especificando su estado inicial en el cuerpo de la petición.
  - **Actualización de Estado (`PUT`):** Confirma la modificación parcial/total de un recurso existente para marcar una tarea pendiente como completada.
  - **Baja de Recursos (`DELETE`):** Testea la eliminación efectiva de una tarea del arreglo mediante su ID (`/1`).

- **Control de Casos Borde y Validaciones:**  
  - **Identificación de Duplicados (`POST`):** Comprueba que la API bloquee el intento de registrar una tarea que posee un nombre previamente guardado (`Ir al gimnasio`), retornando un error descriptivo con estado `400 Bad Request`.