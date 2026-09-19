## Decisiones de diseño

### Modelado de la información

Un rectángulo se modela con dos datos de entrada: `base` y `altura`, ambos números positivos. El perímetro y la superficie no se almacenan ni se reciben, sino que son **valores derivados** que se calculan a partir de esos dos datos:

- Perímetro: `2 * (base + altura)`
- Superficie: `base * altura`

Un cuadrado no se modela como una entidad distinta, sino como un **caso particular del rectángulo** (`base === altura`). Por eso la respuesta incluye un campo booleano `esCuadrado`, un campo `tipo` (`"cuadrado"` o `"rectangulo"`) y, cuando corresponde, el campo `lado`. Así se distinguen ambos casos sin duplicar rutas ni lógica.

### Recurso y endpoints

El recurso se llama `/rectangulos` (sustantivo en plural, según las convenciones REST). Las consultas se exponen así:

| Método | Ruta                                    | Descripción                            |
| ------ | --------------------------------------- | -------------------------------------- |
| GET    | `/rectangulos/perimetro?base=&altura=`  | Devuelve el perímetro                  |
| GET    | `/rectangulos/superficie?base=&altura=` | Devuelve la superficie                 |
| GET    | `/rectangulos/calculo?base=&altura=`    | Devuelve perímetro y superficie juntos |

### Método HTTP

Se utiliza únicamente `GET`, ya que todas las operaciones son de **lectura**: no crean, modifican ni eliminan recursos. `GET` es además seguro e idempotente, y permite probar la API fácilmente desde el navegador o desde el archivo `.http`.

### Sin persistencia

El enunciado pide resolver consultas, no administrar una colección de rectángulos. Por eso la API es _stateless_: las dimensiones se envían en cada consulta y no se guarda ningún dato en el servidor. Esto simplifica la solución y evita definir rutas de alta, baja o modificación que no son necesarias.

### Datos por query string

`base` y `altura` viajan como **query params** porque son parámetros de la consulta y no identifican a un recurso concreto. Los path params se reservarían para identificar un recurso existente (por ejemplo, `/rectangulos/:id`), lo cual no aplica en este caso.

### Validación

Un middleware reutilizable (`validarRectangulo`) valida los datos antes de llegar a las rutas. Verifica que `base` y `altura`:

1. Estén presentes.
2. Sean numéricos.
3. Sean mayores que 0.
4. No superen un máximo razonable (1.000.000).

Si alguna condición falla, se responde `400 Bad Request` con la lista de errores encontrados, de modo que el cliente sepa exactamente qué corregir.

### Manejo de errores

- `400 Bad Request`: parámetros faltantes o inválidos.
- `404 Not Found`: ruta inexistente.
- `500 Internal Server Error`: error inesperado del servidor.

Todas las respuestas de error se devuelven en formato JSON para mantener consistencia con las respuestas exitosas.

### Organización del código

La validación, la lógica de cálculo (`perimetro`, `superficie`, `esCuadrado`) y las rutas están separadas en funciones pequeñas y de una única responsabilidad. Esto facilita su lectura, su prueba y su reutilización en otros ejercicios.

### Pruebas

El archivo `rectangulos.http` contiene casos exitosos (rectángulo, cuadrado y valores decimales) y casos de error (parámetro faltante, valor no numérico, negativo, cero y ruta inexistente).
