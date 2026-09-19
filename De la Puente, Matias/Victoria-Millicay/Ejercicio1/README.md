Fundamentación de Diseño - index.js
Uso de Módulos ES (import express from 'express'): Se adoptó el estándar moderno de JavaScript para la importación de módulos, aportando mayor legibilidad y consistencia con el desarrollo backend actual.
Diseño del Endpoint por Parámetros de Consulta (req.query): Se estructuró la ruta como /api/rectangulos/calcular utilizando parámetros de consulta (?base=...&altura=...). Esto permite explicitar las variables mediante claves, facilitando la escalabilidad ante futuras incorporaciones de filtros y cumpliendo con operaciones sin estado (stateless).
Validación Robusta y Temprana (Early Return): Se implementó una doble validación secuencial: primero se verifica la existencia de los parámetros para evitar errores de tipo undefined, y luego se comprueba mediante isNaN() y operadores de rango (> 0) que sean valores numéricos reales y positivos. Ante anomalías, responde de inmediato con un código HTTP 400 (Bad Request).
Cálculo Dinámico de Datos Derivados (Cuadrados): La condición para determinar si la figura es un cuadrado no se almacena estáticamente, sino que se evalúa de forma dinámica en tiempo de ejecución mediante la expresión baseNum === alturaNum, asegurando la integridad matemática de la respuesta en formato JSON (res.json).

Fundamentación de Diseño - peticiones.http
Uso del Formato .http (Extensión REST Client): Se decidió incluir este archivo directamente en el directorio del ejercicio tal como exigía la cátedra, permitiendo documentar y ejecutar peticiones HTTP interactivas desde el propio entorno de desarrollo (VS Code).
Diversidad de Casos de Prueba (Testing de Casos de Éxito y Error):
Se contempló una petición para un rectángulo estándar (lados diferentes) para verificar el cálculo correcto de superficie y perímetro.
Se incluyó una petición para el caso especial del cuadrado (base y altura iguales), validando el atributo booleano y la descripción de la figura.
Se incorporaron intencionalmente casos de prueba de error (parámetros faltantes, valores negativos o ceros, y letras) para constatar que la API intercepte correctamente las fallas y devuelva el código HTTP 400 con su respectivo mensaje descriptivo.