

const DEBUG = true;

const whitespaceRegex = /\s+/g;
const punctuationRegex = /[~`!@#$%^&*(){}\[\];:"'<,.>?\/\\|_+=-]/g;

class XRecognizer {

  constructor(config) {
    this.regexs = {};
    if (config.tagWhitespace) {
      this.regexs.whitespace = whitespaceRegex;
    }
    if (config.tagPunctuation) {
      this.regexs.punctuation = punctuationRegex;
    }
  };

  recognize(s) {
    var matches = [];

    Object.keys(this.regexs).forEach(cat => {
      var regex = this.regexs[cat];
      var match = null;
      while (match = regex.exec(s)) {
        var m = {
          "start": match.index,
          "end": regex.lastIndex,
          "cat" : cat,
          "length": match[0].length,
          "string": s.substr(match.index, match[0].length)
        }
        matches.push(m);
        DEBUG && console.log(m);
      }
    });

    return matches;
  }
}

module.exports = XRecognizer;
