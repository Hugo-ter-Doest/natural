/*
	Copyright (c) 2019, Hugo ter Doest

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

const DEBUG = false;

var Recognizer = require('../lib/natural/ner/XRecognizer');
var recognizer = new Recognizer({"tagWhitespace": true, "tagPunctuation": true});

const sentences = [
  "This is a sentence with whitespace",
  "This is a sentence with whitespace and punctuation, followed by another sentence and exclamation!",
  "\"This is sentence is withing quotes\""
];

const expectedResults = [
  [ { start: 4, end: 5, cat: 'whitespace', length: 1, string: ' ' },
    { start: 7, end: 8, cat: 'whitespace', length: 1, string: ' ' },
    { start: 9, end: 10, cat: 'whitespace', length: 1, string: ' ' },
    { start: 18, end: 19, cat: 'whitespace', length: 1, string: ' ' },
    { start: 23, end: 24, cat: 'whitespace', length: 1, string: ' ' } ],

  [ { start: 4, end: 5, cat: 'whitespace', length: 1, string: ' ' },
    { start: 7, end: 8, cat: 'whitespace', length: 1, string: ' ' },
    { start: 9, end: 10, cat: 'whitespace', length: 1, string: ' ' },
    { start: 18, end: 19, cat: 'whitespace', length: 1, string: ' ' },
    { start: 23, end: 24, cat: 'whitespace', length: 1, string: ' ' },
    { start: 34, end: 35, cat: 'whitespace', length: 1, string: ' ' },
    { start: 38, end: 39, cat: 'whitespace', length: 1, string: ' ' },
    { start: 51, end: 52, cat: 'whitespace', length: 1, string: ' ' },
    { start: 60, end: 61, cat: 'whitespace', length: 1, string: ' ' },
    { start: 63, end: 64, cat: 'whitespace', length: 1, string: ' ' },
    { start: 71, end: 72, cat: 'whitespace', length: 1, string: ' ' },
    { start: 80, end: 81, cat: 'whitespace', length: 1, string: ' ' },
    { start: 84, end: 85, cat: 'whitespace', length: 1, string: ' ' },
    { start: 50, end: 51, cat: 'punctuation', length: 1, string: ',' },
    { start: 96, end: 97, cat: 'punctuation', length: 1, string: '!' } ],

  [ { start: 5, end: 6, cat: 'whitespace', length: 1, string: ' ' },
    { start: 8, end: 9, cat: 'whitespace', length: 1, string: ' ' },
    { start: 17, end: 18, cat: 'whitespace', length: 1, string: ' ' },
    { start: 20, end: 21, cat: 'whitespace', length: 1, string: ' ' },
    { start: 28, end: 29, cat: 'whitespace', length: 1, string: ' ' },
    { start: 0, end: 1, cat: 'punctuation', length: 1, string: '"' },
    { start: 35, end: 36, cat: 'punctuation', length: 1, string: '"' } ]
];

describe("Whitespace and punctuation recognizer", function () {
  sentences.forEach((s, index) => {
    it("should tag whitespace and punctuation", function() {
      var result = recognizer.recognize(s);
      expect(result).toEqual(expectedResults[index]);
      DEBUG && console.log(result);
    });
  });
});
