/*
A named entity recognizer based on lexicons
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

var fs = require('fs');

var Edge = require('./Edge');

var defaultLexiconPath = "./English/Lexicons";

const languageModels = {
  "EN": {
    // Lexicon files are plain text word lists.
    // The name of the file (before the extensions) is used as category
    "namedEntityLexiconPath": "./lib/natural/NER/English/Lexicons/",
  }
};


var DEBUG = true;

class LexiconRecognizer {

  constructor(language) {
    // Set path to lexicon files
    if (languageModels[language].namedEntityLexiconPath) {
      this.path = languageModels[language].namedEntityLexiconPath;
    }
    else {
      this.path = defaultLexiconPath;
    }

    // Load vocabularies from the folder
    this.lexicon = {};
    var files = fs.readdirSync(this.path);
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

  // IN: taggedSentence
  // OUT: taggedSentence
  recognizeInTokenized(taggedSentence) {
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

  getIndicesOf(searchStr, str, caseSensitive) {
    var searchStrLen = searchStr.length;

    if (searchStrLen == 0) {
      return [];
    }

    var startIndex = 0;
    var index;
    var indices = [];

    if (!caseSensitive) {
      str = str.toLowerCase();
      searchStr = searchStr.toLowerCase();
    }
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
      DEBUG && console.log("Recognized word: " + searchStr);
      indices.push(index);
      startIndex = index + searchStrLen;
    }
    return indices;
  }

  // Recognizes lexicon entries by using substring on the input string
  // IN: taggedString
  // OUT: taggedString
  recognizeInString(taggedString) {
    Object.keys(this.lexicon).forEach(word => {
      var indices  = this.getIndicesOf(word, taggedString.string, false)
      indices.forEach(index => {
        taggedString.addEdge(new Edge(index, index + word.length, this.lexicon[word]))
      });
    });
    return taggedString;
  }

}

module.exports = LexiconRecognizer;
