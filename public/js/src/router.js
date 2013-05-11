App.Router = Backbone.Router.extend({

  routes: {
    "posts":          "posts:list",
    "posts/new" :     "posts:new",
    "posts/edit/:id": "posts:edit",

    "tags":           "tags:list",
    "tags/new":       "tags:new",
    "tags/edit/:id":  "tags:edit",

    "users":          "users:list",
    "users/new":      "users:new",
    "users/edit/:id": "users:edit",

    "login":          "login",
    "logout":         "logout",
    "dashboard":      "dashboard",
    "settings":       "settings"
  },

  initialize: function initialize() {
    if(this.hash() === '') {
      this.hash('#dashboard');
    }
  },

  hash: function hash(fragment) {
    if(fragment) {
      return document.location.hash = fragment;
    } else {
      return document.location.hash;
    }
  },

  'posts:list': function postsList() {
    App.postForm.unload();
    App.posts.fetch();
    App.region.setView(App.postsView);
  },

  'posts:new': function postsNew() {
    App.postForm.unload();
    App.region.setView(App.postForm);
  },

  'posts:edit': function postsEdit(id) {
    App.postForm.unload();

    App.posts.edit(id)
      .then(function(model) {
        App.postForm.load(model);
        App.region.setView(App.postForm);
      })
      .fail(function() {
        alertify.log('Failed to load model with id ' + id, 'error');
      });
  },

  'tags:list': function tagsList() {
    App.tagForm.unload();
    App.tags.fetch();
    App.region.setView(App.tagsView);
  },

  'tags:new': function tagsNew() {
    App.tagForm.unload();
    App.region.setView(App.tagForm);
  },

  'tags:edit': function tagsEdit(id) {
    App.tagForm.unload();
    App.tags.edit(id)
      .then(function(model) {
        App.tagForm.load(model);
        App.region.setView(App.tagForm);
      })
      .fail(function() {
        alertify.log('Failed to load model with id ' + id, 'error');
      });
  },

  'users:list': function usersList() {
    App.userForm.unload();
    App.users.fetch();
    App.region.setView(App.usersView);
  },

  'users:new': function usersNew() {
    App.userForm.unload();
    App.region.setView(App.userForm);
  },

  'users:edit': function usersEdit(id) {
    App.userForm.unload();
    App.users.edit(id)
      .then(function(model) {
        App.userForm.load(model);
        App.region.setView(App.userForm);
      })
      .fail(function() {
        alertify.log('Failed to load model with id ' + id, 'error');
      });
  },

  logout: function logout() {
    App.session.destroy();
    App.session.clear();
    document.location.hash = '';
    document.location.reload();
  },

  dashboard: function dashboard() {
    App.region.setHtml('<h1>Dashboard</h1>');
    App.region.setView(App.dashboardView, true);
  },

  settings: function settings() {
    App.settingsForm.load('current');
    App.region.setView(App.settingsForm);
  }

});