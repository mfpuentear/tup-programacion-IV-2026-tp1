# Ejercicio 1 - API de rectangulos
Se desarrollo una API con ExpressJS para calcular perimetro y superficie de rectangulos  
La solucion distingue los casos que también constituyen cuadrados.

 decisiones de diseño: 
Se utiliza el metodo POST porque el enunciado solo requiere resolver consultas enviando datos en el body.

se implementaron validaciones para:
que se envien ambos parametros (base y altura).
que los valores sean numericos.
que los valores sean mayores a 0.
 se agrego una validacion para determinar si la figura es rectangulo o cuadrado.

 configuracion del proyecto
Se modifico el "package.json" agregando "type": "module".
 Se agrego el script "dev" para poder iniciar el servidor con npm run dev
