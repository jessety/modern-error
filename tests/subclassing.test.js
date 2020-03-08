'use strict';

const ModernError = require('../src/ModernError.js');

describe('subclasses', () => {

  test('use correct name', () => {

    class DatabaseError extends ModernError {}
    const databaseError = new DatabaseError('An error has occurred');

    expect(databaseError.name).toBe('DatabaseError');

    expect(databaseError instanceof DatabaseError).toBe(true);
    expect(databaseError instanceof Error).toBe(true);
  });


  test('inherit default properties', () => {

    class DefaultPropertyError extends ModernError {
      static get defaults() {
        return {
          test: false,
          code: null
        };
      }
    }

    const error = new DefaultPropertyError('An error has occurred', { code: 'D12' });

    expect(error.test).toBe(false);
    expect(error.code).toBe('D12');
  });


  test('respond to instanceof', () => {

    class DatabaseError extends ModernError {}
    class NetworkError extends ModernError {}
    class TimeoutError extends NetworkError {}

    const database = new DatabaseError();
    const network = new NetworkError();
    const timeout = new TimeoutError();

    expect(database instanceof Error).toBe(true);
    expect(database instanceof DatabaseError).toBe(true);
    expect(network instanceof DatabaseError).toBe(false);
    expect(timeout instanceof TimeoutError).toBe(true);
    expect(timeout instanceof NetworkError).toBe(true);
  });
});
