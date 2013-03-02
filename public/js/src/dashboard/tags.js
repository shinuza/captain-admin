App.TagsWidget = App.DataWidget.extend({

  className: 'tags',

  url: '/tags/count',

  tmpl: '<p><span>{{count}}</span> <a href="#tags">tags</a></p>'

});