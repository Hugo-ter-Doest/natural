/*
    Single dotted items for Earley parsing
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


const DEBUG = true;

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


  // Introduces new items for the next nonterminal to be recognised
  predictor(chart, grammar) {
    var nr_items_added = 0;

    DEBUG && console.log("EarleyItem.predictor: " + this.id);
    var B = this.data.rule.rhs[this.data.dot];
    if (this.isIncomplete() && grammar.isNonterminal(B)) {
      // for each rule with LHS B create an item
      grammar.getRules().forEach(rule => {
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
