App.PostsWidget = App.DataWidget.extend({

  className: 'posts',

  url: '/posts/count',

  tmpl: '<p><span>{{count}}</span> <a href="#posts">posts</a></p>'

});