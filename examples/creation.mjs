import ModernError from '../src/ModernError.js';


console.log(`\n> Creating an error with a message`);

const createdWithText = new ModernError('An error has occurred');

console.log(createdWithText);


console.log(`\n> Creating an error with a message and additional properties`);

const createdWithTextAndObject = new ModernError('An error has occurred', { code: 'D12 ' });

console.log(createdWithTextAndObject);


console.log(`\n> Creating an error with an object`);

const createdWithObject = new ModernError({
  message: 'An error has occurred',
  code: 'D12',
  test: true
});

console.log(createdWithObject);


console.log(`\n> Creating an error from a native Error object`);

const nativeError = new Error('An error has occurred');
nativeError.code = 'D12';

const createdWithError = new ModernError(nativeError);

console.log(createdWithError);
