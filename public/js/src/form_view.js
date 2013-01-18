App.FormView = Backbone.View.extend({

  tagName: 'form',

  templateName: 'form',

  events: {
    'click .submit': 'onSubmit'
  },

  initialize: function initialize(options) {
    var name = options.name;
    this.fields =  {};
    this.options = options;
    this.template = getTmpl(this.templateName);

    this.onRender = options.onRender || noop;
    this.onSuccess = options.onSuccess || noop;
    this.onError = options.onError || noop;

    if(this.collection) {
      this.collection.on('sync', function(collection, resp, options) {
        if(!options.previousModels) {
          App.router.navigate(name, {trigger: true});
        }
      });

      this.collection.on('error', function() {
        console.error(this);
      });
    }

    if(this.model) {
      this.model.on('sync', this.onSuccess, this);
      this.model.on('error', this.onError, this);
    }

    this.render();
    this.onRender();
    this.build();
  },

  text: function Text(name, attributes) {
    return $('<textarea/>', _.extend({name: name}, attributes));
  },

  string: function String(name, attributes) {
    return $('<input/>', _.extend({type: 'text', name: name}, attributes));
  },

  boolean: function Boolean(name, attributes) {
    return $('<input/>', _.extend({type: 'checkbox', name: name}, attributes));
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

  addWidget: function addWidget(el) {2
    this.$el.find('.form-widgets').append(el);
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
    this.trigger('load', model);
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