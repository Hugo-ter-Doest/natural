const DEBUG = true;

var RegExpRecognizer = require('./RegExpRecognizer');
var LexiconRecognizer = require('./LexiconRecognizer');
var Chunker = require('./Chunker');

const languageModels = {
  "EN": {
    "tokenizer": require('../tokenizers/tokenizer'),
    "regExps": {
      // Matches email addresses
      "e-mail": /\b(\w[-._\w]*\w@\w[-._\w]*\w\.\w{2,3})\b/i,
      // Matches time of the form 19:20
      "time": /\b[0-9]{1,2}:[0-9][0-9]\b/,
      // This regular expressions matches dates of the form XX/XX/YYYY
      // where XX can be 1 or 2 digits long and YYYY is always 4 digits long.
      "date": /\b\d{1,2}\/\d{1,2}\/\d{4}\b/,
      "zipcode": /\b[0-9]{1,4} ?[A-Z]{2}/,
      // Matches http://210.50.2.215/sd_new/WebBuilder.cgi?RegID=7449046&amp;First=Ok&amp;Upt=Ok&amp;EditPage=3&amp;S
      "uri": /\b([\d\w\.\/\+\-\?\:]*)((ht|f)tp(s|)\:\/\/|[\d\d\d|\d\d]\.[\d\d\d|\d\d]\.|www\.|\.tv|\.ac|\.com|\.edu|\.gov|\.int|\.mil|\.net|\.org|\.biz|\.info|\.name|\.pro|\.museum|\.co)([\d\w\.\/\%\+\-\=\&amp;\?\:\\\&quot;\'\,\|\~\;]*)\b/,
      "currency": /[+-]?[\$€][0-9]{1,3}(?:[0-9]*(?:[.,][0-9]{2})?|(?:,[0-9]{3})*(?:\.[0-9]{2})?|(?:\.[0-9]{3})*(?:,[0-9]{2})?)/,
      "number": /^(([1-9]*)|(([1-9]*)[\.\,]([0-9]*)))$/
    },
    // Lexicon files are plain text word lists.
    // the name of the file (before the extensions) is used as category
    "namedEntityLexiconPath": "./lib/natural/NER/English/Lexicons/",
    // Generic POS lexicon
    "POSLexiconPath": "./lib/natural/brill_pos_tagger/data/English/lexicon_from_pos_js.json",
    // Default category
    "defaultCategory" :"UNKNOWN",
    // Consecutive entities build up to complex entities
    "grammarFile": "./English/ChunkGrammar.txt"
  }
};


class NamedEntityRecognizer {
  
  constructor(language) {
    // Create the tokenizer
    this.tokenizer = new languageModels[language].tokenizer;

    // Create regular expression recognizer
    this.regexpRecognizer = new RegExpRecognizer(languageModels[language].regExps);

    // Create lexicon-based recognizer
    this.lexiconRecognizer = new LexiconRecognizer(languageModels[language].namedEntityLexiconPath);

    // Load the POS lexicon
    this.POSLexicon = require(languageModels[language].POSLexiconPath);

    // Set the default category
    this.defaultCategory = languageModels[language].defaultCategory;
    
    // Create chunker
    this.chunker = new Chunker(languageModels[language].grammarFile);    
  }


  // In: sentence as string
  // Out: chunk items (CYK items)
  recognize(sentence) {
    // Tokenize sentence
    var tokSentence = this.tokenizer.tokenize(sentence);
    DEBUG && console.log("Tokenized sentence: " + tokSentence);

    // Create tagged sentence
    var taggedSentence = new Sentence();
    tokSentence.forEach(word => {
      taggedSentence.addTaggedWord({
        token: word,
        tag: null
      });
    });
    DEBUG && console.log("Tagged sentence after creation: " + taggedSentence)
    
    // Apply regular expression recognizer
    taggedSentence = this.regexpRecognizer.recognize(taggedSentence);
    DEBUG && console.log("Tagged sentence after applying regular expressions: " + taggedSentence)
    
    // Apply lexicon-based recognizer
    taggedSentence = this.lexiconRecognizer.recognize(taggedSentence);
    DEBUG && console.log("Tagged sentence after applying lexicons: " + taggedSentence);

    // Apply POS tagger for the remaining untagged words
    taggedSentence.forEach(taggedWord => {
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
    DEBUG && console.log("Tagged sentence after tagging remaining tokens: " + taggedSentence);
    
    // Apply chunker
    var chunks = this.chunker.chunk(taggedSentence);
    DEBUG && console.log("Chunks after shallow parsing: " + chunks)
    
    return chunks;
  }

}

module.exports = NamedEntityRecognizer;
