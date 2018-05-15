/*
  Element class for NER
  Copyright (C) 2018 Hugo W.L. ter Doest

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var DEBUG = false;

var util = require('util');
var Element = require('../../classifiers/maxent/Element');
var Feature = require('../../classifiers/maxent/Feature');

function NER_Element(a, b) {
   NER_Element.super_.call(this, a, b);
}

util.inherits(NER_Element, Element);

function startsWithCapital(word) {
  // We use unicode character sets to be prepared for languages other than English 
  return word.match(/^\p{Lu}\p{Ll}*$/) != null;
}

function isFullCapitalized(word) {
  // We use unicode character sets to be prepared for languages other than English 
  return word.match(/^\p{Lu}+$/) != null;
}

// Proper noun tags for the Brown corpus:
// NP	proper noun or part of name phrase
// NP$	possessive proper noun
// NPS	plural proper noun
// NPS$	possessive plural proper noun
function tagIsProperNounTag(tag) {
  var res = ["NP", "NP$", "NPS", "NPS$"].indexOf(tag) > -1;
  DEBUG && console.log("tagIsProperNounTag(" + tag + ") = " + res);
  return res;
}

NER_Element.prototype.generateFeatures = function(featureSet) {
  var context = this.b.data;
  var isPN = this.a;
  var token = context.wordWindow["0"];

  
  // Feature for the current word and tag
  function wordTagFeature(x) {
    if ((x.b.data.wordWindow["0"] === token) &&
        (x.a === isPN)) {
        return 1;
    }
    return 0;
  }
  featureSet.addFeature(new Feature(wordTagFeature, "wordTagFeature", ["0", token, "isPN", isPN]));
  
  
  // Feature for capitalization (first character)
  function wordStartsWithCapital(x) {
    if ((startsWithCapital(x.b.data.wordWindow["0"]) === startsWithCapital(token)) &&
        (x.a === isPN)) {
        return 1;
    }
    return 0;
  }
  featureSet.addFeature(new Feature(wordStartsWithCapital, "wordStartsWithCapital", ["0", token, "isPN", isPN]));
    
  
  // feature for full capitalization
  function wordIsFullCapitalized(x) {
    if ((isFullCapitalized(x.b.data.wordWindow["0"]) == isFullCapitalized(token)) &&
        (x.a === isPN)) {
        return 1;
    }
    return 0;
  }
  featureSet.addFeature(new Feature(wordIsFullCapitalized, "wordIsFullCapitalized", ["0", token, "isPN", isPN]));
  
  
  // Previous word is a proper noun
  if (context.tagWindow["-1"]) {
    var prevTag = context.tagWindow["1"];
    function previousWordIsProperNoun(x) {
      if ((tagIsProperNounTag(x.b.data.tagWindow["-1"]) === tagIsProperNounTag(prevTag)) &&
          (x.a === isPN)) {
          return 1;
      }
      return 0;
    }
    featureSet.addFeature(new Feature(previousWordIsProperNoun, "previousWordIsProperNoun", ["-1", prevTag, "isPN", isPN]));
  }
  
  
  // Next word is a proper noun
  if (context.tagWindow["1"]) {
    var nextTag = context.tagWindow["1"];
    function nextWordIsProperNoun(x) {
      if ((tagIsProperNounTag(x.b.data.tagWindow["1"]) === tagIsProperNounTag(nextTag)) &&
          (x.a === isPN)) {
          return 1;
      }
      return 0;
    }
    featureSet.addFeature(new Feature(nextWordIsProperNoun, "nextWordIsProperNoun", ["1", nextTag, "isPN", isPN]));
  }
    
  
  // Feature for previous bigram (previous two tags), positions -2, -1
  if (context.tagWindow["-2"]) {
    var prevPrevTag = context.tagWindow["-2"];
    var prevTag = context.tagWindow["-1"];
    function prevBigram(x) {
      if ((x.a === isPN) &&
          (x.b.data.tagWindow["-2"] === prevPrevTag) &&
          (x.b.data.tagWindow["-1"] === prevTag)) {
          return 1;
        }
      return 0;
    }
    featureSet.addFeature(new Feature(prevBigram, "prevBigram", ["isPN", isPN, "-2", prevPrevTag, "-1", prevTag]));
  }
  
  
  // Feature for next bigram (next two tags), positions 1 and 2
  if (context.tagWindow["2"]) {
    var nextTag = context.tagWindow["1"];
    var nextNextTag = context.tagWindow["2"];
    function nextBigram(x) {
      if ((x.a === isPN) &&
          (x.b.data.tagWindow["1"] === nextTag) &&
          (x.b.data.tagWindow["2"] === nextNextTag)) {
          return 1;
        }
      return 0;
    }
    featureSet.addFeature(new Feature(nextBigram, "nextBigram", ["isPN", isPN, "1", nextTag, "2", nextNextTag]));
  }

  
  // Feature that looks at the left bigram words
  if (context.wordWindow["-1"]) {
    var prevWord = context.wordWindow["-1"];
    function leftBigramWords(x) {
      if ((x.a === isPN) &&
          (x.b.data.wordWindow["0"] === token) &&
          (x.b.data.wordWindow["-1"] === prevWord)) {
          return 1;
        }
      return 0;
    }
    featureSet.addFeature(new Feature(leftBigramWords, "leftBigramWords", ["isPN", isPN, "0", token, "-1", prevWord]));
  }

  
  // Feature that looks at the right bigram words
  if (context.wordWindow["1"]) {
    var nextWord = context.wordWindow["1"];
    function rightBigramWords(x) {
      if ((x.a === isPN) &&
          (x.b.data.wordWindow["0"] === token) &&
          (x.b.data.wordWindow["1"] === nextWord)) {
          return 1;
        }
      return 0;
    }
    featureSet.addFeature(new Feature(rightBigramWords, "rightBigramWords", ["isPN", isPN, "0", token, "1", nextWord]));
  }
};

module.exports = NER_Element;
