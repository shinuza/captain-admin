$(function() {

  // Instances
  App.users = new App.Users;

  App.posts = new App.Posts;

  App.tags = new App.Tags;

  App.session = new App.Session;

  App.settings = new App.Settings;

  App.postForm = new App.FormView({
    name: 'posts',
    collection: App.posts,
    fields: {
      title: {type: 'string', label: 'Title'},
      summary: {type: 'text', label: 'Summary'},
      body: {type: 'text', label: 'Body'},
      published: {type: 'boolean', label: 'Published'}
    }
  });

  App.userForm = new App.FormView({
    name: 'users',
    collection: App.users,
    fields: {
      username: {type: 'string', label: 'Username'},
      firstname: {type: 'string', label: 'First name'},
      lastname: {type: 'string', label: 'Last name'},
      email: {type: 'string', label: 'Email'},
      isStaff: {type: 'boolean', label: 'Is staff'}
    }
  });

  App.settingsForm = new App.FormView({
    name: 'settings',
    model: App.settings,
    fields: {
      SITE_TITLE: {type: 'string', label: 'Site title'},
      DB: {type: 'string', label: 'Database'},
      TIME_ZONE: {type: 'string', label: 'Time zone'},
      SITE_URL: {type: 'string', label: 'Site url'},
      POSTS_BY_PAGE: {type: 'int', label: 'Post by page'}
    }
  });

  App.tagForm = new App.FormView({
    name: 'tags',
    collection: App.tags,
    fields: {
      title: {type: 'string', label: 'Title'}
    }
  });

  App.postsView = new App.ListView({
    collection: App.posts,
    name: 'posts',
    columns: [
      {'label': 'Title', 'value': 'title'},
      {'label': 'Created at', 'value': 'created_at', 'type': 'date'},
      {'label': 'Published', 'value': 'published', 'type': 'bool'}
    ]
  });

  App.tagsView = new App.ListView({
    collection: App.tags,
    name: 'tags',
    columns: [
      {'label': 'Title', 'value': 'title'},
      {'label': 'Posts', 'value': 'count'}
    ]
  });

  App.usersView = new App.ListView({
    collection: App.users,
    name: 'users',
    columns: [
      {'label': 'Username', 'value': 'username'},
      {'label': 'Created at', 'value': 'created_at', 'type': 'date'},
      {'label': 'Is staff', 'value': 'isStaff', 'type': 'bool'}
    ]
  });

  App.tagEditorView = new App.TagEditorView({
    view: App.postForm
  });

  App.userView = new App.UserView({
    model: App.session
  });

  App.menuView = new App.MenuView;

  App.dashboardView = new App.DashBoardView;

  App.alertView = new App.AlertView;

  App.region = new App.Region;

  App.router = new App.Router;

  // Router
  App.router.on('all', function routeAll(route) {
    var name = route.split(':')[1];
    if(name) {
      App.menuView.select(name);
    }
  });

  App.postForm.construct();
  App.userForm.construct();
  App.tagForm.construct();
  App.settingsForm.construct();
  Backbone.history.start();
  App.session.fetch();
  App.settings.fetch();
});