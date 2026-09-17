# Ejercicio 3 - Administración de Tareas y su Estado de Avance

## Enunciado

Desarrollar una API con ExpressJS para administrar tareas y su estado de avance. Cada tarea deberá contar con un nombre y un estado que indique si fue completada, y esta información se conservará en un arreglo interno.

No podrán existir tareas con el mismo nombre. La API deberá facilitar consultas que permitan diferenciar las tareas completadas de las pendientes.

Definir y fundamentar las decisiones de diseño necesarias para modelar la información y exponer la funcionalidad requerida.

---

## Decisiones de Diseño y Fundamentación

1. **Modelado del Recurso (`/tareas`)**:
   - Se utiliza el sustantivo en plural `/tareas` para representar la colección.
   - Dado que la consigna estipula que *"no podrán existir tareas con el mismo nombre"*, el nombre de la tarea actúa como identificador único y clave de búsqueda natural en las rutas individuales: `/tareas/:nombre`.

2. **Estructura del Arreglo Interno**:
   - Se almacena un arreglo en memoria con objetos que contienen los campos solicitados:
     ```json
     {
       "nombre": "Estudiar para el parcial",
       "completada": false
     }
     ```
   - Al crear una tarea (`POST`), si el cliente omite el campo `completada`, el servidor le asigna por defecto `false` (pendiente), reflejando el flujo de vida habitual de una tarea nueva.

3. **Estrategia de Filtrado (Completadas vs. Pendientes)**:
   - Siguiendo las mejores prácticas de diseño RESTful, para filtrar una colección sobre un mismo recurso se emplean **Query Parameters** sobre el método `GET`, en lugar de crear rutas artificiales (como `/tareas/completadas`).
   - Se implementa:
     - `GET /tareas?completada=true`: retorna únicamente las tareas finalizadas.
     - `GET /tareas?completada=false`: retorna únicamente las tareas pendientes.
   - Adicionalmente, por usabilidad y comodidad, se permite el uso del parámetro `?estado=completada` o `?estado=pendiente`.
   - Si no se especifica ningún filtro, la API responde con la totalidad de las tareas.

4. **Operaciones y Métodos HTTP**:
   - `GET /tareas`: Obtiene el listado completo o filtrado.
   - `GET /tareas/:nombre`: Consulta una tarea individual.
   - `POST /tareas`: Registra una nueva tarea.
   - `PUT /tareas/:nombre`: Reemplaza o actualiza el nombre y/o estado de una tarea existente.
   - `PATCH /tareas/:nombre`: Permite una actualización parcial semántica para cambiar únicamente el estado booleano de `completada`.
   - `DELETE /tareas/:nombre`: Elimina una tarea por su nombre.

5. **Regla de Unicidad y Validaciones**:
   - Al crear (`POST`) o actualizar (`PUT`), se controla que no exista otra tarea con el mismo nombre (mediante comparación insensible a mayúsculas y espacios sobrantes). En caso de conflicto, se emite un error `409 Conflict`.
   - Se verifica que el nombre no sea vacío ni de tipo incorrecto (`400 Bad Request`).
   - Se valida que `completada` sea estrictamente de tipo booleano (`true` o `false`).

6. **Códigos de Estado HTTP Utilizados**:
   - `200 OK`: Operación de lectura, actualización o eliminación realizada con éxito.
   - `201 Created`: Tarea creada exitosamente.
   - `400 Bad Request`: Parámetros o cuerpo de la petición con formato inválido.
   - `404 Not Found`: Tarea no encontrada en el sistema.
   - `409 Conflict`: Intento de duplicación de nombre de tarea.

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
3. Ejecutar las pruebas provistas en el archivo `ejercicio3.http`.
