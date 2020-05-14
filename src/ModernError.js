//
//  Created by Jesse Youngblood on 11/21/19 at 12:26
//  Copyright (c) 2019 Jesse Youngblood. All rights reserved.
//

'use strict';

/**
 * A more modern take on the Error class
 *
 * @class ModernError
 * @extends {Error}
 */
class ModernError extends Error {

  /**
   * Errors can be created with a string, an object, both, or a native Error object
   */
  constructor(...args) {

    let [message, properties] = args;

    // Check if the first argument is an error object, and inherit its properties if so

    if (message instanceof Error) {

      const error = message;

      properties = {
        ...error,
        message: error.message,
        stack: error.stack
      };

      message = error.message;
    }

    // Check if the first argument is an object

    if (typeof message === 'object' && message !== null) {

      properties = message;
      message = properties.message;
    }

    super(message);

    // Capture the stack trace, excluding this function

    if (Error.captureStackTrace) {

      Error.captureStackTrace(this, this.constructor);

    } else {

      Object.defineProperty(this, 'stack', { value: new Error().stack });
    }

    // Set the object name to that of the constructor, so subclasses are named correctly

    Object.defineProperty(this, 'name', { value: this.constructor.name, writable: true });

    // Inherit all default properties from the static defaults() getter

    const { defaults } = this.constructor;

    for (const [key, value] of Object.entries(defaults)) {
      this[key] = value;
    }

    // Inherit properties passed to the constructor

    if (typeof properties === 'object' && properties !== null) {
      for (const [key, value] of Object.entries(properties)) {
        this[key] = value;
      }
    }
  }

  /**
   * Return object containing default properties for new errors.
   * Override in subclasses to use
   *
   * @private
   * @static
   * @memberof ModernError
   */
  static get defaults() {
    return (typeof this._defaults === 'object') ? this._defaults : {};
  }

  /**
   * Set default property values for new instances of this class
   *
   * @public
   * @static
   * @memberof ModernError
   */
  static set defaults(object) {
    Object.defineProperty(this, '_defaults', { value: object });
  }

  /**
   * Return an array of which non-enumerable properties to serialize
   * Override in subclasses to customize
   *
   * @private
   * @static
   * @memberof ModernError
   */
  static get serialize() {
    // If an array of non-enumerable properties has been set, use that.
    // Otherwise, default to just 'message', but not 'name' or 'stack'.
    return Array.isArray(this._serialize) ? this._serialize : ['message'];
  }

  /**
   * Set which non-enumerable properties to serialize
   *
   * @public
   * @static
   * @memberof ModernError
   */
  static set serialize(array) {
    Object.defineProperty(this, '_serialize', { value: array });
  }

  /**
   * Return an enumerable representation of the error when serializing to JSON
   * Includes the non-enumerable properties named in the static 'serialize' array
   *
   * @returns
   * @memberof ModernError
   */
  toJSON() {

    // Use the spread operator to include all enumerable properties

    const result = { ...this };

    //  Explicitly pull non-enumerable properties

    for (const key of this.constructor.serialize) {
      result[key] = this[key];
    }

    // Sort the resulting object by property name

    const sorted = {};

    Object.keys(result).sort().forEach(key => sorted[key] = result[key]);

    return sorted;
  }

  /**
   * Create a subclass
   *
   * @static
   * @param {object} [options={}]
   * @param {object} [options.defaults={}] - Define default properties
   * @param {array}  [options.serialize=['message']] - Set which non-enumerable properties to serialize to JSON by default
   * @param {string} [options.name='Error'] - Set a custom name for this error
   * @returns
   * @memberof ModernError
   */
  static subclass(options = {}) {

    const defaults = options.defaults || this.defaults;
    const serialize = options.serialize || this.serialize;
    const name = options.name || this.name;

    const subclass = class extends this {
      static get defaults() {
        return defaults;
      }
      static get serialize() {
        return serialize;
      }
    };

    Object.defineProperty(subclass, 'name', { value: name, writable: true });

    return subclass;
  }
}

Object.defineProperty(ModernError, 'name', { value: 'Error', writable: true });

// export default ModernError;
module.exports = ModernError;
