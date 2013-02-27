App.FormView = Backbone.View.extend({

  tagName: 'form',

  templateName: 'form',

  events: {
    'click .submit': 'onSubmit'
  },

  initialize: function initialize(options) {
    this.fields =  {};
    this.options = options;
    this.template = App.getTmpl(this.templateName);

    this.onRender = options.onRender || App.noop;
    this.onError = options.onError || this.onError;

    if(this.collection) {
      this.collection.on('sync', function() {this.trigger('success', this.collection)}, this);
      this.collection.on('error', this.onError, this);
    }

    if(this.model) {
      this.model.on('sync', function() {this.trigger('success', this.model)}, this);
      this.model.on('error', this.onError, this);
    }

  },

  text: function Text(name, attributes) {
    return $('<textarea/>', $.extend({name: name}, attributes));
  },

  string: function String(name, attributes) {
    return $('<input/>', $.extend({type: 'text', name: name}, attributes));
  },

  int: function Int(name, attributes) {
    return $('<input/>', $.extend({type: 'number', name: name}, attributes));
  },

  boolean: function Boolean(name, attributes) {
    return $('<input/>', $.extend({type: 'checkbox', name: name}, attributes));
  },

  construct: function construct() {
    this.render();
    this.build();
  },

  render: function render() {
    var html = this.template({'name': this.options.name});
    this.$el.html(html);
    this.trigger('render');
  },

  build: function build() {
    var p, label, widget;
    var container = this.$el.find('.fields');

    _.each(this.options.fields, function(options, name) {
      p = $('<p></p>');
      label = $('<label/>', {'for': name}).html(options.label + ':');
      widget = this[options.type](name, options.attributes || {});

      p.append(label, widget);
      container.append(p);

      this.fields[name] = widget;
    }, this);
  },

  addWidget: function addWidget(el) {
    this.$el.find('.form-widgets').append(el);
  },

  getField: function getField(key) {
    return this.$el.find('[name="' + key + '"]');
  },

  serialize: function serialize() {
    var type, data = {};

    _.each(this.fields, function(widget, key) {
      type = widget.attr('type');

      switch(type) {
        case "checkbox":
          data[key] = widget.prop('checked');
          break;
        case "number":
          data[key] = Number(widget.val());
          break;
        default:
          data[key] = widget.val();
          break;
      }
    });
    return  data;
  },

  unload: function unload() {
    this.model = null;
    this.el.reset();
    this.trigger('unload');
  },

  load: function load(id) {
    this.model = this.collection ? this.collection.get(id) : this.model;

    _.each(this.model.attributes, function(value, key) {
      var field = this.getField(key);

      switch(typeof value) {
        case "boolean":
          field.prop('checked', value);
          break;
        default:
          field.val(value);
          break;
      }

    }, this);

    this.trigger('load', this.model);
  },

  onSubmit: function onSubmit() {
    var data = this.serialize();

    if(!this.model) {
      this.model = this.collection.create(data);
    } else {
      this.model.save(data);
    }

    this.model.once('sync', function() {
      App.alertView.success('Saved');
      this.trigger('saved', this.model);
    }, this);

    return false;
  },

  onError: function onError() {
    console.log(arguments);
    App.alertView.error('Invalid form');
  }

});