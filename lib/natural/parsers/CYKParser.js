/*
Cocke Younger Kasami (CYK) chart parser
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


var Item = require('./CYKItem');
var Chart = require('./Chart');


class CYKParser {

  // Constructor for parser object
  // grammar is an object as defined in CFG.js
  constructor(grammar) {
    this.grammar = grammar;
  }


  initialise(taggedSentence) {
    DEBUG && console.log("Enter CYKParser.initialise: " + JSON.stringify(taggedSentence));
    this.taggedSentence = taggedSentence;
    this.N = taggedSentence.taggedWords.length;
    this.chart = new Chart(this.N);

    for (var i = 0; i < this.N; i++) {

      // Create a terminal item of the form Terminal -> *empty*
      var termItem = new Item({
        rule: {'lhs': taggedSentence.taggedWords[i].token, 'rhs': []},
        from: i,
        to: i + 1
      });

      // Create a tag item of the form Categorie -> Terminal
      var tagItem = new Item({
        rule: {
          'lhs': this.taggedSentence.taggedWords[i].tag,
          'rhs': [this.taggedSentence.taggedWords[i].token]
        },
        from: i,
        to: i + 1
      });
      tagItem.addChild(termItem);
      this.chart.addItem(tagItem);
      DEBUG && console.log("CYK_Parser.initialise: |- " + tagItem.id);
    }

    DEBUG && console.log("Exit CYK_ChartParser.initialise");
  };


  // This is the CYK algorithm
  // sentence is a tagged sentence of the form [[word, category], [word, category], ...]
  parse(taggedSentence) {
    var that = this;

    this.initialise(taggedSentence);
    for (var i = 2; i <= this.N; ++i) { // Length of span
      for (var j = 0; j <= this.N - i; ++j) { // Start of span
        for (var k = i - 1; k >= 0; --k) { // Partition of span
          var items1 = that.chart.getItemsFromTo(j, j + k);
          var items2 = that.chart.getItemsFromTo(j + k, j + i);
          items1.forEach(function(item1) {
            items2.forEach(function(item2) {
              var matchingRules = that.grammar.getRulesWithRHS(item1.data.rule.lhs, item2.data.rule.lhs);
              matchingRules.forEach(function(rule) {
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
}

module.exports = CYKParser;
