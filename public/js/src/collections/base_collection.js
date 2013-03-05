App.BaseCollection = Backbone.Collection.extend({

  initialize: function initialize() {
    this.pagination = new Backbone.Model;
  },

  parse: function(json) {
    this.pagination.set(json);
    return json.posts;
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