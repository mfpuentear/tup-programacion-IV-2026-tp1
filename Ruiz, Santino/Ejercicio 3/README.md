# Ejercicio 3

Manejo de nombres únicos:
Para evitar tareas duplicadas, al momento de crear (POST) o editar (PUT), la API toma el nombre ingresado, elimina los espacios en los extremos y lo convierte a minúsculas. Así, "Comprar leche" y "  comprar LECHE " se consideran la misma tarea.

Consultas filtradas (Completadas y Pendientes):
En lugar de crear endpoints separados como /tareas/completadas y /tareas/pendientes, la mejor práctica RESTful es usar Query Parameters (parámetros de consulta) sobre el endpoint principal. De este modo, enviando una petición a GET /tareas?completada=true o GET /tareas?completada=false, la API filtra dinámicamente el arreglo interno. Si no se envía el parámetro, devuelve todas las tareas.

Creación de tareas:
Por defecto, cuando se crea una nueva tarea mediante el método POST, se asume que su estado inicial es pendiente (completada: false), a menos que el cliente envíe explícitamente lo contrario.
