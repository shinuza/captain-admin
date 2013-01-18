App.Router = Backbone.Router.extend({

  routes: {
    "posts":        "posts",
    "posts/:slug":  "posts",
    "tags":         "tags",
    "tags/:slug":   "tags",
    "users":        "users",
    "users/:slug":  "users",
    "new/posts":    "createPost",
    "new/tags":     "createTag",
    "new/users":    "createUser",
    "login":        "login",
    "logout":       "logout",
    "dashboard":    "dashboard"
  },

  initialize: function initialize() {
    this.navigate('dashboard', {trigger: true});
  },

  posts: function posts(id) {
    if(id) {
      App.posts.onSync(function() {
        App.postForm.load(id);
        App.region.setContent(App.postForm);
      });
    } else {
      App.posts.fetch();
      App.region.setContent(App.postsView);
    }
  },

  tags: function tags(id) {
    if(id) {
      App.tags.onSync(function() {
        App.tagForm.load(id);
        App.region.setContent(App.tagForm);
      })
    } else {
      App.tags.fetch();
      App.region.setContent(App.tagsView);
    }
  },

  users: function users(id) {
    if(id) {
      App.users.onSync(function() {
        App.userForm.load(id);
        App.region.setContent(App.userForm);
      });
    } else {
      App.users.fetch();
      App.region.setContent(App.usersView);
    }
  },

  createPost: function createPost() {
    App.postForm.unload();
    App.region.setContent(App.postForm);
  },

  createTag: function createTag() {
    App.tagForm.unload();
    App.region.setContent(App.tagForm);
  },

  createUser: function createUser() {
    App.userForm.unload();
    App.region.setContent(App.userForm);
  },

  login: function login() {
    App.overlay.setContent(App.loginForm);
    App.overlay.show();
  },

  logout: function logout() {
    App.session.destroy();
    App.session.clear();
    App.router.navigate('dashboard', {trigger: true});
  },

  dashboard: function dashboard() {
    App.region.setContent('<h1>Dashboard</h1>');
  }

});