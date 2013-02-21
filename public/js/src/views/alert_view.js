App.AlertView = Backbone.View.extend({

  el: '#alert',

  initialize: function initialize() {
    this.timer;
    this.hidden = true;

    ['success', 'info', 'warning', 'error'].forEach(function(message) {
      this[message] = function(content) {
        this.$el.attr('class', 'alert ' + message);
        this.$el.html(content);
        this._show();
      }.bind(this);
    }, this);

    $(window).scroll(function() {
      if(!this.hidden) {
        this.$el.css('top', window.scrollY + 'px');
      }
    }.bind(this));

    this.$el.click(this.hide.bind(this));
  },

  hide: function hide() {
    this.hidden = true;
    this.$el
      .html('')
      .css('top', '-50px');
  },

  _show: function _show() {
    this.hidden = false;
    this.$el.css('top', window.scrollY);

    clearTimeout(this.timer);
    this.timer = setTimeout(this.hide.bind(this), 2000);
  }

});