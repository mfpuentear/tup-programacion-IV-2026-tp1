const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Arreglo interno para persistencia en memoria
let alumnos = [];
let nextId = 1;

// Función para calcular el promedio y la condición académica dinámicamente
const calcularDatosDerivados = (alumno) => {
    const sumaNotas = alumno.notas.reduce((acc, nota) => acc + nota, 0);
    const promedio = sumaNotas / alumno.notas.length;
    
    let condicion = 'reprobado';
    if (promedio >= 8) {
        condicion = 'promocionado';
    } else if (promedio >= 6) {
        condicion = 'aprobado';
    }

    return {
        ...alumno, // Retorna los datos originales (id, nombre, notas)
        promedio: parseFloat(promedio.toFixed(2)),
        condicion
    };
};

// Middleware para validar el Body en POST y PUT
const validarEstructura = (req, res, next) => {
    const { nombre, notas } = req.body;
    
    if (typeof nombre !== 'string' || nombre.trim() === '') {
        return res.status(400).json({ error: "El nombre es obligatorio." });
    }
    
    if (!Array.isArray(notas) || notas.length !== 3 || !notas.every(n => typeof n === 'number')) {
        return res.status(400).json({ error: "Se deben ingresar exactamente 3 notas numéricas." });
    }
    
    next();
};

// POST: Crear un nuevo alumno
app.post('/alumnos', validarEstructura, (req, res) => {
    const { nombre, notas } = req.body;
    
    // Validar que el nombre no exista (ignorando mayúsculas/minúsculas)
    const nombreExiste = alumnos.find(a => a.nombre.toLowerCase() === nombre.toLowerCase());
    if (nombreExiste) {
        return res.status(400).json({ error: "Ya existe un alumno registrado con ese nombre." });
    }
    
    const nuevoAlumno = { id: nextId++, nombre, notas };
    alumnos.push(nuevoAlumno);
    
    // Se calcula el promedio y condición solo para devolverlo en la respuesta
    res.status(201).json(calcularDatosDerivados(nuevoAlumno));
});

// GET: Consultar todos los alumnos
app.get('/alumnos', (req, res) => {
    // Retornamos el arreglo mapeado para que incluya los datos derivados en todos los objetos
    const respuesta = alumnos.map(calcularDatosDerivados);
    res.json(respuesta);
});

// GET: Consultar un alumno por ID
app.get('/alumnos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const alumno = alumnos.find(a => a.id === id);
    
    if (!alumno) {
        return res.status(404).json({ error: "Alumno no encontrado." });
    }
    
    res.json(calcularDatosDerivados(alumno));
});

// PUT: Modificar un alumno existente
app.put('/alumnos/:id', validarEstructura, (req, res) => {
    const id = parseInt(req.params.id);
    const index = alumnos.findIndex(a => a.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: "Alumno no encontrado." });
    }
    
    const { nombre, notas } = req.body;
    
    // Validar que el nuevo nombre no pertenezca a OTRO alumno distinto al que editamos
    const nombreEnUso = alumnos.find(a => a.nombre.toLowerCase() === nombre.toLowerCase() && a.id !== id);
    if (nombreEnUso) {
        return res.status(400).json({ error: "El nombre provisto ya está en uso por otro alumno." });
    }
    
    alumnos[index] = { id, nombre, notas };
    res.json(calcularDatosDerivados(alumnos[index]));
});

// DELETE: Eliminar un alumno
app.delete('/alumnos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = alumnos.findIndex(a => a.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: "Alumno no encontrado." });
    }
    
    alumnos.splice(index, 1);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});