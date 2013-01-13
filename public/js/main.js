var templates = {};

function getTmpl(name) {
  if(!templates[name]) {
    templates[name] = swig.compile($('#' + name).html(), {templateName: name});
  }
  return templates[name];
}

var App = {};

App.Users = Backbone.Collection.extend({url: 'http://localhost:8080/users'});
App.Posts = Backbone.Collection.extend({url: 'http://localhost:8080/posts'});
App.Tags = Backbone.Collection.extend({url: 'http://localhost:8080/tags'});

App.ListView = Backbone.View.extend({

  'el': '#content',

  templateName: 'list',

  initialize: function initialize(options) {
    this.name = options.name;
    this.columns = options.columns;
    this.tmpl = getTmpl(this.templateName);
  },

  render: function render(data) {
    var context = {
      'name': this.name,
      'columns': this.columns,
      'lines': data
    };
    var html = this.tmpl(context);
    this.$el.html(html);
  }

});

App.MenuView = Backbone.View.extend({

  el: '#menu',

  unselectAll: function unselectAll() {
    this.$el.find('a').each(function(i, link) {
      $(link).removeClass('active');
    });
  },

  select: function select(hash) {
    this.unselectAll();
    this.$el.find('a[href="#' + hash + '"]').addClass('active');
  }

});

App.Router = Backbone.Router.extend({

  routes: {
    "posts":       "posts",
    "posts/:slug": "posts",
    "tags":        "tags",
    "tags/:slug":  "tags",
    "users":       "users",
    "users/:slug": "users"
  },

  posts: function() {
    App.posts.fetch();
  },

  tags: function() {
    App.tags.fetch();
  },

  users: function() {
    App.users.fetch();
  }

});

$(function() {
  var content = $('#content');

  function onResized() {
    content.css('height', document.height);
  }

  App.menuView = new App.MenuView({selector: '#menu'});

  App.postsView = new App.ListView({
    name: 'posts',
    columns: [
      {'label': 'Title', 'value': 'title'},
      {'label': 'Created at', 'value': 'createdAt', 'type': 'date'},
      {'label': 'Published', 'value': 'published', 'type': 'bool'}
    ]
  });

  App.tagsView = new App.ListView({
    name: 'tags',
    columns: [
      {'label': 'Title', 'value': 'title'},
      {'label': 'Created at', 'value': 'createdAt', 'type': 'date'}
    ]
  });

  App.usersView = new App.ListView({
    name: 'users',
    columns: [
      {'label': 'Username', 'value': 'username'},
      {'label': 'Created at', 'value': 'createdAt', 'type': 'date'},
      {'label': 'Is staff', 'value': 'isStaff', 'type': 'bool'}
    ]
  });

  App.users = new App.Users();
  App.posts = new App.Posts();
  App.tags = new App.Tags();
  App.router = new App.Router();

  App.router.on('all', function(route) {
   App.menuView.select(route.split(':')[1]);
  });

  App.users.on('sync', function(collection) {
    App.usersView.render(collection.toJSON());
  });

  App.posts.on('sync', function(collection) {
    App.postsView.render(collection.toJSON());
  });

  App.tags.on('sync', function(collection) {
    App.tagsView.render(collection.toJSON());
  });


  onResized();
  window.onresize = onResized;
  Backbone.history.start();
});