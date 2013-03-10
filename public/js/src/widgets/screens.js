App.Screens = Backbone.View.extend({

  index: null,

  el: '#screens',

  events: {
    'click .next': 'next',
    'click .previous': 'previous'
  },

  initialize: function(options) {
    this.index = 0;
    this.options = options;
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
    this.trigger(index);
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
    var xhr, data,
        index = this.index + 1,
        view = this.get(this.index),
        form = view.find('form'),
        method = form.attr('method'),
        action = form.attr('action');

    var done = function done(obj) {
      if(this.exists(index)) {
        if(!obj || obj.ok) {
          this.select(index);
          this.trigger('next', [index]);
        } else {
          alert(obj.message);
        }
      }
    }.bind(this);

    if(form.length) {
      data = JSON.stringify(form.serializeObject());
      xhr = $[method + 'JSON'](action, data, done);
      xhr.onloadend = function() {
        if(xhr.status > 201) {
          var obj = JSON.parse(xhr.responseText);
          done(obj);
        }
      }
    } else {
      done();
    }
  },

  addButton: function(type, label) {
    return $('<a/>', {'class': 'button ' + type, html: label });
  },

  validate: function(err, index) {
    var fn = this.options.validate;

    if(fn) {
      return !(fn.apply(this, arguments));
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