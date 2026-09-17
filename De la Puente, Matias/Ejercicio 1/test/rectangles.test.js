const test = require('node:test');
const assert = require('node:assert/strict');
const { validateRectangleInput, calculateRectangle } = require('../app.js');

test('validateRectangleInput rejects invalid dimensions', () => {
  assert.throws(() => validateRectangleInput({ base: 0, height: 4 }), /positive/);
  assert.throws(() => validateRectangleInput({ base: -2, height: 4 }), /positive/);
  assert.throws(() => validateRectangleInput({ base: 2, height: 'x' }), /numeric/);
});

test('calculateRectangle returns area, perimeter and square detection', () => {
  const result = calculateRectangle({ base: 4, height: 4 });
  assert.equal(result.area, 16);
  assert.equal(result.perimeter, 16);
  assert.equal(result.isSquare, true);

  const another = calculateRectangle({ base: 4, height: 6 });
  assert.equal(another.area, 24);
  assert.equal(another.perimeter, 20);
  assert.equal(another.isSquare, false);
});
