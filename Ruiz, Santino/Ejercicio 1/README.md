# Ejercicio N°1 geometría de rectángulos 

## Fundamentación de diseños y decisiones de la API
* **Selección de Método `POST`:** Se utilizó `POST` en `/rectangulos/calcular` para poder enviar los parámetros `ancho` y `alto` dentro del cuerpo de la petición (`req.body`) en formato JSON. Esto permite recibir tipos de datos numéricos nativos y realizar validaciones estrictas.
* **Modelo sin Estado (Stateless):** No se utiliza almacenamiento en memoria ya que la consulta es una operación pura de cálculo que no requiere persistencia.