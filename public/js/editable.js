function Editable(el) {
  this.$el = $(el);
  this.$inputContainer = $('<li/>', {'class': 'tag new'});
  this.$input = $('<input/>', {type: 'text'});
  this.$inputContainer.append(this.$input);

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

  this.$el.append(this.$inputContainer);
}

Editable.prototype = {

  appendNew: function appendNew(text) {
    var old = $('<li/>', {'class': 'tag old'}, text);
    old.html(text);
    old.insertBefore(this.$inputContainer);
  },

  removeLast: function removeLast() {
    this.$inputContainer.prev().remove();
  },

  serialize: function serialize() {
    return [].map.call(this.$el.find('.old'), function(el) {
      return el.innerText.trim();
    });
  }
};


$.fn.editable = function editable() {
  return this.map(function(index, element) {
    new Editable(element);
  });
};