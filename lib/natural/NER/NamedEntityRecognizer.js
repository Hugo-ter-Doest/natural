const DEBUG = true;
var fs = require('fs');

var languageModels = {
  english: {
    "regExs": {
          // Matches email addresses
          "e-mail": /\b(\w[-._\w]*\w@\w[-._\w]*\w\.\w{2,3})\b/ig,
          // Matches time of the form 19:20
          "time": /\b[0-9]{1,2}:[0-9][0-9]\b/g,
          // This regular expressions matches dates of the form XX/XX/YYYY 
          // where XX can be 1 or 2 digits long and YYYY is always 4 digits long.
          "date": /\b\d{1,2}\/\d{1,2}\/\d{4}\b/g,
          "zipcode": /\b[0-9]{1,4} ?[A-Z]{2}/g,
          // Matches http://210.50.2.215/sd_new/WebBuilder.cgi?RegID=7449046&amp;First=Ok&amp;Upt=Ok&amp;EditPage=3&amp;S
          "uri": /\b([\d\w\.\/\+\-\?\:]*)((ht|f)tp(s|)\:\/\/|[\d\d\d|\d\d]\.[\d\d\d|\d\d]\.|www\.|\.tv|\.ac|\.com|\.edu|\.gov|\.int|\.mil|\.net|\.org|\.biz|\.info|\.name|\.pro|\.museum|\.co)([\d\w\.\/\%\+\-\=\&amp;\?\:\\\&quot;\'\,\|\~\;]*)\b/g,
          "currency": /\b[+-]?[\$€]?[0-9]{1,3}(?:[0-9]*(?:[.,][0-9]{2})?|(?:,[0-9]{3})*(?:\.[0-9]{2})?|(?:\.[0-9]{3})*(?:,[0-9]{2})?)\b/g
         },
    // Lexicon files are plain text word lists.
    // the name of the file (before the extensions) is used as category
    "lexiconFolder": "./lib/natural/NER/English/",
    // Consecutive entities build up to complex entities
    "chunkingPatterns": {
      "NPS": ["NP", "NP"],
      "NPS$": ["NP", "NP$"]
    },
    // The model should accept a sentence together with already recognized edges
    // and return a new set of of edges.
    "model": {
      "lexiconClass": "../brill_pos_tagger/lib/Lexicon",
      "lexiconFile": "./lexicon_brown.json",
      "defaultCategory": "NN",
      "defaultCategoryCapitalized": "NP",
      "classifierClass": "../classifiers/maxent/Classifier",
      "modelFile": "./MaxEntClassifier/classifier.json"
    }
  }
}

function regExpEscape(literal_string) {
    return literal_string.replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, '\\$&');
}

class NamedEntityRecognizer {
  
  constructor(language) {
    this.edges = [];
  
    // Set regular expression
    this.regExs = languageModels[language].regExs;

    // Load vocabularies from the folder 
    this.lexicon = {};
    var path = languageModels[language].lexiconFolder;
    var files = fs.readdirSync(path);
    files.forEach(file => {
      var data = fs.readFileSync(path + file, 'utf-8');
      var cat = file.split('.')[0];
      var words = data.split(/\n/);
      words.forEach(word => {
        this.lexicon[word] = cat;
      });
    });

    /*
    // Create the classifier
    var Classifier = require(languageModels[language].model.classifierClass);
    var classifier = new Classifier();
    classifier = classifier.load(languageModels[language].model.modelFile, require('./MaxEntClassifier/NER_Element'));
    
    // Create a lexicon
    // function Lexicon(filename, defaultCategory, defaultCategoryCapitalised) {
    var Lexicon = require(languageModels[language].model.lexiconClass);
    var lexicon = new Lexicon(languageModels[language].model.lexiconFile, 
      languageModels[language].model.defaultCategory,
      languageModels[language].model.defaultCategoryCapitalized);
    var NER_Model = require('./MaxEntClassifier/NER_Model', lexicon);
    this.model = new NER_Model(classifier, lexicon);
    */
  }
  
  applyRegularExpressions(sentence, edges) {
    var that = this;
    Object.keys(this.regExs).forEach(function(cat) {
      var regex = that.regExs[cat];
      var match = null;
      while (match = regex.exec(sentence)) {
        DEBUG && console.log(match);
        DEBUG && console.log(match.index + ' ' + regex.lastIndex);
        that.edges.push({"matchedString": match[0],
                    "category": cat,
                    "start": match.index,
                    "end": regex.lastIndex
        });
      }
    });
  }
  
  applyLexicon(sentence) {
    var that = this;
    Object.keys(this.lexicon).forEach(word => {
      var pattern = "\\b" + regExpEscape(word) + "\\b";
      var regExp = new RegExp(pattern, "g");
      var match = null;
      while (match = regExp.exec(sentence)) {
        DEBUG && console.log(match);
        DEBUG && console.log(match.index + ' ' + regExp.lastIndex);
        that.edges.push({"matchedString": match[0],
                    "category": that.lexicon[word],
                    "start": match.index,
                    "end": regExp.lastIndex
        });
      }
    });
  }
  
  applyModel(sentence, edges) {
    this.model.findNamedEntities(sentence, edges);
  }
  
  chunkEdges(edges) {
    
  }
  
  // Keep longest edges
  purgeEdges(sentence) {
    var that = this;
    var mapIndexToEdge = {};
    this.edges.forEach(edge => {
      mapIndexToEdge[edge.start] = edge;
    });
  }
  
  recognize(sentence) {
    this.edges = [];
    this.applyRegularExpressions(sentence);
    this.applyLexicon(sentence);
    //this.applyModel(sentence, edges);
    this.purgeEdges();
    return this.edges;
  }

}

module.exports = NamedEntityRecognizer;
