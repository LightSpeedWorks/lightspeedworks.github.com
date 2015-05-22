[get-constructors](https://www.npmjs.org/package/get-constructors) - npm
====

[English version](README.md#readme)

  オブジェクトやクラスのコンストラクタ配列(クラス一覧)を取得する。

  Google Chrome, Mozilla Firefox, Microsoft ie11/10/9/8/7/6 や Node.js/io.js をサポートします。

# インストール:

```bash
$ npm install get-constructors --save
```

または

http://lightspeedworks.github.io/get-constructors/get-constructors.js

```html
<script src="http://lightspeedworks.github.io/get-constructors/get-constructors.js"></script>
```

# 準備:

```js
(function (constructors) {
  // constructors を使う事ができます
})(this.constructors || require('get-constructors'));
```

または

```js
var constructors = this.constructors || require('get-constructors'));
```

# 使い方:

## プロパティ: this.constructors()

  コンストラクタ関数(クラス)の配列を取得する。
  (after: constructors.extendPrototype())

### 形式

```js
var MyClass = BaseClass.extend('MyClass');
var o1 = new MyClass();
var classes = o1.constructors();
console.log(classes[0] === MyClass);   // -> true
console.log(classes[1] === BaseClass); // -> true
console.log(classes[2] === Object);    // -> true
```

## 返り値

  コンストラクタ関数(クラス)の配列。

## プロパティ: Class.constructors()

  コンストラクタ関数(クラス)の配列を取得する。
  (after: constructors.extendPrototype())

### 形式

```js
var MyClass = BaseClass.extend('MyClass');
var classes = MyClass.constructors();
console.log(classes[0] === MyClass);   // -> true
console.log(classes[1] === BaseClass); // -> true
console.log(classes[2] === Object);    // -> true
```

## 返り値

  コンストラクタ関数(クラス)の配列。

# ライセンス:

  MITライセンス
