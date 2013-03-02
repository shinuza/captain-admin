App.CountsWidget = App.Widget.extend({

  'className': 'counts',

  components: [
    new App.PostsWidget,
    new App.TagsWidget,
    new App.UsersWidget
  ]

});