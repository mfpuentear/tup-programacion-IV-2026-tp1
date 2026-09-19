import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());


let estudiantes = [];

let nextId = 1;



// VALIDAR NOMBRE. Comprueba que no exista otro estudiante con el mismo nombre
const validarNombre = (nombre, excludeId = null) => {

    const estudianteExistente = estudiantes.find(estudiante =>
        estudiante.nombre.toLowerCase() === nombre.toLowerCase() &&
        estudiante.id !== excludeId
    );

    return estudianteExistente ? "estudiante ya existente" : null;
};

// VALIDAR NOTAS. Comprueba que haya exactamente 3 notas y que estén entre 0 y 10
const validarNota = (notas) => {

    if (!Array.isArray(notas) || notas.length !== 3) {
        return "ERROR, Debe ser 3 notas";
    }

    for (let i = 0; i < notas.length; i++) {

        if (isNaN(parseFloat(notas[i]))) {
            return `ERROR, Nota ${i + 1} debe ser un número`;
        }

        const nota = parseFloat(notas[i]);

        if (nota < 0 || nota > 10) {
            return `ERROR, Nota ${i + 1} debe ser entre 0 y 10`;
        }
    }

    return null;
};


// La ruta principal
// GET se utiliza para obtener información. En este caso muestra información sobre la API y las rutas disponibles

app.get("/", (req, res) => {

    res.json({
        message: "API de Gestión de Estudiantes",

        endpoints: {
            "POST /api/estudiantes": "nuevo estudiante",

            "GET /api/estudiantes": "llamar estudiantes",

            "GET /api/estudiantes/:id": "llamar estudiante",

            "PUT /api/estudiantes/:id": "Actualizar estudiante",

            "DELETE /api/estudiantes/:id": "Eliminar estudiante",

            "GET /api/estudiantes/nombre/:nombre":
                "Buscar estudiante por nombre"
        }
    });
});



// POST se utiliza para crear un nuevo recurso. En este caso, crea un nuevo estudiante
app.post("/api/estudiantes", (req, res) => {

    try {

        const { nombre, notas } = req.body;


        if (!nombre || typeof nombre !== "string") {

            return res.status(400).json({
                error: "Error, campo texto"
            });
        }

        const errorNotas = validarNota(notas);

        if (errorNotas) {

            return res.status(400).json({
                error: errorNotas
            });
        }


        const errorNombre = validarNombre(nombre);

        if (errorNombre) {

            return res.status(400).json({
                error: errorNombre
            });
        }


        const estudiante = {

            id: nextId++,

            nombre: nombre.trim(),

            notas: notas.map(nota => parseFloat(nota))
        };


        estudiantes.push(estudiante);


        res.status(201).json(estudiante);

    } catch (error) {

        res.status(500).json({
            error: "Error, servidor"
        });
    }
});

// GET se utiliza para obtener información. En este caso devuelve todos los estudiantes

app.get("/api/estudiantes", (req, res) => {

    try {

        // map() recorre todos los estudiantes y genera un nuevo array agregando información
        const estudiantesConEstado = estudiantes.map(estudiante => {

            const promedio =
                estudiante.notas.reduce(
                    (sum, nota) => sum + nota,
                    0
                ) / 3;


            let estado = "reprobado";


            if (promedio >= 8) {

                estado = "promocionado";

            } else if (promedio >= 6) {

                estado = "aprobado";
            }


            return {
                ...estudiante,

                promedio: parseFloat(promedio.toFixed(2)),

                estado
            };
        });


        res.json({
            total: estudiantesConEstado.length,

            estudiantes: estudiantesConEstado
        });

    } catch (error) {

        res.status(500).json({
            error: "Error del servidor"
        });
    }
});

// GET se utiliza para obtener información. En este caso obtiene un estudiante específico mediante su ID

app.get("/api/estudiantes/:id", (req, res) => {

    try {

        const id = parseInt(req.params.id);


        if (isNaN(id) || id <= 0) {

            return res.status(400).json({
                error: "ID debe ser positivo"
            });
        }


        const estudiante = estudiantes.find(
            estudiante => estudiante.id === id
        );


        if (!estudiante) {

            return res.status(404).json({
                error: "Estudiante no encontrado"
            });
        }


        const promedio =
            estudiante.notas.reduce(
                (sum, nota) => sum + nota,
                0
            ) / 3;

        let estado = "reprobado";

        if (promedio >= 8) {

            estado = "promocionado";

        } else if (promedio >= 6) {

            estado = "aprobado";
        }

        res.json({
            ...estudiante,

            promedio: parseFloat(promedio.toFixed(2)),

            estado
        });

    } catch (error) {

        res.status(500).json({
            error: "Error del servidor"
        });
    }
});

