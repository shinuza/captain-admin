App.Posts = Backbone.Collection.extend({

  url: '/posts',

  parse: function(json) {
    return json.posts;
  }

});