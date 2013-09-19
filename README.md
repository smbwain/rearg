rearg
=====

This library helps you to make your methods more flexible by managing arguments list. Just use one of wrappers to define your method. Wrapper prepares arguments list due to described pattern and calls your original method.

Wrappers
========

rearg.reorder(pattern, func)
-------

If you define method, which takes list of arguments of different types, you can let caller to pass them in accidental order. Use wrapper _reorder_ to define such method. It reorders arguments for you before call original method.

###E.g.
You have to get three arguments of different types: number, string and boolean.

```js
var myMethod = rearg.reorder('nsb', function(num, str, b) {
  console.log(num, str, b);
});
```

Now you can call your method in any way. Original method will be called with arguments list ordered in right way.

```js
myMethod('aa', false, 5);
    // [5, "aa", false]

myMethod(true, 'aa', 7);
    // [7, "aa", true]

myMethod('456');
    // [undefined, "456", undefined]
```

###Notice
If you use type "O" (any Object), you can't use types "d" (Date), "r" (RegExp), "a" (Array) or "o" (other Object) in pattern, because they might be also interpreted as "O" (any Object). But you may use them with "o" (other Object) there. Anyway, you caught the error if you try to define method with collisions in pattern.
(see Symbols in patterns)

rearg.expand(pattern, func)
------

Extend wrapper is used when you want to keep original order of arguments, but you want let caller to miss some of them. Just use question mark for optional params in pattern.
This wrapper throws error, if passed arguments couldn't be interpreted due to pattern.

###E.g.

```js
var myMethod = rearg.expand('nss?s?f', function(num, s1, s2, s3, f) {
  console.log(arguments);
});
```

In this example third and fourth arguments (s2 and s3) aren't required and caller might miss them. Wrapper will replace them by undefined in that case.

```js
myMethod(2, 'a', 'b', 'c', function() {});
    // [2, "a", "b", "c", function]

myMethod(2, 'a', 'b', function() {});
    // [2, "a", "b", undefined, function]

myMethod(2, 'a', function() {});
    // [2, "a", undefined, undefined, function]

myMethod(2, function() {});
    // throws error as second argument is required by pattern and should be string
```

###Notice
You can define optional arguments in sequence with required arguments of the same type only when optional arguments placed in the end of this sequence. It means you can't define pattern like "s?ssn" or "ss?sn". You can define it like "sss?n" and let only last string argument be optional.
The same story with type "O" (any Object) in conjunction with any of types "d" (Date), "r" (RegExp), "a" (Array) or "o" (other Object), if you use them in sequence. But it's ok with type "o" (other Object).
(see Symbols in patterns)

Symbols in patterns
===================

```
n - number
s - string
b - boolean
f - function
O - any Object
a - Array
d - Date
r - RegExp
o - other Object (object which isn't Array, Date or RegExp)
```

The most interesting is type "O". Because any javaScript value (except undefined) might be strongly recognized as one of the other types. But arrays, dates, regular expressions and other objects are also recognized as "O" (any Object). That's why there are some restrictions to use type "O", described in notices for _reorder_ and _expand_ methods.

How start?
==========

```
npm install rearg
```

```js
var rearg = require('rearg');
```

License
=======

MIT