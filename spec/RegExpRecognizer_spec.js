/*
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

var Recognizer = require('../lib/natural/ner/RegExpRecognizer');

var testSentences = ["xxxxxx at hz@hotmail.com yyyyyyy",
                     "string as you hwl@terdoest.info can read",
                     "the exact time is 19:20 or so",
                     "9:10",
                     "a date that should be tagged 31/2/2018",
                     "zipcode in context 7559AH is",
                     "Here is a URI https://kennisbank.dimpact.nl/jira Oregon",
                     "asnfhf f sdf €12,59 d sf $12,59",
                     "2,5"
     ];

var expectedResults = [
  [ { start: 10,
    end: 24,
    cat: 'email',
    length: 14,
    string: 'hz@hotmail.com' } ],

  [ { start: 14,
    end: 31,
    cat: 'email',
    length: 17,
    string: 'hwl@terdoest.info' } ],

  [ { start: 18, end: 23, cat: 'time', length: 5, string: '19:20' } ],

  [ { start: 0, end: 4, cat: 'time', length: 4, string: '9:10' } ],

  [ { start: 29, end: 38, cat: 'date', length: 9, string: '31/2/2018' } ],

  [ { start: 19, end: 23, cat: 'number', length: 4, string: '7559' } ],

  [ { start: 14,
    end: 48,
    cat: 'uri',
    length: 34,
    string: 'https://kennisbank.dimpact.nl/jira' } ],

  [ { start: 13, end: 19, cat: 'amount', length: 6, string: '€12,59' },
    { start: 25, end: 31, cat: 'amount', length: 6, string: '$12,59' } ],

  [ { start: 0, end: 1, cat: 'number', length: 1, string: '2' },
    { start: 2, end: 3, cat: 'number', length: 1, string: '5' } ]

];

describe("NER based on regular expressions", () => {
  var recognizer = new Recognizer("EN");
  testSentences.forEach(function(sentence, i) {
    // Recognize
    it("should recognize entities as expected", () => {
      var matches = recognizer.recognize(sentence);
      console.log(matches);
      expect(matches).toEqual(expectedResults[i]);
    });
  })
});
