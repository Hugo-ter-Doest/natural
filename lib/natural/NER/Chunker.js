
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
  
  
  // Cleans up the list of chunks
  purgeChunks(list) {
    // Sort chunks by length
    var compare = function(item1, item2) {
      // Sort descending
      return item2.span() - item1.span();
    };
    list.sort(compare);
    DEBUG && console.log("purgeChunks: items sorted by span: " + JSON.stringify(list, null, 2));
    
    // Purge chunks that are contained by larger chunks
    var newList = [];
    list.forEach(item1 => {
      var i = 0;
      do {
        var item2 = list[i];
        // Check if item1 is contained in item2
        if (item2.span() > item1.span() && 
            item1.data.from >= item2.data.from && 
            item1.data.to <= item2.data.to) {
          // item1 is contained in item2 => do nothing
          
        } 
        else {
          // Add it to the new list
          newList.push(item1);
        }
        
        i++;
      } while (i < list.length && list[i].span() >= item1.span());
    });
    DEBUG && console.log("purgeChunks: nr of items purged: " + (list.length - newList.length));
    return newList;
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
    
    chunkList = this.purgeChunks(chunkList);

    // Return chunks
    return chunkList;
  }
}

module.exports = Chunker;
