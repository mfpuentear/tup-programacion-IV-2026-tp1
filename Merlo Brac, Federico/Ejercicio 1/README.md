# Ejercicio 1 - API de Rectángulos y Cuadrados

Desarrollar una API con ExpressJS para resolver consultas sobre perímetros y
superficies de rectángulos. La solución deberá permitir distinguir, cuando
corresponda, los casos que también constituyen cuadrados.

Definir y fundamentar las decisiones de diseño necesarias para modelar la
información y exponer la funcionalidad requerida.

---

## Decisiones de Diseño y Fundamentación

### 1. Modelado de la Información y Geometría
- **Entidad única `Rectangulo`:** En geometría euclidiana, un cuadrado es un caso especial de rectángulo (un paralelogramo equiángulo cuyos lados contiguos son iguales). Por lo tanto, no se modelan entidades separadas; se define una única clase `Rectangulo` caracterizada por `base` y `altura`.
- **Datos primitivos almacenados:** Únicamente se conservan en memoria los atributos elementales: `id`, `base`, `altura` y `nombre`.
- **Datos derivados dinámicos:** El `perimetro` ($2 \cdot (base + altura)$), la `superficie` ($base \cdot altura$) y la propiedad booleana `esCuadrado` ($base === altura$) son datos calculados mediante getters en tiempo de ejecución. Esto garantiza la consistencia de datos evitando desincronizaciones si se modifican las dimensiones vía `PUT`.

### 2. Exposición de la Funcionalidad y Diseño REST
- **Recurso principal:** `/rectangulos`.
- **Diferenciación de cuadrados:** Se implementó mediante el query parameter canónico `GET /rectangulos?esCuadrado=true|false`.
- **Subrecursos de proyección:** `GET /rectangulos/:id/perimetro` y `GET /rectangulos/:id/superficie` para consultar exclusivamente los cálculos correspondientes.
- **Cálculo directo sin persistencia:** `GET /rectangulos/calcular?base=X&altura=Y` para clientes que solo requieran resolver cálculos inmediatos sin persistir una figura.
- **Códigos de Estado HTTP:**
  - `200 OK`: Consultas, modificaciones y eliminaciones exitosas.
  - `201 Created`: Creación de un nuevo rectángulo/cuadrado.
  - `400 Bad Request`: Datos de entrada inválidos (valores menores o iguales a cero, tipos no numéricos o parámetros incorrectos).
  - `404 Not Found`: Identificador inexistente.

### 3. Validación de Entrada
- Se comprueba en `params`, `query` y `body` que las dimensiones sean números reales finitos estrictamente mayores a 0 ($> 0$).

---

## Ejecución y Pruebas

1. Instalar dependencias e iniciar:
   ```bash
   cd "Merlo Brac, Federico/Ejercicio 1"
   npm install
   npm start
   ```

2. Pruebas automáticas:
   ```bash
   npm test
   ```

3. Pruebas interactivas:
   Utilizar el archivo [`ejercicio1.http`](./ejercicio1.http) con la extensión REST Client de VS Code.
