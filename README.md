# modern-error

A modern take on JavaScript errors

[![ci](https://github.com/jessety/modern-error/workflows/ci/badge.svg)](https://github.com/jessety/modern-error/actions)
[![npm](https://img.shields.io/npm/v/modern-error.svg)](https://www.npmjs.com/package/modern-error)
[![license](https://img.shields.io/github/license/jessety/modern-error.svg)](https://github.com/jessety/modern-error/blob/master/LICENSE)

`modern-error` is a drop-in replacement for the native Error class, with slightly more modern features:

- Create and throw errors with additional properties in one line
- Instantiate errors with a string, object, or existing native error
- Serialize the `message` property to JSON by default, without the need for a JSON replacer function or subclass
- Customize which non-enumerable properties are serialized without subclassing
- Easily define subclasses with default properties

## Installation

```bash
npm install modern-error
```

## Usage

```javascript
// Modules
import ModernError from 'modern-error';

// CommonJS
const ModernError = require('modern-error');
```

Create an error with a message

```javascript
throw new ModernError('An error occurred');
```

Create an error with a message and additional properties

```javascript
throw new ModernError('An error occurred', { code: 'D12' });
```

Create an error with an object

```javascript
throw new ModernError({
  message: 'An error occurred',
  code: 'D12',
  test: true
});
```

Create an error by wrapping a native Error object

```javascript
const nativeError = new Error('An error occurred');
nativeError.code = 'D12';

throw new ModernError(nativeError);

// The 'message' and 'code' properties are inherited from the native error object
```

### Subclassing

`modern-error` is designed to be easily extensible.

```javascript
class CustomError extends ModernError {}

const error = new CustomError();

console.log(error instanceof CustomError); // true
```

Subclasses may also define custom properties by overriding the static 'defaults' getter

```javascript
class ErrorWithDefaults extends ModernError() {

  static get defaults() {
    return {
      test: false,
      code: null,
      details: 'No further details'
    };
  }
}

const error = new ErrorWithDefaults('Test', { code: 'D12' });

// error's properties are:
// message: 'Test'
// test: false
// code: 'D12'
// details: 'No further details'
```

Subclasses may alternatively be created by invoking the static `subclass` function.

```javascript
const HTTPError = ModernError.subclass({
  name: 'HTTPError',
  defaults: { status: 500 },
  serialize: ['message', 'stack']
});

const error = new HTTPError('Error occurred');

// error's properties are:
// message: Error occurred
// status: 500
```

### Defaults

Defaults properties for instances of `ModernError` may be defined by setting the class `defaults` property:

```javascript
ModernError.defaults = {
  status: 500,
  test: false
};
```

Or overriding the `defaults` static function of a subclass:

```javascript
class ErrorWithDefaults extends ModernError() {
  static get defaults() {
    return {
      status: 500,
      test: false
    };
  }
}
```

Or, finally, by declaring defaults in a quick subclass:

```javascript
const ErrorWithDefaults = ModernError.subclass({
  defaults: {
    status: 500,
    test: false
  }
});
```

### Serialization

`modern-error` serializes its non-enumerable `message` property to JSON by default. You may also specify which other non-enumerable properties to serialize without subclassing by setting the class property `serialize`.

```javascript
ModernError.serialize = ['message', 'stack'];

// From now on, all JSON representations of a ModernError will include the `stack` property
```

Or overriding the getter in a subclass.

```javascript
class StackError extends ModernError {
  static get serialize() {
    return ['message', 'stack'];
  }
}

const error = new StackError('An error has occurred');

console.log(JSON.stringify(error));
// JSON representation will include the `stack` property
```

All property keys are sorted alphabetically before serialization.

## License

MIT © Jesse Youngblood
