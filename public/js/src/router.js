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
    if(document.location.hash === '') {
      document.location.hash = '#dashboard';
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
    App.postForm.load(id);
    App.region.setView(App.postForm);
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
    App.tagForm.load(id);
    App.region.setView(App.tagForm);
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
    App.userForm.load(id);
    App.region.setView(App.userForm);
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