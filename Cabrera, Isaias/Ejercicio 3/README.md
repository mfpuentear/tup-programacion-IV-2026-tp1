# Ejercicio 3: Administración y Filtrado de Tareas

## Decisiones de Diseño y Modelado
1. **Estructura Interna:** Cada elemento almacena `{ nombre: string, completada: boolean }`.
2. **Diferenciación de Estados:** Se implementa un Query Parameter opcional (`/tareas?completada=true|false`), aplicando la técnica explicada en clase de trabajar sobre una copia del arreglo original (`[...tareas]`).
3. **Unicidad:** Se rechazan nombres repetidos en creación y modificación con código `409 Conflict`.