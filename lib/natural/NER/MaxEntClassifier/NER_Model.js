

var DEBUG = false;

// Splits on whitespace and returns an array of tokens with boundaries
function tokenizeSentenceWithBoundaries(sentence) {
  var regex = /\w+/g;
  var match = null;
  var tokens = [];
  while (match = regex.exec(sentence)) {
    DEBUG && console.log(match);
    DEBUG && console.log(match.index + ' ' + regex.lastIndex);
    tokens.push({"matchedString": match[0],
                 "start": match.index,
                 "end": regex.lastIndex
    });
  }
  return tokens;
}

class NER_MaxEntModel {
  constructor(classifier, lexicon){
    this.classifier = classifier;
    this.lexicon = lexicon;
  }

  // sentence is a string
  // edges an array of edges with categories
  findNamedEntities(sentence, edges) {
    // Tokenize the sentence
    var tokens = tokenizeSentenceWithBoundaries(sentence);

    var that = this;
    // Assign initial categories
    tokens.forEach(token => {
      token.tag = that.lexicon.tagWord(token.matchedString);
    });
    
    tokens.forEach(function(token, index) {
      // Create context based on token
      var context = new Context({
          wordWindow: {},
          tagWindow: {}
      });
      // And fill it:
      // Current wordWindow
      context.data.wordWindow["0"] = token.matchedString;
      // Previous bigram
      if (index > 1) {
        context.data.tagWindow["-2"] = tokens[index - 2].tag;
      }
      // Left bigram
      if (index > 0) {
        context.data.tagWindow["-1"] = tokens[index - 1].tag;
      }
      // Right bigram
      if (index < tokens.length - 1) {
        context.data.tagWindow["1"] = tokens[index + 1].tag;
      }
      // Next bigram
      if (index < tokens.length - 2) {
        context.data.tagWindow["2"] = tokens[index + 2].tag;
      }
      // Left bigram words
      if (index > 0) {
        context.data.wordWindow["-1"] = tokens[index - 1].matchedString;
      }
      // Right bigram words
      if (index < tokens.length - 1) {
        context.data.wordWindow["1"] = tokens[index + 1].matchedString;
      }
      
      // Classify using maximum entropy model
      token.cat = this.classifier.classify(context);
      edges.push(token);
      
    });
  }
}

module.exports = NER_MaxEntModel;
