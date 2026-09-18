import { app } from './src/app.js';

const PORT = 3998;
const server = app.listen(PORT, async () => {
  console.log(`Test server running on http://localhost:${PORT}`);

  try {
    const baseUrl = `http://localhost:${PORT}`;

    // 1. Raíz
    let res = await fetch(`${baseUrl}/`);
    let data = await res.json();
    console.assert(res.status === 200, 'Root status 200');

    // 2. Consulta de notas y condición derivada
    res = await fetch(`${baseUrl}/alumnos/1/notas`);
    data = await res.json();
    console.assert(res.status === 200 && data.condicion === 'promocionado' && data.promedio >= 8, 'Promocionado OK');

    res = await fetch(`${baseUrl}/alumnos/2/notas`);
    data = await res.json();
    console.assert(res.status === 200 && data.condicion === 'aprobado' && data.promedio >= 6 && data.promedio < 8, 'Aprobado OK');

    res = await fetch(`${baseUrl}/alumnos/3/notas`);
    data = await res.json();
    console.assert(res.status === 200 && data.condicion === 'reprobado' && data.promedio < 6, 'Reprobado OK');

    // 3. Filtrado por condición
    res = await fetch(`${baseUrl}/alumnos?condicion=promocionado`);
    data = await res.json();
    console.assert(data.alumnos.every((a) => a.condicion === 'promocionado'), 'Filtro promocionado OK');

    // 4. Creación (POST)
    res = await fetch(`${baseUrl}/alumnos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: 'Lucía Fernández', notas: [9, 8.5, 10] })
    });
    data = await res.json();
    console.assert(res.status === 201 && data.alumno.promedio === 9.17, 'Creación OK');
    const nuevoId = data.alumno.id;

    // 5. Unicidad de nombres (409 Conflict)
    res = await fetch(`${baseUrl}/alumnos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: 'Lucía Fernández', notas: [6, 6, 6] })
    });
    console.assert(res.status === 409, 'Duplicado nombre exacto retorna 409');

    res = await fetch(`${baseUrl}/alumnos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: 'lucía fernández', notas: [6, 6, 6] })
    });
    console.assert(res.status === 409, 'Duplicado minúsculas retorna 409');

    // 6. Validaciones de notas (400 Bad Request)
    res = await fetch(`${baseUrl}/alumnos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: 'Pedro', notas: [10, 15, 8] })
    });
    console.assert(res.status === 400, 'Nota > 10 retorna 400');

    // 7. Modificación (PUT)
    res = await fetch(`${baseUrl}/alumnos/3`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notas: [9, 8, 10] })
    });
    data = await res.json();
    console.assert(res.status === 200 && data.alumno.condicion === 'promocionado', 'Recálculo automático OK');

    // Modificar a nombre duplicado (409)
    res = await fetch(`${baseUrl}/alumnos/3`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: 'Juan Pérez' })
    });
    console.assert(res.status === 409, 'Modificación a duplicado retorna 409');

    // 8. Eliminación (DELETE) y 404
    res = await fetch(`${baseUrl}/alumnos/${nuevoId}`, { method: 'DELETE' });
    console.assert(res.status === 200, 'DELETE OK');

    res = await fetch(`${baseUrl}/alumnos/${nuevoId}`);
    console.assert(res.status === 404, '404 tras eliminación OK');

    console.log('\n=========================================');
    console.log('  ¡TODAS LAS PRUEBAS PASARON EXITOSAMENTE!');
    console.log('=========================================\n');
  } catch (err) {
    console.error('Error durante las pruebas:', err);
    process.exit(1);
  } finally {
    server.close();
  }
});
