function Editable(el, options) {
  this.$el = $(el);
  this.options = options;

  this.$inputContainer = $('<li/>', {'class': 'tag new'});
  this.$input = $('<input/>', {type: 'text'});

  this.$input.keyup(function(e) {
    var text = this.$input.val();
    if(e.keyCode === 13 && text !== '') {
      this.appendNew(text);
      this.$input.val('');
    }
    if(e.keyCode === 8 && text === '') {
      this.removeLast();
    }
  }.bind(this));

  this.$el.click(function() {
    this.$input.focus();
    return false;
  }.bind(this));

  this.$inputContainer.append(this.$input);
  this.$el.append(this.$inputContainer);
}

Editable.prototype = {

  appendNew: function appendNew(text, attributes) {
    var old = $('<li/>', _.extend({'class': 'tag old', text: text}, attributes));
    old.insertBefore(this.$inputContainer);
  },

  removeLast: function removeLast() {
    this.$inputContainer.prev().remove();
  },

  serialize: function serialize() {
    var $el;
    return [].map.call(this.$el.find('.old'), function(el) {
      $el = $(el);
      return {
        title: $el.html(),
        id: $el.data('id')
      };
    });
  },

  load: function(arr) {
    if(Array.isArray(arr)) {
      arr.forEach(function(obj) {
        this.appendNew(obj.title, {'data-id': obj.id});
      }, this);
    }
  },

  clear: function() {
    this.$el.find('.old').remove();
  }
};

$.fn.editable = function editable(options) {
  return new Editable(this, options);
};