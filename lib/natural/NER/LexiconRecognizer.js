

var fs = require('fs');

var defaultLexiconPath = "./English/Lexicons";

var DEBUG = true;

class LexiconRecognizer {
  constructor(path) {
    // Set path to lexicon files
    path ? this.path = path : this.path = defaultLexiconPath;

    // Load vocabularies from the folder
    this.lexicon = {};
    var files = fs.readdirSync(path);
    var that = this;
    files.forEach(file => {
      var data = fs.readFileSync(that.path + file, 'utf-8');
      var cat = file.split('.')[0];
      var words = data.split(/\n/);
      words.forEach(word => {
        that.lexicon[word] = cat;
      });
    });
    DEBUG && console.log("LexiconRecognizer: lexicons loaded, nr entries: " + Object.keys(this.lexicon).length);
  }

  recognize(taggedSentence) {
    var that = this;

    taggedSentence.taggedWords.forEach(taggedWord => {
      if (!taggedWord.tag) {
        if (that.lexicon[taggedWord.token]) {
          taggedWord.tag = that.lexicon[taggedWord.token];
        }
      }
    });
    return taggedSentence;
  }

}

module.exports = LexiconRecognizer;

