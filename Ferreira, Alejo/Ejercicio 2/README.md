# Ejercicio 2 - Alumnos y calificaciones

API con ExpressJS para administrar los alumnos de una materia y sus notas.
Cada alumno tiene un nombre y tres notas guardadas en un arreglo interno.

## Como levantarlo

```
npm install
npm start
```

Queda escuchando en `http://localhost:3002`. Las pruebas estan en `alumnos.http`.

## Decisiones de diseno

### Recurso e identificacion

El recurso es **`alumnos`**. Como el enunciado prohibe alumnos repetidos, el
nombre ya funciona como identificador unico y se usa directamente en la ruta:
`/api/alumnos/:nombre`. No se agrego un `id` numerico porque seria un segundo
identificador para la misma restriccion.

La comparacion de nombres se hace normalizada: se recortan los espacios de los
extremos, se colapsan los espacios repetidos y se ignoran las mayusculas. Asi
`"ana gomez"` y `"Ana  Gomez"` no pueden convivir como dos alumnos distintos.
El nombre se guarda tal como lo escribio el cliente (solo con los espacios
normalizados); lo que se normaliza es la comparacion, no el dato.

Los nombres con espacios viajan en la URL codificados (`Ana%20Gomez`), que es la
forma estandar de escribirlos.

### Datos derivados

El arreglo interno guarda unicamente `{ nombre, notas }`. El promedio y la
condicion se calculan en el momento de responder, en `logica/calificaciones.js`.
Guardarlos seria duplicar informacion que ya esta en las notas, y quedaria
desactualizada apenas se modifique una calificacion.

La condicion se decide con el promedio **sin redondear** y el redondeo a dos
decimales se aplica solo al valor que se muestra. Si se redondeara antes, un
promedio de 5,996 se informaria como 6 y el alumno pasaria a figurar aprobado sin
haber llegado.

Escala usada:

| Promedio       | Condicion     |
|----------------|---------------|
| menor a 6      | reprobado     |
| 6 a menos de 8 | aprobado      |
| 8 o mas        | promocionado  |

El enunciado nombra los cortes como "menores a 6", "6 o 7" y "8 o mas", que deja
sin cubrir los promedios intermedios (por ejemplo 7,5). Se interpreto que el
tramo de aprobado llega hasta cualquier valor menor a 8, que es donde arranca la
promocion.

### Metodos HTTP y endpoints

| Metodo | Ruta                           | Para que                                      |
|--------|--------------------------------|-----------------------------------------------|
| GET    | `/api/alumnos`                 | Listar todos. Acepta `?condicion=`            |
| GET    | `/api/alumnos/:nombre`         | Consultar un alumno con promedio y condicion  |
| GET    | `/api/alumnos/:nombre/notas`   | Consultar las notas con promedio y condicion  |
| POST   | `/api/alumnos`                 | Dar de alta un alumno                         |
| PUT    | `/api/alumnos/:nombre`         | Reemplazar el registro completo                |
| PUT    | `/api/alumnos/:nombre/notas`   | Reemplazar solo las tres notas                |
| DELETE | `/api/alumnos/:nombre`         | Eliminar un alumno                            |

Se usa PUT y no PATCH porque en los dos casos el cuerpo trae el recurso entero:
en uno el alumno completo y en el otro las tres notas juntas. No hay
actualizaciones parciales.

Las notas se expusieron ademas como subrecurso (`/:nombre/notas`) porque cargar
calificaciones es la operacion mas frecuente y no tiene por que obligar a
reenviar el nombre. El subrecurso responde tanto a GET como a PUT: si se puede
escribir, se tiene que poder leer.

El filtro por condicion va en query string, que es su lugar natural: no
identifica un alumno, acota una coleccion. Si llega una condicion que no existe
se responde 400 en vez de devolver una lista vacia, para que el cliente sepa que
se equivoco y no crea que no hay alumnos en esa situacion.

En el alta se devuelve **201** con la cabecera `Location` apuntando al alumno
recien creado, y en la baja **204** sin cuerpo, porque no queda nada que devolver.

### Validaciones

Estan en `middlewares/validarAlumno.js`, separadas de las rutas para no repetir
los mismos controles en POST y en PUT.

Del cuerpo (400 si falla):

- `nombre`: cadena, no vacia luego de recortar espacios, hasta 60 caracteres;
- `notas`: arreglo de exactamente tres numeros entre 0 y 10.

De la query (400 si falla): `condicion` solo acepta `reprobado`, `aprobado` o
`promocionado`.

Reglas de negocio:

- **409** al crear un alumno cuyo nombre ya existe, o al renombrar uno hacia un
  nombre ocupado por otro. Se usa 409 y no 400 porque el cuerpo es valido: lo que
  falla es el estado actual de la coleccion.
- **404** al consultar, modificar o eliminar un alumno que no esta.
- **400** si el cuerpo no es un JSON valido, capturado en el manejador de errores
  de `app.js`.

Los errores de validacion se devuelven todos juntos en `detalles`, en lugar de
cortar en el primero.
