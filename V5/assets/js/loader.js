function Loader(msg, holder) {
    this.element = this.create(msg);
    holder.appendChild(this.element);
    this.hide();
}

Loader.prototype.create = function(msg) {
    var wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'loading-circle__wrap');

    var msgHolder = document.createElement('div');
    msgHolder.setAttribute('class', 'loading-circle__text');
    msgHolder.appendChild(document.createTextNode(msg || ''));

    var spinner = document.createElement('div');
    spinner.setAttribute('class', 'loading-circle');

    wrapper.appendChild(msgHolder);
    wrapper.appendChild(spinner);

    return wrapper;
};

Loader.prototype.show = function() {
    this.element.classList.remove('hide');
};

Loader.prototype.hide = function() {
    this.element.classList.add('hide');
};

window.Loader = window.Loader || Loader;
