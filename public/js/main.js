var App = {};

App.templates = {};

function getTmpl(name) {
  if(!App.templates[name]) {
    App.templates[name] = swig.compile($('#' + name).html(), {templateName: name});
  }
  return App.templates[name];
}

var Model = Backbone.Model.extend({
  defaults: function() {
    return {
      createdAt: new Date()
    }
  }
});


var Collection = Backbone.Collection.extend({

  model: Model,

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

  all: false,

  tagName: 'div',

  templateName: 'list',

  events: {
    'click .edit': 'onClick',
    'click .delete': 'onDelete',
    'click .create': 'onCreate',
    'click .all': 'onAll',
    'click .quick-check': 'onQuickCheck'
  },

  initialize: function initialize(options) {
    this.name = options.name;
    this.columns = options.columns;
    this.collection = options.collection;
    this.tmpl = getTmpl(this.templateName);
  },

  render: function render() {
    var context = {
      'name': this.name,
      'columns': this.columns,
      'lines': this.collection.toJSON()
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
    App.router.navigate(this.name + '/' + el.data('id'), {trigger: true});
  },

  onCreate: function onCreate() {
    App.router.navigate('new/' + this.name, {trigger: true});
  },

  onDelete: function() {
    this.trigger('delete', this.selected());
    return false;
  },

  onAll: function() {
    this.all = !this.all;
    this.$el.find('tbody .select').each(function(index, input) {
      $(input).prop('checked', this.all);
    }.bind(this));
  },

  onQuickCheck: function onQuickCheck(e) {
    var el = $(e.currentTarget);
    var id = el.data('id');
    var attribute = el.data('attribute');
    var checked = el.prop('checked');

    var model = this.collection.get(id);
    model.set(attribute, checked);
    model.save();
  }

});

App.FormView = Backbone.View.extend({

  events: {
    'click button': 'onSubmit'
  },

  tagName: 'form',

  initialize: function(options) {
    this.name = options.name;

    //TODO: Put this in a method
    var title = this.make('h1', {}, options.name);
    var submit = this.make('button', {type: 'submit', 'class': 'button'}, 'Submit');
    this.$el.append(title);
    _.each(options.fields, this.render, this);
    this.$el.append(submit);

    this.collection.on('sync', function(collection, models, options) {
      if(!options.previousModels) {
        App.router.navigate(this.name, {trigger: true});
      }
    }, this);

    this.collection.on('error', function() {
      console.error(this);
    });
  },

  Text: function(name, attributes) {
    return this.make('textarea', _.extend({name: name}, attributes));
  },

  String: function(name, attributes) {
    return this.make('input', _.extend({type: 'text', name: name}, attributes));
  },

  Boolean: function(name, attributes) {
    return this.make('input', _.extend({type: 'checkbox', name: name}, attributes));
  },

  render: function(options, name) {
    var line = this.make('p');
    var label = this.make('label', {'for': name}, options.label + ':');
    var input = this[options.type.name](name, options.attributes || {});

    $(line).append(label, input);
    this.$el.append(line);
  },

  getField: function(key) {
    return this.$el.find('[name="' + key + '"]');
  },

  serialize: function() {
    var data = {},
      arr = this.$el.serializeArray();

    _.each(arr, function(field) {
      data[field.name] = field.value;
    });
    return data;
  },

  unload: function() {
    this.model = null;
    this.el.reset();
  },

  load: function(id) {
    var model = this.model = this.collection.get(id);
    _.each(model.attributes, function(value, key) {
      var field = this.getField(key);
      if(typeof value === 'boolean') {
        field.prop('checked', value);
      } else {
        field.val(value);
      }
    }, this);
  },

  onSubmit: function() {
    var data = this.serialize();
    if(!this.model) {
      this.model = this.collection.create(data);
    } else {
      this.model.save(data);
    }
    return false;
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
    "posts":        "posts",
    "posts/:slug":  "posts",
    "tags":         "tags",
    "tags/:slug":   "tags",
    "users":        "users",
    "users/:slug":  "users",
    "new/posts":     "createPost",
    "new/tags":      "createTag",
    "new/users":     "createUser"
  },

  initialize: function() {
    App.posts.fetch();
    App.tags.fetch();
    App.users.fetch();
  },

  posts: function(id) {
    if(id) {
      App.posts.onSync(function() {
        App.postForm.load(id);
        App.region.setContent(App.postForm);
      });
    } else {
      App.postsView.render();
      App.region.setContent(App.postsView);
    }
  },

  tags: function(id) {
    if(id) {
      App.tags.onSync(function() {
        App.tagForm.load(id);
        App.region.setContent(App.tagForm);
      })
    } else {
      App.tagsView.render();
      App.region.setContent(App.tagsView);
    }
  },

  users: function(id) {
    if(id) {
      App.users.onSync(function() {
        App.userForm.load(id);
        App.region.setContent(App.userForm);
      });
    } else {
      App.usersView.render();
      App.region.setContent(App.usersView);
    }
  },

  createPost: function() {
    App.postForm.unload();
    App.region.setContent(App.postForm);
  },

  createTag: function() {
    App.tagForm.unload();
    App.region.setContent(App.tagForm);
  },

  createUser: function() {
    App.userForm.unload();
    App.region.setContent(App.userForm);
  }


});


$(function() {
  var content = $('#content');

  function onResized() {
    content.css('height', document.height);
  }

  App.users = new App.Users();
  App.posts = new App.Posts();
  App.tags = new App.Tags();
  App.router = new App.Router();
  App.region = new App.Region();

  App.postForm = new App.FormView({
    name: 'posts',
    collection: App.posts,
    fields: {
      title: {type: String, label: 'Title'},
      body: {type: Text, label: 'Body'},
      published: {type: Boolean, label: 'Published'}
    }
  });

  App.userForm = new App.FormView({
    name: 'users',
    collection: App.users,
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
    name: 'tags',
    collection: App.tags,
    fields: {
      title: {type: String, label: 'Title'}
    }
  });

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

  App.router.on('all', function(route) {
   App.menuView.select(route.split(':')[1]);
  });

  App.users.on('sync', function(collection) {
    App.usersView.render();
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
    App.postsView.render();
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
    App.tagsView.render();
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