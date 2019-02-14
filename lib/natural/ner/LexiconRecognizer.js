/*
A named entity recognizer based on lexicons
Copyright (c) 2019, Hugo W.L. ter Doest

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

const englishLexicon = require('./English/lexicon');

var DEBUG = true;

class LexiconRecognizer {

  constructor(language) {
    switch(language) {
      case "EN":
        this.lexicon = englishLexicon;
        break;
      default:
        this.lexicon = englishLexicon;
        break;
    }
    DEBUG && console.log("LexiconRecognizer: lexicons loaded, nr entries: " + Object.keys(this.lexicon).length);
  }

  // Should be adapted to work for multi-word entities
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
  // IN:
  // OUT: array of matches of the form {start, end, string, cat, length}
  recognizeInString(s) {
    var matches = [];
    Object.keys(this.lexicon).forEach(entity => {
      var indices  = this.getIndicesOf(entity, s, true);
      indices.forEach(index => {
        this.lexicon[entity].forEach(cat => {
          var match = {
            "start" : index,
            "end": index + entity.length,
            "string": entity,
            "cat": cat,
            "length": entity.length
          };
          DEBUG && console.log("recognizeInString: " + JSON.stringify(match));
          matches.push()
        })
      });
    });
    return matches;
  }

}

module.exports = LexiconRecognizer;
