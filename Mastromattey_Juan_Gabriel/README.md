Trabajo Practico 1 - Programación IV
Ejercicio 1 - Rectangulos

Se utiliza el recurso /rectangulos con GET.
La base y la altura se reciben mediante query, ya que solamente se necesitan para realizar los calculos.
La API devuelve el perimetro, la superficie y si el rectangulo tambien es un cuadrado.
Se valida que la base y la altura sean numeros mayores que cero.
No se utilizan POST, PUT ni DELETE porque no se guardan rectangulos.

---

Ejercicio 2 - Alumnos

Se utiliza el recurso /alumnos.

Se utilizan:
GET para consultar.
POST para crear.
PUT para modificar.
DELETE para eliminar.

El nombre del alumno se utiliza como param y las notas se reciben mediante body.
Cada alumno tiene un nombre y tres notas. No se permiten nombres repetidos.
El promedio y la condición se calculan al consultar y no se guardan, porque son datos derivados de las notas.
Se validan los nombres y las notas, que deben estar entre 0 y 10.

---

Ejercicio 3 - Tareas

Se utiliza el recurso /tareas.

Se utilizan:
GET para consultar.
POST para crear.
PUT para modificar.
DELETE para eliminar.

El nombre de la tarea se utiliza como param y los datos se reciben mediante body.
El estado de la tarea se representa mediante completada, que puede ser true o false.
Para consultar las tareas según su estado se utiliza query:

/tareas?completada=true
/tareas?completada=false

No se permiten tareas con el mismo nombre.

Los tres ejercicios incluyen un archivo .http para probar los distintos endpoints y sus validaciones.
