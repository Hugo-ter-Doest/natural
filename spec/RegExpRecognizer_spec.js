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
var Recognizer = require('../lib/natural/NER/RegExpRecognizer');

var testCases = {
  // email

  "E-mail at the beginning": {
    sentence: "hz@hotmail.com is en e-mail address",
    tag: "email",
    position: 0
  },

  "E-mail in the middle": {
    sentence: "E-mail address in the middle name@info.nl of the string",
    tag: "email",
    position: 5
  },

  "E-mail address at the end": {
    sentence: "E-mail address at the end info@example.com",
    tag: "email",
    position: 5
  },

  "URI that is not an e-mail address": {
    sentence: "Words around an URI www.example.com",
    tag: null,
    position: null
  },

  "Use of @ symbol but not an e-mail address": {
    sentence: "Words words @example.com more words",
    tag: null,
    position: null
  },

  // time

  "time as only string": {
    sentence: "19:20",
    tag: "time",
    position: 0
  },

  "time at the beginning of the string": {
    sentence: "14:12 at the beginning of the string",
    tag: "time",
    position: 0
  },

  "time in the middle of the string and with one digit for hours": {
    sentence: "some words before 1:12 and after the time string",
    tag: "time",
    position: 3
  },

  "time at the end": {
    sentence: "some words before 14:12",
    tag: "time",
    position: 3
  },

  "wrong formatted time with ;": {
    sentence: "19;20",
    tag: null,
    position: null
  },

  // date

  "date at the beginning with one digit date and one digit month": {
    sentence: "2/3/2018 plus some words at the end",
    tag: "date",
    position: 0
  },

  "date in the middle with two digit date and month": {
    sentence: "some words first 12/3/2019 more words to follow",
    tag: "date",
    position: 3
  },

  "date at the end with one digit date and two digit month": {
    sentence: "some words to begin with 2/12/2018",
    tag: "date",
    position: 5
  },

  "date in the middle of the string with two digit year": {
    sentence: "some words 2/2/18 more words to end",
    tag: "date",
    position: 2
  },

  // zipcode

  "zip code at the beginning": {
    sentence: "12345-1234 more words at the end",
    tag: "zipcode",
    position: 0
  },

  "zip code in the middle": {
    sentence: "some words at the beginning 12345-9876 followed by more words",
    tag: "zipcode",
    position: 5
  },

  "zip code at the end": {
    sentence: "some words at the beginning 12345-9876",
    tag: "zipcode",
    position: 5
  },

  "Dutch zip code will not be recognized": {
    sentence: "1023AG 1023 AG",
    tag: null,
    position: null
  },

  // uri

  "URI at the beginning": {
    sentence: "http://www.example.com more words at the end",
    tag: "uri",
    position: 0
  },

  "URI with port number": {
    sentence: "http://www.example.com:443",
    tag: "uri",
    position: 0
  },

  "URI in the middle of the string and with a path": {
    sentence: "a b c d http://www.example.com/path/to/resource e f g h",
    tag: "uri",
    position: 4
  },

  "URI with a path and port number": {
    sentence: "http://www.example.com/path/to/resource",
    tag: "uri",
    position: 0
  },

  "URI with typical REST path": {
    sentence: "http://api.example.com/device-management/managed-devices/{device-id}",
    tag: "uri",
    position: 0
  },

  "URI with typical REST path with parameters": {
    sentence: "http://api.example.com/device-management/managed-devices?region=USA&brand=XYZ&sort=installation-date",
    tag: "uri",
    position: 0
  },

  "Another commplex URI": {
    sentence: "hi uri http://210.50.2.215/sd_new/WebBuilder.cgi?RegID=7449046&amp;First=Ok&amp;Upt=Ok&amp;EditPage=3&amp;S hi uri",
    tag: "uri",
    position: 2
  },

  // currency

  "Amount in euros": {
    sentence: "€120,50",
    tag: "amount",
    position: 0
  },

  "Amount in dollars": {
    sentence: "$14,50",
    tag: "amount",
    position: 0
  },

  "Amount in dollars with thousands separator": {
    sentence: "$14,000.50",
    tag: "amount",
    position: 0
  },

  "A number in context": {
    sentence: "Word1 Word2 Word3 123 Word4 Word5",
    tag: "number",
    position: 3
  },

  "A number with decimals": {
    sentence: "Word1 Word2 Word3 123.12 Word4 Word5",
    tag: "number",
    position: 3
  }

};


describe("RegExpRecognizer", function() {

  var recognizer = new Recognizer("EN");

  it("Should recognize different types of entities correctly", function() {
    Object.keys(testCases).forEach(key => {
      var testCase = testCases[key];
      var tokenizedSentence = testCase.sentence.split(/[ \t\r\n]+/);
      var taggedSentence = new Sentence();
      tokenizedSentence.forEach(token => {
        taggedSentence.addTaggedWord(token, null);
      });
      console.log(tokenizedSentence);
      taggedSentence = recognizer.recognize(taggedSentence);
      console.log(taggedSentence);

      if (testCase.position != null) {
        expect(taggedSentence.taggedWords[testCase.position].tag).toEqual(testCase.tag);
      }
    });
  });
});
