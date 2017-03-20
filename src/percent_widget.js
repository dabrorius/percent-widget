const d3 = require('d3');

class PercentWidget {
  constructor(parentSelector, percentage = 0, options = {}) {
    const parent = d3.select(parentSelector);

    this.percentage = percentage;

    this.settings = {
      radius: 100,
      thickness: 40,
      borderThickness: 5,
      pointerSize: 6,
      labelSize: 25,
      borderColor: '#69D2E7',
      fillColor: '#cceeEE',
      backgroundColor: '#eee',
      fontColor: '#666'
    }
    Object.assign(this.settings, options);
    let settings = this.settings;

    this.settings.innerRadius = settings.radius - settings.thickness;
    this.settings.width = (settings.radius + settings.borderThickness) * 2;
    this.settings.height = settings.width;

    const canvas = parent.append('svg').attr('width', settings.width).attr('height', settings.height);

    let backgroundArc = d3.arc()
      .startAngle(0)
      .endAngle(2 * Math.PI)
      .innerRadius(settings.innerRadius)
      .outerRadius(settings.radius);

    canvas.append('path')
      .attr('transform', `translate(${settings.width/2}, ${settings.height/2})`)
      .attr('d', backgroundArc)
      .attr('fill', settings.backgroundColor);

    let mainArc = d3.arc()
      .startAngle(0)
      .endAngle(2 * Math.PI * percentage / 100)
      .innerRadius(settings.innerRadius)
      .outerRadius(settings.radius);

    this.mainArcPath = canvas.append('path')
      .attr('transform', `translate(${settings.width/2}, ${settings.height/2})`)
      .attr('d', mainArc)
      .attr('fill', settings.fillColor);

    let arcBorder = d3.arc()
      .startAngle(0)
      .endAngle(2 * Math.PI * percentage / 100)
      .innerRadius(settings.radius - settings.borderThickness / 2)
      .outerRadius(settings.radius + settings.borderThickness / 2);

    this.arcBorderPath = canvas.append('path')
      .attr('transform', `translate(${settings.width/2}, ${settings.height/2})`)
      .attr('d', arcBorder)
      .attr('fill', settings.borderColor);

    this.endMarkers = canvas.append('g')
      .attr('transform', `translate(${settings.width/2}, ${settings.height/2}) rotate(${360 * percentage / 100})`);

    canvas.append('circle')
      .attr('cx', 0)
      .attr('cy', -settings.radius)
      .attr('r', settings.borderThickness / 2)
      .attr('fill', settings.borderColor)
      .attr('transform', `translate(${settings.width/2}, ${settings.height/2})`);

    this.endMarkers.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', settings.borderThickness / 2)
      .attr('fill', settings.borderColor)
      .attr('transform', `translate(0, -${settings.radius})`);

    this.pointer = this.endMarkers.append('polygon')
      .attr('points', `0,-${settings.pointerSize} ${settings.pointerSize},${settings.pointerSize}, -${settings.pointerSize},${settings.pointerSize}`)
      .attr('fill', settings.borderColor)
      .attr('transform', `translate(0, -${settings.innerRadius+settings.pointerSize})`);

    this.percentLabel = canvas.append('text')
      .attr('x', settings.width / 2)
      .attr('y', settings.height / 2 + settings.labelSize / 2)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'verdana')
      .attr('font-size', `${settings.labelSize}px`)
      .attr('fill', settings.fontColor)
      .text(`${percentage}%`);
  }

  update(newPercentage) {
    const duration = 1500;

    let oldPercentage = this.percentage;
    this.percentage = newPercentage;

    let settings = this.settings;
    let tweenFunction = this._arcTween;

    this.mainArcPath
      .transition()
      .duration(duration)
      .attrTween('d', function() {
        var newArc = d3.arc()
          .startAngle(0)
          .innerRadius(settings.innerRadius)
          .outerRadius(settings.radius);
        return tweenFunction(newArc, oldPercentage, newPercentage);
      });

    this.arcBorderPath
      .transition()
      .duration(duration)
      .attrTween('d', function() {
        var newArcBorder = d3.arc()
          .startAngle(0)
          .innerRadius(settings.radius - settings.borderThickness / 2)
          .outerRadius(settings.radius + settings.borderThickness / 2);
        return tweenFunction(newArcBorder, oldPercentage, newPercentage);
      });

    this.endMarkers
      .transition()
      .duration(duration)
      .attrTween('transform', function() {
        return function(t) {
          return `translate(${settings.width/2}, ${settings.height/2}) rotate(${360 * (oldPercentage + (newPercentage - oldPercentage) * t) / 100})`;
        }
      });

    var percentageFormat = d3.format(".0%");
    var percentLabel = this.percentLabel;
    this.percentLabel
      .transition()
      .duration(duration)
      .tween('text', function() {
        return function(t) {
          percentLabel.text(percentageFormat((oldPercentage + (newPercentage - oldPercentage) * t) / 100));
        }
      })
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
