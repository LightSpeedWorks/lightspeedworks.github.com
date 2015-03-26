// get-constructors.js

(function () {
  'use strict';

  var g = Function('return this')(); // get window or global object

  if (typeof module === 'object' && typeof module.exports === 'object')
    module.exports = exports = constructors;
  else
    g.constructors = constructors;

  var getProto = Object.getPrototypeOf ? Object.getPrototypeOf :
    function getProto(obj) { return obj.__proto__ };

  // constructors
  function constructors(obj) {
    // supports: getter and normal function
    if (arguments.length === 0) obj = this;

    // convert to object from primitives
    if (obj != null && typeof obj !== 'object' && typeof obj !== 'function')
      obj = Object(obj);

    var classes = [];

    if (obj instanceof Function) {
      // for Class/constructor
      for (; obj; obj = getProto(obj))
        if (typeof obj === 'function')
          classes.push(obj);
    }
    else {
      // for instance/object
      for (; obj; obj = getProto(obj))
        if (obj.hasOwnProperty('constructor'))
          classes.push(obj.constructor);
    }

    return classes;
  }

  // extendPrototype
  constructors.extendPrototype = function extendPrototype(ctor) {
    ctor = ctor || Object;
    if (!ctor.prototype.hasOwnProperty('constructors')) {
      Object.defineProperty(ctor.prototype, 'constructors',
        {get: constructors, configurable: true});
    }
  };

})();
