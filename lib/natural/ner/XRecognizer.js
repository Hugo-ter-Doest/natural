/*
	Copyright (c) 2019, Hugo ter Doest

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

const DEBUG = false;

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
