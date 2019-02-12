/*
A named entity recognizer based on regular expressions
Copyright (c) 2019, Hugo W.L. ter Doest

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


var DEBUG = true;

const languageModels = {
  "EN": {
      // Matches email addresses
      "email": /\b(\w[-._\w]*\w@\w[-._\w]*\w\.\w{2,4})\b/g,
      // Matches time of the form 19:20
      "time": /\b[0-9]{1,2}:[0-9][0-9]\b/g,
      // This regular expressions matches dates of the form XX/XX/YYYY
      // where XX can be 1 or 2 digits long and YYYY is always 4 digits long.
      "date": /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g,
      // US zip code format
      "zipcode": /\b([0-9]{5}-[0-9]{4})\b/g,
      // Matches http://210.50.2.215/sd_new/WebBuilder.cgi?RegID=7449046&amp;First=Ok&amp;Upt=Ok&amp;EditPage=3&amp;S
      "uri": /\b([\d\w\.\/\+\-\?\:]*)((ht|f)tp(s|)\:\/\/|[\d\d\d|\d\d]\.[\d\d\d|\d\d]\.|www\.|\.tv|\.ac|\.com|\.edu|\.gov|\.int|\.mil|\.net|\.org|\.biz|\.info|\.name|\.pro|\.museum|\.co)([\d\w\.\/\%\+\-\=\&amp;\?\:\\\&quot;\'\,\|\~\;]*)\b/g,
      "amount": /\b[+-]?[\$€][0-9]{1,3}(?:[0-9]*(?:[\.\,][0-9]{2})?|(?:,[0-9]{3})*(?:\.[0-9]{2})?|(?:\.[0-9]{3})*(?:,[0-9]{2})?)\b/g,
      "number": /\b((\d+)|((\d+)[\.\,](\d+)))\b/g
  }
};

const defaultLanguage = "EN";

class RegExpRecognizer {

  constructor(language) {
    this.language = defaultLanguage;
    if (language) {
      this.language = language;
    }
    this.regExps = languageModels[this.language];
  }


  // input: a string
  // output: an array of {start, end, string}
  recognize(s) {
    var that = this;
    var matches = [];
    Object.keys(that.regExps).forEach(cat => {
      var regex = that.regExps[cat];
      while (var match = regex.exec(str)) {
        matches.push({
          start: match.index,
          end: patt.lastIndex,
          s: match
        });
        DEBUG && console.log(match + ' ' + match.index + ' ' + patt.lastIndex);
      }
    });
  }
  return matches;
}

module.exports = RegExpRecognizer;
