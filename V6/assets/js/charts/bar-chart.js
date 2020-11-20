function BarChart(payload, chartHolder, handlers) {
    this.chartHolder = chartHolder;
    this.colors = {
        default: '#d7dee9',
        hovered: '#5d7ca8',
        selected: '#004b7f',
        lightText: '#c9cacc',
        text: '#7a7e80',
        axis: '#7a7e80'
    };
    this.config = {
        height: 200,
        width: 300,
        rectWidth: 14,
        margin: {
            top: 30,
            right: 0,
            bottom: 30,
            left: 45
        }
    };
    this.xTickInfo = {
        i: null,
        date: null
    };
    this.todayDate = payload.todayDate;
    this.y = null;
    this.x = null;
    this.handlers = handlers;
    this.svg = this.create(payload.data);
    this.bindEvents();
}

BarChart.prototype.getSvgNode = function() {
    return this.svg.node();
};

BarChart.prototype.updateData = function(data) {
    this.chartHolder.innerHTML = '';
    this.svg = this.create(data);
    this.bindEvents();
};

BarChart.prototype.bindEvents = function() {
    var rect = this.svg.selectAll('rect');
    if (rect._groups.length) {
        rect._groups[0].forEach(function(el) {
            el.addEventListener('mouseover', this.rectHoverHandler.bind(this));
            el.addEventListener('mouseout', this.rectMouseoverHandler.bind(this));
            el.addEventListener('click', this.rectClickHandler.bind(this));
        }, this);
    }
};

BarChart.prototype.create = function(data) {
    this.xTickInfo.i = null;
    this.x = d3.scaleBand()
        .domain(d3.range(data.length))
        .range([this.config.margin.left, this.config.width - this.config.margin.right]);

    this.y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) {
            return d.value;
        })]).nice()
        .range([this.config.height - this.config.margin.bottom, this.config.margin.top]);

    var svg = d3.create('svg').attr('viewBox', [0, 0, this.config.width, this.config.height]);
    svg.append('g')
        .selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', function(d, i) {
            return this.x(i);
        }.bind(this))
        .attr('y', function(d) {
            return this.y(d.value);
        }.bind(this))
        .attr('height', function(d) {
            return this.y(0) - this.y(d.value);
        }.bind(this))
        .attr('width', this.config.rectWidth);

    var xAxis = this.xAxisBuilder(data);
    var yAxis = this.yAxisBuilder();

    svg.append('g').call(xAxis.bind(this)).attr('class', 'x-axis');
    svg.append('g').call(yAxis.bind(this)).attr('class', 'y-axis');

    this.chartHolder.appendChild(svg.node());
    if (this.xTickInfo.i !== null) {
        this.createDaySeparator(svg);
    }
    return svg;
};

BarChart.prototype.xAxisBuilder = function(data) {
    return function(g) {
        g.attr('transform', 'translate(0,' + (this.config.height - this.config.margin.bottom) + ')')
            .call(d3.axisBottom(this.x)
                .tickFormat(function(i) {
                    if (i % 2 !== 0) {
                        return '';
                    }
                    if (this.isTomorrow(data[i].departureTime) && this.xTickInfo.i === null) {
                        this.xTickInfo.i = i;
                        this.xTickInfo.date = data[i].departureTime;
                    }
                    return data[i].name;
                }.bind(this))
            )
            .call(function(g) {
                g.select('.domain').attr('d', 'M45.5,0V0.5H300.5V6')
                    .attr('stroke', this.colors.axis);

                var shiftInPx = 16;
                var shiftCounter = 0;
                var ticks = g.selectAll('.tick')._groups;
                if (!ticks) {
                    return;
                }
                g.selectAll('.tick')._groups[0].forEach(function(el, i) {
                    el.setAttribute('transform', 'translate(' + (this.config.margin.left + shiftCounter) + ', 8)');

                    if (i % 2 !== 0) {
                        el.getElementsByTagName('line')[0].setAttribute('stroke', this.colors.lightText);
                        el.getElementsByTagName('line')[0].setAttribute('y2', 5);
                    } else {
                        el.getElementsByTagName('line')[0].setAttribute('y2', 10);
                        el.getElementsByTagName('line')[0].setAttribute('stroke', this.colors.axis);
                        el.getElementsByTagName('text')[0].setAttribute('y', 15);
                    }

                    shiftCounter += shiftInPx;
                }, this);

                var target = g.selectAll('.tick text');
                this.makeCommonFont(target);
            }.bind(this));
    };
};

BarChart.prototype.yAxisBuilder = function() {
    return function(g) {
        g
            .attr('transform', 'translate(' + this.config.margin.left + ',0)')
            .call(d3.axisLeft(this.y)
                .tickFormat(function(d) {
                    return d % 1 === 0 && d !== 0 ? d + ' h' : '';
                })
            )
            .call(function(g) {
                g.selectAll('.tick:first-of-type line')
                    .attr('stroke', this.colors.axis)
                    .attr('x2', -20)
                    .attr('width', 50);

                g.selectAll('.tick:not(:first-of-type) line')
                    .attr('x2', '80%')
                    .attr('stroke-width', '1px')
                    .attr('stroke-opacity', 0.5)
                    .attr('stroke-dasharray', 2)
                    .attr('stroke', this.colors.lightText);

                var target = g.selectAll('.tick text');
                this.makeCommonFont(target);

                g.select('.domain').remove();
            }.bind(this));
    };
};

