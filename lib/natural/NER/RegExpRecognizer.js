


var DEBUG = false;


class RegExpRecognizer {

  constructor(newRegExps) {
    this.regExps = newRegExps;
  }
  

  // input: a Sentence object
  // output: a Sentence object
  recognize(taggedSentence) {
    var that = this;
    taggedSentence.taggedWords.forEach(taggedWord => {
      if (!taggedWord.tag) {
        Object.keys(that.regExps).some(cat => {
          var regex = that.regExps[cat];
          if (regex.test(taggedWord.token)) {
            DEBUG && console.log(taggedWord.token + " is " + cat);
            taggedWord.tag = cat;
            // Stop looking for matches
            DEBUG && console.log('Found a matching regexp, stop looking');
            return true;
          }
          else {
            // Keep looking
            DEBUG && console.log('Regexp for ' + cat + ' did not match, keep looking');
            return false;
          }
        });
      }
    });
    return taggedSentence;
  }
}

module.exports = RegExpRecognizer;
