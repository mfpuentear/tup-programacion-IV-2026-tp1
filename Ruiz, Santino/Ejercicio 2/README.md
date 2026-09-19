# Ejercicio 2

Datos Derivados (Promedio y Condición): El promedio y la condición académica (reprobado, aprobado o promocionado) no se almacenan en el arreglo interno. Se calculan "al vuelo" cada vez que se realiza una petición GET. Esto garantiza que siempre reflejen el estado real de las notas y evita inconsistencias en los datos.

Nombres Únicos: Antes de registrar o modificar a un alumno mediante los métodos POST o PUT, la API normaliza el texto (lo pasa a minúsculas y elimina espacios sobrantes) para verificar que el nombre no esté registrado previamente.

Identificadores (ID): Aunque la validación principal recae sobre los nombres, se implementó un id numérico autoincremental para cada alumno. Esta es una buena práctica en APIs REST para identificar unívocamente los recursos al momento de actualizarlos o borrarlos, incluso si el usuario decide corregir su nombre.

GET /alumnos: Retorna la lista completa de alumnos, calculando en tiempo real el promedio y la condición de cada uno.

GET /alumnos/:id: Retorna los detalles de un alumno específico buscándolo por su ID.

POST /alumnos: Crea un nuevo alumno. Espera en el body un nombre (String) y un arreglo de exactamente tres notas (Numbers).

PUT /alumnos/:id: Modifica el nombre o las notas de un alumno existente (verificando que el nuevo nombre no le pertenezca a otro).

DELETE /alumnos/:id: Elimina a un alumno del registro.