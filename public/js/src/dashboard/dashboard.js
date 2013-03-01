App.Widget = Backbone.View.extend({

  construct: function construct() {
    if(this.components) {
      _.each(this.components, function(component) {
        this.$el.append(component.construct());
      }, this);
    } else {
      this.render();
    }
    return this.$el;
  },

  renderInto: function renderInto(various) {
    $(various).append(this.construct());
  }

});

App.DataWidget = App.Widget.extend({

  initialize: function() {
    App.Widget.prototype.initialize.call(this);
    this.tmpl = swig.compile(this.tmpl);
  },

  render: function() {
    var self = this;
    if(!this.data) {
      $.getJSON(this.url, function(json) {
        self.data = json;
        self._render();
      });
    } else {
      this._render();
    }

    return this.$el;
  },

  _render: function() {
    var html = this.tmpl(this.data);
    this.$el.empty().html(html);
  }

});

App.DashBoardView = Backbone.View.extend({

  initialize: function() {
    var countsWidget = new App.CountsWidget();
    countsWidget.renderInto(this.$el);
  }

});