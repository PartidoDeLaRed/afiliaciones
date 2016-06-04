var aws = require('aws-sdk')
var Batch = require('batch')
var crypto = require('crypto')
var mime = require('mime-types')
var config = require('../../config')

aws.config.update({
  region: config.aws.region,
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  sslEnabled: true,
  logger: process.stdout
})

function getUploadUrl (originalFile, peer, cb) {
  var s3 = new aws.S3()

  var ContentType = mime.contentType(originalFile)

  if (!ContentType) return cb(new Error('Invalid file.'))
  if (!peer || !peer._id) return cb(new Error('Invalid peer.'))

  var ext = mime.extension(ContentType)
  var filename = random() + '.' + ext
  var file = [folderFor(peer), filename].join('/')

  var params = {
    Bucket: config.aws.bucket,
    Key: file,
    Expires: 60 * 15,
    ContentType: ContentType,
    ACL: 'private'
  }

  s3.getSignedUrl('putObject', params, function (err, uploadUrl) {
    if (err) return cb(err)

    cb(null, {
      uploadUrl: uploadUrl,
      file: file
    })
  })
}

function getUrls (peer, cb) {
  var s3 = new aws.S3()

  var prefix = folderFor(peer) + '/'

  var params = {
    Bucket: config.aws.bucket,
    Delimiter: '/',
    Prefix: prefix
  }

  s3.listObjects(params, function (err, data) {
    if (err) return cb(err)

    var batch = new Batch()
    batch.concurrency(3)

    data.Contents.forEach(function (item) {
      if (!item.Key) return

      var fetch = s3.getSignedUrl.bind(s3, 'getObject', {
        Bucket: config.aws.bucket,
        Key: item.Key,
        Expires: 120
      })

      batch.push(function (done) {
        fetch(function (err, url) {
          if (err) return done(err)
          done(null, {
            file: item.Key,
            url: url
          })
        })
      })
    })

    batch.end(cb)
  })
}

module.exports = {
  getUploadUrl: getUploadUrl,
  getUrls: getUrls
}

function folderFor (peer) {
  return ['peers', peer._id].join('/')
}

function random () {
  return crypto.randomBytes(3).toString('hex')
}
