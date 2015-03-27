// base-class-extend.js

(function () {
  'use strict';

  // setConst(obj, prop, val)
  var setConst = Object.defineProperty ?
    function setConst(obj, prop, val) {
      Object.defineProperty(obj, prop, {value: val}); } :
    function setConst(obj, prop, val) { obj[prop] = val; };

  // setValue(obj, prop, val)
  var setValue = Object.defineProperty ?
    function setValue(obj, prop, val) {
      Object.defineProperty(obj, prop, {value: val,
        writable: true, configurable: true}); } :
    function setValue(obj, prop, val) { obj[prop] = val; };

  // setProto(obj, proto)
  var setProto = Object.setPrototypeOf ? Object.setPrototypeOf :
    function setProto(obj, proto) { obj.__proto__ = proto; };

  // getProto(obj)
  var getProto = Object.getPrototypeOf ? Object.getPrototypeOf :
    function getProto(obj) { return obj.__proto__; };

  // fnameRegExp: function name regular expression
  var fnameRegExp = /^\s*function\s*\**\s*([^\(\s]*)[\S\s]+$/im;

  // fname: get function name
  function fname() {
    return ('' + this).replace(fnameRegExp, '$1');
  }

  // Function.prototype.name
  if (!Function.prototype.hasOwnProperty('name')) {
    if (Object.defineProperty)
      Object.defineProperty(Function.prototype, 'name', {get: fname});
    else if (Object.prototype.__defineGetter__)
      Function.prototype.__defineGetter__('name', fname);
  }

  // Base.extend([name], [proto], [staticProps])
  // Usage:
  //    var SimpleClass =
  //        Base.extend(
  //          {new: function SimpleClass() {
  //                  SimpleClass.super_.call(this);
  //                  this.prop1 = 'val'; },
  //           method1: function method1() {},
  //           get prop1() { return this._prop1; },
  //           set prop1(val) { this._prop1 = val; }},
  //          {classMethod1: function () {}});
  function Base_extend(name, proto, staticProps) {
    // check argument: name
    if (typeof name !== 'string') {
      staticProps = proto;
      proto = name;
      name = '';
    }

    if (!proto || typeof proto !== 'object') proto = {};
    var superCtor = typeof this === 'function' ? this : Object;

    var ctor = proto.hasOwnProperty('constructor') ? proto.constructor :
               proto.hasOwnProperty('new')         ? proto['new'] :
      Function('proto, superCtor, Base_create',
        'return function ' + name + '() {\n' +
        '  "use strict";' +
        '  if (!(this instanceof proto.constructor) ||\n' +
        '      this instanceof Array && !this.hasOwnProperty("length") ||\n' +
        '      this instanceof Error && !this.hasOwnProperty("message"))\n' +
        '    return Base_create.apply(proto.constructor, arguments);\n' +
        '  if (superCtor !== Object && superCtor !== Array && superCtor !== Error)\n' +
        '    superCtor.apply(this, arguments); }')
        (proto, superCtor, Base_create);
    if (typeof ctor !== 'function')
      throw new TypeError('constructor must be a function');
    if (!ctor.name && name !== '') {
      ctor.prototype = proto;
      ctor = Function('proto, ctor, Base_create',
        'return function ' + name + '() {\n' +
        '  "use strict";' +
        '  if (!(this instanceof proto.constructor) ||\n' +
        '      this instanceof Array && !this.hasOwnProperty("length") ||\n' +
        '      this instanceof Error && !this.hasOwnProperty("message"))\n' +
        '    return Base_create.apply(proto.constructor, arguments);\n' +
        '  ctor.apply(this, arguments); }')
        (proto, ctor, Base_create);
    }
    ctor.prototype = proto;

    // override constructor
    delete proto['new'];
    setValue(proto, 'constructor', ctor);

    // inherits from super constructor
    setProto(proto, superCtor.prototype);

    // constructor.__proto__ -> for inherits class methods
    if (staticProps == null || typeof staticProps !== 'object') {
      setProto(ctor, superCtor === Object ? Function.prototype : superCtor);
    }
    else {
      setProto(ctor, staticProps);
      setProto(staticProps, superCtor === Object ? Function.prototype : superCtor);

      // class initializer: init
      var init = staticProps.hasOwnProperty('init') && staticProps.init;
      delete staticProps.init;
      if (typeof init === 'function') init.call(ctor);

      // add name to methods/functions if not found
      var keys = Object.keys(staticProps);
      for (var i = 0, n = keys.length; i < n; ++i) {
        var key = keys[i];
        if (typeof staticProps[key] === 'function' &&
            !staticProps[key].name) {
          staticProps[key] = Function('fn',
            'return function ' + key + '_() {\n' +
            '  return fn.apply(this, arguments); }')
            (staticProps[key]);
        }
      }
    }

    // add methods and class methods if not found (in prototype chain)
    if (ctor.extend !== Base_extend) ctor.extend = Base_extend;
    if (ctor.create !== Base_create) ctor.create = Base_create;
    if (ctor['new'] !== Base_create) ctor['new'] = Base_create;

    if (!('private'      in proto)) proto['private']      = Base_addPrototype;
    if (!('addPrototype' in proto)) proto['addPrototype'] = Base_addPrototype;

    // constructor.super_ -> for points super class
    setConst(ctor, 'super_', superCtor);
    setConst(ctor, 'super', superCtor);

    return ctor;
  }

  // Base.new(...args) or Base.create(...args)
  function Base_create() {
    if (this.prototype instanceof Array) {
      var obj = Array.apply(null, arguments);
      setProto(obj, this.prototype);
    }
    else if (this.prototype instanceof Error) {
      var obj = Error.apply(null, arguments);
      if (!obj.hasOwnProperty('message') &&
          typeof arguments[0] === 'string')
        obj.message = arguments[0];
      if (typeof obj.stack === 'string')
        obj.stack = obj.stack.split('\n').filter(function (str) {
          return !/((base-class.js)|(Base_create))/.test(str);
        }).join('\n');
      setProto(obj, this.prototype);
    }
    else
      var obj = Object.create(this.prototype);
    return this.apply(obj, arguments), obj;
  }

  // Base.addPrototype(proto)
  function Base_addPrototype(proto) {
    setProto(proto, getProto(this));
    setProto(this, proto);
    return proto;
  }

  // Base.extendPrototype([ctor = Function])
  function Base_extendPrototype(ctor) {
    if (typeof ctor !== 'function') ctor = Function.prototype;
    ctor.extend = Base_extend;
    return this;
  }

  var Base = Base_extend('Base',
                    {'private':       Base_addPrototype,
                     addPrototype :   Base_addPrototype},
                    {extend:          Base_extend,
                     create:          Base_create,
                     'new':           Base_create,
                     extendPrototype: Base_extendPrototype});


  // exports
  if (typeof module !== 'undefined') {
    module.exports = exports = Base;
  }
  else {
    var g = Function('return this')();
    g.BaseClass = Base;
  }

})();
