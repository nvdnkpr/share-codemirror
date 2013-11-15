(function () {
  'use strict';

  /**
   * Creates a new DispatchSocket. By default this creates a drop-in replacement for a WebSocket or BCSocket.
   *
   * Incoming messages can be dispatched to custom event handlers by assigning `on_xxx` event handlers.
   * This causes incoming messages with a `_type: 'xxx'` attribute to be routed to that handler instead of
   * the default `onmessage` handler.
   *
   * @param {WebSocket} ws - a WebSocket or BCSocket object.
   * @constructor
   */
  function DispatchSocket(ws) {
    var self = this;

    ws.onopen = function () {
      self.onopen && self.onopen();
    };

    ws.onmessage = function (msg) {
      var data = msg.data ? msg.data : msg;
      if (data._type) {
        var handlerName = 'on_' + data._type;
        var handler = self[handlerName];
        if (typeof handler === 'function') {
          handler.call(self, msg);
        } else {
          // Deliver in the usual way
          self.onmessage && self.onmessage(msg);
        }
      } else {
        // Deliver in the usual way
        self.onmessage && self.onmessage(msg);
      }
    };

    ws.onerror = function (err) {
      self.onerror && self.onerror(err);
    };

    ws.onclose = function () {
      self.onclose && self.onclose();
    };

    this.send = function (msg) {
      ws.send(msg);
    };

    this.__defineGetter__('readyState', function () {
      return ws.readyState;
    });
  }

  // Exporting
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    // Node.js
    module.exports = DispatchSocket;
    module.exports.scriptsDir = __dirname;
  } else {
    if (typeof define === 'function' && define.amd) {
      // AMD
      define([], function () {
        return DispatchSocket;
      });
    } else {
      // Browser, no AMD
      window.DispatchSocket = DispatchSocket;
    }
  }

})();
