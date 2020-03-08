import ModernError from '../src/ModernError.js';


console.log(`\n> Creating a basic error subclass\n`);

class DatabaseError extends ModernError {}
const databaseError = new DatabaseError('An error has occurred');
console.log(databaseError);


console.log(`\n> Creating an error subclass with default properties\n`);

class DefaultPropertyError extends ModernError {

  static get defaults() {
    return {
      test: false,
      code: null
    };
  }
}

const defaultsError = new DefaultPropertyError('This is a custom error with a few defaults', { code: 'D12' });

console.log(defaultsError);


console.log(`\n> Creating an error subclass that does not record the stack\n`);

class StacklessError extends ModernError {

  constructor(...args) {
    super(...args);

    delete this.stack;
  }
}

const stacklessError = new StacklessError('This is a custom error without a stack', { code: 'D12' });

console.log(stacklessError);


console.log(`\n> Creating an error subclass that serializes it's stack to JSON by default\n`);

class StackError extends ModernError {

  // Override this function to return an array of all non-enumerable properties to serialize
  static get serialize() {
    return ['message', 'stack'];
  }
}

const stackError = new StackError({ message: 'This is a stack error', test: true });

console.log(JSON.stringify(stackError, null, '  '));
