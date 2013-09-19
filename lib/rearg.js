/**
 * @author Roman Ditchuk
 * @email me@ototak.net
 * @license MIT
 */

(function() {
    var rearg = {
        is: function(val, sym) {
            switch(sym) {
                case 'n':
                    return typeof val == 'number';
                case 's':
                    return typeof val == 'string';
                case 'b':
                    return typeof val == 'boolean';
                case 'f':
                    return typeof val == 'function';
                case 'O':
                    return typeof val == 'object';
                case 'a':
                    return val instanceof Array;
                case 'd':
                    return val instanceof Date;
                case 'r':
                    return val instanceof RegExp;
                case 'o':
                    return typeof val == 'object'  &&  !(val instanceof Array)  &&  !(val instanceof Date)  &&  !(val instanceof RegExp);
            }
        },
        reorder: function(pattern, func) {
            this.reorderCheckPattern(pattern);
            var self = this;
            return function() {
                return func.apply(this, self.reorderList(pattern, arguments));
            }
        },
        reorderCheckPattern: function(pattern) {
            var usedAnyObject = pattern.indexOf('O') != -1;
            var objectTypes = 'adro';
            var allowedSyms = 'nsbfOadro';
            var used = '';
            for(var i = pattern.length-1; i >= 0; i--) {
                if(allowedSyms.indexOf(pattern[i]) == -1) {
                    throw new Error('Unexpected symbol "'+pattern[i]+'" in reorder pattern');
                }
                if(used.indexOf(pattern[i]) != -1) {
                    throw new Error('Type symbol "'+pattern[i]+'" occurs more than once in reorder pattern');
                }
                if(usedAnyObject  &&  objectTypes.indexOf(pattern[i]) != -1) {
                    throw new Error('You cann\'t use type symbol "'+pattern[i]+'" with type symbol "O" (any Object) in reorder pattern. Try to use "o" (other Object).');
                }
                used += pattern[i];
            }
        },
        reorderList: function(pattern, list) {
            var args = Array(pattern.length);
            for(var i = list.length-1; i >= 0; i--) {
                var j = pattern.length-1;
                for(; j >= 0; j--) {
                    if(this.is(list[i], pattern[j])) {
                        break;
                    }
                }
                if(j != -1) {
                    args[j] = list[i];
                }
            }
            return args;
        },
        expand: function(pattern, func) {
            this.expandCheckPattern(pattern);
            var self = this;
            return function() {
                return func.apply(this, self.expandList(pattern, arguments));
            }
        },
        expandCheckPattern: function(pattern) {
            var wasOptional = false;
            var last = {};
            var allowedSyms = 'nsbfOadro';
            var objectTypes = 'adro';
            for(var i = 0; i < pattern.length; i++) {
                if(allowedSyms.indexOf(pattern[i]) == -1) {
                    throw new Error('Unexpected symbol "'+pattern[i]+'" in expand pattern');
                }
                if(pattern[i+1] == '?') {
                    wasOptional = true;
                    last[pattern[i]] = true;
                    i++;
                } else {
                    if(wasOptional  &&  (last[pattern[i]]  ||  (last['O']  &&  objectTypes.indexOf(pattern[i]) != -1)  ||  (pattern[i] == 'O' && (last.a || last.d || last.r || last.o)))) {
                        throw new Error('You cann\'t use required argument after optional arguments sequence which include the same or similar type in expand pattern');
                    }
                    wasOptional = false;
                    last = {};
                }
            }
        },
        expandList: function(pattern, list) {
            var args = [];
            var j = 0;
            for(var i = 0; i < pattern.length; i++) {
                if(this.is(list[j], pattern[i])) {
                    args.push(list[j++]);
                    if(pattern[i+1] == '?') {
                        i++;
                    }
                    continue;
                }
                if(pattern[i+1] == '?') {
                    args.push(undefined);
                    i++;
                    continue;
                }
                throw new Error('Passed arguments list doesn\'t match expected pattern');
            }
            if(j < list.length-1) {
                args.push.apply(args, Array.prototype.slice.call(list, j));
            }
            return args;
        }
    };

    // define for browsers
    if(typeof window != 'undefined') {
        window.rearg = rearg;
    }

    // define for CommonJS
    if(typeof module != 'undefined'  &&  module.exports) {
        module.exports = rearg;
    }
})();