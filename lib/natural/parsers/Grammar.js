/*
    Grammar class
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


class Grammar {

  constructor() {
    this.production_rules = [];
    this.production_rules = [];
    this.nonterminals = {};
    this.symbols = {};
    this.start_symbol = "";
    this.is_CNF = true;
  }


  // Add a rule to the grammar
  addRule(rule) {
    this.production_rules.push(rule);
    DEBUG && console.log("Grammar: addRule: " + rule)
  }


  //Checks if B is a nonterminal
  isNonterminal(B) {
    DEBUG && console.log("Checking if " + B + " is a nonterminal: " + this.nonterminals[B]);
    return (this.nonterminals[B]);
  }


  //Checks if B is a (pre)terminal
  isTerminal(B) {
    DEBUG && console.log("Checking if " + B + " is a (pre)terminal: " + !this.nonterminals[B]);
    return (!this.nonterminals[B]);
  }


  // Looks up all rules with lhs B
  rulesWithLHS(B) {
    var rules = [];

    this.production_rules.forEach(function(rule) {
      if (rule.lhs === B) {
        rules.push(rule);
      }
    });
    return(rules);
  }


  // Returns the start production rule which is the first rule read from file
  startRule() {
    return(this.production_rules[0]);
  }


  // Returns the start symbol
  getStartSymbol() {
    return(this.start_symbol);
  }


  // Returns all rules that match right hand side nonterminals s and t
  getRulesWithRHS(s, t) {
    var res = [];

    this.production_rules.forEach(function(rule) {
      if ((rule.rhs.length === 2) && (rule.rhs[0] === s) && (rule.rhs[1] === t)) {
        res.push(rule);
      }
    });
    return res;
  }


  getRules() {
    return this.production_rules;
  }

  // Pretty prints the grammar to a string
  prettyPrint() {
    var result = '';
    var newline = '\n';
    this.production_rules.forEach(function(rule) {
      result += rule.prettyPrint() + newline;
    });
    return(result);
  }
}

module.exports = Grammar;
