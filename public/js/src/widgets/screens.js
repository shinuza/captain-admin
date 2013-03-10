App.Screens = Backbone.View.extend({

  index: null,

  el: '#screens',

  events: {
    'click .next': 'next',
    'click .previous': 'previous'
  },

  initialize: function(fns) {
    this.index = 0;
    this.fns = fns;
    this.screens = this.$('.screen');

    this.screens.forEach(function(screen, index, screens) {
      var p = $('<p/>');
      if(index > 0) p.append(this._addPrevious());
      if(index < screens.length) p.append(this._addNext());
      $(screen).append(p);
    }, this);

    this.select(null, this.index);
  },

  exists: function(index) {
    return !!this.get(index);
  },

  select: function(index) {
    this.index = index;
    this.screens.hide();
    this.get(index).show();
  },

  get: function(index) {
    return this.screens.eq(index);
  },

  previous: function() {
    var index = this.index - 1;
    if(this.exists(index)) {
      this.select(index);
      this.trigger('previous', [index]);
    }
  },

  next: function() {
    var xhr,
        index = this.index + 1,
        view = this.get(this.index),
        form = view.find('form'),
        method = form.attr('method'),
        action = form.attr('action');

    var done = function go(err) {
      if(this.exists(index)) {
        if(this.execute(err, this.index)) {
          this.select(index);
          this.trigger('next', [index]);
        }
      }
    }.bind(this);

    if(form.length) {
      xhr = $[method + 'JSON'](action, JSON.stringify(form.serializeObject()), done);
      xhr.onloadend = function() {
        if(xhr.status > 201) {
          done(JSON.parse(xhr.responseText));
        }
      }
    } else {
      done();
    }
  },

  addButton: function(type, label) {
    return $('<a/>', {'class': 'button ' + type, html: label });
  },

  execute: function(err, index) {
    var fn = this.fns[index],
        view = this.get(index);

    if(fn) {
      return !(fn.apply(this, [err, view]));
    }
    return true;
  },

  _addPrevious: function() {
    return this.addButton('previous', '&lt;&lt; Previous');
  },

  _addNext: function() {
    return this.addButton('next', 'Next &gt;&gt;');
  }

});