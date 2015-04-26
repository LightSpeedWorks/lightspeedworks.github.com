// get-constructors.js

this.constructors = function () {
  'use strict';

  // getProto
  var getProto = Object.getPrototypeOf ? Object.getPrototypeOf :
    function getProto(obj) { return obj.__proto__; };

  // constructors
  function constructors(obj) {
    // supports: getter and normal function
    if (arguments.length === 0) obj = this;

    // convert to object from primitives
    if (obj != null && typeof obj !== 'object' && typeof obj !== 'function')
      obj = Object(obj);

    var classes = [];

    if (obj instanceof Function)
      // for Class/constructor
      for (; obj; obj = getProto(obj))
        typeof obj === 'function' &&
          classes.push(obj);

    else
      // for instance/object
      for (; obj; obj = getProto(obj))
        obj.hasOwnProperty('constructor') &&
          classes.push(obj.constructor);

    return classes;
  }

  // extendPrototype
  constructors.extendPrototype = function extendPrototype(ctor) {
    ctor = ctor || Object;

    if (!ctor.prototype.hasOwnProperty('constructors'))
      Object.defineProperty(ctor.prototype, 'constructors',
        {get: constructors, configurable: true});

    return this;
  };

  // exports
  if (typeof module === 'object' && module.exports)
    module.exports = exports = constructors;

  return constructors;

}();
