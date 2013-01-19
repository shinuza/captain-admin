App.Router = Backbone.Router.extend({

  routes: {
    "posts":          "listPosts",
    "posts/new" :     "createPost",
    "posts/edit/:id": "editPost",

    "tags":           "listTags",
    "tags/new":       "createTag",
    "tags/edit/:id":  "editTag",

    "users":          "listUsers",
    "users/new":      "createUser",
    "users/edit/:id": "editUser",

    "login":          "login",
    "logout":         "logout",
    "dashboard":      "dashboard"
  },

  initialize: function initialize() {
    this.navigate('dashboard', {trigger: true});
  },

  listPosts: function listPosts() {
    App.postForm.unload();
    App.posts.fetch();
    App.region.setContent(App.postsView);
  },

  createPost: function createPost() {
    App.postForm.unload();
    App.region.setContent(App.postForm);
  },

  editPost: function editPost(id) {
    App.postForm.unload();
    App.postForm.load(id);
    App.region.setContent(App.postForm);
  },

  listTags: function listTags() {
    App.tagForm.unload();
    App.tags.fetch();
    App.region.setContent(App.tagsView);
  },

  createTag: function createTag() {
    App.tagForm.unload();
    App.region.setContent(App.tagForm);
  },

  editTag: function editTag(id) {
    App.tagForm.unload();
    App.tagForm.load(id);
    App.region.setContent(App.tagForm);
  },

  listUsers: function listUsers() {
    App.userForm.unload();
    App.users.fetch();
    App.region.setContent(App.usersView);
  },

  createUser: function createUser() {
    App.userForm.unload();
    App.region.setContent(App.userForm);
  },

  editUser: function editUser(id) {
    App.userForm.unload();
    App.userForm.load(id);
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