/*
    Unit test for CYKParser.js
    Copyright (C) 2015 Hugo W.L. ter Doest

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

var fs = require('fs');

var Sentence = require('../lib/natural/brill_pos_tagger/lib/Sentence');
var GrammarParser = require('../lib/natural/parsers/GrammarParser');
var Parser = require('../lib/natural/parsers/CYKParser');
var Item = require('../lib/natural/parsers/CYKItem');


var path = './spec/test_data/';
var lexicon_file = '';
var grammar_file = path + 'test_grammar_for_CYK.txt';

// Grammar (in ../data/test_grammar_for_CYK.txt)
//S  -> NP VP
//NP -> DET N
//NP -> NP PP
//PP -> P NP
//VP -> V NP
//VP -> VP PP

// Lexicon
//DET -> the
//NP -> I
//N -> man
//N -> telescope
//P -> with
//V -> saw
//N -> cat
//N -> dog
//N -> pig
//N -> hill
//N -> park
//N -> roof
//P -> from
//P -> on
//P -> in

describe('CYK Parser', function() {
  var grammar_text;
  it('should read a text file', function(done) {
    fs.readFile(grammar_file, 'utf8', function (error, text) {
      expect(text).toBeDefined();
      grammar_text = text;
      done();
    });
  });

  var grammar = null;
  it('should parse the text file with the grammar', function() {
    grammar = GrammarParser.parse(grammar_text);
  });

  it('should parse a sentence', function() {
    var taggedSentence = new Sentence();
    taggedSentence.addTaggedWord('I', 'NP');
    taggedSentence.addTaggedWord('saw', 'V');
    taggedSentence.addTaggedWord('the', 'DET');
    taggedSentence.addTaggedWord('man', 'N');
    taggedSentence.addTaggedWord('with', 'P');
    taggedSentence.addTaggedWord('the', 'DET');
    taggedSentence.addTaggedWord('telescope', 'N');

    var N = taggedSentence.length;
    var parser = new Parser(grammar);
    var chart = parser.parse(taggedSentence);
    var parses = chart.fullParseItems(parser.grammar.getStartSymbol(), "cykitem");
    expect(parses.length).toEqual(2);
    var expectedItem = new Item({
      rule: {'lhs': 'S', 'rhs': ['NP', 'VP']},
      from: 0,
      to: 7
    });
    expect(parses[0].id, expectedItem.id).toEqual(expectedItem.id);
    expect(parses[1].id, expectedItem.id).toEqual(expectedItem.id);
  });
});
