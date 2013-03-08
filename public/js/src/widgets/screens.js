App.Screens = Backbone.View.extend({

  index: null,

  el: '#screens',

  events: {
    'click .next': 'next',
    'click .previous': 'previous'
  },

  initialize: function(options) {
    options = options || {};
    this.index = options.initial || 0;
    this.screens = this.$('.screen');

    this.screens.forEach(function(screen, index, screens) {
      var p = $('<p/>');
      if(index > 0) p.append(this._addPrevious());
      if(index < screens.length) p.append(this._addNext());
      $(screen).append(p);
    }, this);

    this.select(this.index);
  },

  select: function(index) {
    var target = this.screens.eq(index);
    if(target) {
      this.screens.hide();
      target.show();
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
  },

  addButton: function(type, label) {
    return $('<a/>', {'class': 'button ' + type, html: label });
  },

  _addPrevious: function() {
    return this.addButton('previous', '&lt;&lt; Previous');
  },

  _addNext: function() {
    return this.addButton('next', 'Next &gt;&gt;');
  }

});