App.FormView = Backbone.View.extend({

  tagName: 'form',

  templateName: 'form',

  events: {
    'submit': 'onSubmit',
    'click .submit': 'onSubmit'
  },

  initialize: function initialize(options) {
    this.options = options;
    this.template = App.getTmpl(this.templateName);

    this.onRender = options.onRender || App.noop;
    this.onError = options.onError || this.onError;
    this.onSuccess = options.onSuccess || this.onSuccess;

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

  input: function(type, name, attributes) {
    return $('<input/>', $.extend({type: type, name: name}, attributes));
  },

  string: function String(name, attributes) {
    return this.input('text', name, attributes);
  },

  int: function Int(name, attributes) {
    return this.input('number', name, attributes);
  },

  boolean: function Boolean(name, attributes) {
    return this.input('checkbox', name, attributes);
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
    }, this);
  },

  addWidget: function addWidget(el) {
    this.$el.find('.form-widgets').append(el);
  },

  getField: function getField(key) {
    return this.$el.find('[name="' + key + '"]');
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

  listing: function listing() {
    App.router[this.collection.key + ':list']();
  },

  onSubmit: function onSubmit() {
    var data = this.$el.find('.fields').serializeObject();

    if(!this.model) {
      this.model = this.collection.create(data);
    } else {
      this.model.save(data);
    }

    this.model.once('sync', function() {
      this.onSave();
      this.trigger('saved', this.model);
    }, this);

    return false;
  },

  onSave: function onSave() {
    var that = this;

    alertify.set({
      labels: {
        ok: "Return to listing",
        cancel: "Continue editing"
      }
    });

    alertify.confirm("Modifications saved.", function(e) {
      if(e) {
        that.listing();
      }
    });
  },

  onError: function onError() {
    console.log(arguments);
    alertify.log('Unable to save', 'error');
  }

});