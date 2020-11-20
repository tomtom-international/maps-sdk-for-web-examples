function InputTime(element, date) {
    var inititalTime = this.setInitialTime(date);

    this.state = {
        h: inititalTime.getHours(),
        m: inititalTime.getMinutes(),
        selectedIndex: 0,
        date: inititalTime.toISOString()
    };

    this.constraints = null;

    this.elements = {
        time: this.createSelect('select'),
        arrowLeft: this.createArrow('left', this.decreaseValue.bind(this)),
        arrowRight: this.createArrow('right', this.increaseValue.bind(this))
    };

    element.appendChild(this.elements.arrowLeft);
    element.appendChild(this.elements.time);
    element.appendChild(this.elements.arrowRight);

    this.bindEvents();
}

InputTime.prototype.bindEvents = function() {
    this.elements.time.addEventListener('change', this.selectHandler.bind(this));
};

InputTime.prototype.setInitialTime = function(date) {
    var noticedMinutes = 5;
    var halfAnHour = 30;
    var inititalTime = moment(date ? new Date(date) : new Date()).add(noticedMinutes, 'minutes');

    var minutes = inititalTime.toDate().getMinutes();
    if (minutes > halfAnHour) {
        inititalTime.add(1, 'hours').startOf('hour');
    }

    if (minutes < halfAnHour) {
        var minutesToadd = halfAnHour - minutes;
        inititalTime.add(minutesToadd, 'minutes');
    }

    return inititalTime.toDate();
};

InputTime.prototype.decreaseValue = function() {
    var indexToCheck = this.elements.time.selectedIndex - 1;
    this.checkConstraints(indexToCheck);
};

InputTime.prototype.increaseValue = function() {
    var indexToCheck = this.elements.time.selectedIndex + 1;
    this.checkConstraints(indexToCheck);
};

InputTime.prototype.addZero = function(value) {
    return value.toString().length === 2 ? value : '0' + value;
};

InputTime.prototype.checkConstraints = function(index) {
    if (index > this.constraints - 1) {
        this.elements.time.selectedIndex = 0;
        this.state.selectedIndex = 0;
        this.setStateTime();
        return;
    }
    if (index < 0) {
        this.elements.time.selectedIndex = this.constraints - 1;
        this.state.selectedIndex = this.constraints;
        this.setStateTime();
        return;
    }
    this.elements.time.selectedIndex = index;
    this.state.selectedIndex = this.elements.time.selectedIndex;
    this.setStateTime();
};

InputTime.prototype.setStateTime = function() {
    var time = this.elements.time.value.split(':');
    if (time.length) {
        this.state.h = Number(time[0]);
        this.state.m = Number(time[1]);
        var stateDate = new Date(this.state.date);
        stateDate.setHours(this.state.h, this.state.m, 0);
        this.state.date = stateDate.toISOString();
    }
};

InputTime.prototype.selectHandler = function(event) {
    this.state.selectedIndex = event.target.selectedIndex;
    this.setStateTime();
};

InputTime.prototype.createSelect = function(key) {
    var select = document.createElement('select');
    var hours = 23;
    for (var i = 0; i <= hours; ++i) {
        var optionEven = this.createTimeOption(i, 0);
        var optionOdd = this.createTimeOption(i, 30);

        select.appendChild(optionEven);
        select.appendChild(optionOdd);
    }
    this.constraints = select.childNodes.length;
    select.setAttribute('name', key);

    select.value = this.createSelectValue(this.state.h, this.state.m);
    this.state.selectedIndex = select.selectedIndex;
    return select;
};

InputTime.prototype.createTimeOption = function(hours, minutes) {
    var option = document.createElement('option');
    var value = this.createSelectValue(hours, minutes);
    option.setAttribute('value', value);
    option.innerHTML = value;
    return option;
};

InputTime.prototype.createSelectValue = function(hours, minutes) {
    return this.addZero(hours) + ':' + this.addZero(minutes);
};

InputTime.prototype.createArrow = function(direction, callback) {
    var arrow = document.createElement('input');
    arrow.setAttribute('type', 'button');
    var arrowSign = direction === 'left' ? '<' : '>';
    arrow.setAttribute('value', arrowSign);
    arrow.setAttribute('class', 'arrow arrow-' + direction);
    arrow.addEventListener('click', callback);
    return arrow;
};

InputTime.prototype.disableArrow = function(data) {
    for (var i = 0; i < data.arrow.length; ++i) {
        var arrowName = 'arrow' + data.arrow[i];
        if (data.isDisabled) {
            this.elements[arrowName].setAttribute('disabled', data.isDisabled);
            continue;
        }
        this.elements[arrowName].removeAttribute('disabled');
    }
};

InputTime.prototype.setDate = function(date) {
    var inititalTime = this.setInitialTime(date);
    this.state.date = inititalTime.toISOString();
};

InputTime.prototype.getTime = function() {
    return {
        h: this.state.h,
        m: this.state.m,
        year: new Date(this.state.date).getFullYear(),
        month: new Date(this.state.date).getMonth(),
        date: new Date(this.state.date).getDate()
    };
};

window.InputTime = window.InputTime || InputTime;
