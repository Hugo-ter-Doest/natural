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


var Recognizer = require('../lib/natural/ner/LexiconRecognizer');
var recognizer = new Recognizer("EN");

const DEBUG = false;

const sentences = [
  // Single word named entity in single word sentence
  "Susan",
  // Single word named entity at the beginning of a sentence
  "Susan is a a first name",
  // Single word named entity in the middle of a sentence
  "We think Germany is a beautiful country",
  // Single word named entity at the end of a sentence
  "Another country in Europe",

  // Multi word named entity as a sentence
  "District Of Columbia",
  // Multi word named entity at the start of a sentence
  "District Of Columbia is a district",
  // Multi word named entity in the middle of a sentence
  "The state called District Of Columbia is a district",
  // Multi word named entity at the end of a sentence
  "The state called District Of Columbia",

  // Multiple named entities in a sentence
  "Both Susan and Alice are first and last names"
];

const expectedResults = [
  [ { start: 0,
    end: 4,
    namedEntity: 'Susan',
    string: 'Susan',
    cat: 'firstName',
    length: 5 },
    { start: 0,
      end: 4,
      namedEntity: 'Susan',
      string: 'Susan',
      cat: 'lastName',
      length: 5 } ],

  [ { start: 0,
    end: 4,
    namedEntity: 'Susan',
    string: 'Susan',
    cat: 'firstName',
    length: 5 },
    { start: 0,
      end: 4,
      namedEntity: 'Susan',
      string: 'Susan',
      cat: 'lastName',
      length: 5 } ],

  [ { start: 9,
    end: 15,
    namedEntity: 'Germany',
    string: 'Germany',
    cat: 'country',
    length: 7 },
    { start: 9,
      end: 15,
      namedEntity: 'Germany',
      string: 'Germany',
      cat: 'lastName',
      length: 7 } ],

  [ { start: 19,
    end: 24,
    namedEntity: 'Europe',
    string: 'Europe',
    cat: 'lastName',
    length: 6 } ],

  [ { start: 0,
    end: 19,
    namedEntity: 'District Of Columbia',
    string: 'District Of Columbia',
    cat: 'stateUSA',
    length: 20 } ],

  [ { start: 0,
    end: 19,
    namedEntity: 'District Of Columbia',
    string: 'District Of Columbia',
    cat: 'stateUSA',
    length: 20 } ],

  [ { start: 17,
    end: 36,
    namedEntity: 'District Of Columbia',
    string: 'District Of Columbia',
    cat: 'stateUSA',
    length: 20 } ],

  [ { start: 17,
    end: 36,
    namedEntity: 'District Of Columbia',
    string: 'District Of Columbia',
    cat: 'stateUSA',
    length: 20 } ],

  [ { start: 15,
    end: 19,
    namedEntity: 'Alice',
    string: 'Alice',
    cat: 'firstName',
    length: 5 },
    { start: 15,
      end: 19,
      namedEntity: 'Alice',
      string: 'Alice',
      cat: 'lastName',
      length: 5 },
    { start: 5,
      end: 9,
      namedEntity: 'Susan',
      string: 'Susan',
      cat: 'firstName',
      length: 5 },
    { start: 5,
      end: 9,
      namedEntity: 'Susan',
      string: 'Susan',
      cat: 'lastName',
      length: 5 },
    { start: 0,
      end: 3,
      namedEntity: 'Both',
      string: 'Both',
      cat: 'lastName',
      length: 4 } ]
];

// Test cases for case insensitive
const sentencesCI = [
  // Single word named entity in single word sentence
  "susan",
  // Single word named entity at the beginning of a sentence
  "susan is a a first name",
  // Single word named entity in the middle of a sentence
  "We think germany is a beautiful country",
  // Single word named entity at the end of a sentence
  "Another country in europe"
];

const expectedResultsCI = [
  [ { start: 0,
    end: 4,
    namedEntity: 'Susan',
    string: 'susan',
    cat: 'firstName',
    length: 5 },
    { start: 0,
      end: 4,
      namedEntity: 'Susan',
      string: 'susan',
      cat: 'lastName',
      length: 5 } ],

  [ { start: 0,
    end: 4,
    namedEntity: 'Susan',
    string: 'susan',
    cat: 'firstName',
    length: 5 },
    { start: 0,
      end: 4,
      namedEntity: 'Susan',
      string: 'susan',
      cat: 'lastName',
      length: 5 },
    { start: 13,
      end: 17,
      namedEntity: 'First',
      string: 'first',
      cat: 'lastName',
      length: 5 } ],

  [ { start: 9,
    end: 15,
    namedEntity: 'Germany',
    string: 'germany',
    cat: 'country',
    length: 7 },
    { start: 9,
      end: 15,
      namedEntity: 'Germany',
      string: 'germany',
      cat: 'lastName',
      length: 7 } ],

  [ { start: 16,
    end: 17,
    namedEntity: 'In',
    string: 'in',
    cat: 'firstName',
    length: 2 },
    { start: 16,
      end: 17,
      namedEntity: 'In',
      string: 'in',
      cat: 'lastName',
      length: 2 },
    { start: 19,
      end: 24,
      namedEntity: 'Europe',
      string: 'europe',
      cat: 'lastName',
      length: 6 } ]
];

// Test case for recognition without looking at word boundaries
const sentencesWB = [
  // Single word named entity in single word sentence
  "Susa",
  // Single word named entity at the beginning of a sentence
  "Sus is a a first name",
  // Single word named entity in the middle of a sentence
  "We think Mitche is a beautiful name",
  // Single word named entity at the end of a sentence
  "Another country in Europe"
];

const expectedResultsWB = [
  [ { start: 0,
    end: 3,
    namedEntity: 'Susa',
    string: 'Susa',
    cat: 'lastName',
    length: 4 } ],

    [ { start: 0,
      end: 1,
      namedEntity: 'Su',
      string: 'Su',
      cat: 'firstName',
      length: 2 },
    { start: 0,
      end: 1,
      namedEntity: 'Su',
      string: 'Su',
      cat: 'lastName',
      length: 2 } ],

    [ { start: 9,
      end: 13,
      namedEntity: 'Mitch',
      string: 'Mitch',
      cat: 'firstName',
      length: 5 },
    { start: 9,
      end: 13,
      namedEntity: 'Mitch',
      string: 'Mitch',
      cat: 'lastName',
      length: 5 } ],

    [ { start: 0,
      end: 2,
      namedEntity: 'Ano',
      string: 'Ano',
      cat: 'lastName',
      length: 3 },
    { start: 19,
      end: 24,
      namedEntity: 'Europe',
      string: 'Europe',
      cat: 'lastName',
      length: 6 } ]

];

describe("Lexicon-based named entity recognizer", function() {
  sentences.forEach((sentence, index) => {
    it("should recognize named entities", function() {
      var matches = recognizer.recognizeInString(sentence, true, true);
      DEBUG && console.log(matches);
      expect(matches).toEqual(expectedResults[index]);
    });
  });
  sentencesCI.forEach((sentence, index) => {
    it("should recognize named entities in case insensitive mode", function() {
      var matches = recognizer.recognizeInString(sentence, false, true);
      DEBUG && console.log(matches);
      expect(matches).toEqual(expectedResultsCI[index]);
    });
  });
  sentencesWB.forEach((sentence, index) => {
    it("should recognize named entities without considering word boundaries", function() {
      var matches = recognizer.recognizeInString(sentence, true, false);
      DEBUG && console.log(matches);
      expect(matches).toEqual(expectedResultsWB[index]);
    });
  });
});



