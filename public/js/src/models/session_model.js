App.Session = Backbone.Model.extend({

  defaults: {
    id: 'current'
  },

  initialize: function initialize() {
    setInterval(function() {
      this.fetch({
        error: function(model, xhr) {
          if(xhr.status === 404) {
            document.location.reload(true);
          }
        }
      });
    }.bind(this), 60 * 1000);
  },

  url: function() {
    return '/sessions/' + (this.get('id') || '');
  }
});