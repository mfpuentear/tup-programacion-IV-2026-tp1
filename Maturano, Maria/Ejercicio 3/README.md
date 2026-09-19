# Ejercicio 3

Desarrollar una API con ExpressJS para administrar tareas y su estado de avance.
Cada tarea deberá contar con un nombre y un estado que indique si fue
completada, y esta información se conservará en un arreglo interno.

No podrán existir tareas con el mismo nombre. La API deberá facilitar consultas
que permitan diferenciar las tareas completadas de las pendientes.

Definir y fundamentar las decisiones de diseño necesarias para modelar la
información y exponer la funcionalidad requerida.


## Decisiones de diseño

- **Identificador de la tarea:** se utiliza el `nombre` como identificador en la URL (`/tareas/:nombre`), en lugar de un id autogenerado, ya que el enunciado solo define nombre y estado, y el nombre ya debe ser único por restricción del propio enunciado.

- **Modificación del estado:** se agregó `PATCH /tareas/:nombre` para marcar una tarea como completada o pendiente. Esto no está explícito en el enunciado, pero es necesario para que la funcionalidad de "administrar tareas y su estado de avance" tenga sentido completo: sin este endpoint nunca sería posible cambiar el estado de una tarea ya creada.

- **Diferenciación entre completadas y pendientes:** se optó por un query param (`GET /tareas?completada=true|false`) en lugar de endpoints separados (`/tareas/completadas`, `/tareas/pendientes`), por ser la opción más simple que cumple con lo pedido ("facilitar consultas que permitan diferenciar"), sin duplicar lógica de filtrado en dos rutas distintas.

- **Eliminación de tareas:** no se incluyó un endpoint de borrado, ya que el enunciado no lo menciona y no es necesario para cumplir con la funcionalidad requerida (administrar tareas y diferenciar su estado).

- **Comparación de nombres duplicados:** se realiza de forma exacta (case-sensitive), siguiendo el comportamiento por defecto de JavaScript, dado que el enunciado no especifica que deba normalizarse.
