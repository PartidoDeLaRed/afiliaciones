var $ = require('jquery')
var toObject = require('form-to-object')

$.put = function (url, data, callback, type) {
  
  if ($.isFunction(data)) {
    type = type || callback,
    callback = data,
    data = {}
  }
  
  return $.ajax({
    url: url,
    type: 'PUT',
    success: callback,
    data: data,
    contentType: type
  });
}


$(document).ready(function () {
  loadSearchBoxes();

  $("button").click(function () {
    SaveData();
  });
})

function loadSearchBoxes() {
  $('.listHeader:not(.actions, .state)').each(function (index, item) {
    $(item).children().remove();

    var searchButton = $('<div class="button search" />')
    
    var searchContainer = $('<div class="searchContainer" />')
    var searchField = $('<input type="text" class="searchField" />')
    searchContainer.append(searchField)
    searchContainer.append($('<div class="button cancel" />').click(function () {
      searchButton.fadeIn(100)
      searchContainer.fadeOut(100)
    }))
    
    searchButton.click(function () {
      searchButton.fadeOut(100)
      searchContainer.fadeIn(100)
      searchField.value = ''
      searchField.focus()
    })
    
    $(item).append(searchButton)
    $(item).append(searchContainer)
    searchContainer.fadeOut(100)
  })
}

function SaveData()
{
  var form = toObject(document.querySelector('form'))

  if (form._id) {
    $.put('/admin/peers/' + form._id, form, function (res) {
      window.location = '/admin/peers';
    })
  }
  else {
    $.post('/admin/peers/', form, function (res) {
      window.location = '/admin/peers';
    })
  }
}