/*
    CYK item class for CYK Parsing
    Copyright (C) 2018 Hugo W.L. ter Doest

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
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
