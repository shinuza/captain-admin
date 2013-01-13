var templates = {};

function getTmpl(name) {
  if(!templates[name]) {
    templates[name] = swig.compile($('#' + name).html(), {templateName: name});
  }
  return templates[name];
}

function ListView(name, columns) {
  this.name = name;
  this.columns = columns;
  this.text = null;
}

ListView.prototype ={
  fetch: function fetch(url, cb) {
    $.getJSON(url, function(data) {
      var context = {
        'name': this.name,
        'columns': this.columns,
        'lines': data
      };
      cb(getTmpl('list')(context));
    }.bind(this));
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

var posts = new ListView('posts', [
  {'label': 'Title', 'value': 'title'},
  {'label': 'Created at', 'value': 'createdAt', 'type': 'date'},
  {'label': 'Published', 'value': 'published', 'type': 'bool'}
]);

var tags = new ListView('tags', [
  {'label': 'Title', 'value': 'title'},
  {'label': 'Created at', 'value': 'createdAt', 'type': 'date'}
]);

var users = new ListView('users', [
  {'label': 'Username', 'value': 'username'},
  {'label': 'Created at', 'value': 'createdAt', 'type': 'date'},
  {'label': 'Is staff', 'value': 'isStaff', 'type': 'bool'}
]);

$(function() {
  var content = $('#content');

  function onHashChanged(e) {
    var hash = document.location.hash;
    var route = routes[hash];
    menu.select(hash);
    route && route(e);
  }

  function onResized() {
    content.css('height', document.height);
  }

  var routes = {
    '#dashboard': function() {

    },

    '#posts': function() {
      posts.fetch('http://localhost:8080/posts', function(html) {
        content.html(html);
      });
    },

    '#tags': function() {
      tags.fetch('http://localhost:8080/tags', function(html) {
        content.html(html);
      });
    },

    '#users': function() {
      users.fetch('http://localhost:8080/users', function(html) {
        content.html(html);
      });
    },

    '#settings': function() {

    }
  };

  onHashChanged();
  onResized();
  window.onhashchange = onHashChanged;
  window.onresize = onResized;
});