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

var DEBUG = false;

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

  pruneMatches(s, matches, applyWordBoundaries) {
    // Checks if a match is inside another match
    function inside(m1, m2) {
      return (m2.start <= m1.start && m1.end <= m2.end && m1.length < m2.length);
    }

    var remove = new Array(matches.length);

    // Prune matches that are inside other matches
    matches.forEach((m1, i) => {
      matches.forEach((m2, j) => {
        if (inside(m1, m2)) {
          remove[i] = true;
          DEBUG && console.log("Remove " + m1.string + " because of " + m2.string);
        }
        else {
          if (inside(m2, m1)) {
            DEBUG && console.log("Remove " + m2.string + " because of " + m1.string);
            remove[j] = true;
          }
        }
      })
    });

    if (applyWordBoundaries) {
      // Prune matches that are within words
      matches.forEach((m, i) => {
        if (!remove[i]) {
          var insideWord = false;
          if (m.start > 0) {
            DEBUG && console.log("Inside word at the left of " + m.string + " " + /\w/.test(s[m.start - 1]));
            insideWord = /\w/.test(s[m.start - 1]);
          }
          if (m.end < s.length - 1) {
            DEBUG && console.log("Inside word at the right of " + m.string + " " + /\w/.test(s[m.end + 1]));
            insideWord = insideWord || /\w/.test(s[m.end + 1]);
          }
          remove[i] = insideWord;
          DEBUG && insideWord && console.log("Remove " + m.string + " " + i + " because it is inside word");
        }
      });
    }

    var newMatches = [];
    matches.forEach((m, i) => {
      if (!remove[i]) {
        newMatches.push(matches[i])
      }
    });

    return newMatches;
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
  // IN: string
  // OUT: array of matches of the form {start, end, string, cat, length}
  recognizeInString(s, caseSensitive, applyWordBoundaries) {
    var matches = [];
    Object.keys(this.lexicon).forEach(entity => {
      var indices  = this.getIndicesOf(entity, s, caseSensitive);
      indices.forEach(index => {
        this.lexicon[entity].forEach(cat => {
          var match = {
            "start" : index,
            "end": index + entity.length - 1,
            "namedEntity": entity,
            "string": s.substr(index, entity.length),
            "cat": cat,
            "length": entity.length
          };
          DEBUG && console.log("recognizeInString: " + JSON.stringify(match));
          matches.push(match);
        })
      });
    });
    return this.pruneMatches(s, matches, applyWordBoundaries);
  }

  // NER based on regular expressions
  // Do not use this variant because of performance problems
  recognizeInStringRexExp(s, caseSensitive, applyWordBoundaries) {
    var matches = [];
    var switches = "gi";
    if (caseSensitive) {
      switches = "g";
    }
    var wordBoundaries = "";
    if (applyWordBoundaries) {
      wordBoundaries = "\\b";
    }
    Object.keys(this.lexicon).forEach(entity => {
      // Build regular expression
      function escape (string) {
        return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
      }

      var exp = new RegExp(wordBoundaries + escape(entity) + wordBoundaries, switches);
      var match = null;
      while (match = exp.exec(s)) {
        this.lexicon[entity].forEach(cat => {
          var m = {
            "start": match.index,
            "end": exp.lastIndex,
            "cat": cat,
            "length": match[0].length,
            "string": s.substr(match.index, match[0].length)
          };
          matches.push(m);
          DEBUG && console.log(m);
        });
      }
    });
    return matches;
  }

}

module.exports = LexiconRecognizer;
