App.UsersWidget = App.DataWidget.extend({

  className: 'users',

  url: '/users/count',

  tmpl: '<p><span>{{count}}</span> <a href="#users">users</a></p>'

});