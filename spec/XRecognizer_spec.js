

var Recognizer = require('../lib/natural/ner/XRecognizer');
var recognizer = new Recognizer({"tagWhitespace": true, "tagPunctuation": true});

const sentences = [
  "Word1 word2 word3 word4",
  "sentence1, sentence2?",
  "sentence1!",
  "\"quote\""
];

sentences.forEach(s => {
  console.log(recognizer.recognize(s));
});
