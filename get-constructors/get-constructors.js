// get-constructors.js

this.constructors = function () {
  'use strict';

  try {
    names('Object', Object);
    names('Array', Array);
    names('Error', Error);
    names('RegExp', RegExp);
    names('String', String);
    names('Number', Number);
    names('Boolean', Boolean);
    names('Function', Function);
    names('Empty', Function.prototype);
  } catch (err) {}

  // names(name, fn)
  function names(name, fn) {
    if (fn.name !== name)
      fn.name = name;
  }

  // getProto(obj)
  var getProto = Object.getPrototypeOf ? Object.getPrototypeOf :
    Object.prototype.__proto__ ?
    function getProto(obj) { return obj.__proto__; } :
    function getProto(obj) {
      var ctor = obj.constructor;
      if (typeof ctor === 'function') {
        if (ctor.prototype !== obj)
          return ctor.prototype;
        if (typeof ctor['super'] === 'function')
          return ctor['super'].prototype;
        if (typeof ctor.super_ === 'function')
          return ctor.super_.prototype;
      }
      return obj.__proto__;
    };

  // constructors([obj])
  function constructors(obj) {
    // supports: getter and normal function
    if (arguments.length === 0) obj = this;

    // convert to object from primitives
    if (obj != null && typeof obj !== 'object' && typeof obj !== 'function')
      obj = Object(obj);

    if (obj === Array) return [Array, Function.prototype];
    if (obj === Error) return [Error, Function.prototype];
    if (obj === RegExp) return [RegExp, Function.prototype];
    if (obj === Object) return [Object, Function.prototype];
    if (obj === String) return [String, Function.prototype];
    if (obj === Number) return [Number, Function.prototype];
    if (obj === Boolean) return [Boolean, Function.prototype];
    if (obj === Function) return [Function, Function.prototype];
    if (obj.constructor === Array) return [Array, Object];
    if (obj.constructor === Error) return [Error, Object];
    if (obj.constructor === RegExp) return [RegExp, Object];
    if (obj.constructor === Object) return [Object];
    if (obj.constructor === String) return [String, Object];
    if (obj.constructor === Number) return [Number, Object];
    if (obj.constructor === Boolean) return [Boolean, Object];

    var classes = [];

    if (obj instanceof Function) {
      // for Class/constructor
      for (; obj; obj = (obj['super'] || obj.super_ || getProto(obj)))
        if (typeof obj === 'function')
          classes.push(obj);

      if (classes.length === 0 ||
          classes[classes.length - 1] !== Function.prototype)
        classes.push(Function.prototype);
    }
    else {
      var saveObj = obj;

      // for instance/object
      for (; obj; obj = getProto(obj)) {
        if (obj.hasOwnProperty) {
          if (obj.hasOwnProperty('constructor'))
            classes.push(obj.constructor);
        }
        else if (obj.constructor) {
          if (classes.length === 0 ||
              classes[classes.length - 1] !== obj.constructor)
            classes.push(obj.constructor);
        }
      }

      if (classes.length === 0 &&
          typeof saveObj.constructor === 'function')
        classes = [saveObj.constructor];

      if (classes.length === 0 ||
          classes[classes.length - 1] !== Object)
        classes.push(Object);
    }

    return classes;
  }

  // extendPrototype([ctor])
  constructors.extendPrototype = function extendPrototype(ctor) {
    ctor = ctor || Object;

    if (ctor.prototype.constructors !== constructors)
      ctor.prototype.constructors = constructors;

    return this;
  };


  // defProp(obj, prop, propDesc)
  var defProp = function (obj) {
    if (!Object.defineProperty) return null;
    try {
      Object.defineProperty(obj, 'prop', {value: 'str'});
      return obj.prop === 'str' ? Object.defineProperty : null;
    } catch (err) { return null; }
  } ({});

  // defGetter(obj, prop, getter)
  var defGetter = defProp ?
    function defGetter(obj, prop, getter) {
      return defProp(obj, prop, {get: getter}); } :
    Object.prototype.__defineGetter__ ?
    function defGetter(obj, prop, getter) {
      return obj.__defineGetter__(prop, getter); } :
    function defGetter(obj, prop, getter) {};

  // fnameRegExp: function name regular expression
  var fnameRegExp = /^\s*function\s*\**\s*([^\(\s]*)[\S\s]+$/im;

  // Function.prototype.name for ie
  if (!Function.prototype.hasOwnProperty('name'))
    defGetter(Function.prototype, 'name',
      function nameOfFunction() {
        return ('' + this).replace(fnameRegExp, '$1') || undefined; });

  constructors.constructors = constructors;

  // module.exports
  if (typeof module === 'object' && module.exports)
    module.exports = constructors;

  return constructors;

}();
