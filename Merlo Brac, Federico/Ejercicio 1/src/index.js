import express from 'express';

export const app = express();
app.use(express.json());

// ==========================================
// ARREGLO INTERNO CON DATOS INICIALES
// ==========================================
// El arreglo interno conserva las dimensiones primitivas de cada figura.
// Los datos derivados (perímetro, superficie y esCuadrado) se calculan dinámicamente.
let proximoId = 1;
const rectangulos = [
  { id: proximoId++, base: 10, altura: 5, nombre: 'Rectángulo Estándar' },
  { id: proximoId++, base: 6, altura: 6, nombre: 'Cuadrado Modelo' },
  { id: proximoId++, base: 14, altura: 8, nombre: 'Rectángulo Mediano' },
  { id: proximoId++, base: 4, altura: 4, nombre: 'Cuadrado Pequeño' }
];

// Función auxiliar para calcular perímetro, superficie y determinar si es cuadrado
function enriquecerFigura(figura) {
  const base = Number(figura.base);
  const altura = Number(figura.altura);
  const esCuadrado = base === altura;

  return {
    id: figura.id,
    nombre: figura.nombre || (esCuadrado ? 'Cuadrado' : 'Rectángulo'),
    base,
    altura,
    perimetro: 2 * (base + altura),
    superficie: base * altura,
    esCuadrado,
    tipo: esCuadrado ? 'cuadrado' : 'rectangulo'
  };
}

// ==========================================
// RUTAS DE LA API
// ==========================================

// Ruta raíz informativa con enlaces directos para el navegador
app.get('/', (req, res) => {
  res.json({
    mensaje: 'API de Rectángulos y Cuadrados - Ejercicio 1 (TP1)',
    autor: 'Federico Merlo Brac',
    consigna: 'Cálculo de perímetros y superficies, identificando cuadrados cuando corresponda.',
    recursos: {
      todos: '/rectangulos',
      soloCuadrados: '/rectangulos?esCuadrado=true',
      soloRectangulos: '/rectangulos?esCuadrado=false',
      porId: '/rectangulos/1',
      perimetro: '/rectangulos/1/perimetro',
      superficie: '/rectangulos/1/superficie',
      calculoDirecto: '/rectangulos/calcular?base=10&altura=10'
    },
    totalFigurasPrecargadas: rectangulos.length
  });
});

// GET /rectangulos/calcular: Cálculo directo sin guardar en el arreglo
app.get('/rectangulos/calcular', (req, res) => {
  const { base, altura } = req.query;

  if (base === undefined || altura === undefined) {
    return res.status(400).json({ error: 'Debes enviar los parámetros query base y altura (ej: ?base=5&altura=5).' });
  }

  const numBase = Number(base);
  const numAltura = Number(altura);

  if (isNaN(numBase) || isNaN(numAltura) || numBase <= 0 || numAltura <= 0) {
    return res.status(400).json({ error: 'La base y la altura deben ser números positivos mayores a cero.' });
  }

  const resultado = enriquecerFigura({ id: null, base: numBase, altura: numAltura, nombre: 'Cálculo al vuelo' });
  delete resultado.id;
  res.json(resultado);
});

// GET /rectangulos: Listar todas las figuras (soporta ?esCuadrado=true|false)
app.get('/rectangulos', (req, res) => {
  const { esCuadrado } = req.query;

  let lista = rectangulos.map(enriquecerFigura);

  if (esCuadrado !== undefined) {
    const filtrarCuadrados = esCuadrado === 'true' || esCuadrado === '1';
    lista = lista.filter((r) => r.esCuadrado === filtrarCuadrados);
  }

  res.json(lista);
});

// GET /rectangulos/:id: Obtener figura por ID
app.get('/rectangulos/:id', (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'El ID debe ser un número entero positivo.' });
  }

  const figura = rectangulos.find((r) => r.id === id);
  if (!figura) {
    return res.status(404).json({ error: 'Rectángulo no encontrado.' });
  }

  res.json(enriquecerFigura(figura));
});

