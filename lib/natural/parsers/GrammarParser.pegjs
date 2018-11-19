/*
PEG grammar for context-free grammars
Copyright (c) 2018, Hugo W.L. ter Doest

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

{
  const DEBUG = true;

  var Rule = require('./ProductionRule');
  var Grammar = require('./Grammar');

  // A signature must be passed in the options variable
  var grammar = new Grammar();
}

grammar =
  rules: (S production_rule S) +
  {
    grammar.start_symbol = grammar.production_rules[0].lhs;
    DEBUG && console.log('grammar: grammar parsed: ' + grammar.prettyPrint());
    return(grammar);
  }

// A production rule must be specified on one line
production_rule =
  lhs: nonterminal Arrow rhs_1: identifier_no_eol* head: (HeadIndicator identifier_no_eol HeadIndicator)? rhs_2: identifier_no_eol* (EOL / EOI)
  {
   var rhs = [];
   var head_pos = 0;

   rhs = rhs_1;
   if (head) {
     head_pos = rhs_1.length;
     rhs.push(head[1]);
   }
   rhs = rhs.concat(rhs_2);
   rhs.forEach(function(symbol) {
     grammar.symbols[symbol] = true;
   });
   var rule = new Rule(lhs, rhs, head_pos);
   grammar.nonterminals[lhs] = true;
   grammar.symbols[lhs] = true;
   if ((rule.rhs.length > 2) || (rule.rhs.length === 0)) {
     grammar.is_CNF = false;
   }
   DEBUG && console.log('rule: recognised rule: ' + JSON.stringify(rule));
   grammar.addRule(rule);
 }

nonterminal =
  nt:identifier S
  {
   return(nt);
  }

nonterminal_seq =
  identifier_seq

identifier_seq =
  identifier*

identifier =
  characters: [a-zA-Z_\-0-9]+ S
  {
   var s = "";
   for (var i = 0; i < characters.length; i++) {
     s += characters[i];
   }
   return(s);
  }

identifier_no_eol =
  characters: [a-zA-Z_0-9$]+ S_no_eol
  {
   var s = "";
   for (var i = 0; i < characters.length; i++) {
     s += characters[i];
   }
   return(s);
  }

// Terminals
startList
  = "[" S
endList
  = "]" S
listSeparator
  = "," S
Arrow =
  "->" S_no_eol
PathOpen =
  "<" S
PathClose =
  ">" S
Equal = 
  "=" S
HeadIndicator = 
  "*" S_no_eol

// Blanks
EOL =
  '\r\n' / '\n' / '\r'
Comment =
  "\/\/" (!EOL .)* (EOL/EOI)
S =
  (' ' / '\t' / EOL / Comment)*
S_no_eol =
  (' ' / '\t' / Comment)*
EOI= 
  !.
