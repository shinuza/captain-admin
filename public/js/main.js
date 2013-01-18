$(function() {
  App.users = new App.Users;
  App.posts = new App.Posts;
  App.tags = new App.Tags;
  App.session = new App.Session;

  App.region = new App.Region;
  App.overlay = new App.Overlay;
  App.router = new App.Router;

  // Router

  App.router.on('all', function routeAll(route) {
    var name = route.split(':')[1];
    if(name) {
      App.menuView.select(name);
    }
  });

  // Form

  App.loginForm = new App.FormView({
    name: 'login',
    model: App.session,
    fields: {
      username: {type: 'string', label: 'Username'},
      password: {type: 'string', label: 'Password', attributes: {'type': 'password'}}
    },
    onSuccess: function() {
      App.overlay.hide();
      App.router.navigate('dashboard', {trigger: true});
    }
  });

  App.postForm = new App.FormView({
    name: 'posts',
    collection: App.posts,
    fields: {
      title: {type: 'string', label: 'Title'},
      body: {type: 'text', label: 'Body'},
      published: {type: 'boolean', label: 'Published'}
    },
    onRender: function() {
      var $label = $('<div/>', {text:'Tags:'});
      var $ul = $('<ul/>', {'class': 'editable'});
      this.addWidget($label);
      this.addWidget($ul);
      $($ul).editable();
    }
  });

  App.userForm = new App.FormView({
    name: 'users',
    collection: App.users,
    fields: {
      username: {type: 'string', label: 'Username'},
      password: {type: 'string', label: 'Password', attributes: {'type': 'password'}},
      firstname: {type: 'string', label: 'First name'},
      lastname: {type: 'string', label: 'Last name'},
      email: {type: 'string', label: 'Email'},
      isStaff: {type: 'boolean', label: 'Is staff'}
    }
  });

  App.tagForm = new App.FormView({
    name: 'tags',
    collection: App.tags,
    fields: {
      title: {type: 'string', label: 'Title'}
    }
  });

  // Views

  App.userView = new App.UserView({model: App.session});
  App.menuView = new App.MenuView;

  App.postsView = new App.ListView({
    collection: App.posts,
    name: 'posts',
    columns: [
      {'label': 'Title', 'value': 'title'},
      {'label': 'Created at', 'value': 'createdAt', 'type': 'date'},
      {'label': 'Published', 'value': 'published', 'type': 'bool'}
    ]
  });

  App.tagsView = new App.ListView({
    collection: App.tags,
    name: 'tags',
    columns: [
      {'label': 'Title', 'value': 'title'},
      {'label': 'Created at', 'value': 'createdAt', 'type': 'date'}
    ]
  });

  App.usersView = new App.ListView({
    collection: App.users,
    name: 'users',
    columns: [
      {'label': 'Username', 'value': 'username'},
      {'label': 'Created at', 'value': 'createdAt', 'type': 'date'},
      {'label': 'Is staff', 'value': 'isStaff', 'type': 'bool'}
    ]
  });
  Backbone.history.start();
  App.session.fetch();
});