App.PostsWidget = App.DataWidget.extend({

  url: '/posts/count',

  tmpl: '<p>{{count}} <a href="#posts">posts</a></p>'

});