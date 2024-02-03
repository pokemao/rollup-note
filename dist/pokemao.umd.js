(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.pokemaoUtils = factory());
})(this, (function () { 'use strict';

    const add = (a, b) => {
        return a + b
    };

    return add;

}));
