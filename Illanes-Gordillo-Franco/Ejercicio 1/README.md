# Ejercicio 1

## Decisiones tomadas

* **Metodo GET:** lo uso para la ruta /api/rectangulos porque es solo para consultar un calculo, no guardo ni modifico nada en el servidor.
* **Parametros por Query:** como es un get, los datos de base y altura los paso por la url (?base=10&altura=5) y no por el body.
* **Validaciones:** me fijo que lleguen los datos, que sean numeros y mayores a 0. si mandan letras o negativos tira un error 400 bad request.
* **Cuadrados:** puse un if para ver si base y altura miden lo mismo, si es asi devuelve esCuadrado: true.