
var GrammarParser = require('../parsers/lib/GrammarParser');
var Parser = require('../parsers/CYKParser');


var grammarFile = {
  "EN": "./English/Chunkgrammar.txt"
};


class Chunker {

  constructor(language) {
    if (grammarFile[language]) {
      var text = fs.readFileSync(grammarFile[language]);
      if (text) {
        this.grammar = GrammarParser.parse(text);
        this.parser = new Parser(this.grammar);
      }
    }
  }

  // In: a Sentence object
  // Out: an array of chunks
  chunk(sentence) {
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
    for (var i = 0; i < sentence.length - 1; i++) {
      // Get chunks of length > 2
      for (var length = 2; i + length < sentence.length; length++) {
        // Get complete items
        var cItems = chart.getCompleteItemsFromTo(i, i + length);
        // Add them to the chunk list
        chunkList = chunkList.concat(cItems);
      }
    }

    // Return chunks
    return chunkList;
  }
}

module.exports = Chunker;
