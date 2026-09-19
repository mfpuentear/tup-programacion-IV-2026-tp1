import express from 'express'

const app = express()

app.use(express.json())

let alumnos = [{nombre:'juan', notas:[7,8,9]}]

const calcularEstadoAcademico = (notas) => {
    const suma = notas.reduce((acc, nota) => acc + nota, 0)
    const promedio = suma / notas.length

    let condicion = ''
    if (promedio < 6) {
        condicion = 'Reprobado'
    } else if (promedio >= 6 && promedio < 8) {
        condicion = 'Aprobado'
    } else {
        condicion = 'Promocionado'
    }
    return {promedio, condicion}
}
//Ruta para traer todos los alumnos
app.get('/alumnos', (req, res) => {
    if (!alumnos || alumnos.length === 0) {
        return res.status(400).send('No hay alumnos cargados en el arreglo')
    }

    const alumnosEnArreglo = alumnos.map((alumno)=>{
        const {promedio, condicion} = calcularEstadoAcademico(alumno.notas)
        return{
            nombre: alumno.nombre,
            notas: alumno.notas,
            promedio,
            condicion
        }
    })
    res.json(alumnosEnArreglo)
})

//Ruta para traer un alumno en específico
app.get('/alumnos/:nombre', (req, res) => {
    const {nombre} = req.params

    const alumno = alumnos.find(a => a.nombre.toLocaleLowerCase() === nombre.toLocaleLowerCase())

    if (!alumno) {
         return res.status(404).send("Alumno no encontrado")
    }

    const {promedio, condicion} = calcularEstadoAcademico(alumno.notas)

    res.json({
        nombre: alumno.nombre,
        notas: alumno.notas,
        promedio,
        condicion
    })
})

// Ruta para crea un nuevo alumno en el arreglo
app.post('/alumnos', (req, res) => {
       const { nombre, notas } = req.body;

    if (!nombre || !notas || !Array.isArray(notas) || notas.length !== 3) {
        return res.status(400).send("Debe agregar un nombre y un arreglo con 3 notas")
    }

   if (notas.some(nota => typeof nota !== 'number' || nota < 0 || nota > 10)) {
        return res.status(400).send('Todas las notas deben ser núemros entre 0 y 10')
    }

    const existe = alumnos.find(a => a.nombre.toLocaleLowerCase() === nombre.toLocaleLowerCase())
    if (existe) {
        return res.status(400).send("Ya existe un alumno con el mismo nombre")
    }

    const nuevoAlumno = {nombre, notas}

    alumnos.push(nuevoAlumno)
    res.status(201).json({mensaje: "Alumno creado", alumno: nuevoAlumno})
})

//Ruta para modificar alumno
app.put('/alumnos/:nombreActual', (req, res) => {
    console.log()
    const { nombreActual } = req.params;
    const { nombre: nombreNuevo, notas: notasNuevas } = req.body;

    const index = alumnos.findIndex(a => a.nombre.toLowerCase() === nombreActual.toLowerCase());
    
    if (index === -1) {
        return res.status(404).send('Alumno no encontrado');
    }

    if (nombreNuevo && nombreNuevo.toLowerCase() !== nombreActual.toLowerCase()) {
        const existeNuevo = alumnos.find(a => a.nombre.toLowerCase() === nombreNuevo.toLowerCase());
        if (existeNuevo) {
            return res.status(409).send('El nombre nuevo ya está registrado por otro alumno.');
        }
    }

    if (notasNuevas) {
        if (!Array.isArray(notasNuevas) || notasNuevas.length !== 3 || notasNuevas.some(nota => typeof nota !== 'number' || nota < 0 || nota > 10)) {
            return res.status(400).send('El arreglo debe contener exactamente 3 notas numéricas. Las notas deben ser numeros entre 0 y 10');
        }
    }

    alumnos[index] = {
        nombre: nombreNuevo || alumnos[index].nombre,
        notas: notasNuevas || alumnos[index].notas
    };

    res.json({ mensaje: 'Alumno actualizado con éxito', alumno: alumnos[index] });
});

app.listen(3000, () => {
    console.log("Servidor funcionando en el puerto 3000")
})