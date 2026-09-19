import express from 'express'

const app = express()

app.use(express.json())

let alumnos = [{ nombre: 'gustavo', notas: [6, 6, 9] }]

// Función auxiliar
const calcularEstadoAcademico = (notas) => {
    let suma = 0;
    for (let i = 0; i < notas.length; i++) {
        suma = suma + notas[i];
    }
    const promedio = suma / notas.length;

    let condicion = '';
    if (promedio < 6) {
        condicion = 'Reprobado';
    } else if (promedio >= 6 && promedio < 8) {
        condicion = 'Aprobado';
    } else {
        condicion = 'Promocionado';
    }
    
    // Devolvemos construyendo el objeto 
    return { promedio: promedio, condicion: condicion };
}


// Ruta para traer todos los alumnos
app.get('/alumnos', (req, res) => {
    if (alumnos.length === 0) {
        return res.status(400).send('No hay alumnos cargados en el arreglo');
    }

    let alumnosEnArreglo = [];
    
    for (let i = 0; i < alumnos.length; i++) {
        let alumnoActual = alumnos[i];
        let estado = calcularEstadoAcademico(alumnoActual.notas);

        let alumnoCompleto = {
            nombre: alumnoActual.nombre,
            notas: alumnoActual.notas,
            promedio: estado.promedio,
            condicion: estado.condicion
        };

        alumnosEnArreglo.push(alumnoCompleto);
    }
    
    res.send(alumnosEnArreglo);
})


// Ruta para traer un alumno en específico
app.get('/alumnos/:nombre', (req, res) => {
    const nombreBuscado = req.params.nombre;

    let alumnoEncontrado = null;
    for (let i = 0; i < alumnos.length; i++) {
        if (alumnos[i].nombre === nombreBuscado) {
            alumnoEncontrado = alumnos[i];
            break; // Detenemos el ciclo si lo encontramos
        }
    }

    if (alumnoEncontrado === null) {
         return res.status(404).send("Alumno no encontrado");
    }

    let estado = calcularEstadoAcademico(alumnoEncontrado.notas);

    let respuesta = {
        nombre: alumnoEncontrado.nombre,
        notas: alumnoEncontrado.notas,
        promedio: estado.promedio,
        condicion: estado.condicion
    };

    res.send(respuesta);
})


// Ruta para crear un nuevo alumno en el arreglo
app.post('/alumnos', (req, res) => {
    const nombreNuevo = req.body.nombre;
    const notasNuevas = req.body.notas;

    // Validaciones
    if (nombreNuevo === undefined || notasNuevas === undefined) {
        return res.status(400).send("Debe agregar un nombre y un arreglo con notas");
    }

    if (notasNuevas.length !== 3) {
        return res.status(400).send("Debe agregar exactamente 3 notas");
    }

    // Buscamos si existe 
    let existe = false;
    for (let i = 0; i < alumnos.length; i++) {
        if (alumnos[i].nombre === nombreNuevo) {
            existe = true;
            break;
        }
    }

    if (existe === true) {
        return res.status(400).send("Ya existe un alumno con el mismo nombre");
    }

    let nuevoAlumno = { 
        nombre: nombreNuevo, 
        notas: notasNuevas 
    };

    alumnos.push(nuevoAlumno);
    res.status(201).send({ mensaje: "Alumno creado", alumno: nuevoAlumno });
})


// Ruta para modificar un alumno
app.put('/alumnos/:nombreActual', (req, res) => {
    const nombreActual = req.params.nombreActual;

    //  Buscamos el índice 
    let index = -1;
    for (let i = 0; i < alumnos.length; i++) {
        if (alumnos[i].nombre === nombreActual) {
            index = i;
            break;
        }
    }
    
    if (index === -1) {
        return res.status(404).send('Alumno no encontrado');
    }

    const nombreNuevo = req.body.nombre;
    const notasNuevas = req.body.notas;

    //  Si nos envían un nombre nuevo, validamos
    if (nombreNuevo !== undefined && nombreNuevo !== nombreActual) {
        
        // Verificamos que el nuevo nombre no lo tenga otra persona
        let existeOtro = false;
        for (let i = 0; i < alumnos.length; i++) {
            if (alumnos[i].nombre === nombreNuevo) {
                existeOtro = true;
                break;
            }
        }

        if (existeOtro === true) {
            return res.status(409).send('El nombre nuevo ya está registrado por otro alumno.');
        }

        // Si todo está bien, actualizamos el nombre
        alumnos[index].nombre = nombreNuevo;
    }

    //  Si nos envían notas, validamos y actualizamos
    if (notasNuevas !== undefined) {
        if (notasNuevas.length === 3) {
            alumnos[index].notas = notasNuevas;
        } else {
            return res.status(400).send('El arreglo debe contener exactamente 3 notas.');
        }
    }

    res.send({ mensaje: 'Alumno actualizado con éxito', alumno: alumnos[index] });
});

app.listen(3000, () => {
    console.log("Servidor funcionando en el puerto 3000")
})
