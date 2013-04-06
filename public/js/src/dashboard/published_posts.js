App.PublishedPostsWidget = App.DataWidget.extend({

  className: 'posts',

  url: '/posts/count_published',

  tmpl: '<p><span>{{count}}</span> <a href="#posts">published posts</a></p>'

});