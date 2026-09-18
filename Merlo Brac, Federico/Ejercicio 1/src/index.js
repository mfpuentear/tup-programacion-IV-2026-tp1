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

// Ruta raíz: si se abre en navegador responde HTML con enlaces; si es petición API devuelve JSON
app.get('/', (req, res) => {
  const esNavegador = req.headers.accept && req.headers.accept.includes('text/html') && !req.headers.accept.includes('application/json');
  if (esNavegador) {
    return res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Ejercicio 1 - Rectángulos y Cuadrados</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 30px; line-height: 1.6; background: #f8fafc; color: #1e293b; max-width: 800px; margin: 0 auto; }
          h1 { color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
          .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-top: 20px; }
          ul { list-style: none; padding: 0; }
          li { margin: 12px 0; }
          a { color: #2563eb; text-decoration: none; font-weight: 600; font-size: 16px; }
          a:hover { text-decoration: underline; color: #1d4ed8; }
          .desc { color: #64748b; font-size: 14px; margin-left: 8px; }
          .badge { background: #e0e7ff; color: #3730a3; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>Ejercicio 1: Rectángulos y Cuadrados <span class="badge">Puerto 3001</span></h1>
        <p><strong>Autor:</strong> Federico Merlo Brac | <strong>Estado:</strong> Activo</p>
        <div class="card">
          <h3>Enlaces para probar en el navegador:</h3>
          <ul>
            <li><a href="/rectangulos">/rectangulos</a> <span class="desc">&rarr; Ver todos los rectángulos precargados</span></li>
            <li><a href="/rectangulos?esCuadrado=true">/rectangulos?esCuadrado=true</a> <span class="desc">&rarr; Filtrar solo los que constituyen cuadrados</span></li>
            <li><a href="/rectangulos?esCuadrado=false">/rectangulos?esCuadrado=false</a> <span class="desc">&rarr; Filtrar solo rectángulos no cuadrados</span></li>
            <li><a href="/rectangulos/1">/rectangulos/1</a> <span class="desc">&rarr; Ver detalle de figura ID 1</span></li>
            <li><a href="/rectangulos/1/perimetro">/rectangulos/1/perimetro</a> <span class="desc">&rarr; Consultar perímetro de figura ID 1</span></li>
            <li><a href="/rectangulos/1/superficie">/rectangulos/1/superficie</a> <span class="desc">&rarr; Consultar superficie de figura ID 1</span></li>
            <li><a href="/rectangulos/calcular?base=8&altura=8">/rectangulos/calcular?base=8&altura=8</a> <span class="desc">&rarr; Cálculo directo sin persistir (cuadrado 8x8)</span></li>
          </ul>
        </div>
      </body>
      </html>
    `);
  }

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

// Inicio del servidor en puerto 3001 por defecto (o process.env.PORT si se especifica)
const PORT = process.env.PORT || 3001;
if (process.argv[1] && process.argv[1].endsWith('index.js')) {
  const server = app.listen(PORT, () => {
    console.log(`\n===============================================================`);
    console.log(`  Ejercicio 1 iniciado en: http://localhost:${PORT}`);
    console.log(`  Abre en tu navegador:    http://localhost:${PORT}`);
    console.log(`  Ver todos los rectángulos: http://localhost:${PORT}/rectangulos`);
    console.log(`===============================================================\n`);
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n [AVISO] El puerto ${PORT} está ocupado. Cerrá el proceso anterior con Ctrl+C.\n`);
    }
  });
}
