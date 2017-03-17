const d3 = require('d3');
const parent = d3.select('#percent-widget');


const width = 300;
const height = 300;

const canvas = parent.append('svg').attr('width', width).attr('height', height);

const borderColor = '#69D2E7';
const fillColor = '#cceeEE';
const backgroundColor = '#eee';
const fontColor = '#666';

const radius = 100;
const thickness = 40;
const borderThickness = 5;
const pointerSize = 6;
const labelSize = 25;

var percentage = 90;

let backgroundArc = d3.arc()
  .startAngle(0)
  .endAngle(2 * Math.PI)
  .innerRadius(radius-thickness)
  .outerRadius(radius);

canvas.append('path')
  .attr('transform', 'translate(150,150)')
  .attr('d', backgroundArc)
  .attr('fill', backgroundColor);

let mainArc = d3.arc()
  .startAngle(0)
  .endAngle(2 * Math.PI * percentage / 100)
  .innerRadius(radius-thickness)
  .outerRadius(radius);

canvas.append('path')
  .attr('transform', 'translate(150,150)')
  .attr('d', mainArc)
  .attr('fill', fillColor);

let arcBorder = d3.arc()
  .startAngle(0)
  .endAngle(2 * Math.PI * percentage / 100)
  .innerRadius(radius - borderThickness / 2)
  .outerRadius(radius + borderThickness / 2);

canvas.append('path')
  .attr('transform', 'translate(150,150)')
  .attr('d', arcBorder)
  .attr('fill', borderColor);

canvas.append('circle')
  .attr('cx', 0)
  .attr('cy', -radius)
  .attr('r', borderThickness / 2)
  .attr('fill', borderColor)
  .attr('transform', `translate(${width/2}, ${height/2})`);

canvas.append('circle')
  .attr('cx', 0)
  .attr('cy', -radius)
  .attr('r', borderThickness / 2)
  .attr('fill', borderColor)
  .attr('transform', `translate(${width/2}, ${height/2}) rotate(${360 * percentage / 100})`);

canvas.append('polygon')
  .attr('points', `0,-${pointerSize} ${pointerSize},${pointerSize}, -${pointerSize},${pointerSize}`)
  .attr('fill', borderColor)
  .attr('transform', `translate(${width/2}, ${height/2}) rotate(${360 * percentage / 100}) translate(0, -${radius-thickness+pointerSize})`);

canvas.append('text')
  .attr('x', width / 2)
  .attr('y', height / 2 + labelSize / 2)
  .attr('text-anchor', 'middle')
  .attr('font-family', 'verdana')
  .attr('font-size', `${labelSize}px`)
  .attr('fill', fontColor)
  .text(`${percentage}%`);
