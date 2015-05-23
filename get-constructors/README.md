[get-constructors](https://www.npmjs.org/package/get-constructors) - npm
====

  get an array of constructors (classes) for objects and classes.

  supports Google Chrome, Mozilla Firefox, Microsoft ie11/10/9/8/7/6 and Node.js/io.js.

[Japanese version/■日本語版はこちら■](README-JP.md#readme)

# INSTALL:

```bash
$ npm install get-constructors --save
```

or

http://lightspeedworks.github.io/get-constructors/get-constructors.js

```html
<script src="http://lightspeedworks.github.io/get-constructors/get-constructors.js"></script>
```

# PREPARE:

```js
(function (constructors) {
  // you can use constructors
})(this.constructors || require('get-constructors'));
```

or

```js
var constructors = this.constructors || require('get-constructors'));
```

# USAGE:

## function: constructors(object or Class/constructor)

```js
var constructors = require('get-constructors');

constructors({});     // -> [Object]
constructors(Object); // -> [Object, Function.prototype]

constructors([]);     // -> [Array, Object]
constructors(Array);  // -> [Array, Function.prototype]

function Klass() {}
constructors(new Klass); // -> [Klass, Object]
constructors(Klass);     // -> [Klass, Function.prototype]

function SubKlass() {}
SubKlass.prototype = new Klass();
SubKlass.prototype.constructor = SubKlass;
SubKlass.super_ = Klass;

constructors(new SubKlass); // -> [SubKlass, Klass, Object]
constructors(SubKlass);     // -> [SubKlass, Klass, Function.prototype]
```

## method: constructors.extendPrototype([ctor = Object])

  Extends prototype method `constructors` and returns `constructors`.

### Format

```js
var constructors = require('get-constructors').extendPrototype();

({}).constructors()   // -> [Object]
Object.constructors() // -> [Object, Function.prototype]

[].constructors()     // -> [Array, Object]
Array.constructors()  // -> [Array, Function.prototype]

function Klass() {}
(new Klass).constructors() // -> [Klass, Object]
Klass.constructors()       // -> [Klass, Function.prototype]

function SubKlass() {}
SubKlass.prototype = new Klass();
SubKlass.prototype.constructor = SubKlass;
SubKlass.super_ = Klass;

(new SubKlass).constructors() // -> [SubKlass, Klass, Object]
SubKlass.constructors()       // -> [SubKlass, Klass, Function.prototype]
```

## method: this.constructors()

  Get an array of constructor functions (classes).
  (after: constructors.extendPrototype())

### Format

```js
var constructors = require('get-constructors').extendPrototype();

function BaseClass() {}
function MyClass() {}
MyClass.prototype = new BaseClass()
MyClass.prototype.constructor = MyClass;
MyClass.super_ = BaseClass;

var o1 = new MyClass();
console.log(o1.constructor === MyClass);   // -> true

var classes = o1.constructors();
console.log(classes[0] === MyClass);   // -> true
console.log(classes[1] === BaseClass); // -> true
console.log(classes[2] === Object);    // -> true
```

## Returns

  An array of constructor functions (classes).

## method: Class.constructors()

  Get an array of constructor functions (classes).
  (after: constructors.extendPrototype())

### Format

```js
var constructors = require('get-constructors').extendPrototype();

function BaseClass() {}
function MyClass() {}
MyClass.prototype = new BaseClass()
MyClass.prototype.constructor = MyClass;
MyClass.super_ = BaseClass;

var classes = MyClass.constructors();
console.log(classes[0] === MyClass);   // -> true
console.log(classes[1] === BaseClass); // -> true
console.log(classes[2] === Function.prototype); // -> true
```

## Returns

  An array of constructor functions (classes).

# SEE ALSO:

## [base-class-extend](https://www.npmjs.org/package/base-class-extend) - npm

# LICENSE:

  MIT License
