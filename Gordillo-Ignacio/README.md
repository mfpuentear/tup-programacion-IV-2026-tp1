# TP N° 1 - Programación IV

Alumno: Ignacio Gordillo Greatti

Los tres ejercicios son APIs hechas con Express. Cada uno está en su carpeta, tiene su propio `package.json` y un archivo `.http` para probar las rutas con la extensión REST Client de VS Code.

Para correr cualquiera:

```
cd "Ejercicio 1"
npm install
node index.js
```

Todos usan el puerto 3000, así que hay que levantar uno por vez (si queda otro prendido, el nuevo no arranca y las rutas dan 404).

Los datos se guardan en un arreglo en memoria, o sea que al reiniciar el servidor se pierde todo. Para este TP alcanza, no pedía base de datos.

## Cosas que hice igual en los tres

- El `id` lo genera la API con un contador (`ultimoId`), el cliente no lo manda. Lo uso en la URL para buscar, modificar o borrar (`/recurso/:id`).
- Antes de hacer cualquier cosa valido lo que llega. Si el id no es un entero positivo, o el body/query tiene algo raro, devuelvo 400 con un mensaje que explica qué está mal.
- Los códigos de respuesta que usé:
  - 200 cuando sale bien
  - 201 cuando se crea algo
  - 204 cuando se borra (no devuelvo nada)
  - 400 datos inválidos
  - 404 no existe ese id
  - 409 nombre repetido (ejercicios 2 y 3)
- Lo que se puede calcular a partir de otros datos no lo guardo, lo calculo cuando alguien consulta. Así nunca queda desactualizado.

## Ejercicio 1 - Rectángulos

Pensé el rectángulo como un recurso (`/rectangulos`) que guarda solo lo necesario: `id`, `base` y `altura`. El perímetro, la superficie y si es cuadrado salen de esos dos valores, entonces los agrego en la respuesta pero no los guardo.

Para saber si es cuadrado comparo base con altura. Agregué un filtro por query para listar solo los cuadrados o solo los que no lo son, que me pareció la forma más simple de "distinguir" los casos que pide el enunciado.

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/rectangulos` | Lista todos (con perímetro, superficie y esCuadrado) |
| GET | `/rectangulos?cuadrado=true` | Solo los cuadrados (`false` para los que no) |
| GET | `/rectangulos/:id` | Uno solo |
| POST | `/rectangulos` | Crea uno. Body: `{ "base": 4, "altura": 6 }` |
| PUT | `/rectangulos/:id` | Cambia base y altura |
| DELETE | `/rectangulos/:id` | Lo borra |

Validaciones: base y altura tienen que ser números mayores a 0 (no acepto texto, negativos ni cero porque no tendría sentido un lado de medida 0). El query `cuadrado` solo puede ser `true` o `false`.

## Ejercicio 2 - Alumnos y notas

Cada alumno se guarda como `{ id, nombre, notas }`, donde `notas` es un arreglo de 3 números. El promedio y la condición no se guardan, como pide el enunciado. Se calculan en la ruta de notas.

Hice una ruta aparte (`/alumnos/:id/notas`) para consultar las notas porque ahí es donde tiene sentido mostrar el promedio y la condición. El resto de las rutas devuelve al alumno tal cual está guardado.

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/alumnos` | Lista todos |
| GET | `/alumnos/:id` | Un alumno |
| GET | `/alumnos/:id/notas` | Notas, promedio y condición |
| POST | `/alumnos` | Crea. Body: `{ "nombre": "Juan Perez", "notas": [8, 9, 10] }` |
| PUT | `/alumnos/:id` | Modifica nombre y notas |
| DELETE | `/alumnos/:id` | Lo borra |

Condición según el promedio:

- menos de 6: reprobado
- de 6 hasta menos de 8: aprobado
- 8 o más: promocionado

El enunciado dice "6 o 7" para aprobado pero el promedio puede dar con decimales (por ejemplo 7,5), así que tomé todo lo que está entre 6 y 8 como aprobado. El promedio lo redondeo a 2 decimales.

Validaciones:

- el nombre es obligatorio y no puede estar vacío
- tienen que ser exactamente 3 notas, y cada una un número entre 1 y 10
- no puede haber dos alumnos con el mismo nombre, ni al crear ni al modificar. Comparo sin importar mayúsculas y sacando espacios de más, porque "Juan Perez" y "juan perez " son la misma persona. En el PUT dejo que el alumno conserve su propio nombre (si no, no se podrían cambiar solo las notas).

## Ejercicio 3 - Tareas

Cada tarea es `{ id, nombre, completada }`. Para el estado usé un booleano porque la tarea solo puede estar completada o no, no hacía falta algo más complejo.

Para diferenciar completadas de pendientes usé el mismo criterio que en el ejercicio 1: un filtro por query sobre la lista.

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/tareas` | Lista todas |
| GET | `/tareas?completada=true` | Solo completadas (`false` para las pendientes) |
| GET | `/tareas/:id` | Una tarea |
| POST | `/tareas` | Crea. Body: `{ "nombre": "Estudiar" }` |
| PUT | `/tareas/:id` | Reemplaza nombre y estado |
| PATCH | `/tareas/:id` | Cambia solo el estado. Body: `{ "completada": true }` |
| DELETE | `/tareas/:id` | La borra |

Acá sumé PATCH porque lo que más se hace con una tarea es marcarla como hecha, y no tiene sentido obligar a mandar el nombre de nuevo para eso. El PUT queda para cuando se quiere cambiar todo.

Validaciones:

- nombre obligatorio, no vacío, y sin repetir (mismo criterio que en el ejercicio 2)
- `completada` tiene que ser `true` o `false` de verdad (booleano, no el texto "si" o "true")
- al crear, si no se manda `completada`, la tarea arranca como pendiente
