/*
Single dotted items for Earley parsing
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


class EarleyItem {
  // Creates an item; dot is an index in the RHS of the rule,
  // from is the starting point in the sentence
  // Data structure is prepared for InfoVis
  constructor(parameters) {
    // A unique identifier is constructed from rule, dot and from
    this.id = "Earley(" + parameters.rule.lhs + "->" + parameters.rule.rhs +
      ", " + parameters.dot + ", " + parameters.from + ", " + parameters.to +")";
    DEBUG && console.log("EarleyItem: " + this.id);
    this.name = parameters.rule.lhs;
    this.children = [];

    this.data = {};
    this.data.rule = parameters.rule;
    this.data.dot = parameters.dot;
    this.data.from = parameters.from;
    this.data.to = parameters.to;
  }


  // Compares two items
  isEqualTo(item, signature) {
    var equal = (this.name === item.name) &&
      _.isEqual(this.children, item.children) &&
      _.isEqual(this.data.rule, item.data.rule) &&
      (this.data.dot === item.data.dot) &&
      (this.data.from === item.data.from) &&
      (this.data.to === item.data.to);
    return(equal);
  }


  setChildren(children) {
    DEBUG && console.log("Enter EarleyItem.setChildren: " + children);
    this.children = children;
    DEBUG && console.log("Exit EarleyItem.setChildren");
  }


  append_child(child) {
    DEBUG && console.log("Enter EarleyItem.append_child: " + child);
    this.children.push(child);
    DEBUG && console.log("Exit EarleyItem.append_child");
  }


  // Checks if an item is incomplete
  isIncomplete() {
    DEBUG && console.log("EarleyItem.isIncomplete: " + this.id +
      (this.data.dot < this.data.rule.rhs.length));
    return(this.data.dot < this.data.rule.rhs.length);
  }


  // Checks if an item is complete
  isComplete() {
    DEBUG && console.log("EarleyItem.isComplete: " + this.id + ' ' +
      (this.data.dot === this.data.rule.rhs.length));
    return(this.data.dot === this.data.rule.rhs.length);
  }
  
  
  // Returns the length (span) of the item
  span() {
    return this.data.to - this.data.from;
  }


  // Introduces new items for the next nonterminal to be recognised
  predictor(chart, grammar) {
    var nr_items_added = 0;

    DEBUG && console.log("EarleyItem.predictor: " + this.id);
    var B = this.data.rule.rhs[this.data.dot];
    if (this.isIncomplete() && grammar.isNonterminal(B)) {
      // for each rule with LHS B create an item
      grammar.rulesWithLHS(B).forEach(rule => {
        var newitem = new EarleyItem({
          'rule': rule,
          'dot': 0,
          'from': this.data.to,
          'to': this.data.to
        });
        nr_items_added += chart.addItem(newitem);
        DEBUG && console.log("EarleyItem.predictor: (" + rule.lhs + ' -> ' + rule.rhs.join(' ') + "), " + this.id + " |- " + newitem.id);
      });
    }
    DEBUG && console.log("EarleyItem.predictor: added " + nr_items_added + " items");
    // Return number of items added
    return(nr_items_added);
  }


  // item is complete
  // Shifts the dot to the right for items in chart[k]
  completer(chart, grammar) {
    var nr_items_added = 0;

    DEBUG && console.log("EarleyItem.completer: " + this.id);
    if (this.isComplete()) {
      var items = chart.getItemsTo(this.data.from);
      items.forEach(item2 => {
        if (item2.isIncomplete() &&
            (this.data.rule.lhs === item2.data.rule.rhs[item2.data.dot])) {
          var new_item = new EarleyItem({
            'rule': item2.data.rule,
            'dot': item2.data.dot + 1,
            'from': item2.data.from,
            'to': this.data.to
          });
          DEBUG && console.log("EarleyItem.completer: " + this.id + ", " + item2.id +
            " |- " + new_item.id);
          // Make a copy of the children of item2, otherwise two items refer to the same set of children
          new_item.children = item2.children.slice();
          new_item.append_child(this);
          nr_items_added += chart.addItem(new_item);
        }
      });
    }
    DEBUG && console.log("EarleyItem.completer: added " + nr_items_added + " items");
    return(nr_items_added);
  }


  // Creates a textual nested representation of the parse tree using braces.
  createParseTree() {
    DEBUG && console.log("Enter EarleyItem.createParseTree: " + this.id);
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
    DEBUG && console.log("Exit EarleyItem.createParseTree: " + subtree);
    return(subtree);
  }


  prettyPrint() {
    var result = this.id + '\n';
    result += this.createParseTree() + '\n';
    return(result);
  }

}

module.exports = EarleyItem;
