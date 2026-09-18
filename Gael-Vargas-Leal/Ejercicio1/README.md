Ejercicio 1 - API de Rectángulos y Cuadrados
## Decisiones de Diseño y Fundamentación (index.js)

- **Procesamiento en Memoria sin Persistencia:**  
  Las operaciones son transformaciones geométricas puras, por lo que no se requiere guardar datos en un arreglo ni en una base de datos. Cada petición se procesa en tiempo real de forma síncrona.

- **Modelado de Datos y Distinción Geométrica:**  
  La lógica evalúa la condición `h === w`. Con el resultado booleano se generan las propiedades `esCuadrado` (`true`/`false`) y `tipoFigura` (`"Cuadrado"`/`"Rectángulo"`), permitiendo diferenciar las figuras claramente.

- **Validación Centralizada (validarDimensiones):**  
  Valida la presencia de datos, fuerza la conversión numérica (`Number`), comprueba que sean valores finitos (`isFinite`) y exige que sean mayores a cero (> 0). Ante datos inválidos, devuelve un estado `HTTP 400 Bad Request`.

- **Soporte Dual de Métodos HTTP (POST y GET):**  
  - **`POST /api/rectangulos/calcular`:** Procesa datos enviados en el cuerpo (`req.body` en formato JSON).
  - **`GET /api/rectangulos/calcular`:** Procesa datos pasados en la URL a través de query parameters (`req.query`).



## Fundamentación de la Suite de Pruebas — Cliente (peticiones.http)

- **Verificación de Casos de Éxito:**  
  - **Rectángulo estándar (`POST`):** Comprueba el cálculo de área y perímetro con dimensiones distintas (`alto: 10`, `ancho: 5`).
  - **Detección de cuadrado (`POST`):** Confirma la regla de negocio que identifica cuadrados cuando `alto` y `ancho` son iguales (`6` y `6`).
  - **Consulta vía URL (`GET`):** Verifica el funcionamiento correcto con `query params` (`?alto=4&ancho=4`).

- **Control y Cobertura de Errores (Casos Borde):**  
  - **Dimensión negativa (`POST`):** Revisa que se invaliden valores incoherentes como `alto: -2` con error `400`.
  - **Atributo faltante (`POST`):** Evalúa la reacción del servidor cuando se omite un campo obligatorio (`ancho`).