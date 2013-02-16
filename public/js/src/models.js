App.Session = Backbone.Model.extend({

  defaults: {
    id: 'current'
  },

  //TODO: Use config
  url: function() {
    var s = this.get('id') || '';
    return '/sessions/' + s;
  },

  isAnonymous: function isAnonymous() {
    return this.get('id') !== undefined;
  }
});

App.Settings = Backbone.Model.extend({

  defaults: {
    id: 'current'
  },

  url: function() {
    var s = this.get('id') || '';
    return '/conf/' + s;
  }

});