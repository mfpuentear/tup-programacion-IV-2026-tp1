const express = require('express');

const app = express();
app.use(express.json());

function isValidPositiveNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

function validateRectangleInput({ base, height }) {
  if (!isValidPositiveNumber(Number(base))) {
    throw new Error('Base must be a positive numeric value.');
  }

  if (!isValidPositiveNumber(Number(height))) {
    throw new Error('Height must be a positive numeric value.');
  }

  return {
    base: Number(base),
    height: Number(height),
  };
}

function calculateRectangle({ base, height }) {
  const rectangle = validateRectangleInput({ base, height });

  return {
    base: rectangle.base,
    height: rectangle.height,
    area: rectangle.base * rectangle.height,
    perimeter: 2 * (rectangle.base + rectangle.height),
    isSquare: rectangle.base === rectangle.height,
  };
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'rectangle-calculator' });
});

app.get('/api/rectangles/summary', (req, res) => {
  try {
    const { base, height } = validateRectangleInput({
      base: req.query.base,
      height: req.query.height,
    });

    const result = calculateRectangle({ base, height });
    res.json({ resource: 'rectangle', ...result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/rectangles/summary', (req, res) => {
  try {
    const result = calculateRectangle(req.body || {});
    res.status(201).json({ resource: 'rectangle', ...result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Rectangle API running on http://localhost:${PORT}`);
  });
}

module.exports = {
  app,
  validateRectangleInput,
  calculateRectangle,
};
