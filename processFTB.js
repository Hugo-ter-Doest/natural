
var fs = require("fs");
xml2js = require('xml2js');
var Sentence = require('./lib/natural/brill_pos_tagger/lib/Sentence');
var Corpus = require('./lib/natural/brill_pos_tagger/lib/Corpus');

// Folder with corpus
var corpusPath = "/home/hugo/Workspace/FrenchTreeBank/originXML/current/corpus-constit/";


// Documentation of the treebank:
// http://ftb.linguist.univ-paris-diderot.fr/treebank.php?fichier=documentation&langue=en
//

// Part of speech tags:
// A (adjective)
// Adv (adverb)
// C (conjunction): coordinating (Cc) or subordinated (Cs)
// Cl (weak clitic pronoun)
// D (determiner)
// ET (foreign word)
// I (interjection)
// N (noun) : Nc (common noun) or Np (nom proper noun)
// P (preposition)
// PREF (prefix)
// PRO (strong pronoun)
// V (verb)
// PONCT (punctuation mark)
var partOfSpeechTags = ["A", 
                        "Adv", 
                        "C", 
                        "Cc", 
                        "Cs", 
                        "Cl", 
                        "D", 
                        "ET", 
                        "I", 
                        "N", 
                        "Nc", 
                        "Np", 
                        "P", 
                        "PREF", 
                        "PRO", 
                        "V", 
                        "PONCT"];

// Phrasal tags:
// AP (adjectival phrases)
// AdP (adverbial phrases)
// COORD (coordinated phrases)
// NP (noun phrases)
// PP (prepositional phrases)
// VN (verbal nucleus)
// VPinf (infinitive clauses)
// VPpart (nonfinite clauses)
// SENT (sentences)
// Sint, Srel, Ssub (finite clauses)
var phrasalTagSet = ["AP", 
                     "AdP", 
                     "COORD", 
                     "NP", 
                     "PP", 
                     "VN", 
                     "VPinf", 
                     "VPpart", 
                     "SENT", 
                     "Sint", 
                     "Srel", 
                     "Ssub"];

var corpus = new Corpus(corpusPath, 2, Sentence);