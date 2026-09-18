# Ejercicio 2

## Decisiones tomadas

* **Metodos HTTP:** uso POST para crear alumnos enviando los datos por el body (json), y GET para listar todos los alumnos registrados.
* **No almacenar datos derivados:** en el array en memoria solo guardo nombre y el array con las 3 notas. El promedio y la condicion academica se calculan adentro del GET al momento de hacer la consulta con un map(), asi no guardo datos que se pueden calcular en el momento.
* **Validaciones:** se controla que vengan 3 notas obligatorias, que sean numericas del 0 al 10 y que no se repita el nombre del alumno para evitar duplicados. Si falla algo devuelve un 400 Bad Request.