const { Router } = require('express')
const validarDimensiones = require('../middlewares/validarDimensiones')

const router = Router()

// Los calculos con decimales arrastran el error tipico del punto flotante
// (2 * (1.1 + 2.2) da 6.6000000000000005), asi que se recorta la cola.
function redondear (valor) {
  return Number(valor.toFixed(4))
}

function describir (base, altura) {
  const esCuadrado = base === altura

  const figura = {
    base,
    altura,
    tipo: esCuadrado ? 'cuadrado' : 'rectangulo',
    esCuadrado,
    perimetro: redondear(2 * (base + altura)),
    superficie: redondear(base * altura)
  }

  if (esCuadrado) {
    figura.lado = base
  }

  return figura
}

// GET /api/rectangulos/:base/:altura
router.get('/:base/:altura', validarDimensiones, (req, res) => {
  const { base, altura } = req.dimensiones
  res.json(describir(base, altura))
})

// GET /api/rectangulos/:base/:altura/perimetro
router.get('/:base/:altura/perimetro', validarDimensiones, (req, res) => {
  const { base, altura } = req.dimensiones
  const figura = describir(base, altura)

  res.json({
    base: figura.base,
    altura: figura.altura,
    tipo: figura.tipo,
    esCuadrado: figura.esCuadrado,
    perimetro: figura.perimetro
  })
})

// GET /api/rectangulos/:base/:altura/superficie
router.get('/:base/:altura/superficie', validarDimensiones, (req, res) => {
  const { base, altura } = req.dimensiones
  const figura = describir(base, altura)

  res.json({
    base: figura.base,
    altura: figura.altura,
    tipo: figura.tipo,
    esCuadrado: figura.esCuadrado,
    superficie: figura.superficie
  })
})

module.exports = router
