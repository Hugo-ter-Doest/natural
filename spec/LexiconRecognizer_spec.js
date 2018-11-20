/*
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

const DEBUG = true;

var Sentence = require('../lib/natural/brill_pos_tagger/lib/Sentence');
var Recognizer = require('../lib/natural/NER/LexiconRecognizer');

var recognizer = new Recognizer("EN");

var testCases = [
  {
    sentence: "Belgium",
    tag: "country",
    position: "0"
  },
  {
    sentence: "Janet",
    tag: "firstName",
    position: "0"
  },
  {
    sentence: "Coleman",
    tag: "lastName",
    position: "0"
  },
  {
    sentence: "Oregon",
    tag: "stateUSA",
    position: "0"
  }

];

describe("LexiconRecognizer", function() {
  it("should recognize entities as defined in the lexicons", function() {
    testCases.forEach(testCase => {
      var tokenizedSentence = testCase.sentence.split(/[ \t\r\n]+/);
      var taggedSentence = new Sentence();
      tokenizedSentence.forEach(token => {
        taggedSentence.addTaggedWord(token, null);
      });
      taggedSentence = recognizer.recognize(taggedSentence);
      DEBUG && console.log(taggedSentence);
      expect(taggedSentence.taggedWords[testCase.position].tag).toEqual(testCase.tag);
    });
  });
});
