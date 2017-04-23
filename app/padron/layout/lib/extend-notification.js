var notify = require('notification')

notify.Notification.effect = 'default'

/**
 * Don't let two messages of the same scope at the same time.
 * @param  {String}
 * @return {Function}
 */

notify.scope = (function () {
  var scopes = {}

  return function notifyScope (scope) {
    if (scopes[scope]) return scopes[scope]

    scopes[scope] = (function () {
      var current
      var timeout

      return function notifyScopeMessage (msg) {
        if (timeout) {
          clearTimeout(timeout)
          timeout = null
        }

        if (current) {
          current.hide(1000)
          timeout = setTimeout(function () {
            timeout = null
            current = null
            notifyScopeMessage(msg)
          }, 500)
        } else {
          current = notify(msg)
        }
      }
    })()

    return notifyScope(scope)
  }
})()
