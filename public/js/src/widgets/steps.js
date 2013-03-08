App.StepViewer = Backbone.View.extend({

  el: '#step-viewer',

  initialize: function initialize(options) {
    this.count = options.count;
    this.steps = [];

    _.times(this.count, function() {
      var step = $('<div>').css({
        width: 100 / this.count + '%',
        height: 5,
        background: '#eee',
        float: 'left'
      });
      this.$el.append(step);
      this.steps.push(step);
    }, this);
  },

  highlight: function highlight(index, hex) {
    this.steps[index].css('background', hex);
  },

  on: function on(index) {
    this.highlight(index, '#ccc');
  },

  off: function off(index) {
    this.highlight(index, '#eee');
  }

});