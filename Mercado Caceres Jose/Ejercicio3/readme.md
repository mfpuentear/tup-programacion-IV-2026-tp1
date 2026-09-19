# Ejercicio 3 - Administración de Tareas

## Descripción
API RESTful diseñada para gestionar una lista de tareas y sus estados de avance. Implementa un sistema de guardado en memoria e incluye un sistema de filtrado.

## Decisiones de Diseño
* **Clave Principal Única:** El nombre de la tarea actúa como identificador principal del recurso, lo que permite asegurar la regla de negocio que prohíbe tareas con el mismo nombre y facilita la búsqueda en el arreglo interno.
* **Filtrado de recursos (Query Params):** Para diferenciar las tareas completadas de las pendientes, se implementó un filtrado a través de parámetros de consulta en el endpoint principal (`GET /tareas?estado=completada`). Esta decisión arquitectónica evita tener que crear rutas adicionales redundantes (como `/tareas/completadas`), manteniendo la API flexible para agregar nuevos filtros a futuro.
* **Respuestas de Error Claras:** Si se intenta crear una tarea duplicada o enviar un estado inválido, el servidor responde con códigos 400 (Bad Request), validando la estructura del *body* y los tipos de datos antes de interactuar con el arreglo.