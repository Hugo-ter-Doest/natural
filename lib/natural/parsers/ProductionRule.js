/*
    Production rule class including unification constraints
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
