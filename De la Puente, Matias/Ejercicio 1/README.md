

# Ejercicio 1 

Este proyecto es una API REST desarrollada con **Node.js** y **ExpressJS** que permite calcular el perímetro y la superficie de un rectángulo, identificando además si las dimensiones corresponden a un cuadrado.


## Fundamentación y Decisiones de Diseño

 **Modelo de datos:** Se utilizan dos propiedades básicas para definir la figura: `base` y `altura`.
 **Cálculos realizados:**
   **Perímetro:** $2 \times (\text{base} + \text{altura})$
   **Superficie:** $\text{base} \times \text{altura}$
   **Es Cuadrado:** Se determina comparando si la `base` es exactamente igual a la `altura`.
 **Recursos y Métodos HTTP:**
   `POST /api/rectangulos/calcular`: Es el endpoint principal. Se eligió el método `POST` para recibir los datos de entrada dentro del cuerpo (`body`) en formato JSON.
   `GET /api/rectangulos/calcular`: Se agregó como alternativa para permitir realizar consultas rápidas enviando los parámetros directamente en la URL (`query params`).
 **Validaciones:**
   Se comprueba que ambos valores estén presentes.
   Se verifica que los datos ingresados sean numéricos (`isNaN`).
   Se valida que tanto la base como la altura sean estrictamente mayores a cero ($> 0$), ya que no existen figuras geométricas con lados nulos o negativos.
