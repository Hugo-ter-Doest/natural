/*
Earley Chart Parser
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


var Chart = require('./Chart');
var Item = require('./EarleyItem');


class EarleyParser {

  constructor(grammar, chunkNonterminals) {
    DEBUG && console.log("EarleyParser");
    this.grammar = grammar;
    this.chunkNonterminals = chunkNonterminals;
  }


  // Adds items to the chart for each word in the tagged sentence
  // tagged_sentence[i] is an array of lexical categories
  initialiseSentenceCFG(taggedSentence) {
    var nr_items_added = 0;

    DEBUG && console.log('Enter EarleyParser.initialiseSentenceCFG');
    for (var i = 0; i < this.N; i++) {
      // Create terminal item
      var term_item = new Item({
        'rule': {'lhs': taggedSentence.taggedWords[i].token, 'rhs': ''},
        'dot': 1,
        'from': i,
        'to': i + 1
      });
      // Add tag item
      var category = taggedSentence.taggedWords[i].tag;
      var tag_item = new Item({
        'rule': {'lhs': category, 'rhs': [taggedSentence.taggedWords[i].token]},
        'dot': 1,
        'from': i,
        'to': i + 1
      });
      tag_item.append_child(term_item);
      nr_items_added += this.chart.addItem(tag_item);
      DEBUG && console.log('EarleyParser.initialise_sentence_cfg: |- ' + tag_item.id);
    }
    return(nr_items_added);
  }


  // Initialisation of goals for chunk parsing
  // Creates goals for nonterminals in this.chunkNonterminals
  initialiseGoalsForChunking() {
    var nr_items_added = 0;

    var rules = [];
    this.chunkNonterminals.forEach(LHS => {
      rules = rules.concat(this.grammar.rulesWithLHS(LHS));
    });
    DEBUG && console.log("initialiseGoalsForChunking: rule set: " + JSON.stringify(rules, null, 2));
    rules.forEach(rule => {
      for (var i = 0; i < this.N; i++) {
        var new_item = new Item({
          'rule': rule,
          'dot': 0,
          'from': i,
          'to': i
        });
        nr_items_added += this.chart.addItem(new_item);
      }
    });
    return(nr_items_added);
  }


  // Initialisation of goals for full parsing
  initialiseGoals() {
    var nr_items_added = 0;

    var rules = this.grammar.rulesWithLHS(this.grammar.getStartSymbol());
    rules.forEach(rule => {
      var new_item = new Item({
        'rule': rule,
        'dot': 0,
        'from': 0,
        'to': 0
      });
      nr_items_added += this.chart.addItem(new_item);
    });
    return(nr_items_added);
  }


  // Initialises the chart with goal items and with lexical items
  // tagged_sentence is an array of array of feature structures
  initialise(taggedSentence) {
    var nr_items_added = 0;

    DEBUG && console.log('Enter EarleyParser.initialise');
    this.N = taggedSentence.taggedWords.length;

    // Initialise chart
    this.chart = new Chart(this.N);
    if (this.chunkNonterminals) {
      nr_items_added += this.initialiseGoalsForChunking();
    }
    else {
      nr_items_added += this.initialiseGoals();
    }
    nr_items_added += this.initialiseSentenceCFG(taggedSentence);
    DEBUG && console.log("Exit EarleyParser.initialise; number of items added: " + nr_items_added);
    return(nr_items_added);
  }


  // The main algorithm of the chart parser. Sentence is an array of words
  // Analyses the sentence from left to right
  // If you need more methods to be called then override this method
  parse(taggedSentence) {

    DEBUG && console.log("Enter EarleyParser.parse" + taggedSentence);
    this.initialise(taggedSentence);
    for (var i = 0; i <= taggedSentence.taggedWords.length; i++) {
      var items_added;
      do {
        items_added = 0;
        var items = this.chart.getItemsTo(i);
        items.forEach(item => {
          items_added += item.completer(this.chart, this.grammar);
          DEBUG && console.log("EarleyChartParser.parse: nr of items added by completer: " + items_added);
          items_added += item.predictor(this.chart, this.grammar);
          DEBUG && console.log("EarleyChartParser.parse: nr of items added by predictor: " + items_added);
        });
      } while (items_added);
    }
    DEBUG && console.log("Exit EarleyParser.parse" + this.chart);
    return this.chart;
  }

}

module.exports = EarleyParser;
