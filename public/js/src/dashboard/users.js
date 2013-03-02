App.UsersWidget = App.DataWidget.extend({

  url: '/users/count',

  tmpl: '<p>{{count}} <a href="#users">users</a></p>'

});