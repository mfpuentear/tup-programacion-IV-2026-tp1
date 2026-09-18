# Ejercicio 1 - Rectangulos

API con ExpressJS para consultar el perimetro y la superficie de un rectangulo,
distinguiendo los casos en que la figura es tambien un cuadrado.

## Como levantarlo

```
npm install
npm start
```

Queda escuchando en `http://localhost:3001`. Las pruebas estan en `rectangulos.http`
(se ejecutan con la extension REST Client de VS Code).

## Decisiones de diseno

### Recurso y modelado

El recurso es **`rectangulos`**. Un rectangulo queda definido por su base y su
altura, asi que esas dos medidas alcanzan para identificarlo y van en la ruta
como parametros: `/api/rectangulos/:base/:altura`.

No se usa query string porque base y altura no son un filtro sobre una coleccion,
son lo que identifica a la figura que se consulta.

El cuadrado no se modela como un recurso aparte. Un cuadrado es un rectangulo con
base y altura iguales, de modo que crear `/api/cuadrados` duplicaria la misma
logica. En su lugar la respuesta informa `tipo` y `esCuadrado`, y cuando la figura
es un cuadrado agrega el campo `lado`.

### Metodos HTTP

Solo se usa **GET**. La API no guarda nada: resuelve un calculo a partir de los
datos recibidos y devuelve el resultado. No hay estado que crear, modificar ni
borrar, por lo que POST, PUT o DELETE no tendrian sentido aca.

Por el mismo motivo tampoco se monta `express.json()`: ninguna ruta recibe cuerpo.

### Endpoints

| Metodo | Ruta                                       | Devuelve                               |
|--------|--------------------------------------------|----------------------------------------|
| GET    | `/api/rectangulos/:base/:altura`           | La figura completa con ambos calculos  |
| GET    | `/api/rectangulos/:base/:altura/perimetro` | Solo el perimetro                      |
| GET    | `/api/rectangulos/:base/:altura/superficie`| Solo la superficie                     |

Se agregaron las dos subrutas porque el enunciado habla de consultas sobre
perimetros **y** superficies: quien necesita un solo dato no tiene por que pedir
los dos.

Ejemplo de respuesta de `/api/rectangulos/5/5`:

```json
{
  "base": 5,
  "altura": 5,
  "tipo": "cuadrado",
  "esCuadrado": true,
  "perimetro": 20,
  "superficie": 25,
  "lado": 5
}
```

### Validaciones

La validacion vive en un middleware (`middlewares/validarDimensiones.js`) y no
dentro de cada ruta, para no repetir el mismo control tres veces. Se rechaza con
**400** cuando:

- alguna medida no es un numero (`/api/rectangulos/abc/7`);
- alguna medida es menor o igual a 0, porque un lado de longitud cero o negativa
  no define una figura;
- alguna medida supera 1.000.000, un tope puesto para evitar valores absurdos.

Los errores se acumulan en un arreglo `detalles` en vez de cortar en el primero,
asi el cliente ve de una todo lo que esta mal.

Si la ruta no existe se responde **404** con un JSON, para que la API nunca
devuelva el HTML de error por defecto de Express.

### Precision de los decimales

Las operaciones con decimales arrastran el error del punto flotante: `2 * (1.1 + 2.2)`
da `6.6000000000000005`. Los resultados se redondean a 4 decimales para devolver
un valor legible sin perder precision util.
