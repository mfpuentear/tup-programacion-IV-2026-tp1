## 🎓 Ejercicio 2: Alumnos y Notas

### ¿Cómo lo pensé?
Necesitaba guardar una lista de alumnos donde cada uno tenga un nombre y 3 notas. Para no complicarme con bases de datos por ahora, usé un arreglo simple en memoria (`let alumnos = []`).

### Decisiones que tomé:
- Identificador Único (`id`):** Le asigné a cada alumno un `id` numérico automático. Esto facilita mucho buscarlos, editarlos o borrarlos sin depender de si cambia su nombre.
- Promedio y Condición (Datos Derivados): El enunciado pedía que la condición (*reprobado*, *aprobado*, *promocionado*) y el promedio no se guarden en el arreglo. Así que los calculo "al vuelo" en el momento exacto en que alguien consulta la información. Si el promedio da menos de 6 queda reprobado, entre 6 y 7 aprobado, y de 8 para arriba promocionado.
- Validaciones: 
  - Me aseguré de que el arreglo de notas tenga exactamente 3 notas y que cada nota sea un número entre 0 y 10.
  - Validé que no se repitan los nombres de los alumnos, pasando todo a minúsculas para que no haya problemas si alguien escribe "Juan" y después "juan".