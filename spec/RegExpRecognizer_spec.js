

var Sentence = require('../lib/natural/brill_pos_tagger/lib/Sentence');
//var Tokenizer = require('../lib/natural/tokenizers/aggressive_tokenizer');
var Recognizer = require('../lib/natural/NER/RegExpRecognizer');

var testSentences = ["this is an email address hz@hotmail.com",
  "https://kennisbank.dimpact.nl/jira",
  "https://kennisbank.dimpact.nl/jira/nextpage/page",
  "string as you hwl@terdoest.info can read",
  "the exact time is 19:20 or so",
  "9:10",
  "a date that should be tagged 31/2/2018",
  "zipcode in context 7559AH is",
  "https://kennisbank.dimpact.nl/jira",
  "asnfhf f sdf 12,59 d sf $12,59 12.49"
];


var recognizer = new Recognizer();
testSentences.forEach(sentence => {
  console.log(sentence);
  //var tokenizedSentence = tokenizer.tokenize(sentence);
  var tokenizedSentence = sentence.split(/[ \t\r\n]+/);
  console.log(tokenizedSentence);
  var taggedSentence = new Sentence();
  tokenizedSentence.forEach(token => {
    taggedSentence.addTaggedWord(token, null);
  });
  console.log(taggedSentence);
  taggedSentence = recognizer.recognize(taggedSentence);
  console.log(taggedSentence);
});
