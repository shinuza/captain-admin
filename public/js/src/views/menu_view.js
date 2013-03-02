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