# Ejercicio 3

Desarrollar una API con ExpressJS para administrar tareas y su estado de avance.
Cada tarea deberá contar con un nombre y un estado que indique si fue
completada, y esta información se conservará en un arreglo interno.

No podrán existir tareas con el mismo nombre. La API deberá facilitar consultas
que permitan diferenciar las tareas completadas de las pendientes.

Definir y fundamentar las decisiones de diseño necesarias para modelar la
información y exponer la funcionalidad requerida.

## Decisiones de diseño

- **Recurso:** `/tareas`.
- **Persistencia:** arreglo en memoria. Cada ítem guarda `id`, `nombre` y
  `completada` (boolean).
- **Filtro de estado:** query `?completada=true` o `?completada=false` sobre
  `GET /tareas`, para separar hechas y pendientes sin inventar otro recurso.
- **Unicidad:** el nombre no se puede repetir al crear ni al modificar
  (sin distinguir mayúsculas). Conflicto → `409`.
- **Métodos HTTP:**
  - `GET /tareas` — listar (con filtro opcional por query)
  - `GET /tareas/:id` — consultar una
  - `POST /tareas` — crear (`nombre`, `completada` opcional; default `false`)
  - `PUT /tareas/:id` — reemplazar nombre y estado
  - `PATCH /tareas/:id` — actualizar parcialmente (ej. solo `completada`)
  - `DELETE /tareas/:id` — eliminar
- **Validaciones:** nombre no vacío; `completada` booleano; query solo
  `true`/`false`; `id` entero positivo.

## Cómo probar

```bash
npm start
```

Usar el archivo `tareas.http` (extensión REST Client).
