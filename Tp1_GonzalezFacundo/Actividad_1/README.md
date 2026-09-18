# TP 1 - API de Rectángulos

Primera actividad. Armé una API con ExpressJS que recibe la base y la altura de un rectángulo, calcula el perímetro y la superficie, y además se asegura de si la figura es un cuadrado.

## Decisiones de Diseño

Para armar la API me base en lo que pedía el ejercicio:

### 1. Uso del método GET
Elegí usar el verbo HTTP `GET` para el endpoint porque la API solamente hace una consulta matemática. Como no estoy guardando, modificando ni borrando ningún dato en un servidor o base de datos, `GET` es el método correcto para esto.

### 2. Parámetros por URL (Query Strings)
Para pasarle los datos de la base y la altura a la API, decidí usar *query parameters* (por ejemplo: `?base=4&altura=6`). Como estoy usando un método GET y son solo dos números simples, me pareció la forma más estándar y sencilla de mandarlos, en lugar de complicarla usando el *body* de la petición.

### 3. Un solo endpoint para todo
En vez de hacer rutas separadas (como una para el perímetro y otra para la superficie), preferí hacer un único endpoint que devuelva todo junto. Así, con una sola petición, el usuario ya recibe todos los cálculos de una. Además, armé el JSON de respuesta para que también devuelva la base y la altura que se ingresaron, así queda claro con qué números se hizo la cuenta.

### 4. Validaciones de errores
Le agregué una serie de `if` al principio del código para atajar los errores más comunes. Si el usuario no manda los parámetros, manda letras en vez de números, o pone números negativos/cero, la API devuelve un error `400 Bad Request`. Hice esto para que el programa no intente hacer cálculos imposibles y le avise al usuario exactamente qué hizo mal.

## Pruebas

En la carpeta del proyecto dejé un archivo llamado `rectangulos.http`. Ahí están guardadas las peticiones que usé para probar la API, incluyendo casos donde todo funciona bien y casos donde a propósito mandé datos erroneos para comprobar que las validaciones estén andando correctamente.