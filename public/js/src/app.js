var App = {
  templates: {},

  noop: function noop() {},

  getTmpl: function getTmpl(name) {
    if(!App.templates[name]) {
      App.templates[name] = swig.compile($('#' + name).html(), {templateName: name});
    }
    return App.templates[name];
  }
};