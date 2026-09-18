# Ejercicio 2

Utilice un ID para identificar a cada alumno de forma única y los siguientes endpoints:
POST /alumnos para crear
GET /alumnos para listar
GET /alumnos/:id para consultar uno
PUT /alumnos/:id para modificar

Corroboro que el nombre sea válido que no esté repetido y que existan exactamente tres notas numéricas entre 0 y 10.
El promedio se calcula al consultar: menor que 6: Reprobado... desde 6 hasta menos de 8: Aprobado y 8 o más: Promocionado