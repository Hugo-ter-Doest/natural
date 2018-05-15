

// Splits on whitespace and returns an array of tokens with boundaries
function tokenizeSentenceWithBoundaries(sentence) {
  var regex = /\w+/;
  var match = null;
  var tokens = [];
  while (match = regex.exec(sentence)) {
    DEBUG && console.log(match);
    DEBUG && console.log(match.index + ' ' + regex.lastIndex);
    tokens.push({"matchedString": match[0],
                 "category": cat,
                 "start": match.index,
                 "end": regex.lastIndex
    });
  }
  return tokens;
}

class NER_MaxEntModel {
  constructor(classifier, lexicon){
    this.classifier = classifier;
  }
  
  // sentence is a string
  // edges an array of edges with categories
  findNamedEntities(sentence, edges) {
    // Tokenize the sentence
    var tokens = tokenizeSentenceWithBoundaries(sentence);
    
    // Assign initial categories
    tokens.forEach(token => {
      token.POSTag = this.lexicon.tag(token.matchedString);
    });
    
    tokens.forEach(function(token, index) {
      // Create context based on token
      var context = {
        
      };
      
      // Fill context

      // Classify using maximum entropy model
      var isPN = this.classifier.classify(context);

      // Create and add edge
      
    });
      
  }
}