// GET /rectangulos/:id/perimetro: Obtener solo el perímetro calculado
app.get('/rectangulos/:id/perimetro', (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'El ID debe ser un número entero positivo.' });
  }

  const figura = rectangulos.find((r) => r.id === id);
  if (!figura) {
    return res.status(404).json({ error: 'Rectángulo no encontrado.' });
  }

  const enr = enriquecerFigura(figura);
  res.json({ id: enr.id, nombre: enr.nombre, perimetro: enr.perimetro, formula: '2 * (base + altura)' });
});

// GET /rectangulos/:id/superficie: Obtener solo la superficie calculada
app.get('/rectangulos/:id/superficie', (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'El ID debe ser un número entero positivo.' });
  }

  const figura = rectangulos.find((r) => r.id === id);
  if (!figura) {
    return res.status(404).json({ error: 'Rectángulo no encontrado.' });
  }

  const enr = enriquecerFigura(figura);
  res.json({ id: enr.id, nombre: enr.nombre, superficie: enr.superficie, formula: 'base * altura' });
});

// POST /rectangulos: Crear una nueva figura
app.post('/rectangulos', (req, res) => {
  const { base, altura, nombre } = req.body;

  if (base === undefined || altura === undefined) {
    return res.status(400).json({ error: 'Los campos base y altura son obligatorios.' });
  }

  const numBase = Number(base);
  const numAltura = Number(altura);

  if (isNaN(numBase) || isNaN(numAltura) || numBase <= 0 || numAltura <= 0) {
    return res.status(400).json({ error: 'Base y altura deben ser números positivos mayores a 0.' });
  }

  const nuevo = {
    id: proximoId++,
    base: numBase,
    altura: numAltura,
    nombre: typeof nombre === 'string' && nombre.trim() ? nombre.trim() : (numBase === numAltura ? 'Cuadrado' : 'Rectángulo')
  };

  rectangulos.push(nuevo);
  res.status(201).json(enriquecerFigura(nuevo));
});

// PUT /rectangulos/:id: Modificar una figura existente
app.put('/rectangulos/:id', (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'El ID debe ser un número entero positivo.' });
  }

  const figura = rectangulos.find((r) => r.id === id);
  if (!figura) {
    return res.status(404).json({ error: 'Rectángulo no encontrado.' });
  }

  const { base, altura, nombre } = req.body;

  if (base !== undefined) {
    const numBase = Number(base);
    if (isNaN(numBase) || numBase <= 0) {
      return res.status(400).json({ error: 'La base debe ser un número positivo mayor a 0.' });
    }
    figura.base = numBase;
  }

  if (altura !== undefined) {
    const numAltura = Number(altura);
    if (isNaN(numAltura) || numAltura <= 0) {
      return res.status(400).json({ error: 'La altura debe ser un número positivo mayor a 0.' });
    }
    figura.altura = numAltura;
  }

  if (nombre !== undefined && typeof nombre === 'string') {
    figura.nombre = nombre.trim();
  }

  res.json(enriquecerFigura(figura));
});

// DELETE /rectangulos/:id: Eliminar una figura
app.delete('/rectangulos/:id', (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'El ID debe ser un número entero positivo.' });
  }

  const index = rectangulos.findIndex((r) => r.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Rectángulo no encontrado.' });
  }

  const [eliminado] = rectangulos.splice(index, 1);
  res.json({
    mensaje: 'Figura eliminada correctamente.',
    figura: enriquecerFigura(eliminado)
  });
});

// Manejo de rutas inexistentes (404)
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    mensaje: `No existe la ruta ${req.method} ${req.originalUrl}`
  });
});

// Manejo de errores de formato JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'JSON mal formado en el cuerpo de la petición.' });
  }
  res.status(500).json({ error: 'Error interno del servidor.' });
});

// Inicio del servidor (solo si se ejecuta directamente este archivo)
const PORT = process.env.PORT || 3000;
if (process.argv[1] && process.argv[1].endsWith('index.js')) {
  app.listen(PORT, () => {
    console.log(`\n Servidor de Ejercicio 1 iniciado en: http://localhost:${PORT}`);
    console.log(` Consulta la lista en: http://localhost:${PORT}/rectangulos`);
    console.log(` Consulta cálculo al vuelo en: http://localhost:${PORT}/rectangulos/calcular?base=5&altura=5\n`);
  });
}
