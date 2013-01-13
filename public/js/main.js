var templates = {};

function getTmpl(name) {
  if(!templates[name]) {
    templates[name] = swig.compile($('#' + name).html(), {templateName: name});
  }
  return templates[name];
}

function ListView(name, url, columns) {
  this.name = name;
  this.url = url;
  this.columns = columns;
}

ListView.prototype = {

  fetch: function fetch(cb) {
    $.getJSON(this.url, function(data) {
      var context = {
        'name': this.name,
        'columns': this.columns,
        'lines': data
      };
      cb(context);
    }.bind(this));
  },

  render: function(context) {
    var tmpl = getTmpl('list');
    return tmpl(context);
  }

};

function MenuView(el) {
  this.el = $(el);
  this.links = $('a', $('#menu'));
}

MenuView.prototype = {
  unselectAll: function unselectAll() {
    this.links.each(function(i, link) {
      $(link).removeClass('active');
    });
  },

  select: function(hash) {
    this.unselectAll();
    this.el.find('a[href="' + hash + '"]').addClass('active');
  }
};

var menu = new MenuView('#menu');

var posts = new ListView('posts', 'http://localhost:8080/posts', [
  {'label': 'Title', 'value': 'title'},
  {'label': 'Created at', 'value': 'createdAt', 'type': 'date'},
  {'label': 'Published', 'value': 'published', 'type': 'bool'}
]);

var tags = new ListView('tags', 'http://localhost:8080/tags', [
  {'label': 'Title', 'value': 'title'},
  {'label': 'Created at', 'value': 'createdAt', 'type': 'date'}
]);

var users = new ListView('users', 'http://localhost:8080/users', [
  {'label': 'Username', 'value': 'username'},
  {'label': 'Created at', 'value': 'createdAt', 'type': 'date'},
  {'label': 'Is staff', 'value': 'isStaff', 'type': 'bool'}
]);

$(function() {
  var content = $('#content');

  function onHashChanged(e) {
    var hash = document.location.hash;
    var route = routes[hash];
    route && route(e);
    menu.select(hash);
  }

  function onResized() {
    content.css('height', document.height);
  }

  var routes = {
    '#dashboard': function() {
      content.html('<h1>Not implemented</h1>');
    },

    '#posts': function() {
      posts.fetch(function(data) {
        var html = posts.render(data);
        content.html(html);
      });
    },

    '#tags': function() {
      tags.fetch(function(data) {
        var html = tags.render(data);
        content.html(html);
      });
    },

    '#users': function() {
      users.fetch(function(data) {
        var html = users.render(data);
        content.html(html);
      });
    },

    '#settings': function() {
      content.html('<h1>Not implemented</h1>');
    }
  };

  onHashChanged();
  onResized();
  window.onhashchange = onHashChanged;
  window.onresize = onResized;
});