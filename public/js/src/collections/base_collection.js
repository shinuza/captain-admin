App.BaseCollection = Backbone.Collection.extend({

  currentUrl: null,

  initialize: function initialize() {
    this.pagination = new Backbone.Model;
  },

  parse: function parse(json) {
    if(!this.key) {
      throw new Error('You must specify which key to use for parsing');
    }
    this.pagination.set(json);
    return json[this.key];
  },

  edit: function edit(id) {
    var url = this.url + '/' + id;
    var model = new (this.model);
    model.url = url;

    return model
      .fetch()
      .then(function() {
        return model;
      });
  },

  page: function(nb) {
    var page = Number(this.pagination.get('page')) + nb;
    return this.url + '?page=' + page;
  },

  next: function() {
    this.fetch({url: this.page(+1)});
  },

  prev: function() {
    this.fetch({url: this.page(-1)});
  }

});