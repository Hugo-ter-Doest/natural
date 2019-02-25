

const DEBUG = true;

const rules = {
  "EN": [
    {"lhs": "phrase",
      "rhs": ["firstName", "lastName"]},
    {"lhs": "phrase",
      "rhs": ["firstName", "firstName"]},
    {"lhs": "phrase",
      "rhs": ["firstName", "firstName", "lastName"]},

  ]
}


class Chunker {
  constructor(language) {
    this.language = "EN";
    if (language) {
      this.language = language;
    }
  }

  // Looks for patters of categories that constitute a phrase
  chunk(paths) {

    // IN: rule, and path which is an array of matches
    // OUT: boolean
    function ruleMatches(rule, path) {

      function concatPath(total, match) {
        if (match.cat !== "whitespace") {
          return total.push(match.cat);
        }
        else {
          return total;
        }
      }

      // Eliminate whitespace
      var reducedPath = path.reduce(concatPath, []);

      // Compare
      return reducedPath == rule.rhs;
    }

    var chunks = [];
    rules[this.language].forEach(rule=> {
      paths.forEach(path => {
        if ruleMatches(rule, path) {
          var chunk = {
            start: path[0].start,
            end: path[path.length - 1].end,
            string: "",
            length: 0,
            matches = path,
            chunk: rule.lhs
          };
          DEBUG && console.log(chunk);
          chunks.push(chunk);
        }
      });
    });
    return chunks;
  }

  // Recursively walk through all possible connected matches and collect paths
  collectPaths(matches) {
    var paths = [];
    var matchesMap = {};
    var minIndex = null;
    var maxIndex = null;
    var restart = {};

    // IN: path is an array of matches
    function followPath(path) {
      var matches = matchesMap[path[path.length - 1].end + 1];
      // Continue at the end of path
      if (matches) {
        // There are matches to connect
        matches.forEach(m => {
          // Copy path, extend with match and recurse
          var newPath = path.slice();
          newPath.push(m);
          followPath(newPath);
        });
      }
      else {
        paths.push(path);
        var i = 2;
        do {
          matches = matchesMap[path[path.length - 1].end + i];
          i++;
        } while (i <= maxIndex && !matches);
        if (matches) {
          matches.forEach(m => {
            if (!restart[m.start + m.end + m.cat]) {
              restart[m.start + m.end + m.cat] = true;
              followPath([m]);
            }
          });
        }
      }
    }

    // Create a map from start index to match
    matches.forEach(m => {
      if (minIndex == null || minIndex > m.start) {
        minIndex = m.start;
      }
      if (maxIndex == null || maxIndex < m.start) {
        maxIndex = m.start;
      }
      if (!matchesMap[m.start]) {
        matchesMap[m.start] = [];
      }
      matchesMap[m.start].push(m);
    });
    console.log(matchesMap);
    matchesMap[minIndex].forEach(m => {
      followPath([m]);
    })
    return(paths);
  }

}

module.exports = Chunker;
