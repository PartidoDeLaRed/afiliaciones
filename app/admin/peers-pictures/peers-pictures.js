var $ = require('jquery')
var URL = require('url-parse')

function baseUrl (id, suffix) {
  var url = '/api/admin/peers/:id/pictures'
  if (id) url = url.replace(':id', id)
  if (suffix) url += '/' + suffix
  return url
}

module.exports = {
  getUploadUrl: function (peerId, file) {
    if (!(file instanceof window.File)) {
      return $.Deferred().reject(new Error('Invalid File.'))
    }

    return $.ajax({
      type: 'get',
      url: baseUrl(peerId, 'upload-url'),
      data: {
        filename: file.name
      }
    })
  },

  upload: function (file, uploadUrl) {
    var url = URL(uploadUrl, true)

    return $.ajax({
      url: uploadUrl,
      type: 'PUT',
      headers: {'Content-Type': url.query['Content-Type']},
      processData: false,
      data: file
    })
  }
}
