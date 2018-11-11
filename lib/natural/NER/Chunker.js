
const DEBUG = true;
var fs = require('fs');

var GrammarParser = require('../parsers/GrammarParser');
var Parser = require('../parsers/EarleyParser');


class Chunker {

  constructor(grammarFile) {
    var text = fs.readFileSync(grammarFile, 'utf-8');
    if (text) {
      DEBUG && console.log("Chunker: read grammar text: " + text);
      this.grammar = GrammarParser.parse(text);
      this.parser = new Parser(this.grammar, true);
    }
  }

  // In: a Sentence object
  // Out: an array of chunks
  chunk(sentence) {
    var N = sentence.taggedWords.length;
    // Create the right sentence format
    var sentenceAsList = [];
    sentence.taggedWords.forEach(taggedWord => {
      sentenceAsList.push([taggedWord.token, taggedWord.tag]);
    });

    // Parse the sentence
    var chart = this.parser.parse(sentence);

    // Find chunks on the chart
    var chunkList = [];
    // From each starting position
    for (var i = 0; i < N; i++) {
      // Get chunks of length > 2
      for (var length = 1; i + length <= N; length++) {
        // Get complete items
        var cItems = chart.getCompleteItemsFromTo(i, i + length);
        // Add them to the chunk list
        cItems.forEach(item => {
          if (item.data.rule.lhs == this.grammar.getStartSymbol()) {
            chunkList.push(item);
          }
        });
      }
    }

    // Return chunks
    return chunkList;
  }
}

module.exports = Chunker;
