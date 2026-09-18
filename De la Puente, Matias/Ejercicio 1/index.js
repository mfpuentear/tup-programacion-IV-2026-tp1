const express = require('express');
const app = express();
const port = 3000;

// Permite que Express entienda el formato JSON en el Body
app.use(express.json());

// Arreglo en memoria para simular una base de datos
let rectangulos = [];
let nextId = 1;

// Función para centralizar la lógica matemática
const calcularPropiedades = (base, altura) => {
    return {
        perimetro: 2 * (base + altura),
        superficie: base * altura,
        esCuadrado: base === altura
    };
};

// Middleware para validar el Body en POST y PUT
const validarDimensiones = (req, res, next) => {
    const { base, altura } = req.body;
    // Verifica que existan, sean números y mayores a cero
    if (typeof base !== 'number' || typeof altura !== 'number' || base <= 0 || altura <= 0) {
        return res.status(400).json({ error: "La base y la altura deben ser números mayores a cero." });
    }
    next(); // Si está todo bien, pasa a la función de la ruta
};

// POST: Crear un nuevo rectángulo
app.post('/rectangulos', validarDimensiones, (req, res) => {
    const { base, altura } = req.body;
    const propiedades = calcularPropiedades(base, altura);
    
    const nuevoRectangulo = {
        id: nextId++, // Asigna ID y luego lo incrementa para el próximo
        base,
        altura,
        ...propiedades
    };
    
    rectangulos.push(nuevoRectangulo);
    res.status(201).json(nuevoRectangulo);
});

// GET: Consultar todos o filtrar por query
app.get('/rectangulos', (req, res) => {
    const { filtro } = req.query; // Captura el query param "?filtro="
    
    if (filtro === 'cuadrados') {
        const cuadrados = rectangulos.filter(r => r.esCuadrado);
        return res.json(cuadrados);
    }
    
    res.json(rectangulos);
});

// GET: Consultar uno específico por ID (Params)
app.get('/rectangulos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const rectangulo = rectangulos.find(r => r.id === id);
    
    if (!rectangulo) {
        return res.status(404).json({ error: "Rectángulo no encontrado." });
    }
    
    res.json(rectangulo);
});

// PUT: Modificar un rectángulo existente
app.put('/rectangulos/:id', validarDimensiones, (req, res) => {
    const id = parseInt(req.params.id);
    const index = rectangulos.findIndex(r => r.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: "Rectángulo no encontrado." });
    }
    
    const { base, altura } = req.body;
    const propiedades = calcularPropiedades(base, altura);
    
    rectangulos[index] = {
        ...rectangulos[index], // Mantiene el ID original
        base,
        altura,
        ...propiedades
    };
    
    res.json(rectangulos[index]);
});

// DELETE: Eliminar un rectángulo
app.delete('/rectangulos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = rectangulos.findIndex(r => r.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: "Rectángulo no encontrado." });
    }
    
    rectangulos.splice(index, 1);
    res.status(204).send(); // 204 significa "No Content" (se eliminó exitosamente)
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});