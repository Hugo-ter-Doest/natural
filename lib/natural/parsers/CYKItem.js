/*
    CYK item class for CYK and Head-Corner Parsing
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

const DEBUG = true;

var _ = require('underscore');


function CYKItem(parameters) {
  DEBUG && console.log("CYK_Item: " + parameters.rule + ", " + parameters.from + ", " + parameters.to);
  this.id = "CYK(" + parameters.rule.lhs + ", " + parameters.from + ", " + parameters.to + ")";
  this.name = parameters.rule.lhs;
  this.children = [];
  this.data = {};
  this.data.from = parameters.from;
  this.data.to = parameters.to;
  this.data.rule = parameters.rule;
}


// Compares two CYK items and returns true if they are equal, false otherwise
CYKItem.prototype.isEqualTo = function(item) {
  var equal = (this.name === item.name) &&
    _.isEqual(this.children, item.children) &&
    _.isEqual(this.data.rule, item.data.rule) &&
    (this.data.from === item.data.from) &&
    (this.data.to === item.data.to);
  return(equal);
};


CYKItem.prototype.addChild = function(child) {
  DEBUG && console.log("CYK_Item.addChild: " + child.id);
  this.children.push(child);
};


CYKItem.prototype.isComplete = function() {
  DEBUG && console.log("CYK_Item.isComplete: CYK items always are complete!");
  return(true);
};


CYKItem.prototype.createParseTree = function() {
  DEBUG && console.log("Enter CYK_Item.createParseTree: " + this.id);
  var subtree = this.data.rule.lhs;
  if (this.children.length === 0) {
    subtree += "(" + this.data.rule.rhs + ")";
  }
  else {
    subtree += "(";
    var i;
    for (i = 0; i < this.children.length; i++) {
      subtree +=  this.children[i].createParseTree() + (i < this.children.length - 1 ? "," : "");
    }
    subtree += ")";
  }
  DEBUG && console.log("Exit CYK_Item.createParseTree: " + subtree);
  return(subtree);
};


module.exports = CYKItem;
