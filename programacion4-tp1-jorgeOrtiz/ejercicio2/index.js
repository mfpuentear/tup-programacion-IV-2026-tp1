import express from "express";

const app = express();
const PORT = 3000;
app.use(express.json());



let alumnos = []; // colección en memoria: simula persistencia y permite operaciones CRUD sobre recursos
let nextId = 1;


// Rutas ( GET raíz: expone documentación mínima de la API).
// Nos brinda claridad y descubrimiento de endpoints disponibles.
app.get('/', (req, res) => {
    res.json({
        message: 'API de Gestión de Alumnos',
        endpoints: {
            'POST /api/alumnos': 'nuevo alumno',

            'GET /api/alumnos': 'llamar alumnos',
            'GET /api/alumnos/:id': 'llamar alumno',
            
            'PUT /api/alumnos/:id': 'Actualizar alumno',
            'DELETE /api/alumnos/:id': 'Eliminar alumno',

            'GET /api/alumnos/nombre/:nombre': 'Buscar alumno por nombre'

            
        }
    });
});




// POST → creación con validaciones estrictas para garantizar integridad.
// POST /api/alumnos: creación de recurso.
// Nos brinda validación estricta de integridad (nombre único, 3 notas válidas).
// Se asegura consistencia de datos y se devuelve el recurso creado en JSON.

app.post('/api/alumnos', (req, res) => {
    try {
        const { nombre, notas } = req.body;



        const validarNombre = (nombre, excludeId = null) => {
    const alumnoExistente = alumnos.find(a => 
        a.nombre.toLowerCase() === nombre.toLowerCase() && a.id !== excludeId
    );
    return alumnoExistente ? 'alumno ya existente' : null;
};



        



        const validarNota = (notas) => {
    if (!Array.isArray(notas) || notas.length !== 3) {
        return 'ERRPR, Debe ser 3 notas';
    }

    for (let i = 0; i < notas.length; i++) {
        if (isNaN(parseFloat(notas[i]))) {
            return `ERROR, Nota ${i+1} debe ser un número`;
        }
        const nota = parseFloat(notas[i]);
        if (nota < 0 || nota > 10) {
            return `ERROR, Nota ${i+1} debe ser entre 0 y 10`;
        }
    }
    return null;
};



        // Validaciones
        if (!nombre || typeof nombre !== 'string') {
            return res.status(400).json({ error: 'Error, campo texto' });
        }

        const errorNotas = validarNota(notas);
        if (errorNotas) {
            return res.status(400).json({ error: errorNotas });
        }

        const errorNombre = validarNombre(nombre);
        if (errorNombre) {
            return res.status(400).json({ error: errorNombre });
        }




        // Crear alumno
        const alumno = {
            id: nextId++,
            nombre: nombre.trim(),
            notas: notas.map(nota => parseFloat(nota)),
            
        };

        alumnos.push(alumno);

        res.status(201).json(alumno);

    } catch (error) {
        res.status(500).json({ error: 'Error, servidor' });
    }
});


// GET /api/alumnos: consulta de colección.
// Fundamenta transformación con map para enriquecer cada recurso con promedio y estado académico.
// Devuelve lista completa con metadatos (total).
app.get('/api/alumnos', (req, res) => {
    try {
        const alumnosConEstado = alumnos.map(alumno => {
            const promedio = alumno.notas.reduce((sum, nota) => sum + nota, 0) / 3;
            let estado = 'reprobado';

            if (promedio >= 8) estado = 'promocionado';
            else if (promedio >= 6) estado = 'aprobado';

            return {
                ...alumno,
                promedio: parseFloat(promedio.toFixed(2)),
                estado
            };
        });

        res.json({
            total: alumnosConEstado.length,
            alumnos: alumnosConEstado
        });
    } catch (error) {
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// GET /api/alumnos/:id: consulta puntual.
// Fundamenta validación de ID positivo y búsqueda exacta.
// Devuelve recurso enriquecido con promedio y estado, coherente con REST.
app.get('/api/alumnos/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ error: 'ID debe ser positivo' });
        }

        const alumno = alumnos.find(a => a.id === id);

        if (!alumno) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }

        const promedio = alumno.notas.reduce((sum, nota) => sum + nota, 0) / 3;
        let estado = 'reprobado';
        if (promedio >= 8) estado = 'promocionado';
        else if (promedio >= 6) estado = 'aprobado';

        res.json({
            ...alumno,
            promedio: parseFloat(promedio.toFixed(2)),
            estado
        });
    } catch (error) {
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// PUT /api/alumnos/:id: actualización de recurso.
// brinda validación de integridad (nombre único, notas válidas).
// Se aplica actualización parcial con spread operator, manteniendo consistencia.

app.put('/api/alumnos/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { nombre, notas } = req.body;

        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ error: 'ID debe ser positivo' });
        }

        const alumnoIndex = alumnos.findIndex(a => a.id === id);
        if (alumnoIndex === -1) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }

        // Validaciones
        if (nombre && typeof nombre !== 'string') {
            return res.status(400).json({ error: 'Nombre debe ser texto' });
        }

        if (notas) {
            const errorNotas = validarNota(notas);
            if (errorNotas) {
                return res.status(400).json({ error: errorNotas });
            }
        }

        if (nombre) {
            const errorNombre = validarNombre(nombre, id);
            if (errorNombre) {
                return res.status(400).json({ error: errorNombre });
            }
        }

        // Actualizar alumno
        const alumnoActualizado = {
            ...alumnos[alumnoIndex],
            ...(nombre && { nombre: nombre.trim() }),
            ...(notas && { notas: notas.map(nota => parseFloat(nota)) }),
        
        };

        alumnos[alumnoIndex] = alumnoActualizado;

        res.json(alumnoActualizado);
    } catch (error) {
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// DELETE /api/alumnos/:id: eliminación de recurso.
// Fundamenta validación de ID y existencia.
// Devuelve confirmación con el recurso eliminado, coherente con REST.

app.delete('/api/alumnos/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ error: 'ID debe positivo' });
        }

        const alumnoIndex = alumnos.findIndex(a => a.id === id);
        if (alumnoIndex === -1) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }

        const alumnoEliminado = alumnos.splice(alumnoIndex, 1)[0];
        res.json({ message: 'eliminado', alumno: alumnoEliminado });
    } catch (error) {
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// GET /api/alumnos/nombre/:nombre: búsqueda por atributo.
// Fundamenta filtrado flexible (includes, case-insensitive).
// Devuelve colección parcial enriquecida con promedio y estado.
app.get('/api/alumnos/nombre/:nombre', (req, res) => {
    try {
        const { nombre } = req.params;

        if (!nombre || typeof nombre !== 'string') {
            return res.status(400).json({ error: 'se necesita nombre' });
        }

        const alumnosEncontrados = alumnos.filter(a => 
            a.nombre.toLowerCase().includes(nombre.toLowerCase())
        );

        const alumnosConEstado = alumnosEncontrados.map(alumno => {
            const promedio = alumno.notas.reduce((sum, nota) => sum + nota, 0) / 3;
            let estado = 'reprobado';
            if (promedio >= 8) estado = 'promocionado';
            else if (promedio >= 6) estado = 'aprobado';

            return {
                ...alumno,
                promedio: parseFloat(promedio.toFixed(2)),
                estado
            };
        });

        res.json({
            busqueda: nombre,
            total: alumnosConEstado.length,
            alumnos: alumnosConEstado
        });
    } catch (error) {
        res.status(500).json({ error: 'Error del servidor' });
    }
});


app.listen(PORT, () => {
    console.log(`Servidor http://localhost:${PORT}`);
});