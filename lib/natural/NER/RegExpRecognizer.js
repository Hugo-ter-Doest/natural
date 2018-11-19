/*
A named entity recognizer based on regular expressions
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


var DEBUG = false;


class RegExpRecognizer {

  constructor(newRegExps) {
    this.regExps = newRegExps;
  }
  

  // input: a Sentence object
  // output: a Sentence object
  recognize(taggedSentence) {
    var that = this;
    taggedSentence.taggedWords.forEach(taggedWord => {
      if (!taggedWord.tag) {
        Object.keys(that.regExps).some(cat => {
          var regex = that.regExps[cat];
          if (regex.test(taggedWord.token)) {
            DEBUG && console.log(taggedWord.token + " is " + cat);
            taggedWord.tag = cat;
            // Stop looking for matches
            DEBUG && console.log('Found a matching regexp, stop looking');
            return true;
          }
          else {
            // Keep looking
            DEBUG && console.log('Regexp for ' + cat + ' did not match, keep looking');
            return false;
          }
        });
      }
    });
    return taggedSentence;
  }
}

module.exports = RegExpRecognizer;
