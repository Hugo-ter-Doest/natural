var fs = require('fs');

var Recognizer = require('../lib/natural/NER/NamedEntityRecognizer');

var testSentences = ["this is an email address hz@hotmail.com", 
                     "string as you hwl@terdoest.info can read",
                     "the exact time is 19:20 or so",
                     "9:10",
                     "a date that should be tagged 31/2/2018",
                     "zipcode in context 7559AH is",
                     "https://kennisbank.dimpact.nl/jira",
                     "https://kennisbank.dimpact.nl/jira bla bla Oregon",
                     "asnfhf f sdf €12,59 d sf $12,59"
     ];

var sample = fs.readFileSync("./spec/test_data/Guardian_sample.txt", "utf-8");

var recognizer = new Recognizer("english");
testSentences.forEach(function(sentence) {
  var edges = recognizer.recognize(sentence)
  console.log(edges);
});


var GuardianSentences = sample.split('\n');
GuardianSentences.forEach(function(sentence) {
  var edges = recognizer.recognize(sentence)
  console.log(edges);
});

