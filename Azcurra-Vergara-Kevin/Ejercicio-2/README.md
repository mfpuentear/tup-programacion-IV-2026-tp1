# API de Alumnos y Calificaciones

API desarrollada con **ExpressJS** para administrar la información académica de los alumnos de una materia y sus calificaciones.

## Decisiones de diseño

### Recurso

El recurso principal de la API es:

```text
/alumnos
```

Cada alumno cuenta con:

* `id`: identificador único.
* `nombre`: nombre del alumno.
* `notas`: arreglo con exactamente 3 calificaciones.

Ejemplo:

```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "notas": [8, 7, 9]
}
```

### Persistencia

Los datos se almacenan en un **arreglo en memoria** dentro de la aplicación.

No se utiliza una base de datos, por lo que los datos se pierden al detener o reiniciar el servidor.

### Datos derivados

El `promedio` y la `condicion` no se almacenan en el arreglo interno.

Estos valores se calculan cuando se consulta un alumno:

* **Reprobado:** promedio menor a 6.
* **Aprobado:** promedio mayor o igual a 6 y menor a 8.
* **Promocionado:** promedio mayor o igual a 8.

Ejemplo de respuesta:

```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "notas": [8, 7, 9],
  "promedio": 8,
  "condicion": "promocionado"
}
```

### Unicidad de nombres

No pueden existir dos alumnos con el mismo nombre.

La comparación se realiza sin distinguir entre mayúsculas y minúsculas. Por ejemplo:

```text
Juan Pérez
juan pérez
```

se consideran el mismo nombre.

Si se intenta crear o modificar un alumno utilizando un nombre que ya existe, la API responde con:

```text
409 Conflict
```

## Endpoints

| Método | Ruta           | Descripción                  |
| ------ | -------------- | ---------------------------- |
| GET    | `/alumnos`     | Lista todos los alumnos      |
| GET    | `/alumnos/:id` | Consulta un alumno por ID    |
| POST   | `/alumnos`     | Crea un nuevo alumno         |
| PUT    | `/alumnos/:id` | Modifica un alumno existente |
| DELETE | `/alumnos/:id` | Elimina un alumno            |

## Validaciones

La API realiza las siguientes validaciones:

### Nombre

* Es obligatorio.
* No puede estar vacío.
* No puede repetirse.

### Notas

* Deben existir exactamente 3 notas.
* Cada nota debe estar entre `0` y `10`.

Ejemplo válido:

```json
{
  "nombre": "Ana",
  "notas": [8, 7, 9]
}
```

### ID

El ID debe ser un número entero positivo.

## Códigos de respuesta

La API utiliza códigos HTTP según el resultado de cada operación:

* `200 OK` — operación realizada correctamente.
* `201 Created` — alumno creado correctamente.
* `400 Bad Request` — datos enviados incorrectamente.
* `404 Not Found` — alumno no encontrado.
* `409 Conflict` — ya existe un alumno con ese nombre.

## Instalación

Para instalar las dependencias del proyecto:

```bash
npm install
```

## Ejecución

Para iniciar el servidor:

```bash
npm start
```

El servidor se ejecutará en:

```text
http://localhost:3000
```

## Cómo probar la API

El proyecto incluye el archivo:

```text
alumnos.http
```

Este archivo puede utilizarse con la extensión **REST Client** de Visual Studio Code para realizar las diferentes peticiones HTTP.

Desde el archivo se pueden probar:

* Listar alumnos.
* Consultar un alumno por ID.
* Crear alumnos.
* Modificar alumnos.
* Eliminar alumnos.
* Validaciones de datos.
* Nombres repetidos.
* Cálculo del promedio y condición académica.

## Estructura del proyecto

```text
proyecto/
│
├── app.js
├── alumnos.http
├── package.json
└── README.md
```

## Ejemplo de uso

### Crear un alumno

**POST** `/alumnos`

```json
{
  "nombre": "Carlos",
  "notas": [8, 9, 7]
}
```

### Consultar un alumno

**GET** `/alumnos/1`

Respuesta:

```json
{
  "id": 1,
  "nombre": "Carlos",
  "notas": [8, 9, 7],
  "promedio": 8,
  "condicion": "promocionado"
}
```

### Modificar un alumno

**PUT** `/alumnos/1`

```json
{
  "nombre": "Carlos Gómez",
  "notas": [6, 7, 6]
}
```

### Eliminar un alumno

**DELETE** `/alumnos/1`

El alumno será eliminado del arreglo interno.
