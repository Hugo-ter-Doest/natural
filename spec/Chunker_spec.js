

var Chunker = require('../lib/natural/ner/Chunker');
var chunker = new Chunker("EN");

var matches = [ { start: 15,
  end: 19,
  namedEntity: 'Alice',
  string: 'Alice',
  cat: 'firstName',
  length: 5 },
  { start: 15,
    end: 19,
    namedEntity: 'Alice',
    string: 'Alice',
    cat: 'lastName',
    length: 5 },
  { start: 20,
    end: 21,
    string: ' ',
    cat: 'whitespace',
    length: 1 },
  { start: 5,
    end: 9,
    namedEntity: 'Susan',
    string: 'Susan',
    cat: 'firstName',
    length: 5 },
  { start: 5,
    end: 9,
    namedEntity: 'Susan',
    string: 'Susan',
    cat: 'lastName',
    length: 5 },
  { start: 0,
    end: 3,
    namedEntity: 'Both',
    string: 'Both',
    cat: 'lastName',
    length: 4 } ];

var paths = chunker.collectPaths(matches);
console.log(paths);
