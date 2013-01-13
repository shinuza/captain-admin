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

ListView.prototype.fetch = function fetch(url, cb) {
  $.getJSON(url, function(data) {
    var context = {
      'name': this.name,
      'columns': this.columns,
      'lines': data
    };
    cb(getTmpl('list')(context));
  }.bind(this));
};

var posts = new ListView('posts', [
  {'label': 'Title', 'value': 'title'},
  {'label': 'Created at', 'value': 'createdAt', 'type': 'date'},
  {'label': 'Published', 'value': 'published', 'type': 'bool'}
]);

var users = new ListView('users', [
  {'label': 'Username', 'value': 'username'},
  {'label': 'Created at', 'value': 'createdAt', 'type': 'date'},
  {'label': 'Is staff', 'value': 'isStaff', 'type': 'bool'}
]);