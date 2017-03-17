const d3 = require('d3');
const PercentWidget = require('./percent_widget');

var widget = new PercentWidget('#percent-widget', 20);
widget.update(80);
