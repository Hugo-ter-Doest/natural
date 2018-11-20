/*
Main class for named entity recognition
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

var Sentence = require('../brill_pos_tagger/lib/Sentence');
var Tokenizer = require('../tokenizers/regexp_tokenizer');
var RegExpRecognizer = require('./RegExpRecognizer');
var LexiconRecognizer = require('./LexiconRecognizer');
var Chunker = require('./Chunker');

const languageModels = {
  "EN": {
    "tokenizer": Tokenizer.WhitespaceTokenizer,
    // Generic POS lexicon
    "POSLexiconPath": "../brill_pos_tagger/data/English/lexicon_from_posjs.json",
    // Default category
    "defaultCategory" :"UNKNOWN",
    // Consecutive entities build up to complex entities
    "grammarFile": "./lib/natural/NER/English/ChunkGrammar.txt",
    // Chunk list with nonterminals to be recognized as root
    "chunkList": ["NP", "PP"]
  }
};


class NamedEntityRecognizer {
  
  constructor(language) {
    // Create the tokenizer
    this.tokenizer = new languageModels[language].tokenizer();

    // Create regular expression recognizer
    this.regexpRecognizer = new RegExpRecognizer(language);

    // Create lexicon-based recognizer
    this.lexiconRecognizer = new LexiconRecognizer(language);

    // Load the POS lexicon
    this.POSLexicon = require(languageModels[language].POSLexiconPath);
    DEBUG && console.log("POS lexicon loaded, nr entries: " + Object.keys(this.POSLexicon).length)

    // Set the default category
    this.defaultCategory = languageModels[language].defaultCategory;
    
    // Create chunker
    this.chunker = new Chunker(language);
  }


  // In: sentence as string
  // Out: chunk items (CYK items)
  recognize(sentence) {
    // Tokenize sentence
    var tokSentence = this.tokenizer.tokenize(sentence);
    DEBUG && console.log("Tokenized sentence: " + JSON.stringify(tokSentence));

    // Create tagged sentence
    var taggedSentence = new Sentence();
    tokSentence.forEach(word => {
      taggedSentence.addTaggedWord(word, null);
    });
    DEBUG && console.log("Tagged sentence after creation: " + JSON.stringify(taggedSentence))
    
    // Apply regular expression recognizer
    taggedSentence = this.regexpRecognizer.recognize(taggedSentence);
    DEBUG && console.log("Tagged sentence after applying regular expressions: " + JSON.stringify(taggedSentence))
    
    // Apply lexicon-based recognizer
    taggedSentence = this.lexiconRecognizer.recognize(taggedSentence);
    DEBUG && console.log("Tagged sentence after applying lexicons: " + JSON.stringify(taggedSentence));

    // Apply POS tagger for the remaining untagged words
    taggedSentence.taggedWords.forEach(taggedWord => {
      if (taggedWord.tag == null) {
        if (this.POSLexicon[taggedWord.token]) {
          taggedWord.tag = this.POSLexicon[taggedWord.token][0];
        }
        else {
          // not in the lexicon => apply default category
          taggedWord.tag = this.defaultCategory;
        }
      }
    });
    DEBUG && console.log("Tagged sentence after tagging remaining tokens: " + JSON.stringify(taggedSentence));
    
    // Apply chunker
    var chunks = this.chunker.chunk(taggedSentence);
    DEBUG && console.log("Chunks after shallow parsing: " + JSON.stringify(chunks, null ,2))
    
    return chunks;
  }

}

module.exports = NamedEntityRecognizer;
