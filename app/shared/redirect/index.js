module.exports = function redirectGenerator (toPath) {
  return function redirect (req, res) {
    res.redirect(toPath)
  }
}
