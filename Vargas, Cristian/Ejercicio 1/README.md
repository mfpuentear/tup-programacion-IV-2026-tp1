# Ejercicio 1 - Perímetros y Superficies de Rectángulos

## Enunciado

Desarrollar una API con ExpressJS para resolver consultas sobre perímetros y superficies de rectángulos. La solución deberá permitir distinguir, cuando corresponda, los casos que también constituyen cuadrados.

Definir y fundamentar las decisiones de diseño necesarias para modelar la información y exponer la funcionalidad requerida.

---

## Decisiones de Diseño y Fundamentación

1. **Nombre del Recurso (`/rectangulos`)**:
   - En el diseño de APIs RESTful, los recursos se representan preferentemente mediante sustantivos en plural. Dado que la entidad geométrica principal a analizar es el rectángulo (donde el cuadrado es un caso particular de rectángulo con lados iguales), se definió la ruta `/rectangulos`.

2. **Método HTTP (`GET`)**:
   - Se eligió el método `GET` debido a que la operación solicitada es una **consulta de solo lectura**. No se modifica ni se almacena ningún estado en el servidor (operación sin persistencia). Además, la operación es **segura** e **idempotente**, ya que consultar múltiples veces con los mismos valores de entrada siempre arroja el mismo resultado sin efectos colaterales.

3. **Paso de Parámetros por Query Strings (`?base=X&altura=Y`)**:
   - Como no se trata de un recurso persistido al que se acceda mediante un identificador de ruta (ej. `/rectangulos/:id`) ni de una creación que amerite un cuerpo en `POST`, los parámetros de dimensión corresponden conceptualmente a criterios de consulta. Por lo tanto, se reciben vía `req.query`.

4. **Identificación de Cuadrados (`esCuadrado`)**:
   - Geométricamente, un cuadrado es un caso especial de rectángulo cuyos cuatro lados son iguales (`base === altura`). En la respuesta JSON se incluye la propiedad booleana `esCuadrado`, permitiendo al cliente identificar si la figura evaluada es un cuadrado sin necesidad de crear un endpoint redundante o duplicado.

5. **Validación de Datos de Entrada**:
   - Se controla la presencia obligatoria de ambos parámetros (`base` y `altura`).
   - Se valida que sean valores convertibles a números (`!isNaN`).
   - Se valida que sean estrictamente mayores a 0, ya que no existen figuras geométricas planas reales con dimensiones nulas o negativas.
   - Si no se cumple alguna regla, la API responde con código `400 Bad Request` junto con un mensaje claro en formato JSON.

6. **Códigos de Estado Utilizados**:
   - `200 OK`: Cálculo realizado exitosamente.
   - `400 Bad Request`: Parámetros faltantes o inválidos.

---

## Ejecución y Pruebas

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Iniciar el servidor:
   ```bash
   npm start
   ```
3. Realizar consultas utilizando el archivo `ejercicio1.http` con la extensión REST Client de VS Code o mediante cualquier cliente HTTP (Postman, Thunder Client, curl, etc.).
