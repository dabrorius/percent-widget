const d3 = require('d3');
const PercentWidget = require('./percent_widget');

window.widget = new PercentWidget('#percent-widget');
widget.update(90);

window.widgetRed = new PercentWidget('#percent-widget-red', 90, {borderColor: '#FF0000', thickness: 50, fillColor: '#FFaaaa', pointerSize: 3, borderThickness: 3});
widget.update(30);

window.widgetSmall = new PercentWidget('#percent-widget-small', 0, {radius: 50, thickness: 20, labelSize: 16});
widget.update(60);

module.exports = PercentWidget;