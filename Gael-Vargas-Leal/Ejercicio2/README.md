# Ejercicio 2 - API de Gestión Académica de Alumnos

## Decisiones de Diseño y Fundamentación  (index.js)

* **Persistencia en Memoria y Generación de IDs:**  
  Los datos se almacenan en un arreglo (`alumnos`) para mantener el estado durante la ejecución de la aplicación. Se utiliza una variable autoincremental (`proximoId`) para asignar identificadores únicos y prevenir colisiones al crear nuevos registros.

* **Cálculo Dinámico de Atributos (`promedio` y `condicion`):**  
  Las notas se persisten de forma individual, pero el `promedio` y la `condicion` (`reprobado`, `aprobado`, `promocionado`) se calculan al vuelo mediante las funciones helper `calcularPromedio()` y `determinarCondicion()`. Esto evita inconsistencias por redundancia de datos almacenados.

* **Búsqueda Flexible Polimórfica (`GET /api/alumnos/:criterio`):**  
  Se diseñó un único endpoint de consulta que evalúa el parámetro de ruta tanto como `id` numérico como por coincidencia exacta e insensible a mayúsculas con la propiedad `nombre`.

* **Validaciones Robustas y Reglas de Negocio:**  
  La función `validarDatosAlumno()` verifica que el nombre sea un texto válido y no vacío, que el arreglo contenga exactamente 3 notas, y que cada nota sea un número entre 1 y 10. Además, se valida la unicidad de nombres para prevenir duplicados tanto en la creación (`POST`) como en la edición (`PUT`).

* **Manejo de Errores y Códigos de Estado HTTP:**  
  Se responde con estados HTTP estándares: `200 OK` en consultas y modificaciones exitosas, `201 Created` al registrar alumnos, `400 Bad Request` ante fallas de validación o nombres duplicados, y `404 Not Found` cuando el recurso solicitado no existe.

---

## Fundamentación de la Suite de Pruebas  (peticiones.http)

* **Verificación de Operaciones CRUD Exitosas:**  
  * **Listado General (`GET`):** Consulta todos los alumnos procesando adecuadamente el promedio y la condición.
  * **Búsqueda por ID y por Nombre (`GET`):** Valida la búsqueda polimórfica utilizando tanto el identificador (`/1`) como el texto (`/Maria Gomez`).
  * **Creación y Modificación (`POST`/`PUT`):** Confirma el registro de nuevos alumnos y la actualización de calificaciones con recalculado automático de promedios.
  * **Eliminación y Verificación (`DELETE`):** Borra un elemento de la lista y testea que las búsquedas posteriores respondan adecuadamente con `404 Not Found`.

* **Control y Cobertura de Casos Borde y Errores:**  
  * **Duplicación de Nombres:** Verifica la regla de negocio impidiendo dar de alta alumnos con nombres ya existentes.
  * **Estructura Inválida de Calificaciones:** Evalúa la respuesta de la API cuando el arreglo no tiene exactamente 3 notas o contiene calificaciones fuera del rango numérico permitido (1 a 10).