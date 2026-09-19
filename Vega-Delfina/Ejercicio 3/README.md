# Ejercicio 3 - Administracion de tareas

Cada tarea se representa con 'id', 'nombre' y 'completada' (booleano). 

Recurso y metodos HTTP:
GET  /tareas  :  Listar tareas, con filtro opcional por estado
GET /tareas/:id   : Ver el detalle de una tarea
POST /tareas  : Crear una tarea nueva, siempre arranca como pendiente
PUT  /tareas/:id  : Modificar nombre y/o estado de una tarea
DELETE  /tareas/:id  : Eliminar una tarea

Diferenciar completadas de pendientes:
Se utiliza el parametro completada en el GET /tareas, por ejemplo ?completada=true o ?completada=false, en lugar de crear rutas diferentes. De esta manera se evita repetir la logica y también se puede obtener el listado completo simplemente sin utilizar el filtro.

Validaciones:
El nombre debe ser un texto y no puede estar vacio, porque toda tarea debe tener un nombre.
No puede haber dos tareas con el mismo nombre. Se comparan los nombres sin distinguir mayusculas y minusculas. Al modificar una tarea, se excluye a la propia tarea de esta comprobación.
completada debe ser true o false, ya que indica si la tarea esta completada o pendiente.
El filtro ?completada=... solo acepta true o false, porque son los únicos valores válidos para filtrar las tareas por estado.