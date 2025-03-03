// @strict: true
// @declaration: true

type T01 = {} & string;  // string
type T02 = {} & 'a';  // 'a'
type T03 = {} & object;  // object
type T04 = {} & { x: number };  // { x: number }
type T05 = {} & null;  // never
type T06 = {} & undefined;  // never
type T07 = undefined & void;  // undefined

type T10 = string & {};  // Specially preserved
type T11 = number & {};  // Specially preserved
type T12 = bigint & {};  // Specially preserved

type ThisNode = {};
type ThatNode = {};
type ThisOrThatNode = ThisNode | ThatNode;

function f01(u: unknown) {
    let x1: {} = u;  // Error
    let x2: {} | null | undefined = u;
    let x3: {} | { x: string } | null | undefined = u;
    let x4: ThisOrThatNode | null | undefined = u;
}

function f10(x: unknown) {
    if (x) {
        x;  // {}
    }
    else {
        x;  // unknown
    }
    if (!x) {
        x;  // unknown
    }
    else {
        x;  // {}
    }
}

function f11<T>(x: T) {
    if (x) {
        x;  // T & {}
    }
    else {
        x;  // T
    }
    if (!x) {
        x;  // T
    }
    else {
        x;  // T & {}
    }
}

function f12<T extends {}>(x: T) {
    if (x) {
        x;  // T
    }
    else {
        x;  // T
    }
}

function f20(x: unknown) {
    if (x !== undefined) {
        x;  // {} | null
    }
    else {
        x;  // undefined
    }
    if (x !== null) {
        x;  // {} | undefined
    }
    else {
        x;  // null
    }
    if (x !== undefined && x !== null) {
        x;  // {}
    }
    else {
        x;  // null | undefined
    }
    if (x != undefined) {
        x;  // {}
    }
    else {
        x;  // null | undefined
    }
    if (x != null) {
        x;  // {}
    }
    else {
        x;  // null | undefined
    }
}

function f21<T>(x: T) {
    if (x !== undefined) {
        x;  // T & ({} | null)
    }
    else {
        x;  // T
    }
    if (x !== null) {
        x;  // T & ({} | undefined)
    }
    else {
        x;  // T
    }
    if (x !== undefined && x !== null) {
        x;  // T & {}
    }
    else {
        x;  // T
    }
    if (x != undefined) {
        x;  // T & {}
    }
    else {
        x;  // T
    }
    if (x != null) {
        x;  // T & {}
    }
    else {
        x;  // T
    }
}

function f22<T extends {} | undefined>(x: T) {
    if (x !== undefined) {
        x;  // T & {}
    }
    else {
        x;  // T
    }
    if (x !== null) {
        x;  // T
    }
    else {
        x;  // T
    }
    if (x !== undefined && x !== null) {
        x;  // T & {}
    }
    else {
        x;  // T
    }
    if (x != undefined) {
        x;  // T & {}
    }
    else {
        x;  // T
    }
    if (x != null) {
        x;  // T & {}
    }
    else {
        x;  // T
    }
}

function f23<T>(x: T | undefined | null) {
    if (x !== undefined) {
        x;  // T & {} | null
    }
    if (x !== null) {
        x;  // T & {} | undefined
    }
    if (x != undefined) {
        x;  // T & {}
    }
    if (x != null) {
        x;  // T & {}
    }
}

function f30(x: {}) {
    if (typeof x === "object") {
        x;  // object
    }
}

function f31<T>(x: T) {
    if (typeof x === "object") {
        x;  // T & object | T & null
    }
    if (x && typeof x === "object") {
        x;  // T & object
    }
    if (typeof x === "object" && x) {
        x;  // T & object
    }
}

function f32<T extends {} | undefined>(x: T) {
    if (typeof x === "object") {
        x;  // T & object
    }
}

function possiblyNull<T>(x: T) {
    return !!true ? x : null;  // T | null
}

function possiblyUndefined<T>(x: T) {
    return !!true ? x : undefined;  // T | undefined
}

function possiblyNullOrUndefined<T>(x: T) {
    return possiblyUndefined(possiblyNull(x));  // T | null | undefined
}

function ensureNotNull<T>(x: T) {
    if (x === null) throw Error();
    return x;  // T & ({} | undefined)
}

function ensureNotUndefined<T>(x: T) {
    if (x === undefined) throw Error();
    return x;  // T & ({} | null)
}

function ensureNotNullOrUndefined<T>(x: T) {
    return ensureNotUndefined(ensureNotNull(x));  // T & {}
}

function f40(a: string | undefined, b: number | null | undefined) {
    let a1 = ensureNotNullOrUndefined(a);  // string
    let b1 = ensureNotNullOrUndefined(b);  // number
}

type QQ<T> = NonNullable<NonNullable<NonNullable<T>>>;

function f41<T>(a: T) {
    let a1 = ensureNotUndefined(ensureNotNull(a));  // T & {}
    let a2 = ensureNotNull(ensureNotUndefined(a));  // T & {}
    let a3 = ensureNotNull(ensureNotNull(a));  // T & {} | T & undefined
    let a4 = ensureNotUndefined(ensureNotUndefined(a));  // T & {} | T & null
    let a5 = ensureNotNullOrUndefined(ensureNotNullOrUndefined(a));  // T & {}
    let a6 = ensureNotNull(possiblyNullOrUndefined(a));  // T & {} | undefined
    let a7 = ensureNotUndefined(possiblyNullOrUndefined(a));  // T & {} | null
    let a8 = ensureNotNull(possiblyUndefined(a));  // T & {} | undefined
    let a9 = ensureNotUndefined(possiblyNull(a));  // T & {} | null
}

// Repro from #48468

function deepEquals<T>(a: T, b: T): boolean {
    if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) {
        return false;
    }
    if (Array.isArray(a) || Array.isArray(b)) {
        return false;
    }
    if (Object.keys(a).length !== Object.keys(b).length) { // Error here
        return false;
    }
    return true;
}

// Repro from #49386

function foo<T>(x: T | null) {
    let y = x;
    if (y !== null) {
        y;
    }
}