// PUT se utiliza para ACTUALIZAR un recurso existente. En este caso permite modificar un estudiante
app.put("/api/estudiantes/:id", (req, res) => {

    try {

        const id = parseInt(req.params.id);

        const { nombre, notas } = req.body;


        if (isNaN(id) || id <= 0) {

            return res.status(400).json({
                error: "ID debe ser positivo"
            });
        }


        const estudianteIndex = estudiantes.findIndex(
            estudiante => estudiante.id === id
        );


        if (estudianteIndex === -1) {

            return res.status(404).json({
                error: "Estudiante no encontrado"
            });
        }


        if (nombre && typeof nombre !== "string") {

            return res.status(400).json({
                error: "Nombre debe ser texto"
            });
        }


        if (notas) {

            const errorNotas = validarNota(notas);

            if (errorNotas) {

                return res.status(400).json({
                    error: errorNotas
                });
            }
        }


        if (nombre) {

            const errorNombre = validarNombre(nombre, id);

            if (errorNombre) {

                return res.status(400).json({
                    error: errorNombre
                });
            }
        }


        const estudianteActualizado = {

            ...estudiantes[estudianteIndex],

            ...(nombre && {
                nombre: nombre.trim()
            }),

            ...(notas && {
                notas: notas.map(
                    nota => parseFloat(nota)
                )
            })
        };


        estudiantes[estudianteIndex] = estudianteActualizado;


        res.json(estudianteActualizado);

    } catch (error) {

        res.status(500).json({
            error: "Error del servidor"
        });
    }
});

// DELETE se utiliza para ELIMINAR un recurso. En este caso elimina un estudiante mediante su ID
app.delete("/api/estudiantes/:id", (req, res) => {

    try {

        const id = parseInt(req.params.id);


        if (isNaN(id) || id <= 0) {

            return res.status(400).json({
                error: "ID debe ser positivo"
            });
        }

        const estudianteIndex = estudiantes.findIndex(
            estudiante => estudiante.id === id
        );

        if (estudianteIndex === -1) {

            return res.status(404).json({
                error: "Estudiante no encontrado"
            });
        }

        const estudianteEliminado =
            estudiantes.splice(estudianteIndex, 1)[0];


        res.json({
            message: "eliminado",

            estudiante: estudianteEliminado
        });

    } catch (error) {

        res.status(500).json({
            error: "Error del servidor"
        });
    }
});


// GET se utiliza para obtener información. En este caso busca estudiantes por nombre
app.get("/api/estudiantes/nombre/:nombre", (req, res) => {

    try {

        const { nombre } = req.params;


        if (!nombre || typeof nombre !== "string") {

            return res.status(400).json({
                error: "se necesita nombre"
            });
        }

        // filter() busca todos los estudiantes cuyo nombre contenga el texto buscado
        const estudiantesEncontrados =
            estudiantes.filter(estudiante =>
                estudiante.nombre
                    .toLowerCase()
                    .includes(nombre.toLowerCase())
            );


        const estudiantesConEstado =
            estudiantesEncontrados.map(estudiante => {

                const promedio =
                    estudiante.notas.reduce(
                        (sum, nota) => sum + nota,
                        0
                    ) / 3;


                let estado = "reprobado";

                if (promedio >= 8) {

                    estado = "promocionado";

                } else if (promedio >= 6) {

                    estado = "aprobado";
                }


                return {
                    ...estudiante,

                    promedio: parseFloat(
                        promedio.toFixed(2)
                    ),

                    estado
                };
            });

        res.json({

            busqueda: nombre,

            total: estudiantesConEstado.length,

            estudiantes: estudiantesConEstado
        });

    } catch (error) {

        res.status(500).json({
            error: "Error del servidor"
        });
    }
});




// app.listen() pone el servidor a escuchar peticiones en el puerto indicado
app.listen(PORT, () => {

    console.log(
        `Servidor http://localhost:${PORT}`
    );
});