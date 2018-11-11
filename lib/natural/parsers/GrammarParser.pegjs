/*
    PEG grammar for unification grammars
    Copyright (C) 2018 Hugo W.L. ter Doest

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
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
