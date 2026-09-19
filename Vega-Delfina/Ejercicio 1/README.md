# Ejercicio 1 - Perimetros y superficies de rectangulos

Metodos HTTP: Utilice GET ya que es solo una operacion de consulta sin efectos secundarios (no crea, modifica ni borra nada) y ademas es un metodo idempotente.

Recursos y parametros: la ruta /rectangulos recibe los valores de 'base' y 'altura' como query params ya que son valores utilizados como parámetros de consulta para realizar el cálculo.

Validaciones: base y altura deben estar presentes ya que si no lo estan se imposibilita hacer el calculo y se considera una peticion invalida, incompleta.

Los valores ingresados deben ser numericos y mayores a '0' para poder realizar las operaciones, en el caso de ingresar un tipo de texto o valor menor a 0, no seria valido.

Si 'base === altura', se informa `esCuadrado: true' indicando que el rectangulo es un cuadrado. De esta manera quien consume la API no necesita realizar el calculo por su cuenta.

En cualquier caso invalido, la API responde '400 Bad Request' con un mensaje descriptivo, en vez de devolver un cálculo incorrecto.
