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


var DEBUG = false;

const languageModels = {
  // General regular expressions independent of language or country
  "GEN": {
    // Matches email addresses
    "email": /\b(\w[-._\w]*\w@\w[-._\w]*\w\.\w{2,4})\b/g,
    // Matches time of the form 19:20
    "time": /\b[0-9]{1,2}:[0-9][0-9]\b/g,
    // This regular expressions matches dates of the form XX/XX/YYYY
    // where XX can be 1 or 2 digits long and YYYY is always 4 digits long.
    "date": /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g,
    // Matches http://210.50.2.215/sd_new/WebBuilder.cgi?RegID=7449046&amp;First=Ok&amp;Upt=Ok&amp;EditPage=3&amp;S
    "uri": /\b([\d\w\.\/\+\-\?\:]*)((ht|f)tp(s|)\:\/\/|[\d\d\d|\d\d]\.[\d\d\d|\d\d]\.|www\.|\.tv|\.ac|\.com|\.edu|\.gov|\.int|\.mil|\.net|\.org|\.biz|\.info|\.name|\.pro|\.museum|\.co)([\d\w\.\/\%\+\-\=\&amp;\?\:\\\&quot;\'\,\|\~\;]*)\b/g,
    "amount": /[+-]?[\$€][0-9]{1,3}(?:[0-9]*(?:[\.\,][0-9]{2})?|(?:,[0-9]{3})*(?:\.[0-9]{2})?|(?:\.[0-9]{3})*(?:,[0-9]{2})?)/g,
    "number": /((\d+)|((\d+)[\.\,](\d+)))/g
  },
  // English
  "EN": {
      // US zip code format
      "zipcode": /\b([0-9]{5}-[0-9]{4})\b/g
  },
  // Dutch
  "DU": {
    // Dutch phone number
    "phone": /\b0\d{9}\b/g,
    // Dutch zip code format
    "zipcode": /\b[0-9]{4}[\w]{2}\b/g
  }
};

const defaultLanguage = "EN";

class RegExpRecognizer {

  constructor(language) {
    this.language = defaultLanguage;
    if (language) {
      this.language = language;
    }
    this.regExps = languageModels["GEN"];
    Object.keys(languageModels[this.language]).forEach(key => {
      this.regExps[key] = languageModels[this.language][key];
    });
  }


  // input: a string
  // output: an array of {start, end, string}
  recognize(s) {
    var that = this;
    var matches = [];
    Object.keys(that.regExps).forEach(cat => {
      var regex = that.regExps[cat];
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

    // Checks if a match is inside another match
    function inside(m1, m2) {
      return (m2.start <= m1.start && m1.end <= m2.end && m1.length < m2.length);
    }

    // Prune matches
    var remove = new Array(matches.length);
    matches.forEach((m1, i) => {
      matches.forEach((m2, j) => {
        if (inside(m1, m2)) {
            remove[i] = true;
        }
        else {
          if (inside(m2, m1)) {
            remove[j] = true;
          }
        }
      })
    })

    var newMatches = [];
    matches.forEach((m, i) => {
      if (!remove[i]) {
        newMatches.push(matches[i])
      }
    });

    return newMatches;
  }

}

module.exports = RegExpRecognizer;
