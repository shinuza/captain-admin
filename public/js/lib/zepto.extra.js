;(function($) {

  $.extend($.fn, {
      serializeObject: function serializeObject() {
        var name, type, data = {},
          widgets = this.find('select, textarea, input');

        widgets.each(function(index, widget) {
          widget = $(widget);
          name = widget.attr('name');
          type = widget.attr('type');

          switch(type) {
            case "checkbox":
              data[name] = widget.prop('checked');
              break;
            case "number":
              data[name] = Number(widget.val());
              break;
            default:
              data[name] = widget.val();
              break;
          }
        });

        return  data;
    }
  });

  $.postJSON = function(url, data, options) {
    options = options || {};

    options.type = 'POST';
    options.data = data;
    options.url = url;
    options.dataType = 'json';
    options.contentType = 'application/json';
    return $.ajax(options)
  };

})(Zepto);