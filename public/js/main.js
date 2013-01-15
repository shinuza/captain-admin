var App = {};

App.templates = {};

function getTmpl(name) {
  if(!App.templates[name]) {
    App.templates[name] = swig.compile($('#' + name).html(), {templateName: name});
  }
  return App.templates[name];
}

var Collection = Backbone.Collection.extend({

  initialize: function initialize() {
    this.on('sync', function() {
      this.synced = true;
    }, this);
  },

  onSync: function onSync(cb) {
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

    this.collection.on('destroy', function (model) {
      var view = this.get(model.id);
      if(view) {
        view.remove();
      } else {
        console.error('View for model %d not found', model.id);
      }
    }.bind(this));

    this.collection.on('sync', this.render, this);
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

  get: function get(id) {
    return this.$el.find('[data-id="' + id + '"]');
  },

  onClick: function onClick(e) {
    var el = $(e.currentTarget).parent();
    App.router.navigate(this.name + '/' + el.data('id'), {trigger: true});
  },

  onCreate: function onCreate() {
    App.router.navigate('new/' + this.name, {trigger: true});
  },

  onDelete: function onDelete() {
    this.selected().forEach(function(id) {
      var model = this.collection.get(id);
      if(model) {
        model.destroy();
      } else {
        console.error('Model %d not found', id);
      }
    }, this);
    return false;
  },

  onAll: function onAll() {
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

  tagName: 'form',

  templateName: 'form',

  events: {
    'click button': 'onSubmit'
  },

  initialize: function initialize(options) {
    var name = options.name;
    this.fields =  {};
    this.options = options;
    this.template = getTmpl(this.templateName);

    this.collection.on('sync', function(collection, resp, options) {
      if(!options.previousModels) {
        App.router.navigate(name, {trigger: true});
      }
    });

    this.collection.on('error', function() {
      console.error(this);
    });

    this.render();
    this.build();
  },

  Text: function Text(name, attributes) {
    return this.make('textarea', _.extend({name: name}, attributes));
  },

  String: function String(name, attributes) {
    return this.make('input', _.extend({type: 'text', name: name}, attributes));
  },

  Boolean: function Boolean(name, attributes) {
    return this.make('input', _.extend({type: 'checkbox', name: name}, attributes));
  },

  render: function render() {
    var html = this.template({'name': this.options.name});
    this.$el.html(html);
  },

  build: function build() {
    var p, label, widget;
    var container = this.$el.find('.fields');

    _.each(this.options.fields, function(options, name) {
      p = this.make('p');
      label = this.make('label', {'for': name}, options.label + ':');
      widget = this[options.type.name](name, options.attributes || {});

      p.appendChild(label);
      p.appendChild(widget);
      container.append(p);

      this.fields[name] = $(widget);
    }, this);
  },

  getField: function getField(key) {
    return this.$el.find('[name="' + key + '"]');
  },

  serialize: function serialize() {
    var v, type, data = {};
    _.each(this.fields, function(widget, key) {
      type = widget.attr('type');
      if(type === 'checkbox') {
        v = widget.prop('checked');
      } else {
        v = widget.val();
      }
      data[key] = v;
    });
    return  data;
  },

  unload: function unload() {
    this.model = null;
    this.el.reset();
  },

  load: function load(id) {
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

  onSubmit: function onSubmit() {
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

  initialize: function initialize() {
    App.posts.fetch();
    App.tags.fetch();
    App.users.fetch();
  },

  posts: function posts(id) {
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

  tags: function tags(id) {
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

  users: function users(id) {
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

  App.router.on('all', function routeAll(route) {
   App.menuView.select(route.split(':')[1]);
  });

  onResized();
  window.onresize = onResized;
  Backbone.history.start();
});