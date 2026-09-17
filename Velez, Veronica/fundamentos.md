# Fundamentos de Diseño - TP1

## Ejercicio 1 (Rectángulos)
- **Métodos HTTP:** 
  - `POST /rectangulos`: Para dar de alta un nuevo rectángulo.
  - `GET /rectangulos`: Para obtener la lista.
- **Decisiones:** Los valores de área, perímetro y si es cuadrado se calculan en el momento de crear (POST) y se guardan en el objeto. Esto hace que el GET sea más liviano, ya que son valores que no cambian a menos que cambie la base o altura.

## Ejercicio 2 (Alumnos)
- **Métodos HTTP:**
  - `POST /alumnos`: Para cargar un nuevo alumno y sus notas.
  - `PUT /alumnos/:id`: Para modificar los datos de un alumno existente.
  - `GET /alumnos`: Para consultar el listado de alumnos.
- **Decisiones:** Tal como pide el enunciado, el promedio y la condición se calculan dinámicamente ("on the fly") adentro de la ruta GET y no se guardan en el array. Además puse validaciones al hacer POST y PUT para verificar que no haya nombres duplicados (comparando en minúsculas) y que sean exactamente 3 notas del 1 al 10.

## Ejercicio 3 (Tareas)
- **Métodos HTTP:**
  - `POST /tareas`: Crear tarea.
  - `PUT /tareas/:id`: Modificar tarea (como marcarla completada).
  - `GET /tareas`: Para buscar tareas. Agregué soporte para query params.
  - `DELETE /tareas/:id`: Para borrar una tarea.
- **Decisiones:** En vez de hacer endpoints distintos como `/tareas/completadas`, usé query params en el GET (`/tareas?completada=true`), lo cual es una práctica mucho más "RESTful" para filtrar colecciones. Las tareas nuevas por defecto nacen con `completada: false`. Se valida que no se repitan los nombres en el POST y en el PUT.
