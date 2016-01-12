var $ = require('jquery')

$(document).ready(function () {
  // loadPeers()
  loadSearchBoxes()
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