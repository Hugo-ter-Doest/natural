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
    "chunkingPatterns": [
      "NPS": ["NP", "NP"],
      "NPS$": ["NP", "NP$"]
    ],
    // The model should accept a sentence together with already recognized edges
    // and return a new set of of edges.
    "model": {
      "class": "../../classifiers/maxent/Classifier",
      "modelFile": "./MaxEntClassifier/classifier.json"
    }
  }
}

function regExpEscape(literal_string) {
    return literal_string.replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, '\\$&');
}

class NamedEntityRecognizer {
  
  constructor(language) {
  
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
    
    // Set the model
    var modelClass = require(languageModels[language].model.class);
    var classifier = new modelClass();
    classifier = classifier.load(languageModels[language].model.modelFile, NER_Element);
    // Create a lexicon
    
    this.model = new NER_Model(classifier, lexicon);
  }
  
  applyRegularExpressions(sentence, edges) {
    var that = this;
    Object.keys(this.regExs).forEach(function(cat) {
      var regex = that.regExs[cat];
      var match = null;
      while (match = regex.exec(sentence)) {
        DEBUG && console.log(match);
        DEBUG && console.log(match.index + ' ' + regex.lastIndex);
        edges.push({"matchedString": match[0],
                    "category": cat,
                    "start": match.index,
                    "end": regex.lastIndex
        });
      }
    });
  }
  
  applyLexicon(sentence, edges) {
    Object.keys(this.lexicon).forEach(word => {
      var pattern = "\\b" + regExpEscape(word) + "\\b";
      var regExp = new RegExp(pattern, "g");
      var match = null;
      while (match = regExp.exec(sentence)) {
        DEBUG && console.log(match);
        DEBUG && console.log(match.index + ' ' + regex.lastIndex);
        edges.push({"matchedString": match[0],
                    "category": this.lexicon[word],
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
  purgeEdges(sentence, edges) {
    mapIndexToEdge = {};
    edges.forEach(edge => {
      mapIndexToEdge[edge.start] = edge;
    });
    return edges;
  }
  
  recognize(sentence) {
    var edges = [];
    this.applyRegularExpressions(sentence, edges);
    this.applyLexicon(sentence, edges);
    this.applyModel(sentence, edges);
    return this.purgeAndChunkEdges(edges);
  }

}

module.exports = NamedEntityRecognizer;