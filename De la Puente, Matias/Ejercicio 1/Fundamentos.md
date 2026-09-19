# Fundamentos de desiciones tomadas

## Ruta GET

Esta API funciona básicamente como una calculadora. Le damos dos números y nos devuelve un resultado. Como no estamos guardando datos en una base de datos, ni borrando, ni modificando nada, lo correcto es usar GET.

## Enviamos los datos por la URL

En lugar de mandar la base y la altura en el cuerpo de la petición (el req.body) lo enviamos a traves de la URL. Porque si usamos GET los datos extras deben viajar por la URL.

## Validación de datos

* Usamos parseFloat en vez de parseInt por si alguien quiere calcular un  rectángulo con decimales (ejemplo: 5.5).

* Revisamos que los números sean mayores a cero.

* Si el usuario manda letras o números negativos, le devolvemos un Error 400. Ese error significa: "Te equivocaste al escribir los datos, arreglalos y volvé a intentar".

## El problema del Cuadrado

Matemáticamente, un cuadrado es simplemente un rectángulo que tiene sus lados iguales. Entonces, decidí no crear una ruta nueva para el cuadrado. Usamos la misma ruta del rectángulo, y con un simple `if`nos fijamos si la base es igual a la altura. Si lo son, el sistema automáticamente se da cuenta y le avisa al usuario que su figura es un cuadrado.

## Respuesta a través de JSON

En el res.json decidí dividir la respuesta en dos partes: datosIngresados y resultados. Hice esto para que la persona que use esta API vea claramente qué números nos mandó (por si se equivocó) y vea las respuestas separadas de forma prolija.
