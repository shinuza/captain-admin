var Collection = Backbone.Collection.extend({

  initialize: function initialize() {
    this.on('sync', function() {
      this.synced = true;
    }, this);
  },

  onSync: function onSync(cb) {
    if(this.synced === true) {
      cb(this);
    } else {
      this.on('sync', cb);
    }
  }

});

App.Users = Collection.extend({

  url: '/users' //TODO: Use config

});

App.Posts = Collection.extend({

  url: '/posts/?force=true' //TODO: Use config

});

App.Tags = Collection.extend({

  url: '/tags' //TODO: Use config

});