BarChart.prototype.createDaySeparator = function(svg) {
    var ticks = svg.selectAll('.x-axis line');
    if (!ticks._groups.length || this.xTickInfo.i === null) {
        return;
    }

    var currentTick = ticks._groups[0][this.xTickInfo.i];

    var bbox = currentTick.getBBox();
    var middleX = bbox.x + bbox.width / 2;
    var middleY = bbox.y + bbox.height / 2;

    var data = {
        matrix: currentTick.getScreenCTM(),
        x: middleX, y: middleY
    };
    var absoluteCoords = this.convertCoords(data, svg);
    if (!absoluteCoords) {
        return;
    }
    var yAxisSeparator = function(g) {
        g.attr('transform', 'translate(' + absoluteCoords.x + ',0)')
            .call(d3.axisLeft(this.y)
                .tickFormat(function() {
                    return '';
                })
            )
            .call(function(g) {
                return g.select('.domain').attr('d', 'M-0,170.5V030')
                    .attr('stroke-width', '1px')
                    .attr('stroke', this.colors.axis);
            }.bind(this))
            .call(function(g) {
                return g.selectAll('line').remove();
            });
    };

    var target = svg.append('g')
        .call(yAxisSeparator.bind(this))
        .append('text')
        .attr('transform', 'rotate(90)')
        .attr('x', 80)
        .attr('y', -5)
        .text(this.getFormattedDate(this.xTickInfo.date));

    this.makeCommonFont(target);
};

BarChart.prototype.makeCommonFont = function(target) {
    return target.attr('fill', this.colors.text)
        .attr('font-size', 10 + 'px')
        .attr('font-family', 'Noway')
        .attr('font-weight', 'normal');
};

BarChart.prototype.isTomorrow = function(date) {
    if (date) {
        var tomorrow = moment(date).startOf('day');
        var today = moment(this.todayDate || new Date()).endOf('day');
        return today < tomorrow;
    }
};

BarChart.prototype.getFormattedDate = function(date) {
    if (!date) {
        return '';
    }
    var formattedDate = Formatters.formatToDateTimeString(date);
    var commaIndex = formattedDate.indexOf(',');
    var year = moment(date).year();
    return formattedDate.substr(0, commaIndex).replace(/(\w+\s)(\d+)/g, '$2 $1') + year;
};

BarChart.prototype.convertCoords = function(data, svg) {
    if (!svg._groups.length) {
        return;
    }
    var offset = svg._groups[0][0].getBoundingClientRect();
    var shiftLeft = 15;
    return {
        x: data.matrix.a * data.x + data.matrix.c * data.y + data.matrix.e - offset.left - shiftLeft,
        y: data.matrix.b * data.x + data.matrix.d * data.y + data.matrix.f - offset.top
    };
};

BarChart.prototype.rectHoverColor = function(e) {
    var rect = e.target;
    var attr = rect.attributes.getNamedItem('data-selected');
    if (!attr) {
        rect.setAttribute('fill', this.colors.hovered);
    }
};

BarChart.prototype.rectDefaultColor = function(e) {
    var rect = e.target;
    var attr = rect.attributes.getNamedItem('data-selected');
    if (!attr) {
        rect.setAttribute('fill', this.colors.default);
    }
};

BarChart.prototype.selectFirstRect = function() {
    var rectList = this.svg.selectAll('rect')._groups[0];
    if (!rectList.length) {
        return;
    }

    var event = this.getCrossBrowserDispatchEvent('click');
    rectList[0].dispatchEvent(event);
};

BarChart.prototype.rectMouseoverHandler = function(e) {
    this.rectDefaultColor(e);
    if ('rectMouseoverHandler' in this.handlers) {
        this.handlers.rectMouseoverHandler();
    }
};

BarChart.prototype.rectHoverHandler = function(e) {
    var rect = e.target;
    this.clearBarColor(false);
    this.rectHoverColor(e);
    if ('rectClickHandler' in this.handlers) {
        this.handlers.rectClickHandler(rect.__data__);
    }
};

BarChart.prototype.rectClickHandler = function(e) {
    var rect = e.target;
    this.clearBarColor(true);
    rect.setAttribute('fill', this.colors.selected);
    rect.setAttribute('data-selected', true);
    if ('rectClickHandler' in this.handlers) {
        this.handlers.rectClickHandler(rect.__data__, true);
    }
};

BarChart.prototype.clearBarColor = function(clearChosenRect) {
    var rectList = this.svg.selectAll('rect')._groups[0];
    if (!rectList.length) {
        return;
    }
    rectList.forEach(function(el) {
        if (clearChosenRect) {
            el.setAttribute('fill', this.colors.default);
            el.removeAttribute('data-selected');
        }
    }, this);
};

BarChart.prototype.getCrossBrowserDispatchEvent = function(eventName) {
    if (typeof Event === 'function') {
        return new Event(eventName);
    }
    var event = document.createEvent('Event');
    event.initEvent(eventName, true, true);
    return event;
};

BarChart.prototype.setDate = function(date) {
    this.todayDate = date;
};

window.BarChart = window.BarChart || BarChart;
