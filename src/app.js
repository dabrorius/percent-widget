const d3 = require('d3');
const PercentWidget = require('./percent_widget');

var widget = new PercentWidget('#percent-widget');
widget.update(90);

var widget = new PercentWidget('#percent-widget-red', 90, {borderColor: '#FF0000', fillColor: '#FFaaaa', pointerSize: 3, borderThickness: 3});
widget.update(30);

var widget = new PercentWidget('#percent-widget-small', 0, {radius: 50, thickness: 20, labelSize: 16});
widget.update(60);