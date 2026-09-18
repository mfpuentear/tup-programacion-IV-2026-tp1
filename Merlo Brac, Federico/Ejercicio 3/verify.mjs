import { app } from './src/app.js';

const PORT = 3997;
const server = app.listen(PORT, async () => {
  console.log(`Test server running on http://localhost:${PORT}`);

  try {
    const baseUrl = `http://localhost:${PORT}`;

    // 1. Raíz
    let res = await fetch(`${baseUrl}/`);
    let data = await res.json();
    console.assert(res.status === 200, 'Root status 200');

    // 2. Diferenciación de tareas completadas y pendientes
    res = await fetch(`${baseUrl}/tareas?completada=true`);
    data = await res.json();
    console.assert(data.tareas.every((t) => t.completada === true && t.estado === 'completada'), 'Filtro completadas OK');

    res = await fetch(`${baseUrl}/tareas?completada=false`);
    data = await res.json();
    console.assert(data.tareas.every((t) => t.completada === false && t.estado === 'pendiente'), 'Filtro pendientes OK');

    res = await fetch(`${baseUrl}/tareas?estado=completada`);
    data = await res.json();
    console.assert(data.tareas.every((t) => t.completada === true), 'Filtro estado completada OK');

    res = await fetch(`${baseUrl}/tareas?estado=pendiente`);
    data = await res.json();
    console.assert(data.tareas.every((t) => t.completada === false), 'Filtro estado pendiente OK');

    // 3. Creación (POST)
    res = await fetch(`${baseUrl}/tareas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: 'Realizar despliegue en servidor' })
    });
    data = await res.json();
    console.assert(res.status === 201 && data.tarea.completada === false, 'Creación OK');
    const nuevoId = data.tarea.id;

    // 4. Unicidad de nombres (409 Conflict)
    res = await fetch(`${baseUrl}/tareas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: 'Realizar despliegue en servidor' })
    });
    console.assert(res.status === 409, 'Duplicado exacto retorna 409');

    res = await fetch(`${baseUrl}/tareas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: 'realizar despliegue en servidor' })
    });
    console.assert(res.status === 409, 'Duplicado minúsculas retorna 409');

    // 5. Validación de errores (400 Bad Request)
    res = await fetch(`${baseUrl}/tareas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: '   ' })
    });
    console.assert(res.status === 400, 'Nombre vacío retorna 400');

    // 6. Modificación (PUT)
    res = await fetch(`${baseUrl}/tareas/${nuevoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: 'Nombre de tarea actualizado', completada: true })
    });
    data = await res.json();
    console.assert(res.status === 200 && data.tarea.completada === true, 'Modificación OK');

    // Modificar a duplicado (409)
    res = await fetch(`${baseUrl}/tareas/${nuevoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: 'Configurar entorno de desarrollo' })
    });
    console.assert(res.status === 409, 'Modificar a nombre duplicado retorna 409');

    // 7. Eliminación (DELETE) y 404
    res = await fetch(`${baseUrl}/tareas/${nuevoId}`, { method: 'DELETE' });
    console.assert(res.status === 200, 'DELETE OK');

    res = await fetch(`${baseUrl}/tareas/${nuevoId}`);
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
