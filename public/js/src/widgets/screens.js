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

  select: function(err, index) {
    var target = this.get(index);
    if(target) {
      this.index = index;
      this.execute(err, index);
      this.screens.hide();
      target.show();
      return true
    }
    return false;
  },

  get: function(index) {
    return this.screens.eq(index);
  },

  previous: function() {
    var index = this.index - 1;
    if(this.select(null, index)) {
      this.trigger('previous', [index]);
    }
  },

  next: function() {
    var data, url, args, xhr,
        index = this.index + 1,
        view = this.get(this.index),
        form = view.find('form'),
        method = form.attr('method'),
        action = form.attr('action');

    var go = function go(err) {
      if(this.select(err, index)) {
        this.trigger('next', [index]);
      }
    }.bind(this);

    if(form.length) {
      data = method == 'post' ? form.serializeObject() : form.serialize();
      url = method == 'post' ? action : action + '?' + data;
      args = method == 'post' ?  [url, data, go] : [url, go];
      xhr = $[method + 'JSON'].apply(null, args);
      xhr.onloadend = function() {
        if(xhr.status > 201) {
          go(JSON.parse(xhr.responseText));
        }
      }
    } else {
      go();
    }
  },

  addButton: function(type, label) {
    return $('<a/>', {'class': 'button ' + type, html: label });
  },

  execute: function(err, index) {
    var fn = this.fns[index],
        view = this.get(index);
    if(fn) fn.apply(this, [err, view]);
  },

  activate: function(index) {
    this.get(index || this.index).find('.next').show();
  },

  deactivate: function(index) {
    this.get(index || this.index).find('.next').hide();
  },

  _addPrevious: function() {
    return this.addButton('previous', '&lt;&lt; Previous');
  },

  _addNext: function() {
    return this.addButton('next', 'Next &gt;&gt;');
  }

});