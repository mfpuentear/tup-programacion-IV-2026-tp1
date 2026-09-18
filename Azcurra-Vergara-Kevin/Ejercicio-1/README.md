# Ejercicio 1 - API de Rectángulos

## Descripción

Se desarrolló una API REST utilizando **ExpressJS** para realizar consultas y cálculos sobre rectángulos.

La API permite:

* Obtener el perímetro.
* Obtener la superficie.
* Determinar si un rectángulo también es un cuadrado.

## Modelo

Un rectángulo se representa mediante dos valores:

* `base`
* `altura`

Ambos valores deben ser números mayores que `0`.

Ejemplo:

```json
{
  "base": 10,
  "altura": 5
}
```

## Operaciones

### Perímetro

El perímetro se calcula utilizando la fórmula:

```text
P = 2 × (base + altura)
```

Para un rectángulo de base `10` y altura `5`:

```text
P = 2 × (10 + 5) = 30
```

### Superficie

La superficie se calcula utilizando:

```text
S = base × altura
```

Ejemplo:

```text
S = 10 × 5 = 50
```

### Cuadrado

Se determina que un rectángulo también es un cuadrado cuando su base y altura son iguales.

Ejemplo:

```text
base = 5
altura = 5
```

En este caso, el resultado es:

```text
Es un cuadrado
```

## Validaciones

La API valida que:

* `base` sea un número.
* `altura` sea un número.
* Ambos valores sean mayores que `0`.

Si alguno de los valores no cumple con estas condiciones, la API devuelve un error indicando que los datos son inválidos.

## Endpoints

| Método | Ruta                      | Descripción                 |
| ------ | ------------------------- | --------------------------- |
| GET    | `/rectangulos/perimetro`  | Calcula el perímetro        |
| GET    | `/rectangulos/superficie` | Calcula la superficie       |
| GET    | `/rectangulos/cuadrado`   | Determina si es un cuadrado |

Los valores de `base` y `altura` se envían como parámetros de consulta.

Ejemplo:

```text
GET /rectangulos/perimetro?base=10&altura=5
```

## Ejemplos de respuestas

### Perímetro

```json
{
  "base": 10,
  "altura": 5,
  "perimetro": 30
}
```

### Superficie

```json
{
  "base": 10,
  "altura": 5,
  "superficie": 50
}
```

### Determinar si es cuadrado

Para:

```text
base = 5
altura = 5
```

Respuesta:

```json
{
  "base": 5,
  "altura": 5,
  "esCuadrado": true
}
```

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

Las diferentes operaciones pueden probarse utilizando un cliente REST, como **REST Client** en Visual Studio Code.

Ejemplos:

```text
GET http://localhost:3000/rectangulos/perimetro?base=10&altura=5
```

```text
GET http://localhost:3000/rectangulos/superficie?base=10&altura=5
```

```text
GET http://localhost:3000/rectangulos/cuadrado?base=5&altura=5
```

## Estructura del proyecto

```text
proyecto/
│
├── app.js
├── rectangulos.http
├── package.json
└── README.md
```

## Tecnologías utilizadas

* **Node.js**
* **ExpressJS**
* **REST API**
* **JavaScript**
