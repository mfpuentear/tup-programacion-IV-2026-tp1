# Ejercicio 1

## Descripcion del ejercicio

Se desarrollo una API con ExpressJS para resolver consultas sobre rectangulos. La API permite calcular la superficie y el perimetro de un rectangulo a partir de dos medidas ingresadas por el usuario: base y altura.

Ademas, la API permite distinguir cuando las medidas ingresadas corresponden a un cuadrado. Esto ocurre cuando la base y la altura tienen el mismo valor.

## Recurso modelado

El recurso elegido es rectangulos.

Se eligio este nombre porque el problema planteado trabaja con figuras rectangulares y solicita calcular datos relacionados con ellas, como superficie y perimetro.

Tambien se tiene en cuenta que un cuadrado es un caso particular de rectangulo. Por ese motivo no se crea un recurso separado llamado cuadrados, sino que se informa en la respuesta si el rectangulo consultado tambien cumple la condicion de ser cuadrado.

## Ruta definida

La ruta definida para resolver el ejercicio es:

GET /api/rectangulos/calculo

Se utiliza el prefijo /api para indicar que la ruta pertenece a una API.

Se utiliza rectangulos como nombre del recurso porque representa la figura sobre la que se realiza la consulta.

Se utiliza calculo porque la API no consulta un rectangulo almacenado en una base de datos, sino que realiza un calculo matematico con los valores recibidos.

## Metodo HTTP utilizado

El metodo HTTP utilizado es GET.

Se utiliza GET porque la operacion es una consulta. El cliente envia las medidas del rectangulo y el servidor responde con los resultados calculados.

La API no guarda informacion, no crea un nuevo rectangulo, no modifica datos existentes y no elimina ningun recurso. Por eso, GET es el metodo mas adecuado para este caso.

Ejemplo:

GET /api/rectangulos/calculo?base=10&altura=5

## Justificacion de metodos HTTP no utilizados

No se utiliza POST porque este metodo se usa normalmente cuando se necesita crear un nuevo recurso en el servidor. En este ejercicio no se guarda un rectangulo en memoria, archivo o base de datos. Solamente se reciben dos valores, se realiza un calculo y se devuelve una respuesta.

No se utiliza PUT porque este metodo se usa normalmente para reemplazar completamente un recurso existente. En esta API no existe un rectangulo guardado que pueda ser reemplazado. Cada consulta es independiente y no modifica ningun dato previo.

No se utiliza PATCH porque este metodo se usa normalmente para modificar parcialmente un recurso existente. Como la API no almacena rectangulos, no hay ningun dato previo que pueda modificarse parcialmente.

No se utiliza DELETE porque este metodo se usa para eliminar recursos existentes. En este ejercicio no se crean ni se almacenan rectangulos, por lo tanto no existe ningun recurso que pueda eliminarse.

## Parametros de entrada

Los valores se reciben mediante query params:

- base
- altura

Se eligieron query params porque la operacion es una consulta mediante GET y los datos necesarios son simples: dos valores numericos.

Ejemplo:

GET /api/rectangulos/calculo?base=10&altura=5

## Justificacion de los nombres de parametros

Se utiliza el nombre base porque representa uno de los lados del rectangulo. Es un nombre claro, corto y relacionado directamente con la formula de superficie.

Se utiliza el nombre altura porque representa el otro lado del rectangulo. Junto con base, permite calcular tanto la superficie como el perimetro.

Se eligieron base y altura en lugar de otros nombres como x, y, a o b, porque esos nombres son menos descriptivos y pueden generar confusion.

## Validaciones realizadas

La API valida los valores recibidos antes de realizar el calculo.

Se valida que base y altura hayan sido enviadas. Si falta alguno de los dos valores, no se puede calcular correctamente la superficie ni el perimetro.

Se valida que base y altura sean numeros validos. No se aceptan textos, palabras ni valores que no puedan convertirse correctamente a numero.

Se valida que los valores sean finitos. Esto evita trabajar con valores no representables correctamente como numeros comunes.

Se valida que base y altura sean mayores a cero. No se aceptan valores negativos ni cero, porque una figura geometrica no puede tener una medida negativa o una medida igual a cero para calcular una superficie valida.

Se valida que base y altura no superen el valor 100000. Se define este limite para evitar valores excesivamente grandes para el contexto del ejercicio y mantener las consultas dentro de un rango razonable.

## Calculos realizados

La superficie se calcula multiplicando la base por la altura:

superficie = base * altura

El perimetro se calcula sumando la base y la altura, y multiplicando el resultado por dos:

perimetro = 2 * (base + altura)

La figura se considera cuadrado cuando la base y la altura tienen el mismo valor:

esCuadrado = base === altura

## Respuesta exitosa

Ejemplo de consulta:

GET /api/rectangulos/calculo?base=10&altura=5

Respuesta esperada:

{
  "figura": "rectangulo",
  "medidas": {
    "base": 10,
    "altura": 5
  },
  "resultados": {
    "superficie": 50,
    "perimetro": 30
  },
  "esCuadrado": false
}

## Respuesta cuando la figura es un cuadrado

Ejemplo de consulta:

GET /api/rectangulos/calculo?base=6&altura=6

Respuesta esperada:

{
  "figura": "cuadrado",
  "medidas": {
    "base": 6,
    "altura": 6
  },
  "resultados": {
    "superficie": 36,
    "perimetro": 24
  },
  "esCuadrado": true
}

## Respuestas con error

Cuando los parametros no cumplen con las validaciones, la API responde con estado HTTP 400 Bad Request.

Se utiliza 400 porque el error se produce por datos incorrectos enviados por el cliente.

Ejemplo de respuesta:

{
  "error": "La base y la altura deben ser mayores a cero."
}

## Archivo de pruebas HTTP

Se agrega el archivo peticiones.http.

Este archivo permite probar la API desde Visual Studio Code utilizando la extension REST Client.

Las pruebas incluidas verifican:

- Consulta correcta de un rectangulo comun.
- Consulta correcta de un cuadrado.
- Error cuando falta base.
- Error cuando falta altura.
- Error cuando se envia un valor negativo.
- Error cuando se envia cero.
- Error cuando se envia texto en lugar de un numero.
- Error cuando se envia un valor mayor al limite permitido.

## Ejecucion del proyecto

Para instalar las dependencias:

npm install

Para iniciar el servidor:

npm start

El servidor se ejecuta en:

http://localhost:3000