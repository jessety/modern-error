import ModernError from '../src/index.mjs';


console.log(`> Creating an error object with additional properties`);

const error = new ModernError('Item not found', { status: 404, code: 'D12', test: true });

console.log(`\n> Printing out the error`);

console.log(error);

console.log(`\n> Printing out a JSON representation of the error`);

console.log(JSON.stringify(error, null, ' '));


console.log(`\n> Modifying serialization settings to include the stack, without subclassing`);

ModernError.serialize = ['message', 'stack'];

console.log(JSON.stringify(error, null, ' '));


console.log(`\n> Creating an error subclass that serializes it's stack to JSON by default`);

class StackError extends ModernError {

  // Return all non-enumerable properties to serialize
  static get serialize() {
    return ['message', 'stack'];
  }
}
const stackError = new StackError({ message: 'This is a stack error', test: true });

console.log(JSON.stringify(stackError, null, '  '));


console.log(`\n> Done!`);
