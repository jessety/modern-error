'use strict';

const ModernError = require('../src/ModernError.js');

describe('subclasses', () => {

  test('use correct name', () => {

    class DatabaseError extends ModernError {}
    const databaseError = new DatabaseError('An error has occurred');

    expect(DatabaseError.name).toBe('DatabaseError');
    expect(databaseError.constructor.name).toBe('DatabaseError');
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
    expect(database instanceof ModernError).toBe(true);
    expect(database instanceof DatabaseError).toBe(true);

    expect(network instanceof DatabaseError).toBe(false);

    expect(timeout instanceof Error).toBe(true);
    expect(timeout instanceof ModernError).toBe(true);
    expect(timeout instanceof NetworkError).toBe(true);
    expect(timeout instanceof TimeoutError).toBe(true);
    expect(timeout instanceof DatabaseError).toBe(false);
  });

  test('can be created via the subclass static function', () => {

    const HTTPError = ModernError.subclass({
      defaults: { status: 500 },
      serialize: ['message', 'stack'],
      name: 'HTTPError'
    });

    const error = new HTTPError('An error has occurred');

    expect(error.name).toEqual('HTTPError');
    expect(error.status).toEqual(500);
    expect(error instanceof HTTPError).toBe(true);

    const notFound = new HTTPError('Not found', { status: 404 });
    expect(notFound instanceof HTTPError).toBe(true);

    const BasicError = ModernError.subclass();
    expect(BasicError.defaults).toEqual(ModernError.defaults);
    expect(BasicError.serialize).toEqual(ModernError.serialize);

    const basic = new BasicError('An error has occurred.');
    expect(BasicError.name).toEqual('Error');
    expect(basic.name).toEqual('Error');

    const NamedError = ModernError.subclass({ name: 'NamedError' });
    expect(NamedError.name).toBe('NamedError');
    const named = new NamedError('An error has occurred');
    expect(named.name).toBe('NamedError');

    const StacklessError = ModernError.subclass({
      name: 'StacklessError',
      defaults: { stack: undefined }
    });

    expect(StacklessError.name).toBe('StacklessError');
    const stackless = new StacklessError('An error has occurred');
    expect(stackless.name).toBe('StacklessError');
    expect(stackless.stack).toBeUndefined();
  });
});
