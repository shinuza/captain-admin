App.CountsWidget = App.Widget.extend({

  'className': 'widget counts quarter',

  components: [
    $('<h3></h3>', {'html': 'Content'}),
    new App.PublishedPostsWidget,
    new App.PostsWidget,
    new App.TagsWidget,
    new App.UsersWidget
  ]

});