App.BaseCollection = Backbone.Collection.extend({

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