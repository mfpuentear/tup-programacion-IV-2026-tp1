# Ejercicio 2 - API de Alumnos

Se desarrollo una API con ExpressJS para manejar alumnos y sus notas. Permite crear, modificar, consultar, listar y eliminar alumnos.  
Tambien calcula el promedio y en base a eso determina la condicion academica (promocionado, regular o reprobado)

decisiones de diseño:
Se utiliza el método POST para crear alumnos y PUT para modificar sus notas.
Se valida que:
El alumno tenga nombre y tres notas.
Las notas sean numericas y estén entre 1 y 10.
No existan alumnos con el mismo nombre.
Se calcula el promedio y se determina la condicion
  
