App.Session = Backbone.Model.extend({

  defaults: {
    id: 'current'
  },

  url: function() {
    return '/sessions/' + (this.get('id') || '');
  },

  isAnonymous: function isAnonymous() {
    return this.get('id') !== undefined;
  }
});