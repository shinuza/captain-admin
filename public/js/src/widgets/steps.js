App.StepsGraph = Backbone.View.extend({

  el: '#step-graph',

  initialize: function initialize(options) {
    options = options || {};
    this.index = options.initial || 0;
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

    this.select(this.index);
  },

  highlight: function highlight(step, hex) {
    step.css('background', hex);
  },

  select: function(index) {
    var target = this.steps[index];
    if(target) {
      this.steps.forEach(function(step) {
        this.highlight(step, '#eee');
      }, this);
      this.highlight(target, '#aaa');
      this.index = index;
      return true
    }
    return false;
  },

  previous: function() {
    var index = this.index - 1;
    if(this.select(index)) {
      this.trigger('previous', [index]);
    }
  },

  next: function() {
    var index = this.index + 1;
    if(this.select(index)) {
      this.trigger('next', [index]);
    }
  }

});