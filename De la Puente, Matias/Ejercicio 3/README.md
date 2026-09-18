# Ejercicio 3

Desarrolle una API con ExpressJS para administrar tareas y su estado.. Cada tarea se guarda en un arreglo interno con su nombre y un valor booleano que indica si está completada o pendiente y no se permiten tareas con nombres repetidos.
Para crear tareas se utiliza POST /tareas y para consultarlas GET /tareas y s e puede filtrar por estado usando GET /tareas?estado=completadas o GET /tareas?estado=pendientes...
Valido que el nombre no esté vacío, que no exista otra tarea con el mismo nombre y que el estado utilizado en los filtros sea válido.