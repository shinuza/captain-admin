App.Settings = Backbone.Model.extend({

  defaults: {
    id: 'current'
  },

  url: function() {
    return '/conf/' + (this.get('id') || '');
  }

});