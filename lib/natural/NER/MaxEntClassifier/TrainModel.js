
var fs = require('fs');
const DEBUG = true; 
const BROWN = 1;
const nrIterations = 2;
const minImprovement = 0.01;
const brownCorpusFilepath = '../../../../spec/test_data/browntag_nolines_excerpt.txt';
const classifierFilepath = "./classifier.json";

var Corpus = require('./NER_Corpus');
var Sentence = require('./NER_Sentence');
var FeatureSet = require('../../classifiers/maxent/FeatureSet');
var Classifier = require('../../classifiers/maxent/Classifier');


// Load the Brown corpus
var data = fs.readFileSync(brownCorpusFilepath, 'utf-8');
var corpus = new Corpus(data, BROWN, Sentence);
DEBUG && console.log("Corpus loaded, nr of sentences: " + corpus.nrSentences());
var sample = corpus.generateSample();
DEBUG && console.log("Sample created, nr of elements: " + sample.size());


// Generate features
var featureSet = new FeatureSet();
sample.generateFeatures(featureSet);
DEBUG && console.log("Feature set generated, nr of features: " + featureSet.size());


// Set up the classifier and train
classifier = new Classifier(featureSet, sample);
DEBUG && console.log("Classifier created");
classifier.train(nrIterations, minImprovement);
DEBUG && console.log("Checksum: " + classifier.p.checkSum());


// Save the classifier
classifier.save(classifierFilepath, function(error, classifier) {
  if (error) {
    console.log(error);
  }
  else {
    console.log("Classifier saved to " + classifierFilepath);
  }
});