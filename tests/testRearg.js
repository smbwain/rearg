
var rearg = require('../lib/rearg');

module.exports = {
    testIs: function(test) {
        test.ok(rearg.is('123', 's'), 'String 1');
        test.ok(!rearg.is(123, 's'), 'String 2');

        test.ok(rearg.is(123, 'n'), 'Number 1');
        test.ok(!rearg.is('123', 'n'), 'Number 2');

        test.ok(rearg.is(false, 'b'), 'Boolean 1');
        test.ok(!rearg.is(0, 'b'), 'Boolean 2');

        test.ok(rearg.is(function() {}, 'f'), 'Function 1');
        test.ok(!rearg.is({}, 'f'), 'Function 2');

        test.ok(rearg.is({}, 'o'), 'Object 1');
        test.ok(!rearg.is([], 'o'), 'Object 2');
        test.ok(!rearg.is(/^$/, 'o'), 'Object 3');
        test.ok(!rearg.is(new Date, 'o'), 'Object 4');
        test.ok(!rearg.is(function() {}, 'o'), 'Object 5');
        test.ok(!rearg.is('123', 'o'), 'Object 6');

        test.ok(rearg.is({}, 'O'), 'Object 1');
        test.ok(rearg.is([], 'O'), 'Object 2');
        test.ok(rearg.is(/^$/, 'O'), 'Object 3');
        test.ok(rearg.is(new Date, 'O'), 'Object 4');
        test.ok(!rearg.is(function() {}, 'O'), 'Object 5');
        test.ok(!rearg.is('123', 'O'), 'Object 6');

        test.ok(rearg.is([], 'a'), 'Array 2');
        test.ok(!rearg.is(/^$/, 'a'), 'Array 3');
        test.ok(!rearg.is(function() {}, 'a'), 'Array 5');

        test.ok(rearg.is(/^$/, 'r'), 'RegExp 1');
        test.ok(!rearg.is([], 'r'), 'RegExp 2');
        test.ok(!rearg.is(function() {}, 'r'), 'RegExp 3');

        test.ok(rearg.is(new Date(), 'd'), 'Date 1');
        test.ok(!rearg.is(/^$/, 'd'), 'Date 2');
        test.ok(!rearg.is(function() {}, 'd'), 'Date 3');

        test.done();
    },
    testReorderList: function(test) {
        var res = rearg.reorderList('fbOns', ['123', 123, false, {}, function() {}]);
        test.equal(res.length, 5);
        test.ok(typeof res[0] == 'function');
        test.ok(typeof res[1] == 'boolean');
        test.ok(typeof res[2] == 'object');
        test.ok(typeof res[3] == 'number');
        test.ok(typeof res[4] == 'string');
        var res = rearg.reorderList('fbonsrda', [new Date(), '123', [], /^$/, 123, false, {}, function() {}]);
        test.equal(res.length, 8);
        test.ok(typeof res[0] == 'function');
        test.ok(typeof res[1] == 'boolean');
        test.ok(typeof res[2] == 'object');
        test.ok(typeof res[3] == 'number');
        test.ok(typeof res[4] == 'string');
        test.ok(res[5] instanceof RegExp);
        test.ok(res[6] instanceof Date);
        test.ok(res[7] instanceof Array);
        test.done();
    },
    testReorder: function(test) {
        var f1 = rearg.reorder('fbOns', function() {
            test.equal(this.b, 5);
            test.equal(arguments.length, 5);
            test.ok(typeof arguments[0] == 'function');
            test.ok(typeof arguments[1] == 'boolean');
            test.ok(typeof arguments[2] == 'object');
            test.ok(typeof arguments[3] == 'number');
            test.ok(typeof arguments[4] == 'string');
            return 123;
        });
        test.equal(f1.call({b: 5}, '123', 123, false, {}, function() {}), 123);


        test.throws(function() {
            rearg.reorder('fbOfns', function() {});
        }, Error);

        test.throws(function() {
            rearg.reorder('AbOfns', function() {});
        }, Error);

        test.throws(function() {
            rearg.reorder('rbOfns', function() {});
        }, Error);

        test.done();
    },
    testExpandList: function(test) {
        var res = rearg.expandList('naf', [5, [], function() {}]);
        test.ok(typeof(res[0]) == 'number');
        test.ok(res[1] instanceof Array);
        test.ok(typeof(res[2]) == 'function');

        var res = rearg.expandList('na?f', [5, [], function() {}]);
        test.ok(typeof(res[0]) == 'number');
        test.ok(res[1] instanceof Array);
        test.ok(typeof(res[2]) == 'function');

        var res = rearg.expandList('na?f', [5, function() {}]);
        test.ok(typeof(res[0]) == 'number');
        test.ok(res[1] === undefined);
        test.ok(typeof(res[2]) == 'function');

        var res = rearg.expandList('na?a?f', [5, [], function() {}]);
        test.ok(typeof(res[0]) == 'number');
        test.ok(res[1] instanceof Array);
        test.ok(res[2] === undefined);
        test.ok(typeof(res[3]) == 'function');

        var res = rearg.expandList('nOr?f', [5, /^$/, function() {}]);
        test.ok(typeof(res[0]) == 'number');
        test.ok(res[1] instanceof RegExp);
        test.ok(res[2] === undefined);
        test.ok(typeof(res[3]) == 'function');

        test.throws(function() {
            rearg.expandList('nOrf', [5, /^$/, function() {}]);
        }, Error, 'throw bed args 1');

        test.throws(function() {
            rearg.expandList('n', ['s', 5, 10, function() {}]);
        }, Error, 'throws bed args 1');

        test.doesNotThrow(function() {
            rearg.expandList('n', [1, 's', 5, 10, function() {}]);
        }, Error, 'doesNotThrow bed args 1');

        test.done();
    },
    testExpand: function(test) {

        var f1 = rearg.expand('nr?n?a', function() {
            test.equal(this.a, 123);
            test.ok(arguments[0] === 1);
            test.ok(arguments[1] === undefined);
            test.ok(arguments[2] === 2);
            test.ok(arguments[3] instanceof Array);
            return 15;
        });

        test.equal(f1.call({a: 123}, 1, 2, [1]), 15);

        var f2 = rearg.expand('n?n?n?a', function() {
            test.ok(arguments[0] === 1);
            test.ok(arguments[1] === 2);
            test.ok(arguments[2] === undefined);
            test.ok(arguments[3] instanceof Array);
        });

        f2(1, 2, [1]);

        var f3 = rearg.expand('n?r?d?o?n?n?saO?O?n', function() {
            test.ok(arguments[0] === undefined);
            test.ok(arguments[1] === undefined);
            test.ok(arguments[2] instanceof Date);
            test.ok(arguments[3] === undefined);
            test.ok(arguments[4] === 7);
            test.ok(arguments[5] === undefined);
            test.ok(arguments[6] === '123');
            test.ok(arguments[7] instanceof Array);
            test.ok(arguments[8] instanceof Array);
            test.ok(arguments[9] === undefined);
            test.ok(arguments[10] === 4);
        });

        f3(new Date(), 7, '123', [], [], 4);


        test.throws(function() {
            rearg.expand('nr?n?O', function() {});
        }, Error, 'throws bad pattern 1');

        test.throws(function() {
            rearg.expand('nr?n?or?n?O', function() {});
        }, Error, 'throws bad pattern 2');

        test.doesNotThrow(function() {
            rearg.expand('nr?n?o', function() {});
        }, Error, 'doesNotThrow good pattern 3');

        test.doesNotThrow(function() {
            rearg.expand('nr?n?on?O', function() {});
        }, Error, 'doesNotThrow good pattern 4');

        test.throws(function() {
            rearg.expand('nO?n?r', function() {});
        }, Error, 'throws bad pattern 5');

        test.doesNotThrow(function() {
            rearg.expand('no?n?r', function() {});
        }, Error, 'doesNotThrow good pattern 6');

        test.done();
    }
};