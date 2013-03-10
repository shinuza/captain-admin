;(function($) {

  // handle optional data/success arguments
  function parseArguments(url, data, success, dataType) {
    var hasData = !$.isFunction(data);
    return {
      url:      url,
      data:     hasData  ? data : undefined,
      success:  !hasData ? data : $.isFunction(success) ? success : undefined,
      dataType: hasData  ? dataType || success : success
    }
  }

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

  $.postJSON = function(url, data, success){
    var options = parseArguments.apply(null, arguments);
    options.type = 'POST';
    options.dataType = 'json';
    options.contentType = 'application/json';
    return $.ajax(options)
  };

})(Zepto);