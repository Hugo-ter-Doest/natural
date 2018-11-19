/*
Production rule class for context-free grammars
Copyright (c) 2018, Hugo W.L. ter Doest

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

const DEBUG = false;

var _ = require('underscore');


class ProductionRule {

  // Constructor
  // - lhs is a string
  // - rhs is an array of strings
  // - head is a number pointing to a rhs nonterminal
  constructor(lhs, rhs, head) {
    this.lhs = lhs;
    this.rhs = rhs;
    this.head = head;
    // feature structure of the constraints specified with the rule
    this.fs = null;
  }


  isEqualTo(rule) {
    return ((this.lhs === rule.lhs) &&
      _.isEqual(this.rhs, rule.rhs) &&
      (this.fs ? this.fs.isEqualTo(rule.fs) : true) &&
      (this.head === rule.head));
  }


  // Pretty prints a production rule to a string
  prettyPrint() {
    var result = '';
    var space = ' ';
    var newline = '\n';

    result += this.lhs + space + '->' + space + this.rhs.join(space) + newline;
    return(result);
  }
}

module.exports = ProductionRule;
