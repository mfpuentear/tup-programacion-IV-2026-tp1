# Trabajo práctico N° 1

## Descripción general

Este repositorio contiene la resolución de los tres ejercicios del trabajo práctico, desarrollados como APIs REST con ExpressJS. Cada ejercicio se encuentra separado en su propia carpeta dentro del directorio principal y mantiene una estructura consistente para facilitar la prueba y revisión.

## Estructura del proyecto

- Ejercicio 1: manejo de rectángulos, perímetros y superficies
- Ejercicio 2: gestión académica de alumnos y notas
- Ejercicio 3: administración de tareas y su estado de completitud

Cada ejercicio incluye:
- un archivo `servidor.js` con la API
- un archivo `README.md` con la fundamentación del diseño
- un archivo `.http` con ejemplos para probar los endpoints

## Decisiones de diseño aplicadas

### 1. Modelo de datos interno

Se decidió mantener un arreglo interno en memoria para cada ejercicio, con recursos simples y claros:
- rectángulos: id, ancho y alto
- alumnos: id, nombre y notas
- tareas: id, nombre y completada

Esto permite cumplir con el requisito de conservar la información sin necesidad de persistencia externa, manteniendo la lógica simple y enfocada en la práctica.

### 2. Datos derivados

En los ejercicios donde corresponde, los valores calculados no se almacenan junto con la entidad principal, sino que se derivan al momento de responder la consulta:
- en el ejercicio 1: perímetro, superficie y si es cuadrado
- en el ejercicio 2: promedio y condición académica

Esta decisión respeta la consigna de que esos datos sean derivados y no formen parte del estado persistido.

### 3. Validaciones

Se validan los valores de entrada antes de crear o actualizar registros:
- nombres obligatorios y sin duplicados
- notas con rango válido entre 0 y 10
- valores numéricos positivos para ancho y alto
- campos booleanos para el estado de tareas

Esto permite evitar inconsistencias y mantener la API robusta.

### 4. Filtrado por consultas

Para diferenciar tareas completadas y pendientes, se utiliza el query param `completada` en la ruta de listado. Esta decisión facilita la consulta sin perder la simplicidad del diseño REST.

## Ejercicios resueltos

1. Ejercicio 1: [De la Puente, Matias/Ejercicio 1](De%20la%20Puente,%20Matias/Ejercicio%201)
2. Ejercicio 2: [De la Puente, Matias/Ejercicio 2](De%20la%20Puente,%20Matias/Ejercicio%202)
3. Ejercicio 3: [De la Puente, Matias/Ejercicio 3](De%20la%20Puente,%20Matias/Ejercicio%203)

## Estado final

El trabajo práctico queda resuelto con una API por ejercicio, validaciones, pruebas HTTP y una estructura clara para su revisión final y posterior pull request.
