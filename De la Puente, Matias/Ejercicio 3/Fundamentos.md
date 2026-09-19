# Fundamentos de Diseño Ejercicio 3


## 1. Filtrado de datos usando la UR

Para consultar las tareas (`GET /tareas`), se programó la ruta para que pueda recibir una palabra clave en la URL (por ejemplo: `?estado=completadas` o `?estado=pendientes`). 
* Para no tener que crear tres rutas distintas (una para todas, otra para las completadas y otra para las pendientes). Con una sola ruta que lee la URL, el sistema filtra la lista inteligentemente. Si el usuario no envía ningún estado, el código pasa de largo los `if` y simplemente le devuelve la lista completa por defecto.

## 2. Limpieza de texto para evitar errores
En la ruta para crear tareas (`POST`), antes de guardar el nombre se utiliza el método `.trim()`. 
* A veces los usuarios escriben espacios en blanco por accidente al principio o al final (ejemplo: `"  Comprar pan "`). El `.trim()` borra esos espacios invisibles. Esto evita que el sistema guarde tareas que parezcan vacías o que permita duplicados solo porque uno tenía un espacio de más.

## 3. Prevención de tareas repetidas
Antes de crear una tarea nueva (`POST`), la API busca si ya existe una con el mismo nombre convirtiendo ambas palabras a minúsculas con `.toLowerCase()`.
*  Para mantener la lista limpia y sin confusiones. El sistema entiende que "Estudiar", "ESTUDIAR" y "estudiar" son la misma tarea y bloquea su creación devolviendo un error.

## 4. Valores por defecto
Cuando un usuario envía una nueva tarea a la ruta `POST`, solo se le exige que mande el `nombre`. El sistema se encarga de agregarle internamente el valor `completada: false`.
*  Es una decisión de lógica de negocio pura: nadie anota en una lista una tarea que ya está terminada. Al obligar a que toda tarea nazca como "pendiente" (`false`), le facilitamos el trabajo al usuario porque tiene que enviar menos datos en su petición.

## 5. Actualización estricta y directa
En la ruta para modificar (`PUT`), se exige que el dato que llegue sea estrictamente un valor booleano (`true` o `false`) usando `typeof completada !== 'boolean'`. Además, se utiliza `.find()` para ubicar la tarea y modificarla directamente.
*  La validación estricta evita que el usuario rompa la lista enviando textos como `"sí"` o números como `1` en lugar de un booleano real. Por otro lado, al usar `.find()`, JavaScript nos permite modificar esa tarea directamente en la memoria (`tarea.completada = completada`), lo cual actualiza automáticamente el arreglo principal sin necesidad de escribir código extra.