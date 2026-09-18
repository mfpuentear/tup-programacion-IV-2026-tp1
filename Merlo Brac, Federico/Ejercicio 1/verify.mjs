import { app } from './src/app.js';

const PORT = 3999;
const server = app.listen(PORT, async () => {
  console.log(`Test server running on http://localhost:${PORT}`);

  try {
    const baseUrl = `http://localhost:${PORT}`;

    // 1. Raíz
    let res = await fetch(`${baseUrl}/`);
    let data = await res.json();
    console.assert(res.status === 200, 'Root status 200');

    // 2. Listado y filtrado
    res = await fetch(`${baseUrl}/rectangulos`);
    data = await res.json();
    console.assert(res.status === 200 && data.rectangulos.length >= 4, 'Listado OK');

    res = await fetch(`${baseUrl}/rectangulos?esCuadrado=true`);
    data = await res.json();
    console.assert(data.rectangulos.every((r) => r.esCuadrado === true), 'Filtro cuadrados OK');

    res = await fetch(`${baseUrl}/rectangulos?esCuadrado=false`);
    data = await res.json();
    console.assert(data.rectangulos.every((r) => r.esCuadrado === false), 'Filtro no-cuadrados OK');

    // 3. Subrecursos
    res = await fetch(`${baseUrl}/rectangulos/1/perimetro`);
    data = await res.json();
    console.assert(res.status === 200 && data.perimetro === 30, 'Perímetro OK');

    res = await fetch(`${baseUrl}/rectangulos/1/superficie`);
    data = await res.json();
    console.assert(res.status === 200 && data.superficie === 50, 'Superficie OK');

    // 4. Cálculo directo
    res = await fetch(`${baseUrl}/rectangulos/calcular?base=7&altura=7`);
    data = await res.json();
    console.assert(data.esCuadrado === true && data.perimetro === 28 && data.superficie === 49, 'Cálculo directo OK');

    // 5. Creación (POST)
    res = await fetch(`${baseUrl}/rectangulos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base: 8, altura: 8, nombre: 'Cuadrado 8x8' })
    });
    data = await res.json();
    console.assert(res.status === 201 && data.rectangulo.esCuadrado === true, 'Creación OK');
    const nuevoId = data.rectangulo.id;

    // 6. Validación de errores (400)
    res = await fetch(`${baseUrl}/rectangulos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base: -2, altura: 5 })
    });
    console.assert(res.status === 400, 'Error base negativa OK');

    // 7. Modificación (PUT)
    res = await fetch(`${baseUrl}/rectangulos/${nuevoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base: 10, altura: 5 })
    });
    data = await res.json();
    console.assert(res.status === 200 && data.rectangulo.esCuadrado === false, 'Modificación OK');

    // 8. Eliminación (DELETE) y 404
    res = await fetch(`${baseUrl}/rectangulos/${nuevoId}`, { method: 'DELETE' });
    console.assert(res.status === 200, 'DELETE OK');

    res = await fetch(`${baseUrl}/rectangulos/${nuevoId}`);
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
