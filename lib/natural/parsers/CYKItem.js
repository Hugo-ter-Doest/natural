/*
CYK item class for CYK Parsing
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
// NB: CYK items are completely recognised items of the form [X, i, j] meaning ai...aj can be generated from X

const DEBUG = false;

var _ = require('underscore');


class CYKItem {
  constructor(parameters) {
    DEBUG && console.log("CYKItem: " + parameters.rule + ", " + parameters.from + ", " + parameters.to);
    this.id = "CYK(" + parameters.rule.lhs + ", " + parameters.from + ", " + parameters.to + ")";
    this.name = parameters.rule.lhs;
    this.children = [];
    this.data = {};
    this.data.from = parameters.from;
    this.data.to = parameters.to;
    this.data.rule = parameters.rule;
  }


  // Compares two CYK items and returns true if they are equal, false otherwise
  isEqualTo(item) {
    var equal = (this.name === item.name) &&
      _.isEqual(this.children, item.children) &&
      _.isEqual(this.data.rule, item.data.rule) &&
      (this.data.from === item.data.from) &&
      (this.data.to === item.data.to);
    return (equal);
  };


  // Sets the children of the item
  setChildren(children) {
    DEBUG && console.log('CYKItem.setChildren: set children to ' + children);
    this.children = children;
  }


  // Appends a child to the list of children
  addChild(child) {
    DEBUG && console.log("CYKItem.addChild: " + child.id);
    this.children.push(child);
  }


  // Checks if the item is complete (CYK items are always complete!)
  isComplete() {
    DEBUG && console.log("CYKItem.isComplete: CYK items always are complete!");
    return (true);
  }
  

  // Returns the length (span) of the item
  span() {
    return this.data.to - this.data.from;
  }


  // Prints a parse tree
  createParseTree() {
    DEBUG && console.log("Enter CYKItem.createParseTree: " + this.id);
    var subtree = this.data.rule.lhs;
    if (this.children.length === 0) {
      subtree += "(" + this.data.rule.rhs + ")";
    }
    else {
      subtree += "(";
      var i;
      for (i = 0; i < this.children.length; i++) {
        subtree += this.children[i].createParseTree() + (i < this.children.length - 1 ? "," : "");
      }
      subtree += ")";
    }
    DEBUG && console.log("Exit CYKItem.createParseTree: " + subtree);
    return (subtree);
  }
}

module.exports = CYKItem;
