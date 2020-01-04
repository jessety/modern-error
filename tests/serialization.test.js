'use strict';

const ModernError = require('../src/index.js');

describe('toJSON function', () => {


  test('serializes message property by default', () => {

    const error = new ModernError('Item not found', { status: 404, code: 'D12', test: true });

    const roundtrip = JSON.parse(JSON.stringify(error));

    expect(error.message).toBe(roundtrip.message);
  });


  test('serializes properties in alphabetical order', () => {

    const properties = {
      message: 'Item not found',
      year: 2020,
      status: 404,
      code: 'D12',
      test: true,
      angle: 'acute'
    };

    const error = new ModernError(properties);

    const roundtrip = JSON.parse(JSON.stringify(error));

    expect(Object.keys(roundtrip)).toEqual(Object.keys(properties).sort());
  });


  test('can enable serializing stack without subclassing', () => {

    const error = new ModernError('Item not found', { status: 404, code: 'D12', test: true });

    const roundtripOne = JSON.parse(JSON.stringify(error));

    expect(roundtripOne.stack).toBeUndefined();


    ModernError.serialize = ['message', 'stack'];

    const roundtripTwo = JSON.parse(JSON.stringify(error));

    expect(roundtripTwo.stack).toBe(error.stack);
  });


  test('can enable serializing stack by subclassing', () => {

    class StackError extends ModernError {
      static get serialize() {
        return ['message', 'stack'];
      }
    }

    const stackError = new StackError({ message: 'This is a stack error', test: true });

    const roundtrip = JSON.parse(JSON.stringify(stackError));

    expect(roundtrip.stack).not.toBeUndefined();
  });

});
