App.Region = Backbone.View.extend({

  el: '#main',

  initialize: function initialize() {
    this.onResized();
    $(window).on('resize', this.onResized.bind(this));
  },

  getHeight: function() {
    var inner = window.innerHeight;
    var doc = document.height;
    return inner < doc ? inner : doc;
  },

  onResized: function onResized() {
    this.$el.css('min-height',this.getHeight());
  },

  draw: function draw(view) {
    if(view) {
      view.trigger('display', view);
    }
    this.onResized();
  },

  setHtml: function(html) {
    this.$el.html(html);
    this.draw();
  },

  setView: function(view, empty) {
    if(empty === undefined) {
      this.$el.empty();
    }
    this.$el.append(view.$el);
    this.draw(view);
  }
});