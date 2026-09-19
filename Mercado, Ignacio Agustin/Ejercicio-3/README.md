# Ejercicio 3: API de Gestión de Tareas y Estado de Avance

## Fundamentación de las Decisiones de Diseño

* **Modelado del Recurso (`/tareas`):**
  Se adopta la colección `/tareas` en plural para representar las tareas administradas por la API.

* **Filtros por Query Params (`?completada=true|false`):**
  Para cumplir con el requerimiento de diferenciar tareas completadas de pendientes, se utiliza el parámetro de consulta `completada` en el método `GET /tareas`. Esto permite a los clientes solicitar `/tareas?completada=true` o `/tareas?completada=false` de manera limpia y RESTful sin crear rutas redundantes.

* **Validación de Unicidad de Nombre:**
  Tanto en el alta (`POST`) como en la actualización (`PUT`), se garantiza que no existan tareas repetidas comparando nombres en minúsculas. En las modificaciones se ignora el registro propio para permitir actualizar otros campos sin conflictos.

* **Uso del Método PATCH:**
  Además del `PUT` tradicional para actualizar el recurso completo, se expone la ruta `PATCH /tareas/:id/completada` pensada para operaciones rápidas en interfaces de usuario (como marcar/desmarcar una casilla de verificación).

* **Manejo de Respuestas HTTP:**
  * `200 OK`: Consultas, actualizaciones y eliminaciones exitosas.
  * `201 Created`: Creación de tarea confirmada.
  * `400 Bad Request`: Datos de entrada inválidos o nombres duplicados.
  * `404 Not Found`: Tarea no existente.