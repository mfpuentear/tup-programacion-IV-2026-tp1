import express from 'express';

const app = express();
app.use(express.json());

// Arreglo interno para almacenar los alumnos
let alumnos = [];

// Función auxiliar para calcular promedio y condición
function calcularEstadoAcademico(notas) {
    const suma = notas.reduce((acc, nota) => acc + nota, 0);
    const promedio = Number((suma / notas.length).toFixed(2));
    
    let condicion = '';
    if (promedio < 6) {
        condicion = 'reprobado';
    } else if (promedio < 8) {
        condicion = 'aprobado';
    } else {
        condicion = 'promocionado';
    }

    return { promedio, condicion };
}

// 1. POST: Crear un nuevo alumno
app.post('/api/alumnos', (req, res) => {
    const { nombre, notas } = req.body;

    // Validaciones nativas
    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
        return res.status(400).json({ error: 'El nombre es obligatorio y debe ser un texto válido.' });
    }

    if (!Array.isArray(notas) || notas.length !== 3 || notas.some(n => typeof n !== 'number' || isNaN(n) || n < 0 || n > 10)) {
        return res.status(400).json({ error: 'Se deben proveer exactamente 3 notas numéricas válidas (entre 0 y 10).' });
    }

    // Validar unicidad (sin duplicar nombres)
    const nombreNormalizado = nombre.trim().toLowerCase();
    const existe = alumnos.some(a => a.nombre.toLowerCase() === nombreNormalizado);
    
    if (existe) {
        return res.status(400).json({ error: `Ya existe un alumno registrado con el nombre "${nombre}".` });
    }

    const nuevoAlumno = {
        nombre: nombre.trim(),
        notas
    };

    alumnos.push(nuevoAlumno);

    // Retornamos el alumno junto con sus datos derivados calculados
    const estado = calcularEstadoAcademico(notas);
    res.status(201).json({
        mensaje: 'Alumno registrado con éxito',
        alumno: {
            nombre: nuevoAlumno.nombre,
            notas: nuevoAlumno.notas,
            ...estado
        }
    });
});

// 2. g: Listar todos los alumnos con sus datos derivados
app.get('/api/alumnos', (req, res) => {
    const listaConDerivados = alumnos.map(a => {
        const estado = calcularEstadoAcademico(a.notas);
        return {
            nombre: a.nombre,
            notas: a.notas,
            ...estado
        };
    });

    res.json(listaConDerivados);
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor del Ejercicio 2 escuchando en el puerto ${PORT}`);
});