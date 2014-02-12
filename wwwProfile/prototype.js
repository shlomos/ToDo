function A(){/** A's properties and methods */}
A.prototype = null;

function B(){/** B's properties and methods */}
B.prototype = new A(); //A is a prototype of B

function C(){/** C's properties and methods */}
C.prototype = new B(); //B is a prototype of C

function D(){/** D's properties and methods */}
D.prototype = new C(); //C is a prototype of D