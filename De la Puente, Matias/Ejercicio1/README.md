# Ejercicio 1

## 📐 Ejercicio 1: Rectángulos y Cuadrados

### ¿Cómo lo pensé?
Para calcular el área y perímetro de un rectángulo necesito sí o sí dos datos: la base y la altura. 

### Decisiones que tomé:
- Distinguir si es cuadrado: Simplemente comparé si la base es igual a la altura (`base === altura`). Si son iguales, devuelvo que la figura es un "Cuadrado", de lo contrario un "Rectángulo".
- Métodos HTTP: 
  - Creé un endpoint por `POST` para mandar la base y la altura adentro del cuerpo (body) de la petición.
  - También dejé habilitado un endpoint por `GET` que lee los datos desde la URL (query params), por si alguien quiere hacer una consulta rápida desde el navegador.
- Validaciones: Compruebo que los datos ingresados sean números y que sean mayores a cero. No se puede calcular el perímetro de una figura con medidas negativas o de cero.