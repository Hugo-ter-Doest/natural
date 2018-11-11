/*
    Cocke Younger Kasami (CYK) chart parser
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


var Item = require('./CYKItem');
var Chart = require('./Chart');


// Constructor for parser object
// grammar is an object as defined in CFG.js
function CYKParser(grammar) {
  this.grammar = grammar;
}


CYKParser.prototype.initialise = function(taggedSentence) {
  DEBUG && console.log("Enter CYKParser.initialise: " + JSON.stringify(taggedSentence));
  this.taggedSentence = taggedSentence;
  this.N = taggedSentence.taggedWords.length;
  this.chart = new Chart(this.N);

  for (var i = 0; i < this.N; i++) {

    // Create a terminal item of the form Terminal -> *empty*
    var term_item = new Item({
      rule: {'lhs': taggedSentence.taggedWords[i].token, 'rhs': []},
      from: i,
      to: i + 1
    });

    // Create a tag item of the form Categorie -> Terminal
    var tag_item = new Item({
      rule: {
        'lhs': this.taggedSentence.taggedWords[i].tag,
        'rhs': [this.taggedSentence.taggedWords[i].token]
      },
      from: i,
      to: i + 1
    });
    tag_item.addChild(term_item);
    this.chart.addItem(tag_item);
    DEBUG && console.log("CYK_Parser.initialise: |- " + tag_item.id);
  }

  DEBUG && console.log("Exit CYK_ChartParser.initialise");
};


// This is the CYK chart parser
// sentence is a tagged sentence of the form [[word, category], [word, category], ...]
CYKParser.prototype.parse = function(tagged_sentence) {
  var that = this;

  this.initialise(tagged_sentence);
  for (var i = 2; i <= this.N; ++i) { // Length of span
    for (var j = 0; j <= this.N - i; ++j) { // Start of span
      for (var k = i - 1; k >= 0; --k) { // Partition of span
        var items1 = that.chart.getItemsFromTo(j, j + k);
        var items2 = that.chart.getItemsFromTo(j + k, j + i);
        items1.forEach(function(item1) {
          items2.forEach(function(item2) {
            var matching_rules = that.grammar.getRulesWithRHS(item1.data.rule.lhs, item2.data.rule.lhs);
            matching_rules.forEach(function(rule) {
              var item = new Item({
                rule: rule,
                from: item1.data.from,
                to: item2.data.to
              });
              item.addChild(item1);
              item.addChild(item2);
              that.chart.addItem(item);
            });
          });
        });
      }
    }
  }
  DEBUG && console.log("Exit CYK_ChartParser.parse: " + JSON.stringify(this.chart, null, 2));
  return this.chart;
};


module.exports = CYKParser;
