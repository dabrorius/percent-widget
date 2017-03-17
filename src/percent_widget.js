const d3 = require('d3');

class PercentWidget {
  constructor(parentSelector, percentage, options = {}) {
    this.percentage = percentage;
    this.radius = options.radius || 100;
    this.thickness = options.thickness || 40;
    this.innerRadius = this.radius - this.thickness;

    const borderThickness = options.borderThickness || 5;
    const pointerSize = options.pointerSize || 6;
    const labelSize = options.labelSize || 25;

    const borderColor = options.borderColor || '#69D2E7';
    const fillColor = options.fillColor || '#cceeEE';
    const backgroundColor = options.backgroundColor || '#eee';
    const fontColor = options.fontColor || '#666';

    const width = (this.radius + borderThickness) * 2;
    const height = width;

    const parent = d3.select(parentSelector);
    const canvas = parent.append('svg').attr('width', width).attr('height', height);

    let backgroundArc = d3.arc()
      .startAngle(0)
      .endAngle(2 * Math.PI)
      .innerRadius(this.innerRadius)
      .outerRadius(this.radius);

    canvas.append('path')
      .attr('transform', `translate(${width/2}, ${height/2})`)
      .attr('d', backgroundArc)
      .attr('fill', backgroundColor);

    let mainArc = d3.arc()
      .startAngle(0)
      .endAngle(2 * Math.PI * percentage / 100)
      .innerRadius(this.innerRadius)
      .outerRadius(this.radius);

    this.mainArcPath = canvas.append('path')
      .attr('transform', `translate(${width/2}, ${height/2})`)
      .attr('d', mainArc)
      .attr('fill', fillColor);

    let arcBorder = d3.arc()
      .startAngle(0)
      .endAngle(2 * Math.PI * percentage / 100)
      .innerRadius(this.radius - borderThickness / 2)
      .outerRadius(this.radius + borderThickness / 2);

    canvas.append('path')
      .attr('transform', `translate(${width/2}, ${height/2})`)
      .attr('d', arcBorder)
      .attr('fill', borderColor);

    canvas.append('circle')
      .attr('cx', 0)
      .attr('cy', -this.radius)
      .attr('r', borderThickness / 2)
      .attr('fill', borderColor)
      .attr('transform', `translate(${width/2}, ${height/2})`);

    canvas.append('circle')
      .attr('cx', 0)
      .attr('cy', -this.radius)
      .attr('r', borderThickness / 2)
      .attr('fill', borderColor)
      .attr('transform', `translate(${width/2}, ${height/2}) rotate(${360 * percentage / 100})`);

    canvas.append('polygon')
      .attr('points', `0,-${pointerSize} ${pointerSize},${pointerSize}, -${pointerSize},${pointerSize}`)
      .attr('fill', borderColor)
      .attr('transform', `translate(${width/2}, ${height/2}) rotate(${360 * percentage / 100}) translate(0, -${this.innerRadius+pointerSize})`);

    canvas.append('text')
      .attr('x', width / 2)
      .attr('y', height / 2 + labelSize / 2)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'verdana')
      .attr('font-size', `${labelSize}px`)
      .attr('fill', fontColor)
      .text(`${percentage}%`);
  }

  update(newPercentage) {
    let innerRadius = this.innerRadius;
    let radius = this.radius;
    let oldPercentage = this.percentage;
    let tweenFunction = this._arcTween;

    const duration = 1500;

    this.mainArcPath
      .transition()
      .duration(duration)
      .attrTween('d', function() {
        var newArc = d3.arc()
          .startAngle(0)
          .innerRadius(innerRadius)
          .outerRadius(radius);
        return tweenFunction(newArc, oldPercentage, newPercentage);
      });
  }

  _arcTween(arc, oldPercentage, newPercentage) {
    let percentageDiff = newPercentage - oldPercentage;
    return function(t) {
      arc.endAngle(2 * Math.PI * (oldPercentage + percentageDiff * t) / 100)
      return arc();
    }
  }
}

module.exports = PercentWidget;
