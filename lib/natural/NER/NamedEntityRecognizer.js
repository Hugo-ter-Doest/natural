const DEBUG = true;
var fs = require('fs');

const languageModels = {
  "EN": {
    "tokenizer": require('../tokenizers/tokenizer'),
    "regExs": {
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
    "lexiconFolder": "./English/Lexicons",
    // Consecutive entities build up to complex entities
    "grammarFile": "./English/ChunkGrammar.txt"
  }
}


class NamedEntityRecognizer {
  
  constructor(language) {  
    // Create regular expression recognizer
    this.regexpRecognizer = new RegExpRecognizer(languageModels[language].regExs);

    // Create lexicon-based recognizer
    this.lexiconRecognizer = new LexiconRecognizer(languageModels[language].lexiconFolder);
    
    // Create chunker
    this.chunker = new Chunker(languageModels[language].grammarFile);    
  }
  
  // In: sentence as string
  // Out: chunk items (CYK items)
  recognize(sentence) {
    // Tokenize sentence
    var splitSentence = sentence.split(/\t\n\r /);
    
    // Create tagged sentence
    var taggedSentence = new Sentence();
    splitSentence.forEach(word => {
      taggedSentence.addTaggedWord({
        token: word,
        tag: null
      });
    });
    
    // Apply regular expression recognizer
    taggedSentence = this.regexpRecognizer.recognize(taggedSentence);
    
    // Apply lexicon-based recognizer
    taggedSentence = this.lexiconRecognizer.recognize(taggedSentence);
    
    // Apply chunker
    var chunks = this.chunker.chunk(taggedSentence);
    
    return chunks;
  }

}


module.exports = NamedEntityRecognizer;
