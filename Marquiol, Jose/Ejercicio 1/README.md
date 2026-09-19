# Ejercicio 1

## Diseño

La información se modela mediante un arreglo interno llamado `rectangulos`. Cada rectángulo contiene un `id`, una `base` y una `altura`.

El perímetro, la superficie y la condición de cuadrado no se almacenan, ya que son datos que se pueden obtener a partir de la base y la altura.

Se utiliza el `id` para identificar individualmente cada rectángulo.

## Metodos

* `GET /rectangulos`: obtiene todos los rectángulos.
* `GET /rectangulos/:id`: obtiene un rectángulo específico.
* `POST /rectangulos`: crea un nuevo rectángulo.
* `PUT /rectangulos/:id`: modifica un rectángulo existente.
* `DELETE /rectangulos/:id`: elimina un rectángulo.

También se utiliza el parámetro de consulta `cuadrado` para filtrar los resultados:

* `GET /rectangulos?cuadrado=true`
* `GET /rectangulos?cuadrado=false`

## Calculos

El perímetro se obtiene mediante:

`2 * (base + altura)`

La superficie se obtiene mediante:

`base * altura`

Un rectángulo se considera cuadrado cuando:

`base === altura`

## Validaciones

Se valida que:

* El `id` sea válido.
* La base y la altura sean números positivos.
* La base y la altura estén presentes al crear o modificar.
* El parámetro `cuadrado` solamente pueda tener los valores `true` o `false`.
* El rectángulo buscado exista antes de modificarlo o eliminarlo.
