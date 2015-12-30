module.exports = function objForEach(obj, cb) {
  var extraArgs = [].slice.call(arguments, 2)
  Object.keys(obj).forEach(function(key) {
    var val = obj[key]
    var args = [val, key]
    if (extraArgs.length) args = args.concat(extraArgs)
    cb.apply(obj, args)
  })
}
