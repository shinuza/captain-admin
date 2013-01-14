var App = {};

App.templates = {};

function getTmpl(name) {
  if(!App.templates[name]) {
    App.templates[name] = swig.compile($('#' + name).html(), {templateName: name});
  }
  return App.templates[name];
}

var Collection = Backbone.Collection.extend({

  initialize: function() {
    this.on('sync', function() {
      this.synced = true;
    }, this);
  },

  onSync: function(cb) {
    if(this.synced === true) {
      cb(this);
    } else {
      this.on('sync', cb);
    }
  }

});

App.Users = Collection.extend({
  url: 'http://localhost:8080/users'
});

App.Posts = Collection.extend({
  url: 'http://localhost:8080/posts'
});

App.Tags = Collection.extend({
  url: 'http://localhost:8080/tags'
});

App.Region = Backbone.View.extend({

  el: '#content',

  setContent: function(view) {
    this.$el.empty().append(view.$el);
  }

});

App.ListView = Backbone.View.extend({

  tagName: 'div',

  templateName: 'list',

  events: {
    'click .edit': 'onClick',
    'click .delete': 'onDelete'
  },

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
    this.$el.empty().html(html);
  },

  selected: function selected() {
    var inputs = this.$el.find('.select');
    return _.chain(inputs)
      .filter(function(input) {
        return input.checked === true;
      })
      .map(function(input) {
        return parseInt($(input).data('id'), 10);
      })
      .value();
  },

  get: function(id) {
    return this.$el.find('[data-id="' + id + '"]');
  },

  onClick: function onClick(e) {
    var el = $(e.currentTarget).parent();
    App.router.navigate('posts/' + el.data('id'), {trigger: true});
  },

  onDelete: function() {
    this.trigger('delete', this.selected());
    return false;
  }

});

App.FormView = Backbone.View.extend({

  tagName: 'form',

  Text: function(name, attributes) {
    return this.make('textarea', _.extend({name: name}, attributes));
  },

  String: function(name, attributes) {
    return this.make('input', _.extend({type: 'text', name: name}, attributes));
  },

  Boolean: function(name, attributes) {
    return this.make('input', _.extend({type: 'checkbox', name: name}, attributes));
  },

  initialize: function(options) {
    _.each(options.fields, this.render, this);
  },

  render: function(options, name) {
    var line = this.make('p');
    var label = this.make('label', {'for': name}, options.label);
    var input = this[options.type.name](name, options.attributes || {});
    $(line).append(label, input);
    this.$el.append(line);
  },

  getField: function(key) {
    return this.$el.find('[name="' + key + '"]');
  },

  load: function(model) {
    _.each(model.attributes, function(value, key) {
      var field = this.getField(key);
      if(typeof value === 'boolean') {
        field.attr('checked', value);
      } else {
        field.val(value);
      }
    }, this);
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

  initialize: function() {
    App.posts.fetch();
    App.tags.fetch();
    App.users.fetch();
  },

  posts: function(id) {
    if(id) {
      App.posts.onSync(function() {
        App.postForm.load(App.posts.get(id));
        App.region.setContent(App.postForm);
      });
    } else {
      App.region.setContent(App.postsView);
    }
  },

  tags: function(id) {
    if(id) {
      App.tags.onSync(function() {
        App.tagForm.load(App.tags.get(id));
        App.region.setContent(App.tagForm);
      })
    } else {
      App.region.setContent(App.tagsView);
    }
  },

  users: function(id) {
    if(id) {
      App.users.onSync(function() {
        App.userForm.load(App.users.get(id));
        App.region.setContent(App.userForm);
      });
    } else {
      App.region.setContent(App.usersView);
    }
  }

});


$(function() {
  var content = $('#content');

  function onResized() {
    content.css('height', document.height);
  }

  App.postForm = new App.FormView({
    fields: {
      title: {type: String, label: 'Title'},
      body: {type: Text, label: 'Body'},
      published: {type: Boolean, label: 'Published'}
    }
  });

  App.userForm = new App.FormView({
    fields: {
      username: {type: String, label: 'Username'},
      password: {type: String, label: 'Password', attributes: {'type': 'password'}},
      firstname: {type: String, label: 'First name'},
      lastname: {type: String, label: 'Last name'},
      email: {type: String, label: 'Email'},
      isStaff: {type: Boolean, label: 'Is staff'}
    }
  });

  App.tagForm = new App.FormView({
    fields: {
      title: {type: String, label: 'Title'}
    }
  });

  App.menuView = new App.MenuView;

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
  App.region = new App.Region();

  App.router.on('all', function(route) {
   App.menuView.select(route.split(':')[1]);
  });

  App.users.on('sync', function(collection) {
    App.usersView.render(collection.toJSON());
    App.usersView.on('delete', function(ids) {
      ids.forEach(function(id) {
        collection.get(id).destroy();
      });
    });
  });

  App.users.on('destroy', function(model) {
    var view = App.usersView.get(model.id);
    view.remove();
  });

  App.posts.on('sync', function(collection) {
    App.postsView.render(collection.toJSON());
    App.postsView.on('delete', function(ids) {
      ids.forEach(function(id) {
        collection.get(id).destroy();
      });
    });
  });

  App.posts.on('destroy', function(model) {
    var view = App.postsView.get(model.id);
    view.remove();
  });

  App.tags.on('sync', function(collection) {
    App.tagsView.render(collection.toJSON());
    App.tagsView.on('delete', function(ids) {
      ids.forEach(function(id) {
        collection.get(id).destroy();
      });
    });
  });

  App.tags.on('destroy', function(model) {
    var view = App.tagsView.get(model.id);
    view.remove();
  });


  onResized();
  window.onresize = onResized;
  Backbone.history.start();
});