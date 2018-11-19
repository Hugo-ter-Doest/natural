/*
Generic chart that can be used for all chart parsers
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

// Implements a chart with from/to edges. Items are added by chart.add_item(i, j, item)
// Items are identified by their id.

const DEBUG = false;

var typeOf = require('typeof');


class Chart {

  // Creates a chart for recognition of a sentence of length N
  constructor(N) {
    DEBUG && console.log("Chart: " + N);
    this.N = N;
    this.outgoing_edges = new Array(N+1);
    this.incoming_edges = new Array(N+1);

    var i;
    for (i = 0; i <= N; i++) {
      this.outgoing_edges[i] = {};
      this.incoming_edges[i] = {};
    }

  }


  // Adds an item to the chart if it is not already there; returns 1 if the item was added, 0 otherwise
  // Items are compared using deep compare (so including children)
  addItem(item) {
    var nr_items_added = 0;
    var item_found = false;

    DEBUG && console.log("Enter Chart.add_item: " + item.id);
    if (this.outgoing_edges[item.data.from][item.id]) {
      // item already exists -> deep compare
      this.outgoing_edges[item.data.from][item.id].some(function(item2) {
        if (item.isEqualTo(item2)) {
          item_found = true;
          return(true);
        }
      });
      if (!item_found) {
        // if not found -> add  item to chart
        DEBUG && console.log("Chart.add_item: " + this.outgoing_edges[item.data.from][item.id]);
        this.outgoing_edges[item.data.from][item.id].push(item);
        DEBUG && console.log("Chart.add_item: " + this.incoming_edges[item.data.to][item.id]);
        if (!this.incoming_edges[item.data.to][item.id]) {
          this.incoming_edges[item.data.to][item.id] = [];
        }
        this.incoming_edges[item.data.to][item.id].push(item);
        nr_items_added = 1;
      }
    }
    else {
        // item does not exist -> add to the chart
        this.outgoing_edges[item.data.from][item.id] = [item];
        this.incoming_edges[item.data.to][item.id] = [item];
        nr_items_added = 1;
    }
    if (nr_items_added > 0) {
    }
    DEBUG && console.log("Exit Chart.add_item: number of items added: " + nr_items_added);
    return(nr_items_added);
  }


  isNotOnChart(item) {
    var item_found = false;

    DEBUG && console.log("Enter Chart.isNotOnChart " + item.id);
    if (this.outgoing_edges[item.data.from][item.id]) {
      // item already exists -> deep compare
      this.outgoing_edges[item.data.from][item.id].some(function(item2) {
        if (item.isEqualTo(item2)) {
          item_found = true;
          return(true);
        }
      });
    }
    DEBUG && console.log("Exit Chart.isNotOnChart: " + item_found);
    return(!item_found);
  }


  // Returns all items that span i to j
  getItemsFromTo(i, j) {
    var res = [];
    var that = this;

    DEBUG && console.log("Enter Chart.getItemsFromTo(" + i + ", " + j + ")");
    Object.keys(this.outgoing_edges[i]).forEach(function(item_id){
      if (that.outgoing_edges[i][item_id].length > 0) {
        if (that.outgoing_edges[i][item_id][0].data.to === j) {
          res = res.concat(that.outgoing_edges[i][item_id]);
        }
      }
    });
    DEBUG && console.log("Exit Chart.getItemsFromTo");
    return(res);
  }


  getItemsFrom(i) {
    var res = [];
    var that = this;

    DEBUG && console.log("Enter Chart.getItemsFrom(" + i + ")");
    Object.keys(this.outgoing_edges[i]).forEach(function(item_id){
      res = res.concat(that.outgoing_edges[i][item_id]);
    });
    DEBUG && console.log("Exit Chart.getItemsFrom: " + res);
    return(res);
  }


  getItemsTo(j) {
    var res = [];
    var that = this;

    DEBUG && console.log("Enter Chart.getItemsTo(" + j + ")");
    Object.keys(this.incoming_edges[j]).forEach(function(item_id){
      res = res.concat(that.incoming_edges[j][item_id]);
    });
    DEBUG && console.log("Exit Chart.getItemsTo:" + res);
    return(res);
  }


  nrItemsTo(j) {
    var that = this;
    var nr_items = 0;

    DEBUG && console.log("Enter Chart.nrItemsTo(" + j + ")");
    Object.keys(this.incoming_edges[j]).forEach(function(item_id){
        nr_items += that.incoming_edges[j][item_id].length;
    });
    DEBUG && console.log("Exit Chart.nrItemsTo: " + nr_items);
    return(nr_items);
  }


  // Returns all complete items that span i to j
  getCompleteItemsFromTo(i, j) {
    var res = [];
    var that = this;

    DEBUG && console.log("Enter Chart.getCompleteItemsFromTo(" + i + ", " + j + ")");
    this.getItemsFromTo(i, j).forEach(function(item){
      if (item.isComplete()) {
        res.push(item);
      }
    });
    DEBUG && console.log("Exit Chart.getCompleteItemsFromTo: " + res);
    return(res);
  }


  // Returns all complete items span i to j AND start with nonterminal A
  fullParseItems(A, item_type) {
    var items = [];

    DEBUG && console.log("Enter Chart.fullParseItems(" + A + ")");
    this.getCompleteItemsFromTo(0, this.N).forEach(item => {
      DEBUG && console.log('Exit Chart.fullParseItems: type of item: ' + typeOf(item));
      if ((item.data.rule.lhs === A)  && (typeOf(item) === item_type)) {
        items.push(item);
      }
    });
    DEBUG && console.log("Exit Chart.fullParseItems: " + items);
    return(items);
  }


  // Returns the parse trees in textual bracketed form
  // item_type selects the right type of item to create the parse tree from
  parseTrees(nonterminal, item_type) {
    var parses = [];

    DEBUG && console.log("Enter Chart.parseTrees(" + nonterminal + ", " + item_type + ")");
    this.getItemsFromTo(0, this.N).forEach(function(item) {
      if (typeOf(item) === item_type) {
        if ((item.data.rule.lhs === nonterminal) && item.isComplete()) {
          parses.push(item.createParseTree());
        }
      }
    });
    DEBUG && console.log("Exit Chart.parseTrees:" + parses);
    return(parses);
  }


  // Returns the total number of items on the chart
  nrOfItems() {
    var nr_items = 0;

    DEBUG && console.log("Enter Chart.nrOfItems()");
    for (var i = 0; i <= this.N; i++) {
      nr_items += this.nrItemsTo(i);
    }
    DEBUG && console.log("Exit Chart.nrOfItems: " + nr_items);
    return(nr_items);
  }
}


module.exports = Chart;
