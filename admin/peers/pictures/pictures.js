var $ = require('jquery')

function baseUrl (id, suffix) {
  var url = '/peers/:id/pictures'
  if (id) url = url.replace(':id', id)
  if (suffix) url += '/' + suffix
  return url
}

module.exports = {
  getUploadUrl: function (peerId, file) {
    if (!(file instanceof window.File)) {
      return $.Deferred().reject(new Error('Invalid File.'))
    }

    return $.when($.ajax({
      type: 'get',
      url: baseUrl(peerId, 'upload-url')
    }))
  }
}
