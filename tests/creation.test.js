'use strict';

const ModernError = require('../src/ModernError.js');

describe('the constructor', () => {

  test('creates an error with a message', () => {

    const message = `An error has occurred on ${new Date().toUTCString()}`;

    const error = new ModernError(message);

    expect(error.message).toBe(message);
  });


  test('creates an error with a message and additional properties', () => {

    const message = `An error has occurred`;

    const properties = {
      test: true,
      code: 'D12'
    };

    const error = new ModernError(message, properties);

    for (const [key, value] of Object.entries(properties)) {
      expect(error[key]).toBe(value);
    }
  });


  test('creates an error from an object', () => {

    const object = {
      message: 'An error has occurred',
      code: 'D12',
      test: true,
      time: new Date()
    };

    const error = new ModernError(object);

    for (const [key, value] of Object.entries(object)) {
      expect(error[key]).toBe(value);
    }
  });


  test('creates an error from a native Error object', () => {

    const message = `An error has occurred on ${new Date().toUTCString()}`;

    const properties = {
      test: true,
      code: 'D12',
      time: new Date()
    };

    const nativeError = new Error(message);

    for (const [key, value] of Object.entries(properties)) {
      nativeError[key] = value;
    }

    const modernError = new ModernError(nativeError);

    const keysToCompare = [...Object.keys(nativeError), 'message', 'stack'];

    for (const key of keysToCompare) {
      expect(modernError[key]).toBe(nativeError[key]);
    }
  });


  test('creates an error from another ModernError instance', () => {

    const anError = new ModernError({
      message: `An error has occurred on ${new Date().toUTCString()}`,
      test: true,
      code: 'D12',
      time: new Date()
    });

    const anotherError = new ModernError(anError);

    const keysToCompare = [...Object.keys(anError), 'message', 'name', 'stack'];

    for (const key of keysToCompare) {

      expect(anotherError[key]).toBe(anError[key]);
    }
  });


  test('allows overwriting the "name" property', () => {

    const name = 'ERROR-1231';

    const anError = new ModernError({
      message: 'An issue occurred',
      name: name
    });

    expect(anError.name).toBe(name);
  });

  test('uses default name "Error"', () => {

    const anError = new ModernError('An issue occurred');

    expect(anError.name).toBe('Error');

    expect(anError.toString()).toBe('Error: An issue occurred');
  });
});
