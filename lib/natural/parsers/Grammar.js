/*
Grammar class
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
