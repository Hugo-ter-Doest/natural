


var DEBUG = false;

var regExpsG = {
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
};

class RegExpRecognizer {

  constructor(newRegExps) {
    newRegExps ? this.regExps = newRegExps : this.regExps = regExpsG;
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
