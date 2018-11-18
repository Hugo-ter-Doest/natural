/*
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


var DEBUG = false;

const languageModels = {
  "EN": {
      // Matches email addresses
      "email": /\b(\w[-._\w]*\w@\w[-._\w]*\w\.\w{2,4})\b/i,
      // Matches time of the form 19:20
      "time": /\b[0-9]{1,2}:[0-9][0-9]\b/,
      // This regular expressions matches dates of the form XX/XX/YYYY
      // where XX can be 1 or 2 digits long and YYYY is always 4 digits long.
      "date": /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/,
      // US zip code format
      "zipcode": /\b([0-9]{5}-[0-9]{4})\b/,
      // Matches http://210.50.2.215/sd_new/WebBuilder.cgi?RegID=7449046&amp;First=Ok&amp;Upt=Ok&amp;EditPage=3&amp;S
      "uri": /\b([\d\w\.\/\+\-\?\:]*)((ht|f)tp(s|)\:\/\/|[\d\d\d|\d\d]\.[\d\d\d|\d\d]\.|www\.|\.tv|\.ac|\.com|\.edu|\.gov|\.int|\.mil|\.net|\.org|\.biz|\.info|\.name|\.pro|\.museum|\.co)([\d\w\.\/\%\+\-\=\&amp;\?\:\\\&quot;\'\,\|\~\;]*)\b/,
      "amount": /[+-]?[\$€][0-9]{1,3}(?:[0-9]*(?:[.,][0-9]{2})?|(?:,[0-9]{3})*(?:\.[0-9]{2})?|(?:\.[0-9]{3})*(?:,[0-9]{2})?)/,
      "number": /\b(([1-9]*)|(([1-9]*)[\.\,]([0-9]*)))\b/
  }
};


class RegExpRecognizer {

  constructor(language) {
    this.language = language;
    this.regExps = languageModels[language];
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
