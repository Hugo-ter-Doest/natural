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

var fs = require('fs');

var Recognizer = require('../lib/natural/NER/NamedEntityRecognizer');

var testSentences = ["xxxxxx at hz@hotmail.com yyyyyyy",
                     "string as you hwl@terdoest.info can read",
                     "the exact time is 19:20 or so",
                     "9:10",
                     "a date that should be tagged 31/2/2018",
                     "zipcode in context 7559AH is",
                     "https://kennisbank.dimpact.nl/jira",
                     "https://kennisbank.dimpact.nl/jira bla bla Oregon",
                     "asnfhf f sdf €12,59 d sf $12,59"
     ];

var sample = fs.readFileSync("./spec/test_data/Guardian_sample.txt", "utf-8");

var recognizer = new Recognizer("EN");
testSentences.forEach(function(sentence) {
  var chunks = recognizer.recognize(sentence);
  console.log(chunks);
});



var GuardianSentences = sample.split('\n');
GuardianSentences.forEach(function(sentence) {
  var chunks = recognizer.recognize(sentence)
  console.log(chunks);
});


