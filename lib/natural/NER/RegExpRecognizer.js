

var Sentence = require('../brill_pos_tagger/lib/Sentence');

var DEBUG = true;

var regExpsG = {
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
  "currency": /[+-]?[\$€][0-9]{1,3}(?:[0-9]*(?:[.,][0-9]{2})?|(?:,[0-9]{3})*(?:\.[0-9]{2})?|(?:\.[0-9]{3})*(?:,[0-9]{2})?)/g,
  "number": /^(([1-9]*)|(([1-9]*)[\.\,]([0-9]*)))$/
};

class RegExpRecognizer {

  constructor(newRegExps) {
    newRegExps ? this.regExps = newRegExps : this.regExps = regExpsG;
  }

  // input: a tokenized sentence, i.e. an array of tokens
  // output: a TaggedSentence
  recognize(sentence) {
    var that = this;
    var taggedSentence = new Sentence();
    sentence.forEach(token => {
      if (!Object.keys(this.regExps).some(function(cat) {
        var regex = that.regExps[cat];
          var match = null;
          if (match = regex.exec(token)) {
            DEBUG && console.log(match + " is " + cat);
            DEBUG && console.log(match.index + ' ' + regex.lastIndex);
            taggedSentence.addTaggedWord(token, cat);
            // Stop looking for matches
            return true;
          }
          else {
            // Keep looking
            return false;
          }
        })) {
          DEBUG && console.log(token + ': no matches for this token');
          taggedSentence.addTaggedWord(token, null);
        }
      });
    return taggedSentence;
  }
}

module.exports = RegExpRecognizer;
