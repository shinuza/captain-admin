App.TagEditorView = Backbone.View.extend({

  initialize: function(options) {
    this.view = options.view;

    this.view.on('render', this.render, this);
    this.view.on('unload', this.clear, this);
    this.view.on('load', this.fetch, this);
    this.view.on('saved', this.save, this);
  },

  render: function() {
    var $label = $('<div/>', {text:'Tags:'});
    var $ul = $('<ul/>', {'class': 'editable'});
    this.view.addWidget($label);
    this.view.addWidget($ul);

    this.editable = $($ul).editable();
  },

  clear: function() {
    this.editable.clear();
  },

  url: function() {
    return '/posts/' + this.model.get('id') + '/tags';
  },

  fetch: function(model) {
    this.model = model;
    $.getJSON(this.url(), function(arr) {
      this.editable.load(arr);
    }.bind(this));
  },

  serialize: function() {
    return this.editable.serialize();
  },

  updateTag: function(model) {
    this.editable.getElements().filter(function() {
      return $(this).text() === model.get('title');
    }).data('id', model.get('id'));
  },

  newTag: function() {
    return this.serialize().filter(function(tag) {
      return !tag.id;
    });
  },

  commit: function() {
    $.postJSON(this.url(), JSON.stringify(this.serialize()));
  },

  save: function() {
    var self = this,
        saved = 0,
        unsaved = this.newTag();

    if(unsaved.length > 0) {
      _.each(unsaved, function(tag, index, tags) {
        var model = App.tags.create(tag);
        model.on('sync', function() {
          saved += 1;
          self.updateTag(model);
          if(saved === tags.length) {
            self.commit();
          }
        });
      });
    } else {
      this.commit();
    }
  }

});